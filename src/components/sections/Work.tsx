import Image from "next/image";
import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { projects } from "@/content/projects";
import { VideoPreview, VideoTrigger } from "../ui/VideoDialog";
import { ArrowUpRight, Github, Play } from "lucide-react";

/** Product screenshot, styled to match the video preview. Links to the live site when there is one. */
function Shot({ src, title, href }: { src: string; title: string; href?: string }) {
  const img = (
    <Image
      src={src}
      alt={`${title} screenshot`}
      fill
      sizes="(max-width: 768px) 100vw, 720px"
      className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
    />
  );
  const box =
    "group relative mt-7 block aspect-video w-full max-w-[720px] overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--surface)]";

  if (!href) return <div className={box}>{img}</div>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${box} transition-colors duration-300 hover:border-[var(--line-hi)]`}
    >
      {img}
      <span
        aria-hidden
        className="mono absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ background: "rgba(0,0,0,0.75)", color: "#fff" }}
      >
        Visit live site <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
      </span>
    </a>
  );
}

export function Work() {
  return (
    <Section
      id="work"
      index="02"
      label="Selected work"
      line="work"
      title="Things I built to find out if they'd work."
      lede="Agent systems, mostly. A few are experiments I kept because of what they taught me."
    >
      <div className="border-t-[3px] border-[var(--line-color)]">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 4) * 50}>
            <article
              id={`work-${p.id}`}
              className="relative grid gap-5 border-b border-[var(--line-hi)] py-9 text-[22px] md:grid-cols-12 md:gap-8 md:py-11 md:text-[26px]"
            >
              <span aria-hidden className="stop" style={{ top: "calc(2.75rem + 0.55em)" }} />
              <div className="relative md:col-span-3">
                <h3 className="h-section">{p.title}</h3>
                <div className="mt-2 flex items-center gap-3">
                  <p className="mono text-[12px] text-[var(--faint)]">{p.year}</p>
                  {p.badge && (
                    <span
                      className="mono rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                      style={{ background: "var(--line-color)", color: "var(--on-line)" }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                {(p.github || p.live || p.video) && (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-link text-[13.5px] font-bold text-[var(--text)] transition-colors hover:text-[var(--line-color)]"
                      >
                        <Github />
                        GitHub
                      </a>
                    )}
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-link text-[13.5px] font-bold text-[var(--text)] transition-colors hover:text-[var(--line-color)]"
                      >
                        Live
                        <ArrowUpRight />
                      </a>
                    )}
                    {p.video && (
                      <VideoTrigger
                        {...p.video}
                        title={`${p.title} demo`}
                        className="icon-link text-[13.5px] font-bold text-[var(--line-color)]"
                      >
                        <Play fill="currentColor" />
                        Demo
                      </VideoTrigger>
                    )}
                  </div>
                )}
              </div>

              <div className="relative md:col-span-9">
                <p className="text-[15.5px] leading-relaxed text-[var(--text)]">
                  {p.tagline}
                </p>
                <p className="prose-body mt-3 text-[15px] md:text-[16px]">{p.body}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <li
                      key={t}
                      className="mono rounded-full bg-[var(--surface-hi)] px-2.5 py-1 text-[11px] text-[var(--muted)]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                {p.video ? (
                  <div className="mt-7 max-w-[720px]">
                    <VideoPreview {...p.video} title={`${p.title} demo`} />
                  </div>
                ) : (
                  p.image && <Shot src={p.image} title={p.title} href={p.live} />
                )}
              </div>

            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
