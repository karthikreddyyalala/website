"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Hand } from "lucide-react";
import { profile } from "@/content/profile";
import { CommandButton } from "./CommandMenu";
import { SoundToggle } from "./ui/Sound";
import { ThemeToggle } from "./ui/Fx";
import { ScrambleText } from "./ui/Section";

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

/**
 * The floating nav. A short lit bar (the "lamp") and a soft block slide to
 * the link for the section on screen, or to the link under the pointer or
 * focus. Based on the Tubelight Navbar from 21st.dev (ayushmxxn), rebuilt
 * without a motion library: the lamp is moved with transform only.
 */
export function Nav() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [lamp, setLamp] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const place = () => {
      const link = listRef.current?.querySelector<HTMLElement>(`a[href="#${hovered ?? active}"]`);
      setLamp(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
    };
    place();
    // Fonts arriving change the link widths.
    document.fonts?.ready.then(place);
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
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

  // The section crossing the middle of the screen is the active one. No scroll listener.
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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
      <div className="nav-pill relative mx-auto max-w-[1120px]">
        <nav aria-label="Primary" className="flex h-[56px] items-center pl-5 pr-1.5 md:pl-6">
          <a href="#top" className="title flex min-h-[44px] items-center !text-[18px] text-[var(--ink)]">
            KRY<span className="text-[var(--signal)]">.</span>
          </a>

          <ul
            ref={listRef}
            onPointerLeave={() => setHovered(null)}
            onBlur={() => setHovered(null)}
            className="relative ml-auto hidden h-full items-center md:flex"
          >
            {lamp && (
              <>
                <li aria-hidden className="lamp" style={{ transform: `translate3d(${lamp.left}px,0,0) scaleX(${lamp.width})` }} />
                <li
                  aria-hidden
                  className="lamp-bar"
                  style={{ transform: `translate3d(${lamp.left + lamp.width / 2}px,0,0)` }}
                />
              </>
            )}
            {LINKS.map((link) => (
              <li key={link.id} className="h-full">
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  onPointerEnter={() => setHovered(link.id)}
                  onFocus={() => setHovered(link.id)}
                  className="relative flex h-full items-center px-3.5 text-[15px] font-medium text-[var(--graphite)] transition-colors duration-200 hover:text-[var(--ink)] aria-[current]:text-[var(--ink)] lg:px-4"
                >
                  <ScrambleText text={link.label} />
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center md:ml-3 md:border-l md:border-[var(--rule)] md:pl-2">
            <CommandButton className="icon-btn md:w-auto md:gap-2 md:px-3" />
            <ThemeToggle className="icon-btn hidden md:inline-flex" />
            <SoundToggle className="icon-btn hidden md:inline-flex" />
            {hasCamera && (
              <span className="hidden items-center md:flex">
                <span role="status" className="note mr-1 empty:hidden">
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
                  className="icon-btn md:w-auto md:gap-2 md:px-3 text-[14px]"
                >
                  <Hand />
                  <span className="sr-only xl:not-sr-only">Hands-free</span>
                </button>
              </span>
            )}
            <a
              href={profile.contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1.5 hidden h-10 items-center rounded-full bg-[var(--signal)] px-4 text-[14.5px] font-bold text-[var(--on-signal)] transition-transform duration-300 hover:-translate-y-0.5 md:flex"
            >
              Résumé
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="icon-btn md:hidden"
            >
              <span aria-hidden className="relative block h-3 w-5">
                <span
                  className="absolute left-0 top-0 block h-px w-5 bg-[var(--ink)] transition-transform duration-300"
                  style={{ transform: open ? "translate3d(0,6px,0) rotate(45deg)" : "none" }}
                />
                <span
                  className="absolute left-0 top-3 block h-px w-5 bg-[var(--ink)] transition-transform duration-300"
                  style={{ transform: open ? "translate3d(0,-6px,0) rotate(-45deg)" : "none" }}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="panel unfold mt-2 md:hidden">
          <ul className="flex flex-col px-5 py-2">
            {LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-[var(--rule)] py-3.5 text-[17px] font-medium text-[var(--ink)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="flex items-center justify-between gap-3 py-2">
              <a
                href={profile.contact.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center text-[17px] font-bold text-[var(--signal)]"
              >
                Résumé
              </a>
              <span className="flex items-center">
                <ThemeToggle className="icon-btn" />
                <SoundToggle className="icon-btn" />
              </span>
            </li>
          </ul>
        </div>
      )}

      {handsFree && <HandScroll onClose={stopHandsFree} />}
    </header>
  );
}
