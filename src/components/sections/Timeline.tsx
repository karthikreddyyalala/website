import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { timeline } from "@/content/experience";
import { ArrowUp } from "lucide-react";

/**
 * Single-column timeline. Every entry is a stop on the section's own rail,
 * which fills as you scroll through the years (see Rail in ui/Section).
 */
export function Timeline() {
  return (
    <Section id="path" index="04" label="Path" line="path" title="How I got here.">
      <div>
        <div className="space-y-12 md:space-y-14">
          {timeline.map((entry, i) => (
            <Reveal key={entry.id} delay={Math.min(i, 4) * 60}>
              <div
                id={`path-${entry.id}`}
                className="relative grid gap-3 text-[19px] md:grid-cols-[200px_1fr] md:gap-10"
              >
                <span
                  aria-hidden
                  className="stop"
                  style={entry.kind === "work" ? undefined : { borderColor: "var(--faint)" }}
                />

                <p className="mono pt-1 text-[12.5px] text-[var(--muted)]">
                  {entry.period}
                </p>

                <div>
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
