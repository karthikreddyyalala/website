import Image from "next/image";
import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { projects } from "@/content/projects";
import { TechIcon } from "../ui/TechIcon";
import { VideoPreview, VideoTrigger } from "../ui/VideoDialog";

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
        Visit live site ↗
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
      title="Things I built to find out if they'd work."
      lede="Agent systems, mostly. A few are experiments that taught me something specific; those are here because the lesson mattered, not because the repo is impressive."
    >
      <div className="border-t border-[var(--line)]">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i, 4) * 50}>
            <article
              className={`grid gap-5 border-b border-[var(--line)] py-9 md:grid-cols-12 md:gap-8 md:py-11 ${
                p.badge ? "relative overflow-hidden" : ""
              }`}
            >
              {p.badge && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(600px 300px at 0% 0%, rgba(200,135,62,0.06), transparent 70%)",
                  }}
                />
              )}

              <div className="relative md:col-span-3">
                <h3 className="h-section text-[20px] md:text-[22px]">{p.title}</h3>
                <div className="mt-2 flex items-center gap-3">
                  <p className="mono text-[11px] text-[var(--faint)]">{p.year}</p>
                  {p.badge && (
                    <span
                      className="mono rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                      style={{
                        background: "var(--accent-dim)",
                        color: "var(--accent)",
                        border: "1px solid rgba(200,135,62,0.25)",
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                {(p.github || p.live || p.video) && (
                  <div className="mt-4 flex gap-4">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                      >
                        GitHub ↗
                      </a>
                    )}
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-[11px] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                      >
                        Live ↗
                      </a>
                    )}
                    {p.video && (
                      <VideoTrigger
                        {...p.video}
                        title={`${p.title} demo`}
                        className="mono text-[11px] text-[var(--accent)] transition-colors hover:text-[var(--accent-hi)]"
                      >
                        Demo ▶
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
                      className="mono flex items-center gap-1.5 rounded-full bg-[var(--surface-hi)] px-2.5 py-1 text-[11px] text-[var(--faint)]"
                    >
                      <TechIcon name={t} />
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
