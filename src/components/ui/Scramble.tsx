"use client";

import { useEffect, useState } from "react";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const STEP = 47; // ms between letters settling; the 19-letter hero name lands at ~900ms
const SWAP = 55; // ms between random glyph changes, so it reads as decoding, not flicker

function noise(c: string) {
  const set = c === c.toUpperCase() ? UPPER : LOWER;
  return set[Math.floor(Math.random() * set.length)];
}

/**
 * Decodes `text` from random letters, left to right, once on mount.
 * `offset` is how many letters come before this one in the same sequence,
 * so several lines can share one left-to-right sweep.
 *
 * The real letter always stays in the DOM (transparent while scrambling) and
 * holds its exact width, so the line never shifts and the text stays readable
 * for crawlers and screen readers. The random glyph is an aria-hidden overlay.
 */
export function Scramble({ text, offset = 0 }: { text: string; offset?: number }) {
  // null = settled. Server render and reduced motion never leave this state.
  const [glyphs, setGlyphs] = useState<(string | null)[] | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = [...text];
    const end = (offset + chars.length) * STEP;
    let start = 0;
    let lastSwap = -1;
    let raf = 0;

    const frame = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      if (t >= end) {
        setGlyphs(null);
        return;
      }
      const swap = Math.floor(t / SWAP);
      if (swap !== lastSwap) {
        lastSwap = swap;
        setGlyphs(chars.map((c, i) => (c === " " || t >= (offset + i + 1) * STEP ? null : noise(c))));
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [text, offset]);

  if (!glyphs) return text;

  return [...text].map((c, i) =>
    glyphs[i] ? (
      <span key={i} className="relative">
        <span className="text-transparent">{c}</span>
        <span
          aria-hidden
          className="mono absolute inset-0 flex items-center justify-center font-medium"
        >
          {glyphs[i]}
        </span>
      </span>
    ) : (
      c
    )
  );
}
