import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * A run of short facts. Content writes them joined by a middle dot
 * ("AI Engineer · SDE"); they are drawn apart by hairlines instead. Screen
 * readers get the original string, whole.
 */
export function Meta({ text, className = "" }: { text: string; className?: string }) {
  const parts = text.split(" · ");
  if (parts.length === 1) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {parts.map((part, i) => (
          // Inline, so a long run wraps like ordinary text.
          <span key={part} className={i ? "ml-3 border-l border-[var(--edge)] pl-3" : undefined}>
            {part}
          </span>
        ))}
      </span>
    </span>
  );
}

type SheetProps = {
  id: string;
  /** Sheet number shown in the margin rail, e.g. "03". */
  no: string;
  /** The section's nav name, shown under the number. */
  name: string;
  title?: string;
  lede?: string;
  children: ReactNode;
  className?: string;
};

/**
 * A section, laid out as one sheet of a drawing set. From 1024px up a margin
 * rail on the left carries the sheet number and the section's nav name; the
 * heading itself stands alone, with a rule under it.
 */
export function Sheet({ id, no, name, title, lede, children, className = "" }: SheetProps) {
  return (
    <section id={id} className={`sheet ${className}`}>
      <div className="shell sheet-grid">
        <div aria-hidden className="rail">
          <div>
            <span className="note text-[var(--ink)]">{no}</span>
            <span className="note">{name}</span>
          </div>
        </div>
        <div className="min-w-0 lg:pl-8">
          {title && (
            <Reveal className="border-b border-[var(--rule)] pb-6">
              <h2 className="display-l max-w-[18ch]">{title}</h2>
            </Reveal>
          )}
          {lede && (
            <Reveal delay={60}>
              <p className="lead mt-6 max-w-[58ch] text-[var(--graphite)]">{lede}</p>
            </Reveal>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
