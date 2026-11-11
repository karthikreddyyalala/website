import type { CSSProperties } from "react";
import type { DiagramStage } from "@/content/casestudy";

/**
 * Architecture as a line diagram: each stage is a station, and each failure
 * path leaves its station as a branch line. Shows the pattern only, with no
 * infrastructure identifiers. Flow layout, so it wraps or scrolls on small
 * screens instead of shrinking. The track fills in stage order as it scrolls
 * into view (see .flow-fill).
 */
export function Pipeline({ stages }: { stages: readonly DiagramStage[] }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
      <ol className="flex min-w-max md:min-w-0 md:flex-wrap md:gap-y-9">
        {stages.map((stage, i) => (
          <li key={stage.label} className="relative w-[164px] pr-5 pt-9">
            {i < stages.length - 1 && (
              <span aria-hidden className="absolute inset-x-0 top-[7px] h-[6px] bg-[var(--line-hi)]">
                <span
                  className="flow-fill absolute inset-0 origin-left bg-[var(--line-color)]"
                  style={{ "--i": i } as CSSProperties}
                />
              </span>
            )}
            <span
              aria-hidden
              className="absolute left-0 top-0 h-5 w-5 rounded-full border-[5px] border-[var(--text)] bg-[var(--bg)]"
            />

            <p className="mono text-[10.5px] text-[var(--faint)]">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 text-[15px] font-extrabold leading-tight text-[var(--text)]">{stage.label}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-[var(--muted)]">{stage.detail}</p>

            {stage.branch && (
              <p className="mono mt-3 flex gap-1.5 text-[10.5px] leading-snug text-[var(--muted)]">
                <svg aria-hidden viewBox="0 0 18 14" className="mt-px h-3.5 w-[18px] flex-none text-[var(--l-about)]">
                  <path d="M2 0v4l7 7h9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                </svg>
                {stage.branch}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
