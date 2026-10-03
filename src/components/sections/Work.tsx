import Image from "next/image";
import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { projects } from "@/content/projects";
import { TechIcon } from "../ui/TechIcon";

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
                <div className="flex items-baseline gap-3">
                  <h3 className="h-section text-[20px] md:text-[22px]">{p.title}</h3>
                  {p.featured && (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                </div>
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

                {(p.github || p.live) && (
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
                  </div>
                )}
              </div>

              <div className={`relative ${p.image ? "md:col-span-6" : "md:col-span-9"}`}>
                <p className="text-[15.5px] leading-relaxed text-[var(--text)]">
                  {p.tagline}
                </p>
                <p className="prose-body mt-3 text-[14px]">{p.body}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <li
                      key={t}
                      className="mono flex items-center gap-1.5 rounded-full border border-[var(--line)] px-2.5 py-1 text-[10.5px] text-[var(--faint)]"
                    >
                      <TechIcon name={t} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {p.image && (
                <div className="md:col-span-3">
                  <div className="overflow-hidden rounded-[10px] border border-[var(--line)]">
                    <Image
                      src={p.image}
                      alt=""
                      width={520}
                      height={340}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 260px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
