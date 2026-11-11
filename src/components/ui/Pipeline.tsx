import type { CSSProperties } from "react";
import type { DiagramStage } from "@/content/casestudy";

/**
 * Architecture as a flow running down the page: each stage is a node, a
 * signal pulse travels down the track between stages, and each failure path
 * branches off to the side. Shows the pattern only, with no infrastructure
 * identifiers.
 */
export function Pipeline({ stages }: { stages: readonly DiagramStage[] }) {
  return (
    <ol>
      {stages.map((stage, i) => (
        <li key={stage.label} className="relative pb-6 pl-10 last:pb-0">
          {i < stages.length - 1 && (
            <span aria-hidden className="absolute bottom-0 left-[9px] top-5 w-[2px] bg-[var(--line-hi)]">
              <span className="flow-fill absolute inset-0 bg-[var(--ice)]" />
              <span className="pulse" style={{ "--i": i } as CSSProperties} />
            </span>
          )}
          <span
            aria-hidden
            className="absolute left-0 top-0.5 h-5 w-5 rounded-full border-[3px] border-[var(--ice)] bg-[var(--bg)]"
          />

          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="text-[17px] font-bold leading-tight text-[var(--text)]">{stage.label}</span>
            <span className="text-[15px] leading-snug text-[var(--muted)]">{stage.detail}</span>
          </p>

          {stage.branch && (
            <p className="mono relative mt-2 flex h-[28px] items-end pl-[34px] text-[13px] leading-none text-[var(--signal-hi)]">
              {/* The branch leaves the track and ends at its own small node. */}
              <svg aria-hidden viewBox="0 0 62 30" className="absolute -left-[30px] bottom-[-2px] h-[30px] w-[62px]">
                <path d="M0 0L22 22H46" fill="none" stroke="var(--signal)" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="52" cy="22" r="4.5" fill="var(--bg)" stroke="var(--signal)" strokeWidth="2" />
              </svg>
              <span className="pb-[3px]">{stage.branch}</span>
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
