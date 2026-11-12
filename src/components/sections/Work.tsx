import Image from "next/image";
import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { ShowcaseStage } from "../ui/Fx";
import { projects, type Project } from "@/content/projects";
import { VideoPreview, VideoTrigger } from "../ui/VideoDialog";
import { Github, Globe, Play } from "lucide-react";
import { TechTag } from "../ui/TechTag";

/** Product screenshot, styled to match the video preview. Links to the live site when there is one. */
function Shot({ src, title, href }: { src: string; title: string; href?: string }) {
  const img = (
    <Image
      src={src}
      alt={`${title} screenshot`}
      fill
      sizes="(max-width: 1024px) 100vw, 680px"
      className="object-cover object-top"
    />
  );
  const box =
    "group relative block aspect-video w-full overflow-hidden rounded-[14px] border border-[var(--line-hi)] bg-[var(--bg-deep)]";

  if (!href) return <div className={box}>{img}</div>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={box}>
      {img}
      <span
        aria-hidden
        className="mono absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-[12.5px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ background: "rgba(0,0,0,0.75)", color: "#fff" }}
      >
        Visit live site
      </span>
    </a>
  );
}

/** A project's demo video or screenshot, or nothing when it has neither. */
function Media({ p }: { p: Project }) {
  if (p.video) return <VideoPreview {...p.video} title={`${p.title} demo`} />;
  if (p.image) return <Shot src={p.image} title={p.title} href={p.live} />;
  return null;
}

const link = "icon-link text-[14.5px] font-bold text-[var(--text)] transition-colors hover:text-[var(--signal)]";

/**
 * Selected work as a pinned showcase. On wide screens a glass stage holds
 * still on the right while the write-ups scroll past on the left; the stage
 * swaps to the demo or screenshot of whichever project is at mid-screen, and
 * the other write-ups dim. Below that width each project carries its own media.
 */
export function Work() {
  return (
    <Section
      id="work"
      title="Things I built to find out if they'd work."
      lede="Agent systems, mostly. A few are experiments I kept because of what they taught me."
    >
      <div data-showcase className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          {projects.map((p, i) => (
            // Padding, not margin, between projects: the one at mid-screen is always exactly one of them.
            <article
              key={p.id}
              id={`work-${p.id}`}
              data-project
              data-active={i === 0 || undefined}
              className="border-t border-[var(--line)] py-12 first:border-t-0 first:pt-0 lg:flex lg:min-h-[62vh] lg:items-center lg:border-t-0 lg:py-[9vh]"
            >
              <Reveal className="showcase-item">
                <h3 className="h-section text-[26px] lg:text-[32px]">{p.title}</h3>
                <div className="mt-2 flex items-center gap-3">
                  <p className="mono text-[13px] text-[var(--faint)]">{p.year}</p>
                  {p.badge && (
                    <span
                      className="mono rounded-full px-2.5 py-0.5 text-[12.5px] font-medium"
                      style={{ background: "var(--signal)", color: "var(--on-signal)" }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                <p className="mt-5 text-[17px] leading-relaxed text-[var(--text)]">{p.tagline}</p>

                {/* Narrow screens have no stage, so the media sits with its project, ahead of the write-up. */}
                {(p.video || p.image) && (
                  <div className="mt-5 lg:hidden">
                    <Media p={p} />
                  </div>
                )}

                <p className="prose-body mt-3 text-[16.5px]">{p.body}</p>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <TechTag key={t} name={t} className="mono text-[12.5px]" />
                  ))}
                </ul>

                {(p.github || p.live || p.video) && (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className={link}>
                        <Github />
                        GitHub
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className={link}>
                        <Globe />
                        Live
                      </a>
                    )}
                    {p.video && (
                      <VideoTrigger
                        {...p.video}
                        title={`${p.title} demo`}
                        className="icon-link text-[14.5px] font-bold text-[var(--signal)]"
                      >
                        <Play fill="currentColor" />
                        Demo
                      </VideoTrigger>
                    )}
                  </div>
                )}

              </Reveal>
            </article>
          ))}
        </div>

        <ShowcaseStage className="hidden lg:col-span-7 lg:block">
          <div className="card sticky top-[max(104px,calc(50svh-210px))] p-3">
            <div className="relative">
              {/* Holds the stage open at the size of one slide. */}
              <div aria-hidden className="aspect-video" />
              <div aria-hidden className="h-[58px]" />

              {projects.map((p, i) => (
                <div key={p.id} data-slide data-active={i === 0 || undefined} className="stage-slide">
                  <div className="stage-media">
                    {p.video || p.image ? (
                      <Media p={p} />
                    ) : (
                      // No footage for this one: the name at scale, on what it is built with.
                      <div
                        aria-hidden
                        className="flex aspect-video flex-col justify-end rounded-[14px] border border-[var(--line)] bg-[var(--bg-deep)] p-8"
                      >
                        <p className="h-display text-[clamp(2.2rem,3.6vw,3.4rem)] text-[var(--text)]">{p.title}</p>
                        <ul className="mt-5 flex flex-wrap gap-1.5">
                          {p.tech.slice(0, 6).map((t) => (
                            <TechTag key={t} name={t} className="mono text-[12.5px]" />
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <p aria-hidden className="flex h-[58px] items-center gap-3 px-2 text-[15px] text-[var(--muted)]">
                    <span className="h-section text-[18px] text-[var(--text)]">{p.title}</span>
                    <span className="mono text-[13px] text-[var(--faint)]">{p.year}</span>
                  </p>
                </div>
              ))}

              {/* Where you are in the list. */}
              <div aria-hidden className="absolute bottom-[27px] right-2 flex gap-1.5">
                {projects.map((p, i) => (
                  <span key={p.id} data-tick data-active={i === 0 || undefined} className="stage-tick" />
                ))}
              </div>
            </div>
          </div>
        </ShowcaseStage>
      </div>
    </Section>
  );
}
