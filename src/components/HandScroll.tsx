"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  FilesetResolver,
  HandLandmarker,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

// Keep the version in step with @mediapipe/tasks-vision in package.json: the WASM must match the JS.
const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.2/wasm";
const MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

/*
 * Interaction model, borrowed from Vision Pro and Quest hand tracking:
 * one gesture, the pinch. Move your hand to aim, pinch and release to click,
 * pinch and drag to scroll the page like a touchscreen (with momentum).
 * No poses to remember, so nothing gets misread as the wrong mode.
 */

// Tuning knobs. The camera is noisy and every setup differs, so these are worth adjusting.
const AREA = { left: 0.2, right: 0.8, top: 0.2, bottom: 0.8 }; // part of the camera frame mapped to the screen
const PINCH_IN = 0.3; // thumb-to-index gap, relative to palm size, that counts as a pinch
const PINCH_OUT = 0.45; // gap that releases it; wider, so a held pinch never flickers
const CONFIRM_FRAMES = 2; // frames a pinch or release must hold before it counts
const GRACE_MS = 250; // keep a pinch alive through a brief tracking dropout
const TAP_MS = 600; // a pinch shorter than this that didn't drag is a click
const DRAG_START = 18; // px the hand must travel during a pinch before it scrolls
const DRAG_GAIN = 2.6; // page px scrolled per px of hand travel
const FRICTION = 4; // momentum decay per second after a drag ends
const FILTER = { minCutoff: 1.4, beta: 0.012 }; // One Euro filter: jitter at rest vs lag in motion

type Status = "loading" | "idle" | "ready" | "press" | "scroll";

const LABEL: Record<Status, string> = {
  loading: "Loading hand tracking",
  idle: "Raise your hand",
  ready: "Ready",
  press: "Pinch",
  scroll: "Scrolling",
};

const dist = (a: NormalizedLandmark, b: NormalizedLandmark) =>
  Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Reads one tracked hand: where it aims (share of the screen, mirrored) and
 * how closed the pinch is. Aim follows the palm, not a fingertip, so pinching
 * doesn't drag the cursor off what you were pointing at.
 */
export function readHand(lm: NormalizedLandmark[]) {
  const palmX = (lm[0].x + lm[5].x + lm[17].x) / 3;
  const palmY = (lm[0].y + lm[5].y + lm[17].y) / 3;
  return {
    x: clamp01((1 - palmX - AREA.left) / (AREA.right - AREA.left)),
    y: clamp01((palmY - AREA.top) / (AREA.bottom - AREA.top)),
    pinch: dist(lm[4], lm[8]) / dist(lm[0], lm[5]),
  };
}

export type Pinch = { down: boolean; streak: number; lostAt: number };
export const OPEN: Pinch = { down: false, streak: 0, lostAt: 0 };

/**
 * Pinch state for one detection frame. `ratio` is null when no hand is seen.
 * Hysteresis, a short confirmation and a grace period for dropouts keep a
 * pinch from flickering, which is what makes clicks and drags feel solid.
 */
export function pinchStep(p: Pinch, ratio: number | null, now: number): Pinch {
  if (ratio === null) {
    const lostAt = p.lostAt || now;
    return p.down && now - lostAt < GRACE_MS ? { ...p, lostAt } : OPEN;
  }
  const want = p.down ? ratio < PINCH_OUT : ratio < PINCH_IN;
  if (want === p.down) return { down: p.down, streak: 0, lostAt: 0 };
  const streak = p.streak + 1;
  return streak >= CONFIRM_FRAMES
    ? { down: want, streak: 0, lostAt: 0 }
    : { down: p.down, streak, lostAt: 0 };
}

