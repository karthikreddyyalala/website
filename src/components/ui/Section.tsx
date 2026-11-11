import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Section heading: the title at display scale, with the section's short name beside it. */
export function SectionHead({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-[var(--line-hi)] pb-6 text-[clamp(2rem,4.6vw,3.4rem)]">
      {children}
      {label && (
        <p className="mono pb-1.5 text-[12.5px] uppercase tracking-[0.16em] text-[var(--ice)]">{label}</p>
      )}
    </div>
  );
}

type SectionProps = {
  id: string;
  label: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
};

/** Section shell. Server component: the only client code is the Reveal leaf. */
export function Section({ id, label, title, lede, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      <div className="shell">
        <Reveal>
          <SectionHead label={label}>
            <h2 className="h-section">{title}</h2>
          </SectionHead>
        </Reveal>

        {lede ? (
          <Reveal delay={90}>
            <p className="prose-body mt-6 text-[16.5px]">{lede}</p>
          </Reveal>
        ) : null}

        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
