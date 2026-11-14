"use client";

import { useEffect, useRef } from "react";
import { play } from "./Sound";

const MULTIPLIERS: Record<string, number> = { K: 1_000, M: 1_000_000, B: 1_000_000_000 };

/** "$1M+" becomes { prefix: "$", target: 1000000, tail: "+" }; "170+" keeps its tail; "4" has none. */
function parse(value: string) {
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)([KMB]?)(.*)$/i);
  if (!m) return null;
  const decimals = m[2].split(".")[1]?.length ?? 0;
  return { prefix: m[1], target: parseFloat(m[2]) * (MULTIPLIERS[m[3].toUpperCase()] ?? 1), decimals, tail: m[4] };
}

function format(p: NonNullable<ReturnType<typeof parse>>, n: number) {
  const digits = { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals };
  return `${p.prefix}${n.toLocaleString("en-US", digits)}${p.tail}`;
}

/**
 * A figure that counts up from zero the first time it scrolls into view.
 * The real figure is in the page from the start, so it is correct without
 * JavaScript, for search engines, with reduced motion and with motion paused.
 */
export function CountUp({ value, duration = 1800 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parse(value);
  const final = parsed ? format(parsed, parsed.target) : value;

  useEffect(() => {
    const el = ref.current;
    const p = parse(value);
    if (!el || !p || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let armed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!armed) {
          // First report. Already on screen (a reload, or a link straight to this
          // section): the visitor has seen the figure, so it stays as it is.
          // Otherwise it drops to zero now, out of sight, and waits.
          if (entry.isIntersecting) return observer.disconnect();
          armed = true;
          el.textContent = format(p, 0);
          return;
        }
        if (entry.intersectionRatio < 0.6) return;
        observer.disconnect();
        if (document.documentElement.dataset.motion === "off") {
          el.textContent = format(p, p.target);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(Math.max((now - start) / duration, 0), 1); // a frame can be stamped before start
          const eased = 1 - Math.pow(1 - t, 4); // fast start, long settle on the last digits
          const scale = 10 ** p.decimals;
          el.textContent = format(p, t === 1 ? p.target : Math.floor(eased * p.target * scale) / scale);
          // With sound on: ticks that climb as the figure does, then a chord when it lands.
          play(t < 1 ? "count" : "success", t);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: [0, 0.6] }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = format(p, p.target);
    };
  }, [value, duration]);

  return (
    <>
      {/* Screen readers get the figure as the content states it, e.g. "$1M+". */}
      <span className="sr-only">{value}</span>
      {/* As wide as the final figure from the start (the face is monospaced), so nothing beside it moves. */}
      <span ref={ref} aria-hidden className="inline-block" style={{ minWidth: `${final.length}ch` }}>
        {final}
      </span>
    </>
  );
}