/** One Euro filter (Casiez et al. 2012): smooth when still, responsive when moving. */
export function oneEuro({ minCutoff, beta } = FILTER) {
  let x: number | undefined;
  let dx = 0;
  let last = 0;
  const alpha = (cutoff: number, dt: number) => 1 / (1 + 1 / (2 * Math.PI * cutoff * dt));
  return {
    next(value: number, now: number) {
      if (x === undefined) {
        x = value;
        last = now;
        return value;
      }
      const dt = Math.max((now - last) / 1000, 1e-3);
      last = now;
      dx += alpha(1, dt) * ((value - x) / dt - dx);
      x += alpha(minCutoff + beta * Math.abs(dx), dt) * (value - x);
      return x;
    },
    reset() {
      x = undefined;
      dx = 0;
    },
  };
}

/** Clicks what the cursor is on. New-tab links fall back to this tab if a popup blocker stops them. */
function activate(el: Element | null) {
  const target =
    el?.closest<HTMLElement>("a, button, [role=button], label, summary, input") ??
    (el as HTMLElement | null);
  if (!target) return;
  if (target instanceof HTMLAnchorElement && target.target === "_blank") {
    const tab = window.open(target.href, "_blank");
    if (tab) tab.opener = null;
    else window.location.href = target.href;
    return;
  }
  target.click();
}

/**
 * Webcam hand control. Loaded with next/dynamic only after the visitor turns
 * it on, so MediaPipe never ships to anyone else. Every frame is processed in
 * the browser; nothing is uploaded.
 *
 * `onClose` must be stable. It is called with a message when the camera or
 * the model can't start, and with nothing when the visitor closes it.
 */
