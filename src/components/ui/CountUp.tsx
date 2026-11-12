"use client";

import { useEffect, useRef } from "react";

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
    el.textContent = format(p, 0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (document.documentElement.dataset.motion === "off") {
          el.textContent = format(p, p.target);
          return;
        }
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 4); // fast start, long settle on the last digits
          const scale = 10 ** p.decimals;
          el.textContent = format(p, t === 1 ? p.target : Math.floor(eased * p.target * scale) / scale);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
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
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden>
        {final}
      </span>
    </>
  );
}
