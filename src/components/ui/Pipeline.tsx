import type { DiagramStage } from "@/content/casestudy";

/**
 * Architecture as a line diagram running down the page: each stage is a
 * station, and each failure path is a branch line that leaves the track at
 * 45 degrees and ends at its own small stop. Shows the pattern only, with no
 * infrastructure identifiers. The track fills stage by stage as you scroll
 * (see .flow-fill).
 */
export function Pipeline({ stages }: { stages: readonly DiagramStage[] }) {
  return (
    <ol>
      {stages.map((stage, i) => (
        <li key={stage.label} className="relative pb-6 pl-10 last:pb-0">
          {i < stages.length - 1 && (
            <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-[6px] bg-[var(--line-hi)]">
              <span className="flow-fill absolute inset-0 origin-top bg-[var(--line-color)]" />
            </span>
          )}
          <span
            aria-hidden
            className="absolute left-0 top-0.5 h-5 w-5 rounded-full border-[5px] border-[var(--text)] bg-[var(--bg)]"
          />

          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="text-[16px] font-extrabold leading-tight text-[var(--text)]">{stage.label}</span>
            <span className="text-[14px] leading-snug text-[var(--muted)]">{stage.detail}</span>
          </p>

          {stage.branch && (
            <p className="relative mt-1.5 flex h-[30px] items-end pl-[34px] text-[13px] leading-none text-[var(--muted)]">
              {/* The spur starts on the track and runs out to its own stop. */}
              <svg aria-hidden viewBox="0 0 62 30" className="absolute -left-[30px] bottom-[-2px] h-[30px] w-[62px]">
                <path d="M0 0L22 22H46" fill="none" stroke="var(--branch)" strokeWidth="5" strokeLinejoin="round" />
                <circle cx="52" cy="22" r="5.5" fill="var(--bg)" stroke="var(--branch)" strokeWidth="3.5" />
              </svg>
              <span className="pb-[3px]">{stage.branch}</span>
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
