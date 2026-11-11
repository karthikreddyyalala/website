"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Hand } from "lucide-react";
import { profile } from "@/content/profile";

// MediaPipe only downloads once a visitor turns hands-free on.
const HandScroll = dynamic(() => import("./HandScroll").then((m) => m.HandScroll), {
  ssr: false,
});

const LINKS = [
  { id: "work-avis", label: "Avis" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hasCamera, setHasCamera] = useState(false);
  const [handsFree, setHandsFree] = useState(false);
  const [cameraMsg, setCameraMsg] = useState("");

  // Checked after mount: navigator doesn't exist during the server render.
  useEffect(() => setHasCamera(Boolean(navigator.mediaDevices?.getUserMedia)), []);

  const stopHandsFree = useCallback((error?: string) => {
    setHandsFree(false);
    if (error) setCameraMsg(error);
  }, []);

  useEffect(() => {
    if (!cameraMsg) return;
    const t = window.setTimeout(() => setCameraMsg(""), 4000);
    return () => window.clearTimeout(t);
  }, [cameraMsg]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }

  /**
   * Active-section tracking and the scrolled state both run on
   * IntersectionObserver rather than a scroll listener. The previous
   * implementation called setState on every scroll frame.
   */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));

    // A zero-height sentinel at the top of the page tells us when we have
    // scrolled away from it — no scroll handler needed.
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;height:80px;width:1px;pointer-events:none;";
    document.body.prepend(sentinel);

    const topObserver = new IntersectionObserver(
      ([e]) => setLifted(!e.isIntersecting),
      { threshold: 0 }
    );
    topObserver.observe(sentinel);

    return () => {
      observer.disconnect();
      topObserver.disconnect();
      sentinel.remove();
    };
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: lifted ? "rgba(11,11,12,0.92)" : "transparent",
        borderBottom: `1px solid ${lifted ? "var(--line)" : "transparent"}`,
      }}
    >
      <span
        aria-hidden
        className="scroll-progress absolute inset-x-0 -bottom-px h-px bg-[var(--accent)]"
      />
      <nav className="shell flex h-[68px] items-center justify-between">
        <a
          href="#top"
          className="mono text-[13px] tracking-tight text-[var(--text)] transition-colors hover:text-[var(--accent)]"
        >
          KRY<span className="text-[var(--accent)]">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className="relative block px-3.5 py-2 text-[13px] transition-colors duration-200"
                style={{
                  color: active === link.id ? "var(--text)" : "var(--muted)",
                }}
              >
                {link.label}
                {active === link.id && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 -bottom-px h-px"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </a>
            </li>
          ))}
          {hasCamera && (
            <li className="flex items-center">
              <span role="status" className="mono mr-2 text-[11px] text-[var(--faint)] empty:hidden">
                {cameraMsg}
              </span>
              <button
                type="button"
                aria-pressed={handsFree}
                onClick={() => {
                  setCameraMsg("");
                  setHandsFree((v) => !v);
                }}
                title="Control the page with hand gestures through your camera"
                className="mr-1.5 flex h-7 items-center gap-1.5 rounded-full border px-3 text-[12px] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{
                  borderColor: handsFree ? "var(--accent)" : "var(--line-hi)",
                  color: handsFree ? "var(--accent)" : "var(--muted)",
                }}
              >
                <Hand className="h-3 w-3" />
                Hands-free
              </button>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line-hi)] text-[var(--muted)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {theme === "dark" ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </li>
          <li className="ml-2">
            <a
              href={profile.contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--line-hi)] px-4 py-1.5 text-[13px] text-[var(--text)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-[0.97]"
            >
              Résumé
            </a>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className="absolute left-0 block h-px w-5 bg-[var(--text)] transition-transform duration-300"
              style={{ top: open ? 6 : 0, transform: open ? "rotate(45deg)" : "none" }}
            />
            <span
              className="absolute left-0 block h-px w-5 bg-[var(--text)] transition-transform duration-300"
              style={{ top: open ? 6 : 12, transform: open ? "rotate(-45deg)" : "none" }}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--line)] bg-[var(--bg)] md:hidden">
          <ul className="shell flex flex-col py-3">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-[var(--line)] py-3.5 text-[15px] text-[var(--muted)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="flex w-full items-center gap-3 border-b border-[var(--line)] py-3.5 text-[15px] text-[var(--muted)]"
              >
                {theme === "dark" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </li>
            <li>
              <a
                href={profile.contact.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block py-3.5 text-[15px] text-[var(--accent)]"
              >
                Résumé ↗
              </a>
            </li>
          </ul>
        </div>
      )}

      {handsFree && <HandScroll onClose={stopHandsFree} />}
    </header>
  );
}
