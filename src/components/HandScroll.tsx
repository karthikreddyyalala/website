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

type Status = "loading" | "idle" | "hold" | "paused" | "scrolling";

const LABEL: Record<Status, string> = {
  loading: "Starting",
  idle: "Show an open hand",
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

/** Target scroll speed in px/s for one tracked hand. Negative scrolls up. */
export function handSpeed(lm: NormalizedLandmark[]): { speed: number; fist: boolean } {
  const wrist = lm[0];
  const reach = (p: NormalizedLandmark) => Math.hypot(p.x - wrist.x, p.y - wrist.y);
  // A finger is folded when its tip sits closer to the wrist than its middle joint.
  const folded = FINGERS.filter(([tip, pip]) => reach(lm[tip]) < reach(lm[pip])).length;
  if (folded >= 3) return { speed: 0, fist: true };

  const offset = lm[8].y - 0.5; // index fingertip; negative = above center
  const strength = Math.min(1, Math.max(0, Math.abs(offset) - DEAD_ZONE) / (0.5 - DEAD_ZONE));
  return { speed: Math.sign(offset) * strength * MAX_SPEED, fist: false };
}

/**
 * Webcam hand-gesture scrolling. Loaded with next/dynamic only after the
 * visitor turns it on, so MediaPipe never ships to anyone else. Every frame
 * is processed in the browser; nothing is uploaded.
 *
 * `onClose` must be stable. It is called with a message when the camera or
 * the model can't start, and with nothing when the visitor closes it.
 */
export function HandScroll({ onClose }: { onClose: (error?: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
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
      let target = 0;
      let speed = 0;
      let carry = 0; // sub-pixel remainder, so slow speeds still move
      let lastFrame = -1;
      let last = performance.now();
      setStatus("idle");

      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;

        if (video.readyState >= 2 && video.currentTime !== lastFrame) {
          lastFrame = video.currentTime;
          const hand = tracker.detectForVideo(video, now).landmarks[0];
          const read = hand ? handSpeed(hand) : null;
          target = read?.speed ?? 0;
          setStatus(!read ? "idle" : read.fist ? "paused" : target ? "scrolling" : "hold");
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
    <aside aria-label="Hands-free scroll" className="fixed bottom-4 right-4 z-50 w-[160px]">
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
          aria-label="Turn off hands-free scroll"
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
    </aside>
  );
}
