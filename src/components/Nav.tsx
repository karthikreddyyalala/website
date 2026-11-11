"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Hand } from "lucide-react";
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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div
        className={`relative mx-auto max-w-[1180px] overflow-hidden rounded-full border transition-[background-color,border-color,backdrop-filter] duration-500 ${
          lifted ? "card !rounded-full" : "border-transparent"
        }`}
      >
      <span aria-hidden className="scroll-progress absolute inset-x-0 bottom-0 h-[2px] bg-[var(--signal)]" />
      <nav className="flex h-[58px] items-center justify-between px-5 md:px-7">
        <a
          href="#top"
          className="h-section text-[17px] text-[var(--text)]"
        >
          KRY<span className="text-[var(--accent)]">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className="flex items-center gap-2 px-3 py-2 text-[14px] font-semibold transition-colors duration-200 hover:!text-[var(--text)]"
                style={{ color: active === link.id ? "var(--text)" : "var(--muted)" }}
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                  style={{ background: active === link.id ? "var(--signal)" : "transparent" }}
                />
                {link.label}
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
          <li className="ml-2">
            <a
              href={profile.contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--signal)] px-4 py-1.5 text-[13.5px] font-bold text-[var(--on-signal)] transition-colors duration-200 hover:bg-[var(--signal-hi)]"
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

      </div>

      {open && (
        <div className="card mt-2 !rounded-[22px] !bg-[rgba(8,12,18,0.92)] md:hidden">
          <ul className="flex flex-col px-6 py-3">
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
              <a
                href={profile.contact.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block py-3.5 text-[15px] text-[var(--accent)]"
              >
                Résumé <ArrowUpRight className="inline h-4 w-4" />
              </a>
            </li>
          </ul>
        </div>
      )}

      {handsFree && <HandScroll onClose={stopHandsFree} />}
    </header>
  );
}
