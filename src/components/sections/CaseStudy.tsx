import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { Pipeline } from "../ui/Pipeline";
import { Aside } from "../ui/Aside";
import { Rail, SectionHead, lineStyle } from "../ui/Section";
import { caseStudy } from "@/content/casestudy";
import { ArrowUpRight, ChevronDown } from "lucide-react";

export function CaseStudy() {
  return (
    <section id="work-avis" className="relative py-24 md:py-36" style={lineStyle("avis")}>
      <Rail />
      <div className="shell relative">
        <Reveal>
          <SectionHead index="01" label="Production work">
            <h2 className="h-section">{caseStudy.company}</h2>
          </SectionHead>
        </Reveal>

        <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-start">
          <Reveal delay={60} className="md:col-span-7">
            <p className="text-[15px] text-[var(--muted)]">
              {caseStudy.role} · {caseStudy.qualifier} · {caseStudy.location}
              <span className="mono ml-3 text-[var(--faint)]">{caseStudy.period}</span>
            </p>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5">
            <p className="prose-body text-[15px]">{caseStudy.intro}</p>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <dl className="mt-12 grid grid-cols-1 border-t-[3px] border-[var(--line-color)] sm:grid-cols-3">
            {caseStudy.headline.map((m) => (
              <div
                key={m.label}
                className="border-b border-[var(--line)] py-6 pr-8 sm:border-b-0"
              >
                <dt
                  className="mono tabular-nums text-[28px] md:text-[34px]"
                  style={{ color: "var(--accent)" }}
                >
                  <CountUp value={m.value} />
                </dt>
                <dd className="mt-1.5 text-[12.5px] leading-snug text-[var(--muted)]">
                  {m.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-20 space-y-20 md:space-y-28">
          {caseStudy.initiatives.map((init, idx) => (
            <Reveal key={init.id} delay={idx === 0 ? 0 : 40}>
              <article>
                <div className="grid gap-6 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <h3 className="h-section flex items-start gap-3 text-[24px] md:text-[28px]">
                      <span aria-hidden className="bullet mt-1">
                        {init.index}
                      </span>
                      {init.title}
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {init.tech.map((t) => (
                        <li
                          key={t}
                          className="mono rounded-full border border-[var(--line)] px-2.5 py-1 text-[10.5px] text-[var(--faint)]"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>

                    {init.aside && <Aside>{init.aside}</Aside>}
                  </div>

                  <div className="min-w-0 md:col-span-8">
                    <p className="prose-body text-[16.5px]">{init.summary}</p>

                    {init.pipeline && (
                      <div className="mt-8 border-y border-[var(--line-hi)] py-6">
                        <Pipeline stages={init.pipeline} />
                      </div>
                    )}

                    {init.outcomes && init.outcomes.length > 0 && (
                      <ul className="mt-8 space-y-2">
                        {init.outcomes.map((o) => (
                          <li
                            key={o}
                            className="flex gap-3 text-[14.5px] text-[var(--muted)]"
                          >
                            <span aria-hidden className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-[var(--line-color)]" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    )}
                    <details className="group mt-8">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[13.5px] font-bold text-[var(--line-color)] transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
                        <span className="group-open:hidden">Read the engineering decisions</span>
                        <span className="hidden group-open:inline">Hide details</span>
<ChevronDown aria-hidden className="h-4 w-4 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
                      </summary>
                    {/* The decisions. This is the differentiating content. */}
                    <div className="mt-7 space-y-7">
                      {init.decisions.map((d) => (
                        <div
                          key={d.title}
                          className="border-l pl-5"
                          style={{ borderColor: "var(--accent-dim)" }}
                        >
                          <h4 className="text-[15px] font-medium text-[var(--text)]">
                            {d.title}
                          </h4>
                          <p className="prose-body mt-2 text-[15px]">{d.body}</p>
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
          <div className="mt-20 border-t-[3px] border-[var(--line-color)] pt-8">
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3 className="h-section text-[22px] md:text-[26px]">
                  {caseStudy.research.title}
                </h3>
                <p className="mono mt-2 text-[11px] uppercase tracking-[0.14em] text-[var(--faint)]">Beyond the build</p>
                <p className="mt-2.5 text-[13px] font-bold text-[var(--line-color)]">
                  {caseStudy.research.forWhom}
                </p>
              </div>
              <div className="md:col-span-8">
                <p className="prose-body text-[15px]">{caseStudy.research.body}</p>
                {caseStudy.research.note && (
                  <p className="mono mt-4 text-[11px] text-[var(--faint)]">
                    {caseStudy.research.note}
                  </p>
                )}
                {caseStudy.research.liveLink && (
                  <a
                    href={caseStudy.research.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-link mt-4 text-[13.5px] font-bold text-[var(--line-color)]"
                  >
                    {caseStudy.research.liveLinkLabel}
                    <ArrowUpRight />
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
