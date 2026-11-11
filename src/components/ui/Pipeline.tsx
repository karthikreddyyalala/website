import type { DiagramStage } from "@/content/casestudy";

/**
 * Generalized architecture diagram.
 *
 * Deliberately shows the *pattern* — stage, purpose, and failure branch — with
 * no infrastructure identifiers. Built from flow layout rather than SVG so it
 * reflows on mobile instead of scaling into illegibility.
 */
export function Pipeline({ stages }: { stages: readonly DiagramStage[] }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
      <ol className="flex min-w-max items-stretch md:min-w-0 md:flex-wrap">
        {stages.map((stage, i) => (
          <li key={stage.label} className="flex items-stretch">
            <div className="flex w-[152px] flex-col justify-between py-4 md:w-[148px]">
              <div>
                <p className="mono text-[10px] text-[var(--faint)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1.5 text-[13.5px] font-medium leading-tight text-[var(--text)]">
                  {stage.label}
                </p>
                <p className="mt-1 text-[11.5px] leading-snug text-[var(--muted)]">
                  {stage.detail}
                </p>
              </div>

              {stage.branch ? (
                <p
                  className="mono mt-3 text-[10px] leading-snug"
                  style={{ color: "var(--accent)" }}
                >
                  ↳ {stage.branch}
                </p>
              ) : (
                <span className="mt-3 block h-3" aria-hidden />
              )}
            </div>

            {i < stages.length - 1 && (
              <div aria-hidden className="flex w-6 items-center justify-center">
                <span className="relative h-px w-full bg-[var(--line-hi)]">
                  {/* Fills in stage order as the diagram scrolls past. */}
                  <span
                    className="flow-fill absolute inset-0 bg-[var(--accent)]"
                    style={{ "--i": i } as React.CSSProperties}
                  />
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