export function HandScroll({ onClose }: { onClose: (error?: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let landmarker: HandLandmarker | null = null;

    const fail = (message: string) => !cancelled && onClose(message);

    // Fetch the model while the camera permission prompt is open, not after.
    const model = FilesetResolver.forVisionTasks(WASM).then((fileset) => {
      const create = (delegate: "GPU" | "CPU") =>
        HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL, delegate },
          runningMode: "VIDEO",
          numHands: 1,
        });
      return create("GPU").catch(() => create("CPU"));
    });
    model.then((m) => (cancelled ? m.close() : (landmarker = m))).catch(() => {});

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
      } catch {
        return fail("Camera unavailable"); // denied, no camera, or in use elsewhere
      }
      if (cancelled) return stream.getTracks().forEach((t) => t.stop());

      stream.getVideoTracks()[0]?.addEventListener("ended", () => fail("Camera unavailable"));
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play().catch(() => {});

      let tracker: HandLandmarker;
      try {
        tracker = await model;
      } catch {
        return fail("Hand tracking unavailable");
      }
      if (cancelled) return;
      setStatus("idle");

      const cursor = cursorRef.current!;
      const ring = ringRef.current!;
      const fx = oneEuro();
      const fy = oneEuro();

      let aimX = innerWidth / 2; // filtered hand aim, updated per camera frame
      let aimY = innerHeight / 2;
      let cx = aimX; // drawn cursor, eased toward the aim every display frame
      let cy = aimY;
      let seen = false;
      let pinch = OPEN;
      let press = { t: 0, y: 0, scroll: 0, target: null as Element | null, dragging: false };
      let scrollGoal = 0;
      let samples: { t: number; s: number }[] = []; // recent drag positions, for momentum
      let momentum = 0; // px/s
      let lastFrame = -1;
      let last = performance.now();

      const detect = (now: number) => {
        const hand = tracker.detectForVideo(video, now).landmarks[0];
        const read = hand ? readHand(hand) : null;
        seen = !!read;
        if (read) {
          aimX = fx.next(read.x * innerWidth, now);
          aimY = fy.next(read.y * innerHeight, now);
        } else if (!pinch.down) {
          fx.reset();
          fy.reset();
        }

        const was = pinch.down;
        pinch = pinchStep(pinch, read?.pinch ?? null, now);

        if (pinch.down && !was) {
          press = {
            t: now,
            y: aimY,
            scroll: scrollY,
            target: document.elementFromPoint(cx, cy),
            dragging: false,
          };
          momentum = 0;
          samples = [];
        } else if (pinch.down && read) {
          if (!press.dragging && Math.abs(aimY - press.y) > DRAG_START) {
            // Re-anchor at the moment the drag starts, so the page doesn't jump.
            press = { ...press, dragging: true, y: aimY, scroll: scrollY };
          }
          if (press.dragging) {
            scrollGoal = press.scroll + (press.y - aimY) * DRAG_GAIN;
            samples = [...samples.filter((p) => now - p.t < 120), { t: now, s: scrollGoal }];
          }
        } else if (!pinch.down && was) {
          if (press.dragging && samples.length > 1) {
            const a = samples[0];
            const b = samples[samples.length - 1];
            const v = ((b.s - a.s) / (b.t - a.t || 1)) * 1000;
            momentum = Math.max(-4000, Math.min(4000, v));
          } else if (!press.dragging && now - press.t < TAP_MS) {
            activate(press.target);
          }
        }

        setStatus(
          !seen && !pinch.down ? "idle"
          : pinch.down && press.dragging ? "scroll"
          : pinch.down ? "press"
          : "ready"
        );
      };

      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;

        if (video.readyState >= 2 && video.currentTime !== lastFrame) {
          lastFrame = video.currentTime;
          detect(now);
        }

        // Cursor: hold still while a click is being pinched, otherwise glide to the aim.
        if (!(pinch.down && !press.dragging)) {
          cx += (aimX - cx) * 0.5;
          cy += (aimY - cy) * 0.5;
        }
        const shown = seen || pinch.down;
        const over =
          shown && !!document.elementFromPoint(cx, cy)?.closest("a, button, [role=button]");
        cursor.style.opacity = shown ? "1" : "0";
        cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        ring.style.transform = `scale(${pinch.down ? 0.75 : over ? 1.4 : 1})`;
        ring.style.background = pinch.down
          ? "var(--accent)"
          : over
            ? "var(--accent-dim)"
            : "transparent";

        // "instant" because html has scroll-behavior: smooth, which would queue every step.
        if (pinch.down && press.dragging) {
          window.scrollTo({ top: scrollY + (scrollGoal - scrollY) * 0.35, behavior: "instant" });
        } else if (Math.abs(momentum) > 20) {
          window.scrollBy({ top: momentum * dt, behavior: "instant" });
          momentum *= Math.exp(-FRICTION * dt);
        } else {
          momentum = 0;
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      landmarker?.close();
    };
  }, [onClose]);

  return (
    <>
      {/* Cursor: the outer layer moves every frame, the inner ring animates its own state. */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] opacity-0 transition-opacity duration-200"
      >
        <div
          ref={ringRef}
          className="-ml-3 -mt-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--accent)] transition-[transform,background-color] duration-150 ease-out"
        >
          <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
        </div>
      </div>

      <aside data-lenis-prevent aria-label="Hands-free control" className="fixed bottom-4 right-4 z-50 w-[180px]">
        <div className="relative h-[135px] overflow-hidden rounded-[12px] border border-[var(--line-hi)] bg-[var(--surface)]">
          <video
            ref={videoRef}
            muted
            playsInline
            aria-hidden
            className="h-full w-full -scale-x-100 object-cover"
          />
          <button
            type="button"
            onClick={() => onClose()}
            aria-label="Turn off hands-free control"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors duration-200 hover:text-[var(--accent)]"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <p
            className="mono absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-2 pb-1.5 pt-4 text-[10px] text-white/85"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-colors duration-200"
              style={{
                background:
                  status === "loading" || status === "idle"
                    ? "rgba(255,255,255,0.4)"
                    : "var(--accent)",
              }}
            />
            {LABEL[status]}
          </p>
        </div>
        <ul className="mono mt-2 space-y-0.5 text-[10px] leading-snug text-[var(--muted)]">
          <li>Move your hand to aim</li>
          <li>Pinch to click</li>
          <li>Pinch and drag to scroll</li>
        </ul>
        <p className="mono mt-1.5 text-[10px] leading-snug text-[var(--faint)]">
          Runs on your device. No video leaves your browser.
        </p>
      </aside>
    </>
  );
}
