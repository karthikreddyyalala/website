import { Meta, Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { timeline } from "@/content/experience";
import { TechTag } from "../ui/TechTag";

/** Single-column timeline with a spine that lights up as you scroll through the years. */
export function Timeline() {
  return (
    <Section id="path" title="How I got here.">
      <div className="relative md:pl-10">
        {/* Spine: lights up as you scroll through the years. */}
        <div aria-hidden className="absolute bottom-0 left-[5px] top-2 hidden w-[2px] bg-[var(--line-hi)] md:block">
          <span className="spine-fill absolute inset-0 bg-[var(--signal)]" />
        </div>
        <div className="space-y-12 md:space-y-14">
          {timeline.map((entry, i) => (
            <Reveal key={entry.id} delay={Math.min(i, 4) * 60}>
              <div
                id={`path-${entry.id}`}
                className="relative grid gap-3 text-[19px] md:grid-cols-[190px_1fr] md:gap-10"
              >
                <span
                  aria-hidden
                  className="absolute -left-10 top-1.5 hidden h-3 w-3 rounded-full border-2 bg-[var(--bg)] md:block"
                  style={{ borderColor: entry.kind === "work" ? "var(--signal)" : "var(--ice)" }}
                />

                <p className="mono pt-1 text-[13px] text-[var(--ice)]">
                  {entry.period}
                </p>

                <div>
                  <h3 className="h-section text-[20px] text-[var(--text)]">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-[14.5px] text-[var(--muted)]">
                    <Meta text={`${entry.org} · ${entry.location}`} />
                  </p>

                  {entry.points.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {entry.points.map((pt) => (
                        <li key={pt} className="prose-body text-[16.5px]">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}

                  {entry.caseStudyId && (
                    <a
                      href="#work-avis"
                      className="icon-link mt-4 text-[14.5px] font-bold text-[var(--signal)]"
                    >
                      Read the case study
                    </a>
                  )}

                  {entry.tech && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {entry.tech.map((t) => (
                        <TechTag key={t} name={t} className="mono text-[12.5px]" />
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
