"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Play, X } from "lucide-react";

type Video = { src: string; poster: string; title: string };

// One dialog for the whole page; any trigger opens it with this event.
const OPEN_EVENT = "video-dialog:open";

export function VideoTrigger({
  className,
  children,
  ...video
}: Video & { className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent<Video>(OPEN_EVENT, { detail: video }))}
    >
      {children}
    </button>
  );
}

/** Mouse users without reduced motion get a hover preview. Touch keeps tap-to-open. */
function canPreview() {
  return (
    window.matchMedia("(hover: hover)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Inline poster. Hovering plays a loop in place, with sound once the visitor has interacted; clicking opens the
 * player in the dialog on this page. The <video> is only mounted on the
 * first hover, so the file is never requested for visitors who don't.
 */
export function VideoPreview(video: Video) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const hovering = useRef(false);

  // Browsers only allow sound after the visitor has clicked, tapped or pressed a key
  // somewhere on the page (a hover doesn't count). Until then the preview plays muted.
  const play = (v: HTMLVideoElement) => {
    v.muted = navigator.userActivation ? !navigator.userActivation.hasBeenActive : false;
    v.play().catch((e: DOMException) => {
      if (e.name !== "NotAllowedError" || !hovering.current) return; // paused mid-load: fine
      v.muted = true;
      v.play().catch(() => {});
    });
  };

  // The first hover mounts the <video>; start it once it exists.
  useEffect(() => {
    if (armed && hovering.current && ref.current) play(ref.current);
  }, [armed]);

  const start = () => {
    if (!canPreview()) return;
    hovering.current = true;
    if (ref.current) play(ref.current);
    else setArmed(true);
  };

  // Back to the poster frame: pause, rewind and hide the video layer.
  const stop = () => {
    hovering.current = false;
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
  };

  return (
    <div onPointerEnter={start} onPointerLeave={stop} onClickCapture={stop}>
      <VideoTrigger
        {...video}
        className="group relative block aspect-video w-full overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-left transition-colors duration-300 hover:border-[var(--line-hi)]"
      >
        <Image
          src={video.poster}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className="object-cover opacity-90 transition-opacity duration-500 ease-out group-hover:opacity-100"
        />
        {armed && (
          <video
            ref={ref}
            src={video.src}
            playsInline
            loop
            preload="none"
            aria-hidden
            tabIndex={-1}
            onPlaying={() => setPlaying(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
              playing ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* Bottom scrim keeps the label legible on any frame. */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent 45%)" }}
        />
        <span
          aria-hidden
          className={`absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[transform,opacity] duration-300 ease-out group-hover:scale-110 group-active:scale-95 md:h-[72px] md:w-[72px] ${
            playing ? "opacity-0" : "opacity-100"
          }`}
          style={{ background: "var(--accent)", color: "var(--on-accent)", boxShadow: "0 8px 30px rgba(0,0,0,0.35)" }}
        >
          <Play className="ml-1 h-6 w-6" fill="currentColor" strokeWidth={0} />
        </span>
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-5">
          <span>
            <span className="block text-[15px] font-medium text-white">Watch the demo</span>
            <span className="mt-0.5 block text-[13px] text-white/75">
              Plays right here, no redirect
            </span>
          </span>
          <span className="hidden text-[13px] text-white/75 sm:block">{video.title}</span>
        </span>
      </VideoTrigger>
    </div>
  );
}

export function VideoDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    const open = (e: Event) => {
      setVideo((e as CustomEvent<Video>).detail);
      ref.current?.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  // Fires for Esc, the close button and backdrop clicks alike.
  // Unmounting the <video> is what stops playback.
  const onClose = () => {
    setVideo(null);
    document.documentElement.style.overflow = "";
  };

  return (
    <dialog
      ref={ref}
      data-lenis-prevent
      aria-label={video ? video.title : "Video"}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="video-dialog m-auto w-[min(1100px,calc(100vw-32px),calc((100dvh-120px)*16/9))] max-w-none bg-transparent p-0 text-[var(--text)]"
    >
      {video && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-[15px] font-medium text-white">{video.title}</p>
            <div className="flex items-center gap-3">
              <kbd className="mono hidden rounded border border-white/20 px-1.5 py-0.5 text-[12.5px] text-white/70 sm:inline">
                Esc
              </kbd>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                aria-label="Close video"
                autoFocus
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
          <video
            src={video.src}
            poster={video.poster}
            controls
            autoPlay
            playsInline
            preload="auto"
            className="aspect-video w-full rounded-[12px] border border-white/10 bg-black"
          />
        </div>
      )}
    </dialog>
  );
}
