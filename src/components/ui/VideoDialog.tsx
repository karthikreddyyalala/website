"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Play, X } from "lucide-react";

type Video = { id: string; title: string };

// One dialog for the whole page; any trigger opens it with this event.
const OPEN_EVENT = "video-dialog:open";

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export function VideoTrigger({
  id,
  title,
  className,
  children,
}: Video & { className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={className}
      onClick={() =>
        window.dispatchEvent(new CustomEvent<Video>(OPEN_EVENT, { detail: { id, title } }))
      }
    >
      {children}
    </button>
  );
}

/** Inline thumbnail. Clicking opens the player in the dialog, never YouTube. */
export function VideoPreview({ id, title }: Video) {
  return (
    <VideoTrigger
      id={id}
      title={title}
      className="group relative block aspect-video w-full overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-left transition-colors duration-300 hover:border-[var(--line-hi)]"
    >
      <Image
        src={thumb(id)}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        onError={(e) => (e.currentTarget.style.display = "none")}
        className="object-cover opacity-80 transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.02] group-hover:opacity-100"
      />
      {/* Bottom scrim keeps the label legible on any frame. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent 55%)" }}
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95 md:h-[72px] md:w-[72px]"
        style={{ background: "var(--accent)", color: "#14100a", boxShadow: "0 8px 30px rgba(0,0,0,0.35)" }}
      >
        <Play className="ml-1 h-6 w-6" fill="currentColor" strokeWidth={0} />
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-5">
        <span>
          <span className="block text-[14px] font-medium text-white">Watch the demo</span>
          <span className="mono mt-0.5 block text-[10.5px] text-white/70">
            Plays right here · no redirect
          </span>
        </span>
        <span className="mono hidden text-[10.5px] text-white/70 sm:block">{title}</span>
      </span>
    </VideoTrigger>
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
  // Unmounting the iframe is what stops playback.
  const onClose = () => {
    setVideo(null);
    document.documentElement.style.overflow = "";
  };

  return (
    <dialog
      ref={ref}
      aria-label={video ? `${video.title} video` : "Video"}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="video-dialog m-auto w-[min(1100px,calc(100vw-32px),calc((100dvh-140px)*16/9))] max-w-none bg-transparent p-0 text-[var(--text)]"
    >
      {video && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-[14px] font-medium text-white">{video.title}</p>
            <div className="flex items-center gap-3">
              <kbd className="mono hidden rounded border border-white/20 px-1.5 py-0.5 text-[10px] text-white/60 sm:inline">
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
          <div
            className="relative aspect-video w-full overflow-hidden rounded-[12px] border border-white/10 bg-black bg-cover bg-center"
            style={{ backgroundImage: `url(${thumb(video.id)})` }}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mono mt-3 inline-block text-[11px] text-white/60 transition-colors hover:text-[var(--accent)]"
          >
            Open on YouTube ↗
          </a>
        </div>
      )}
    </dialog>
  );
}
