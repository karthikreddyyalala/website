import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { Pipeline } from "../ui/Pipeline";
import { Aside } from "../ui/Aside";
import { caseStudy } from "@/content/casestudy";

export function CaseStudy() {
  return (
    <section id="work-avis" className="relative py-24 md:py-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow flex items-center gap-3">
            <span>01</span>
            <span aria-hidden className="h-px w-8 bg-[var(--line-hi)]" />
            <span>Production work</span>
          </p>
        </Reveal>

        <div className="mt-5 grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal delay={60} className="md:col-span-7">
            <h2 className="h-section text-[clamp(2rem,4.5vw,3.25rem)]">
              {caseStudy.company}
            </h2>
            <p className="mt-3 text-[14px] text-[var(--muted)]">
              {caseStudy.role} · {caseStudy.qualifier} · {caseStudy.location}
              <span className="mono ml-3 text-[var(--faint)]">{caseStudy.period}</span>
            </p>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5">
            <p className="prose-body text-[15px]">{caseStudy.intro}</p>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <dl className="mt-12 grid grid-cols-1 border-t border-[var(--line)] sm:grid-cols-3">
            {caseStudy.headline.map((m) => (
              <div
                key={m.label}
                className="border-b border-[var(--line)] py-6 pr-8 sm:border-b-0"
              >
                <dt
                  className="mono text-[28px] md:text-[34px]"
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
                    <p className="mono text-[12px]" style={{ color: "var(--accent)" }}>
                      {init.index}
                    </p>
                    <h3 className="h-section mt-2 text-[22px] md:text-[26px]">
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
                      <div className="mt-8 border-y border-[var(--line)]">
                        <Pipeline stages={init.pipeline} />
                      </div>
                    )}

                    {/* The decisions. This is the differentiating content. */}
                    <div className="mt-9 space-y-7">
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

                    {init.outcomes && init.outcomes.length > 0 && (
                      <ul className="mt-8 space-y-2">
                        {init.outcomes.map((o) => (
                          <li
                            key={o}
                            className="flex gap-3 text-[14.5px] text-[var(--muted)]"
                          >
                            <span aria-hidden className="mono mt-px text-[var(--accent)]">
                              ·
                            </span>
                            {o}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* VP research — different shape so it reads as a different kind of work */}
        <Reveal>
          <div className="panel mt-20 p-7 md:p-10">
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="eyebrow">Beyond the build</p>
                <h3 className="h-section mt-3 text-[20px] md:text-[23px]">
                  {caseStudy.research.title}
                </h3>
                <p className="mt-2.5 text-[13px]" style={{ color: "var(--accent)" }}>
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
                    className="mono mt-4 inline-flex items-center gap-1.5 text-[12px] text-[var(--accent)] hover:opacity-75 transition-opacity"
                  >
                    {caseStudy.research.liveLinkLabel} ↗
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
