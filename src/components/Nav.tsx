"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Hand } from "lucide-react";
import { profile } from "@/content/profile";
import { CommandButton } from "./CommandMenu";

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
  // The highlight pill slides to the link under the pointer, or to the current section.
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const link = listRef.current?.querySelector<HTMLElement>(`a[href="#${hovered ?? active}"]`);
    setPill(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
  }, [active, hovered]);
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

  // Escape closes the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
        className={`nav-glass relative mx-auto max-w-[1180px] overflow-hidden rounded-full transition-shadow duration-500 ${
          lifted ? "shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)]" : ""
        }`}
      >
      <span aria-hidden className="scroll-progress absolute inset-x-0 bottom-0 h-[2px] bg-[var(--signal)]" />
      <nav className="flex h-[60px] items-center justify-between pl-6 pr-2 md:pl-7">
        <a
          href="#top"
          className="h-section flex min-h-[44px] items-center text-[18px] text-[var(--text)]"
        >
          KRY<span className="text-[var(--accent)]">.</span>
        </a>

        <ul
          ref={listRef}
          onPointerLeave={() => setHovered(null)}
          className="relative hidden items-center gap-1 md:flex"
        >
          <li
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill ? 1 : 0 }}
          />
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                onPointerEnter={() => setHovered(link.id)}
                onFocus={() => setHovered(link.id)}
                onBlur={() => setHovered(null)}
                className="relative flex min-h-[44px] items-center px-4 text-[15px] font-medium transition-colors duration-300 hover:!text-[var(--text)]"
                style={{ color: active === link.id ? "var(--text)" : "var(--muted)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <CommandButton className="mx-1 flex h-11 items-center gap-2 rounded-full border border-[var(--line-hi)] px-4 text-[var(--muted)] transition-colors duration-300 hover:text-[var(--text)]" />
          </li>
          {hasCamera && (
            <li className="flex items-center">
              <span role="status" className="mono mr-2 text-[12.5px] text-[var(--faint)] empty:hidden">
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
                className="mr-1.5 flex h-11 items-center gap-2 rounded-full border px-4 text-[14px] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{
                  borderColor: handsFree ? "var(--accent)" : "var(--line-hi)",
                  color: handsFree ? "var(--accent)" : "var(--muted)",
                }}
              >
                <Hand className="h-4 w-4" />
                Hands-free
              </button>
            </li>
          )}
          <li className="ml-2">
            <a
              href={profile.contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center rounded-full bg-[var(--signal)] px-5 text-[14.5px] font-semibold text-[var(--on-signal)] transition-colors duration-200 hover:bg-[var(--signal-hi)]"
            >
              Résumé
            </a>
          </li>
        </ul>

        <CommandButton className="ml-auto flex h-11 w-11 items-center justify-center text-[var(--text)] md:hidden" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center md:hidden"
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
                  className="block border-b border-[var(--line)] py-3.5 text-[16.5px] text-[var(--muted)]"
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
                className="block py-3.5 text-[16.5px] text-[var(--accent)]"
              >
                Résumé
              </a>
            </li>
          </ul>
        </div>
      )}

      {handsFree && <HandScroll onClose={stopHandsFree} />}
    </header>
  );
}
