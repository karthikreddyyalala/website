import { Sheet, Meta } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { TechTag } from "../ui/TechTag";
import { timeline } from "@/content/experience";

/**
 * Sheet 05. The path as a dated list down a line. The line fills as the
 * reader scrolls through it (transform only; see .spine-fill).
 */
export function Timeline() {
  return (
    <Sheet id="path" no="05" name="Path" title="How I got here.">
      <div data-tied className="relative mt-12 md:pl-10">
        <div aria-hidden className="absolute bottom-0 left-[5px] top-2 hidden w-px bg-[var(--rule)] md:block">
          <span className="spine-fill absolute inset-0 bg-[var(--signal)]" />
        </div>
        <div className="space-y-12 md:space-y-14">
          {timeline.map((entry, i) => (
            <Reveal key={entry.id} delay={Math.min(i, 4) * 50}>
              <div id={`path-${entry.id}`} className="relative grid gap-3 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
                <span
                  aria-hidden
                  className="absolute -left-[39px] top-[7px] hidden h-[11px] w-[11px] border bg-[var(--paper)] md:block"
                  style={{ borderColor: entry.kind === "work" ? "var(--signal)" : "var(--edge)" }}
                />

                <p className="note pt-1 text-[var(--ink)]">{entry.period}</p>

                <div className="min-w-0">
                  <h3 className="title !text-[1.3rem]">{entry.title}</h3>
                  <p className="mt-1.5 text-[15px] text-[var(--graphite)]">
                    <Meta text={`${entry.org} · ${entry.location}`} />
                  </p>

                  {entry.points.length > 0 && (
                    <ul className="mt-4 space-y-2.5">
                      {entry.points.map((pt) => (
                        <li key={pt} className="prose-body text-[16px]">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}

                  {entry.caseStudyId && (
                    <a href="#work-avis" className="icon-link mt-3 !text-[var(--signal)]">
                      Read the case study
                    </a>
                  )}

                  {entry.tech && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {entry.tech.map((t) => (
                        <TechTag key={t} name={t} />
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
