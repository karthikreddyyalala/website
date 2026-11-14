import { Plus } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { Pipeline } from "../ui/Pipeline";
import { Aside } from "../ui/Aside";
import { Details, Meta, Sheet } from "../ui/Section";
import { TechTag } from "../ui/TechTag";
import { caseStudy } from "@/content/casestudy";

/**
 * Sheet 02, in three levels so it can be scanned:
 *   1. the header, the three figures and the intro;
 *   2. four initiative rows. The first is open and carries the pipeline that
 *      draws itself as you scroll; the others open on click;
 *   3. inside each, the engineering decisions behind one more disclosure.
 * Everything stays in the DOM when collapsed.
 */
export function CaseStudy() {
  return (
    <Sheet id="work-avis" no="02" name="Avis" title={caseStudy.company}>
      <Reveal delay={60}>
        <p className="mt-6 text-[16.5px] text-[var(--graphite)]">
          <Meta text={`${caseStudy.role} · ${caseStudy.qualifier} · ${caseStudy.location} · ${caseStudy.period}`} />
        </p>
      </Reveal>

      {/* The headline figures; each counts up once as it scrolls in. */}
      <Reveal delay={100}>
        <dl className="mt-10 grid gap-x-8 border-y border-[var(--rule)] sm:grid-cols-[1fr_auto_1fr] lg:gap-x-14">
          {caseStudy.headline.map((m, i) => (
            <div key={m.label} className={`flex flex-col-reverse py-6 ${i ? "border-t border-[var(--rule)] sm:border-t-0" : ""}`}>
              <dt className="mt-2 text-[15px] leading-snug text-[var(--graphite)]">{m.label}</dt>
              <dd className="readout text-[var(--signal)]">
                <CountUp value={m.value} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={140} className="mt-8 grid lg:grid-cols-12">
        <p className="lead max-w-[62ch] text-[var(--graphite)] lg:col-span-9 lg:col-start-4">{caseStudy.intro}</p>
      </Reveal>

      <div className="mt-14 border-b border-[var(--edge)]">
        {caseStudy.initiatives.map((init, idx) => (
          <Reveal key={init.id}>
            <article id={`avis-${init.id}`} className="border-t border-[var(--edge)]">
              <Details
                defaultOpen={idx === 0}
                summaryClassName="flex min-h-[72px] items-center gap-4 py-4 md:gap-6"
                summary={
                  <>
                    <span className="note w-7 flex-none text-[var(--signal)]">{init.index}</span>
                    <h3 className="title min-w-0 flex-1">{init.title}</h3>
                    <span className="note hidden items-center gap-2 text-[var(--ink)] sm:flex">
                      <span className="when-closed">Open</span>
                      <span className="when-open">Close</span>
                    </span>
                    <span aria-hidden className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[var(--edge)]">
                      <Plus className="plus h-4 w-4" />
                    </span>
                  </>
                }
              >
                <div className="grid gap-8 pb-12 pt-2 lg:grid-cols-12 lg:gap-10">
                  <div className="min-w-0 lg:order-2 lg:col-span-7">
                    <p className="prose-body">{init.summary}</p>

                    {init.outcomes && init.outcomes.length > 0 && (
                      <ul className="mt-7 space-y-2.5">
                        {init.outcomes.map((o) => (
                          <li key={o} className="flex gap-3 text-[15.5px] leading-snug text-[var(--ink)]">
                            <span aria-hidden className="mt-[8px] h-[5px] w-[5px] flex-none bg-[var(--signal)]" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    )}

                    <ul className="mt-7 flex flex-wrap gap-1.5">
                      {init.tech.map((t) => (
                        <TechTag key={t} name={t} />
                      ))}
                    </ul>

                    {init.aside && <Aside>{init.aside}</Aside>}

                    <Details
                      className="mt-7"
                      summaryClassName="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-bold text-[var(--signal)]"
                      summary={
                        <>
                          <Plus aria-hidden className="plus h-4 w-4" strokeWidth={2.25} />
                          <span className="when-closed">Read the engineering decisions</span>
                          <span className="when-open">Hide details</span>
                        </>
                      }
                    >
                      {/* The decisions. This is the differentiating content. */}
                      <div className="mt-5 space-y-6">
                        {init.decisions.map((d) => (
                          <div key={d.title} className="border-l border-[var(--edge)] pl-5">
                            <h4 className="text-[16.5px] font-bold text-[var(--ink)]">{d.title}</h4>
                            <p className="prose-body mt-2 text-[16px]">{d.body}</p>
                          </div>
                        ))}
                      </div>
                    </Details>
                  </div>

                  {init.pipeline && (
                    <div className="min-w-0 lg:sticky lg:top-24 lg:order-1 lg:col-span-5 lg:self-start">
                      <div className="panel ticks p-5 md:p-6">
                        <Pipeline stages={init.pipeline} />
                      </div>
                    </div>
                  )}
                </div>
              </Details>
            </article>
          </Reveal>
        ))}
      </div>

      {/* VP research: a different shape, so it reads as a different kind of work. */}
      <Reveal>
        <div id="avis-research" className="panel mt-14 p-6 md:p-9">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <h3 className="title">{caseStudy.research.title}</h3>
              <p className="mt-2 text-[15px] font-bold text-[var(--graphite)]">Beyond the build</p>
              <p className="note mt-2.5 text-[var(--signal)]">{caseStudy.research.forWhom}</p>
            </div>
            <div className="md:col-span-8">
              <p className="prose-body">{caseStudy.research.body}</p>
              {caseStudy.research.note && <p className="mt-4 text-[14.5px] text-[var(--graphite)]">{caseStudy.research.note}</p>}
              {caseStudy.research.liveLink && (
                <a href={caseStudy.research.liveLink} target="_blank" rel="noopener noreferrer" className="icon-link mt-3 !text-[var(--signal)]">
                  {caseStudy.research.liveLinkLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Sheet>
  );
}
