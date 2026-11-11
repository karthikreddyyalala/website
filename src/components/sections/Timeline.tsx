import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { timeline } from "@/content/experience";
import { ArrowUp } from "lucide-react";

/**
 * Single-column timeline. The amber spine draws itself as you scroll through
 * the years, using a CSS scroll-driven animation on transform only: no scroll
 * listener and no repaint, which is what made the earlier JS version janky.
 * Without support it is the plain static rule.
 */
export function Timeline() {
  return (
    <Section id="path" index="04" label="Path" line="path" title="How I got here.">
      <div className="relative">
        {/* Spine: static rule, with the scroll-drawn amber line over it */}
        <div
          aria-hidden
          className="absolute bottom-0 top-2 hidden w-[6px] -translate-x-[3px] rounded-full bg-[var(--line)] md:left-[200px] md:block"
        />
        <div
          aria-hidden
          className="spine-fill absolute bottom-0 top-2 hidden w-[6px] -translate-x-[3px] rounded-full bg-[var(--line-color)] md:left-[200px] md:block"
        />

        <div className="space-y-12 md:space-y-14">
          {timeline.map((entry, i) => (
            <Reveal key={entry.id} delay={Math.min(i, 4) * 60}>
              <div className="relative grid gap-3 md:grid-cols-[200px_1fr] md:gap-10">
                <span
                  aria-hidden
                  className="absolute top-0.5 hidden h-[20px] w-[20px] -translate-x-[10px] rounded-full border-[5px] md:left-[200px] md:block"
                  style={{
                    background: "var(--bg)",
                    borderColor: entry.kind === "work" ? "var(--text)" : "var(--faint)",
                  }}
                />

                <p className="mono pt-px text-[11.5px] text-[var(--faint)] md:pr-8 md:text-right">
                  {entry.period}
                </p>

                <div className="md:pl-8">
                  <h3 className="text-[19px] font-extrabold text-[var(--text)]">
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
                      className="icon-link mt-4 text-[13.5px] font-bold text-[var(--line-color)]"
                    >
                      Read the case study
                      <ArrowUp />
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
