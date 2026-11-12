import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Section heading: the title at display scale over a rule. The heading speaks for itself, with no label beside it. */
export function SectionHead({ children }: { children: ReactNode }) {
  return (
    <div className="border-b border-[var(--line-hi)] pb-6 text-[clamp(2rem,4.6vw,3.4rem)]">{children}</div>
  );
}

/**
 * A run of short facts. Content writes them joined by a middle dot
 * ("AI Engineer · SDE"); they are set apart by hairlines instead.
 */
export function Meta({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
      {text.split(" · ").map((part, i) => (
        <span key={part} className={i ? "border-l border-[var(--line-hi)] pl-3" : undefined}>
          {i > 0 && <span className="sr-only">, </span>}
          {part}
        </span>
      ))}
    </span>
  );
}

type SectionProps = {
  id: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
};

/** Section shell. Server component: the only client code is the Reveal leaf. */
export function Section({ id, title, lede, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      <div className="shell">
        <Reveal>
          <SectionHead>
            <h2 className="h-section">{title}</h2>
          </SectionHead>
        </Reveal>

        {lede ? (
          <Reveal delay={90}>
            <p className="prose-body mt-6 text-[17px]">{lede}</p>
          </Reveal>
        ) : null}

        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
