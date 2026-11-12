import type { CSSProperties } from "react";
import type { DiagramStage } from "@/content/casestudy";

/**
 * Architecture as a flow running down the page: each stage is a node on one
 * rail, a signal travels the rail from the first stage to the last, and each
 * failure path curves off to the side into its own chip. Shows the pattern
 * only, with no infrastructure identifiers.
 */
export function Pipeline({ stages }: { stages: readonly DiagramStage[] }) {
  const n = stages.length;

  return (
    <ol className="grid grid-cols-1">
      {/* The rail runs from the first node's centre to the last node's centre:
          it spans every row but the last, shifted down by half a node. */}
      {n > 1 && (
        <li
          aria-hidden
          className="pointer-events-none relative -mb-3 mt-3 w-5 overflow-hidden [container-type:size]"
          style={{ gridColumn: 1, gridRow: `1 / span ${n - 1}` }}
        >
          <span className="absolute inset-y-0 left-[9px] w-[2px] bg-[var(--line-hi)]">
            <span className="flow-fill absolute inset-0 bg-[var(--ice)]" />
          </span>
          <span className="pulse" style={{ "--n": n } as CSSProperties} />
        </li>
      )}

      {stages.map((stage, i) => {
        // Content writes a branch as "condition → outcome"; draw it as a chip and a result.
        const [condition, outcome] = stage.branch?.split(" → ") ?? [];
        return (
          <li key={stage.label} className="relative pb-6 pl-10 last:pb-0" style={{ gridColumn: 1, gridRow: i + 1 }}>
            <span
              aria-hidden
              className="absolute left-0 top-0.5 h-5 w-5 rounded-full border-[3px] border-[var(--ice)] bg-[var(--bg)]"
            />

            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span className="text-[17px] font-bold leading-tight text-[var(--text)]">{stage.label}</span>
              <span className="text-[15px] leading-snug text-[var(--muted)]">{stage.detail}</span>
            </p>

            {condition && (
              <p className="mono relative mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] leading-none">
                {/* The branch curves off the rail into the chip. */}
                <svg aria-hidden viewBox="0 0 31 14" className="absolute -left-[31px] top-0 h-[14px] w-[31px]">
                  <path d="M1 0A13 13 0 0 0 14 13H31" fill="none" stroke="var(--signal)" strokeWidth="2" />
                </svg>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--signal)_50%,transparent)] bg-[color-mix(in_srgb,var(--signal)_12%,transparent)] px-2.5 py-[6px] text-[var(--signal-hi)]">
                  {condition}
                </span>
                {outcome && (
                  <>
                    <span aria-hidden className="h-px w-4 bg-[var(--line-hi)]" />
                    <span className="sr-only">leads to</span>
                    <span className="text-[var(--text)]">{outcome}</span>
                  </>
                )}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
