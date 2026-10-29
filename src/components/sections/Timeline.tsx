import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { timeline } from "@/content/experience";

/**
 * Single-column timeline with a static rule. No parallax, no perspective
 * transforms, no scroll-linked progress bar — those were the repaint cost in
 * the previous build and they added nothing a date column doesn't.
 */
export function Timeline() {
  return (
    <Section id="path" index="04" label="Path" title="How I got here.">
      <div className="relative">
        {/* Static spine */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 top-2 w-px bg-[var(--line)] md:left-[164px]"
        />

        <div className="space-y-12 md:space-y-14">
          {timeline.map((entry, i) => (
            <Reveal key={entry.id} delay={Math.min(i, 4) * 60}>
              <div className="relative grid gap-3 pl-8 md:grid-cols-[164px_1fr] md:gap-10 md:pl-0">
                <span
                  aria-hidden
                  className="absolute left-0 top-2 h-1.5 w-1.5 -translate-x-[3px] rounded-full md:left-[164px]"
                  style={{
                    background:
                      entry.kind === "work" ? "var(--accent)" : "var(--faint)",
                  }}
                />

                <p className="mono pt-px text-[11.5px] text-[var(--faint)] md:pr-8 md:text-right">
                  {entry.period}
                </p>

                <div className="md:pl-8">
                  <h3 className="text-[16.5px] font-medium text-[var(--text)]">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-[13.5px] text-[var(--muted)]">
                    {entry.org}
                    <span className="text-[var(--faint)]"> · {entry.location}</span>
                  </p>

                  {entry.points.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {entry.points.map((pt) => (
                        <li key={pt} className="prose-body text-[15px]">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}

                  {entry.caseStudyId && (
                    <a
                      href="#work-avis"
                      className="mono mt-4 inline-block text-[11px] transition-colors hover:text-[var(--accent-hi)]"
                      style={{ color: "var(--accent)" }}
                    >
                      Read the case study ↑
                    </a>
                  )}

                  {entry.tech && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {entry.tech.map((t) => (
                        <li
                          key={t}
                          className="mono rounded-full bg-[var(--surface-hi)] px-2.5 py-1 text-[11px] text-[var(--faint)]"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
