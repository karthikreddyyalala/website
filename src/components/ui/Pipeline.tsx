import type { CSSProperties } from "react";
import type { DiagramStage } from "@/content/casestudy";

/**
 * Architecture as a numbered flow down the page. Each stage is a node on a
 * rail, and each failure path leaves the rail as a spur into its own chip.
 *
 * The diagram draws itself as the reader scrolls: ScrollTied sets --p on the
 * list, and each step turns that into its own progress in CSS, drawing its
 * node, then the line to the next node, with stroke-dashoffset. The step
 * being drawn is ringed. With no script, reduced motion or motion paused it
 * is fully drawn. Shows the pattern only, with no infrastructure identifiers.
 */
export function Pipeline({ stages }: { stages: readonly DiagramStage[] }) {
  const n = stages.length;

  return (
    <ol data-tied="pipe" className="pipe" style={{ "--n": n } as CSSProperties}>
      {stages.map((stage, i) => {
        // Content writes a branch as "condition → outcome"; it is drawn as a chip and a result.
        const [condition, outcome] = stage.branch ? stage.branch.split(" → ") : [];
        return (
          <li key={stage.label} className="pipe-step grid grid-cols-[34px_minmax(0,1fr)] pb-5 last:pb-0" style={{ "--i": i } as CSSProperties}>
            {/* The line down to the next node. */}
            {i < n - 1 && (
              <svg aria-hidden viewBox="0 0 2 100" preserveAspectRatio="none" className="absolute left-[10px] top-[24px] h-[calc(100%-24px)] w-[2px]">
                <path className="pipe-ghost" d="M1 0V100" />
                <path className="pipe-draw pipe-late" pathLength={1} d="M1 0V100" />
              </svg>
            )}
            <svg aria-hidden viewBox="0 0 22 22" className="mt-[3px] h-[22px] w-[22px]">
              <circle className="pipe-ghost" cx="11" cy="11" r="8.5" />
              <circle className="pipe-draw pipe-node" pathLength={1} cx="11" cy="11" r="8.5" transform="rotate(-90 11 11)" />
            </svg>

            <div className="pipe-fade relative min-w-0 rounded-[3px] px-2.5 py-1.5">
              <span aria-hidden className="shine" />
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <span className="note">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[16.5px] font-bold leading-tight text-[var(--ink)]">{stage.label}</span>
                <span className="text-[15px] leading-snug text-[var(--graphite)]">{stage.detail}</span>
              </p>

              {condition && (
                <p className="relative mt-2 text-[13px] leading-none">
                  <span className="sr-only">{stage.branch}</span>
                  <span aria-hidden className="mono flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="rounded-[3px] border border-[var(--signal)] px-2 py-[5px] text-[var(--signal)]">{condition}</span>
                    {outcome && (
                      <>
                        <span className="h-px w-4 bg-[var(--edge)]" />
                        <span className="text-[var(--ink)]">{outcome}</span>
                      </>
                    )}
                  </span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
