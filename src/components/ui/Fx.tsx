"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Copy, Moon, Sun } from "lucide-react";
import { play } from "./Sound";

/**
 * True when motion is allowed: the visitor has not asked the system for
 * reduced motion and has not pressed "Pause motion". Every scripted effect on
 * the page asks this before it moves anything.
 */
export const motionOK = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches && document.documentElement.dataset.motion !== "off";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ------------------------------------------------------------------ */
/* Scroll-tied effects                                                */
/* ------------------------------------------------------------------ */

/**
 * The one scroll listener on the page. Every element marked data-tied gets
 * --p, from 0 to 1: how far the reader's eye-line (three quarters of the way
 * down the screen) has travelled from the element's top to its bottom. CSS
 * turns that into drawn lines and darkening words. A pipeline also gets
 * data-active on the step being drawn.
 *
 * It only does work while a tied element is on screen, at most once a frame.
 * Without it, or under reduced motion, --p keeps its default of 1: everything
 * is fully drawn.
 */
export function ScrollTied() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScreen = new Set<HTMLElement>();
    let raf = 0;

    const paint = () => {
      raf = 0;
      const line = window.innerHeight * 0.78;
      onScreen.forEach((el) => {
        const box = el.getBoundingClientRect();
        const p = clamp01((line - box.top) / Math.max(box.height, 1));
        el.style.setProperty("--p", p.toFixed(3));
        if (el.dataset.tied === "pipe") {
          const steps = el.querySelectorAll<HTMLElement>(".pipe-step");
          const active = Math.min(steps.length - 1, Math.floor(p * steps.length - 0.001));
          steps.forEach((step, i) => step.toggleAttribute("data-active", p > 0 && i === active));
        }
      });
    };
    const queue = () => {
      if (!raf && onScreen.size) raf = requestAnimationFrame(paint);
    };

    const watch = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting ? onScreen.add(e.target as HTMLElement) : onScreen.delete(e.target as HTMLElement)
        );
        queue();
      },
      { rootMargin: "10% 0px" }
    );
    // Tied elements can be added later (an initiative opened by the reader).
    const adopt = () => document.querySelectorAll<HTMLElement>("[data-tied]").forEach((el) => watch.observe(el));
    adopt();
    window.addEventListener("tied:added", adopt);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);

    return () => {
      cancelAnimationFrame(raf);
      watch.disconnect();
      window.removeEventListener("tied:added", adopt);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* Layout change without animating layout                             */
/* ------------------------------------------------------------------ */

/**
 * Runs `change` (which opens or closes something at or after `anchor`) and
 * then slides everything that comes after it in the page into its new place.
 * This is FLIP: positions are measured before and after, and the difference
 * is animated with `translate` on the compositor. No height is ever animated.
 */
export function flipAfter(anchor: HTMLElement, change: () => void) {
  if (!motionOK()) return change();

  // Everything later in the document: the following siblings of the anchor and of each ancestor.
  const after: HTMLElement[] = [];
  for (let el: HTMLElement | null = anchor; el && el !== document.body; el = el.parentElement) {
    for (let sib = el.nextElementSibling; sib; sib = sib.nextElementSibling) {
      if (sib instanceof HTMLElement && getComputedStyle(sib).position !== "fixed") after.push(sib);
    }
  }
  const before = after.map((el) => el.getBoundingClientRect().top);
  change();

  requestAnimationFrame(() => {
    after.forEach((el, i) => {
      const delta = before[i] - el.getBoundingClientRect().top;
      if (Math.abs(delta) < 1) return;
      el.style.transition = "none";
      el.style.translate = `0 ${delta}px`;
      requestAnimationFrame(() => {
        el.style.transition = "translate 0.45s var(--spring)";
        el.style.translate = "";
        el.addEventListener("transitionend", () => (el.style.transition = ""), { once: true });
      });
    });
  });
}

/* ------------------------------------------------------------------ */
/* Text scramble                                                      */
/* ------------------------------------------------------------------ */

const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

/**
 * On hover or focus the letters shuffle briefly and settle, left to right, on
 * the exact text. Screen readers get the text once, as one phrase: a hidden
 * copy holds it and the moving letters are hidden from them. After an
 * idea in Magic UI's Hyper Text (MIT), rewritten without a motion library.
 */
export function Scramble({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest<HTMLElement>("a, button") ?? el;
    if (!el || !host) return;
    let raf = 0;

    const run = () => {
      if (!motionOK() || raf) return;
      const start = performance.now();
      el.style.minWidth = `${el.offsetWidth}px`; // hold the width so neighbours do not shift
      const tick = (now: number) => {
        const done = Math.floor(((now - start) / 280) * text.length);
        if (done >= text.length) {
          el.textContent = text;
          el.style.minWidth = "";
          raf = 0;
          return;
        }
        el.textContent = [...text]
          .map((ch, i) => (i < done || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("");
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    host.addEventListener("pointerenter", run);
    host.addEventListener("focus", run);
    return () => {
      host.removeEventListener("pointerenter", run);
      host.removeEventListener("focus", run);
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden className="inline-block">
        {text}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Theme                                                              */
/* ------------------------------------------------------------------ */

const THEME_EVENT = "theme:change";

/**
 * Light or dark. The inline script in layout.tsx has already set the theme
 * before first paint; this button flips it, stores the choice and, where the
 * browser can, wipes the new theme out from the button in a circle.
 */
export function ThemeToggle({ className = "", label = false }: { className?: string; label?: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const sync = () => setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    sync();
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const flip = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
      window.dispatchEvent(new Event(THEME_EVENT));
    };
    const box = e.currentTarget.getBoundingClientRect();
    root.style.setProperty("--vt-x", `${box.left + box.width / 2}px`);
    root.style.setProperty("--vt-y", `${box.top + box.height / 2}px`);
    if (motionOK() && document.startViewTransition) document.startViewTransition(apply);
    else apply();
  };

  const next = theme === "light" ? "dark" : "light";
  return (
    <button type="button" aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`} onClick={flip} className={className}>
      <span aria-hidden className="relative block h-[17px] w-[17px]">
        <Sun
          className="absolute inset-0 transition-[transform,opacity] duration-500"
          style={{ transform: theme === "light" ? "none" : "rotate(-90deg) scale(0.4)", opacity: theme === "light" ? 1 : 0 }}
        />
        <Moon
          className="absolute inset-0 transition-[transform,opacity] duration-500"
          style={{ transform: theme === "light" ? "rotate(90deg) scale(0.4)" : "none", opacity: theme === "light" ? 0 : 1 }}
        />
      </span>
      {label && "Theme"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Pause control                                                      */
/* ------------------------------------------------------------------ */

/**
 * Stops everything that moves on its own or with the scroll (the hero's
 * signal field, the drawn pipelines, reveals, scrambles), for anyone who
 * finds movement distracting. It stops the same things as the system's
 * reduced-motion setting.
 */
export function MotionToggle({ className = "" }: { className?: string }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "off" : "on";
    window.dispatchEvent(new Event("motion:change"));
  }, [paused]);

  // The command menu can flip this too.
  useEffect(() => {
    const flip = () => setPaused((v) => !v);
    window.addEventListener("motion:toggle", flip);
    return () => window.removeEventListener("motion:toggle", flip);
  }, []);

  return (
    <button type="button" aria-pressed={paused} onClick={() => setPaused((v) => !v)} className={className}>
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Small living details                                               */
/* ------------------------------------------------------------------ */

/** Copies text to the clipboard and says so for a moment, with a tick that draws itself. */
export function CopyButton({ text, label, className = "" }: { text: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(text).then(
          () => {
            setCopied(true);
            play("success");
          },
          () => {}
        )
      }
      className={className}
    >
      {copied ? (
        <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path className="draw-check" pathLength={1} d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <Copy aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/** A disclosure: a button and the region it opens. Content stays in the DOM when closed. */
export function Fold({
  summary,
  children,
  defaultOpen = false,
  buttonClassName = "",
  className = "",
  tied = false,
}: {
  /** The button's content. Receives whether the region is open. */
  summary: (open: boolean) => ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  buttonClassName?: string;
  className?: string;
  /** Set when the region contains scroll-tied elements, so they are picked up on first open. */
  tied?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const button = useRef<HTMLButtonElement>(null);
  const region = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const el = region.current;
    if (!el || !button.current) return;
    flipAfter(el, () => {
      el.hidden = open; // applied at once, so the positions measured next are the final ones
    });
    setOpen(!open);
    if (tied && !open) requestAnimationFrame(() => window.dispatchEvent(new Event("tied:added")));
  };

  return (
    <div className={className}>
      <button ref={button} type="button" aria-expanded={open} onClick={toggle} className={buttonClassName}>
        {summary(open)}
      </button>
      <div ref={region} hidden={!open} className={open ? "unfold" : undefined}>
        {children}
      </div>
    </div>
  );
}

/* Temporary: sections not yet rebuilt still import these. Removed in the clean-up step. */
export function Parallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function ShowcaseStage({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
