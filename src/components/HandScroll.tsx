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

// Tuning knobs.
const DEAD_ZONE = 0.1; // share of frame height either side of center where nothing scrolls
const MAX_SPEED = 1400; // px per second with the finger at the top or bottom edge
const SMOOTHING = 0.12; // share of the gap to the target speed closed each frame
const CURSOR_SMOOTHING = 0.35; // same, for the cursor position
const REACH = 0.2; // camera margin ignored on each side, so the screen edges are easy to reach
const PINCH_IN = 0.22; // thumb-to-index gap, relative to palm size, that starts a click
const PINCH_OUT = 0.35; // gap that releases it (wider, so one pinch never clicks twice)

type Status = "loading" | "idle" | "point" | "click" | "hold" | "paused" | "scrolling";

const LABEL: Record<Status, string> = {
  loading: "Starting",
  idle: "Show your hand",
  point: "Pointing",
  click: "Click",
  hold: "Move up or down",
  paused: "Fist: paused",
  scrolling: "Scrolling",
};

// [tip, middle joint] for index, middle, ring and little finger.
const FINGERS = [
  [8, 6],
  [12, 10],
  [16, 14],
  [20, 18],
];

const dist = (a: NormalizedLandmark, b: NormalizedLandmark) => Math.hypot(a.x - b.x, a.y - b.y);

export type HandRead = {
  /** Index finger folded along with at least two others. */
  fist: boolean;
  /** Middle and ring finger folded: the index finger drives the cursor. */
  point: boolean;
  /** Thumb tip to index tip, relative to palm size. Small = pinching. */
  pinch: number;
  /** Cursor position as a share of the screen, already mirrored. */
  x: number;
  y: number;
  /** Open-hand scroll speed in px/s. Negative scrolls up. */
  speed: number;
};

/** Reads one tracked hand. Pure, so the gesture rules can be checked without a camera. */
export function readHand(lm: NormalizedLandmark[]): HandRead {
  const wrist = lm[0];
  // A finger is folded when its tip sits closer to the wrist than its middle joint.
  const folded = FINGERS.map(([tip, pip]) => dist(lm[tip], wrist) < dist(lm[pip], wrist));
  const toScreen = (v: number) => Math.min(1, Math.max(0, (v - REACH) / (1 - 2 * REACH)));

  const offset = lm[8].y - 0.5; // index fingertip; negative = above center
  const strength = Math.min(1, Math.max(0, Math.abs(offset) - DEAD_ZONE) / (0.5 - DEAD_ZONE));

  // Index folded too, so pointing (index up, the rest folded) never reads as a fist.
  const fist = folded[0] && folded.filter(Boolean).length >= 3;

  return {
    fist,
    point: !fist && folded[1] && folded[2],
    pinch: dist(lm[4], lm[8]) / dist(wrist, lm[9]),
    // Index base knuckle: it follows the hand but barely moves when the fingers pinch,
    // so the click lands where the cursor was.
    x: toScreen(1 - lm[5].x),
    y: toScreen(lm[5].y),
    speed: Math.sign(offset) * strength * MAX_SPEED,
  };
}

/**
 * Webcam hand-gesture control: point to move a cursor, pinch to click,
 * open hand to scroll, fist to pause. Loaded with next/dynamic only after the
 * visitor turns it on, so MediaPipe never ships to anyone else. Every frame
 * is processed in the browser; nothing is uploaded.
 *
 * `onClose` must be stable. It is called with a message when the camera or
 * the model can't start, and with nothing when the visitor closes it.
 */
export function HandScroll({ onClose }: { onClose: (error?: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    let landmarker: HandLandmarker | null = null;

    const fail = (message: string) => !cancelled && onClose(message);

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" },
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

      try {
        const fileset = await FilesetResolver.forVisionTasks(WASM);
        const create = (delegate: "GPU" | "CPU") =>
          HandLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: MODEL, delegate },
            runningMode: "VIDEO",
            numHands: 1,
          });
        landmarker = await create("GPU").catch(() => create("CPU"));
      } catch {
        return fail("Hand tracking unavailable");
      }
      if (cancelled) return landmarker.close();

      const tracker = landmarker;
      const cursor = cursorRef.current!;
      let target = 0;
      let speed = 0;
      let carry = 0; // sub-pixel remainder, so slow speeds still move
      let cx = innerWidth / 2;
      let cy = innerHeight / 2;
      let goalX = cx;
      let goalY = cy;
      let pointing = false;
      let pinched = false;
      let lastFrame = -1;
      let last = performance.now();
      setStatus("idle");

      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;

        if (video.readyState >= 2 && video.currentTime !== lastFrame) {
          lastFrame = video.currentTime;
          const hand = tracker.detectForVideo(video, now).landmarks[0];
          const read = hand ? readHand(hand) : null;
          const wasPinched = pinched;
          // A click has to start from pointing, so closing into a fist never clicks.
          pinched = !!read && (pinched ? read.pinch < PINCH_OUT : pointing && read.pinch < PINCH_IN);
          pointing = !!read && !pinched && !read.fist && read.point;
          target = read && !read.fist && !read.point && !pinched ? read.speed : 0;

          if (pointing) {
            goalX = read!.x * innerWidth;
            goalY = read!.y * innerHeight;
          }
          if (pinched && !wasPinched) {
            (document.elementFromPoint(cx, cy) as HTMLElement | null)?.click();
          }
          setStatus(
            !read ? "idle"
            : pinched ? "click"
            : read.fist ? "paused"
            : pointing ? "point"
            : target ? "scrolling"
            : "hold"
          );
        }

        // Cursor: frozen while pinched, hidden when no hand is pointing or clicking.
        if (pointing) {
          cx += (goalX - cx) * CURSOR_SMOOTHING;
          cy += (goalY - cy) * CURSOR_SMOOTHING;
        }
        const shown = pointing || pinched;
        cursor.style.opacity = shown ? "1" : "0";
        cursor.style.transform = `translate(${cx}px, ${cy}px)`;
        if (shown) {
          const over = document.elementFromPoint(cx, cy)?.closest("a, button, [role=button]");
          cursor.style.background = pinched ? "var(--accent)" : over ? "var(--accent-dim)" : "transparent";
        }

        speed += (target - speed) * SMOOTHING;
        if (Math.abs(speed) < 1) speed = 0;
        carry += speed * dt;
        const px = Math.trunc(carry);
        if (px) {
          carry -= px;
          // "instant" because html has scroll-behavior: smooth, which would queue every step.
          window.scrollBy({ top: px, behavior: "instant" });
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
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] -ml-2.5 -mt-2.5 h-5 w-5 rounded-full border-2 border-[var(--accent)] opacity-0 transition-[opacity,background-color] duration-150"
      />
      <aside aria-label="Hands-free control" className="fixed bottom-4 right-4 z-50 w-[160px]">
        <div className="relative h-[120px] overflow-hidden rounded-[12px] border border-[var(--line-hi)] bg-[var(--surface)]">
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
            className="mono absolute inset-x-0 bottom-0 px-2 pb-1.5 pt-4 text-[10px] text-white/80"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}
          >
            {LABEL[status]}
          </p>
        </div>
        <p className="mono mt-1.5 text-[10px] leading-snug text-[var(--faint)]">
          Runs on your device. No video leaves your browser.
        </p>
        <p className="mono mt-1 text-[10px] leading-snug text-[var(--faint)]">
          Point to move, pinch to click, open hand to scroll, fist to pause.
        </p>
      </aside>
    </>
  );
}
