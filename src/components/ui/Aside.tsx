import type { ReactNode } from "react";

/** A margin note in the author's voice, set quietly beside the work. */
export function Aside({ children }: { children: ReactNode }) {
  return (
    <p className="mt-7 max-w-[36ch] border-l border-[var(--signal)] pl-4 text-[15px] leading-relaxed text-[var(--muted)]">
      {children}
    </p>
  );
}
