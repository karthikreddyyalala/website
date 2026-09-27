"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: string;
  duration?: number;
  className?: string;
};

function parse(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const suffix = match[2];
  const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
  return { num, suffix, decimals };
}

export function CountUp({ value, duration = 1600, className }: CountUpProps) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(parsed ? `0${parsed.decimals > 0 ? "." + "0".repeat(parsed.decimals) : ""}${parsed.suffix}` : value);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!parsed || hasRun.current) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;
        observer.disconnect();

        const start = performance.now();
        const { num, suffix, decimals } = parsed;

        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * num;
          setDisplay(current.toFixed(decimals) + suffix);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed, value, duration]);

  return <span ref={ref} className={className}>{display}</span>;
}
