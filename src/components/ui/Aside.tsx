import type { ReactNode } from "react";

/**
 * A margin note in the author's voice.
 *
 * Deliberately off the grid: nudged left of the column it sits in and rotated a
 * fraction of a degree, so it reads as something written beside the work rather
 * than another styled block generated with it. The rotation is small enough to
 * register as texture rather than as an effect.
 */
export function Aside({ children }: { children: ReactNode }) {
  return (
    <p
      className="mt-7 max-w-[34ch] border-l-[3px] pl-4 text-[13.5px] leading-relaxed"
      style={{
        borderColor: "var(--l-stack)",
        color: "var(--muted)",
        transform: "rotate(-0.35deg)",
      }}
    >
      {children}
    </p>
  );
}
