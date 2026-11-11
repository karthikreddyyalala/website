import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { Pipeline } from "../ui/Pipeline";
import { Aside } from "../ui/Aside";
import { SectionHead } from "../ui/Section";
import { caseStudy } from "@/content/casestudy";
import { Plus } from "lucide-react";

export function CaseStudy() {
  return (
    <section id="work-avis" className="relative py-24 md:py-32">
      <div className="shell relative">
        <Reveal>
          <SectionHead label="Production work">
            <h2 className="h-section">{caseStudy.company}</h2>
          </SectionHead>
        </Reveal>

        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-start">
          <Reveal delay={60} className="md:col-span-7">
            <p className="text-[16.5px] text-[var(--muted)]">
              {caseStudy.role} · {caseStudy.qualifier} · {caseStudy.location}
              <span className="ml-3 text-[var(--faint)]">{caseStudy.period}</span>
            </p>
            <dl className="mt-8 max-w-[440px]">
              {caseStudy.headline.map((m) => (
                <div key={m.label} className="flex items-baseline gap-5 border-t border-[var(--line-hi)] py-3.5">
                  <dt className="h-section w-[150px] flex-none text-[26px] leading-none tabular-nums text-[var(--signal-hi)]">
                    <CountUp value={m.value} />
                  </dt>
                  <dd className="text-[15px] leading-snug text-[var(--muted)]">{m.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5">
            <p className="prose-body text-[16.5px]">{caseStudy.intro}</p>
          </Reveal>
        </div>

        <div className="mt-20 space-y-20 md:space-y-28">
          {caseStudy.initiatives.map((init, idx) => (
            <Reveal key={init.id} delay={idx === 0 ? 0 : 40}>
              <article id={`avis-${init.id}`} className="relative text-[24px] md:text-[28px]">
                <div className="grid gap-6 md:grid-cols-12">
                  {/* Stays pinned beside the write-up while it scrolls past. */}
                  <div className="md:sticky md:top-28 md:col-span-4 md:self-start">
                    <h3 className="h-section">{init.title}</h3>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {init.tech.map((t) => (
                        <li
                          key={t}
                          className="tag mono text-[12.5px]"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>

                    {init.aside && <Aside>{init.aside}</Aside>}
                  </div>

                  <div className="min-w-0 md:col-span-8">
                    <p className="prose-body text-[17px]">{init.summary}</p>

                    {init.pipeline && (
                      <div data-scroll="rise" className="card mt-8 p-6 md:p-7">
                        <Pipeline stages={init.pipeline} />
                      </div>
                    )}

                    {init.outcomes && init.outcomes.length > 0 && (
                      <ul className="mt-8 space-y-2">
                        {init.outcomes.map((o) => (
                          <li
                            key={o}
                            className="flex gap-3 text-[15px] text-[var(--muted)]"
                          >
                            <span aria-hidden className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-[var(--signal)]" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    )}
                    <details className="group mt-8">
                      <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-2 text-[14.5px] font-bold text-[var(--signal)] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
                        <Plus aria-hidden className="h-4 w-4 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none" strokeWidth={2.25} />
                        <span className="group-open:hidden">Read the engineering decisions</span>
                        <span className="hidden group-open:inline">Hide details</span>
                      </summary>
                    {/* The decisions. This is the differentiating content. */}
                    <div className="mt-7 space-y-7">
                      {init.decisions.map((d) => (
                        <div
                          key={d.title}
                          className="border-l pl-5"
                          style={{ borderColor: "var(--accent-dim)" }}
                        >
                          <h4 className="text-[16.5px] font-medium text-[var(--text)]">
                            {d.title}
                          </h4>
                          <p className="prose-body mt-2 text-[16.5px]">{d.body}</p>
                        </div>
                      ))}
                    </div>

                    </details>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* VP research — different shape so it reads as a different kind of work */}
        <Reveal>
          <div id="avis-research" data-scroll="rise" className="card mt-20 p-7 text-[22px] md:p-10 md:text-[26px]">
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3 className="h-section">
                  {caseStudy.research.title}
                </h3>
                <p className="mt-2 text-[15px] font-bold text-[var(--muted)]">Beyond the build</p>
                <p className="mt-2.5 text-[14.5px] font-bold text-[var(--signal)]">
                  {caseStudy.research.forWhom}
                </p>
              </div>
              <div className="md:col-span-8">
                <p className="prose-body text-[16.5px]">{caseStudy.research.body}</p>
                {caseStudy.research.note && (
                  <p className="mt-4 text-[14.5px] text-[var(--faint)]">
                    {caseStudy.research.note}
                  </p>
                )}
                {caseStudy.research.liveLink && (
                  <a
                    href={caseStudy.research.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link mt-4 text-[14.5px] font-bold text-[var(--signal)]"
                  >
                    {caseStudy.research.liveLinkLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
