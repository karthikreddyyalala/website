"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: string;
  duration?: number;
  className?: string;
};

const MULTIPLIERS: Record<string, number> = { K: 1_000, M: 1_000_000, B: 1_000_000_000 };

function parse(value: string) {
  const match = value.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const prefix = match[1];
  const num = parseFloat(match[2]);
  const suffix = match[3];
  const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;

  const suffixLetter = suffix.match(/^([KMB])/i)?.[1]?.toUpperCase() ?? "";
  const multiplier = MULTIPLIERS[suffixLetter] ?? 1;
  const fullNum = num * multiplier;

  return { prefix, num, suffix, decimals, fullNum, multiplier };
}

function formatMidAnimation(prefix: string, current: number, multiplier: number, suffix: string): string {
  if (multiplier > 1) {
    return `${prefix}${Math.floor(current).toLocaleString("en-US")}`;
  }
  return `${prefix}${Math.floor(current)}${suffix}`;
}

export function CountUp({ value, duration = 1600, className }: CountUpProps) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);
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
        const { prefix, num, suffix, decimals, fullNum, multiplier } = parsed;

        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * fullNum;

          if (progress === 1 && multiplier > 1) {
            setDisplay(`${prefix}${Math.floor(fullNum).toLocaleString("en-US")}+`);
          } else if (progress === 1) {
            setDisplay(prefix + num.toFixed(decimals) + suffix);
          } else {
            setDisplay(formatMidAnimation(prefix, current, multiplier, suffix));
          }

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
