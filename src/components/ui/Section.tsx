import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "./Reveal";

/** The route lines. Each section rides one; the token lives in globals.css. */
export type Line = "avis" | "work" | "stack" | "path" | "contact";

/** Sets `--line-color` for everything inside. Yellow and ink need their own bullet ink. */
export function lineStyle(line: Line): CSSProperties {
  return {
    "--line-color": `var(--l-${line})`,
    ...(line === "stack" && { "--bullet-ink": "#11151c" }),
    ...(line === "contact" && { "--bullet-ink": "var(--bg)" }),
  } as CSSProperties;
}

/**
 * The trunk line down the left edge of a section. It fills with the section's
 * line color as you scroll (CSS scroll-driven; a solid line without support).
 * Stacked sections make one continuous route that changes color at each stop,
 * and a small train marker rides the tip of the line.
 */
export function Rail() {
  return (
    <div aria-hidden className="shell pointer-events-none absolute inset-0">
      <div className="rail">
        <span className="rail-fill" />
        <span className="rail-train" />
      </div>
    </div>
  );
}

/**
 * Section heading as a station sign: the stop on the rail, the numbered line
 * bullet, the title, and the line's name in plain type at the far end.
 */
export function SectionHead({
  index,
  label,
  children,
}: {
  index: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative text-[clamp(2rem,4.5vw,3.25rem)]">
      <span aria-hidden className="station" />
      <div className="flex flex-wrap items-start gap-x-5 gap-y-2">
        <span aria-hidden className="bullet mt-[0.07em]">
          {index}
        </span>
        {children}
        {label && (
          <p className="ml-auto self-center text-[15px] font-bold text-[var(--muted)]">{label}</p>
        )}
      </div>
    </div>
  );
}

type SectionProps = {
  id: string;
  /** Two-digit marker, e.g. "02". */
  index: string;
  label: string;
  title: string;
  line: Line;
  lede?: string;
  children: ReactNode;
  className?: string;
};

/** Section shell. Server component: the only client code is the Reveal leaf. */
export function Section({ id, index, label, title, line, lede, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative py-24 md:py-36 ${className}`} style={lineStyle(line)}>
      <Rail />
      <div className="shell relative">
        <Reveal>
          <SectionHead index={index} label={label}>
            <h2 className="h-section">{title}</h2>
          </SectionHead>
        </Reveal>

        {lede ? (
          <Reveal delay={90}>
            <p className="prose-body mt-6 text-[16px]">{lede}</p>
          </Reveal>
        ) : null}

        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
