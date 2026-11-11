import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { SystemMap, LineList } from "../ui/SystemMap";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { VideoTrigger } from "../ui/VideoDialog";
import { ArrowDown, FileText } from "lucide-react";

const demo = projects.find((p) => p.video);

/**
 * First viewport: the name as the map's title, the claim as its caption, and
 * the system map itself. The map is the navigation and the proof at once.
 */
export function Hero() {
  return (
    <section id="top" className="relative pt-28 lg:pt-[104px]">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <h1 className="h-display text-[clamp(3rem,8.4vw,6rem)]">
                <span className="line-rise">
                  <span>Karthik Reddy</span>
                </span>
                <span className="line-rise" style={{ "--rise-delay": "90ms" } as CSSProperties}>
                  <span>Yalala</span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mono mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] uppercase tracking-[0.12em] text-[var(--muted)]">
                {profile.availability.active && (
                  <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[var(--l-path)]" />
                )}
                {profile.role} · {profile.location}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#work-avis"
                  className="rounded-full bg-[var(--l-avis)] px-6 py-3 text-[14.5px] font-bold text-[var(--on-line)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  See the production work
                  <ArrowDown className="ml-2 inline h-4 w-4" strokeWidth={2.5} />
                </a>
                <a
                  href={profile.contact.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border-2 border-[var(--text)] px-6 py-[10px] text-[14.5px] font-bold transition-colors duration-200 hover:bg-[var(--text)] hover:text-[var(--bg)]"
                >
                  <FileText className="mr-2 inline h-4 w-4" strokeWidth={2.25} />
                  Résumé
                </a>
                {demo?.video && (
                  <VideoTrigger
                    {...demo.video}
                    title={`${demo.title} demo`}
                    className="group flex items-center gap-2.5 px-2 py-3 text-[14.5px] font-medium text-[var(--muted)] transition-colors duration-200 hover:text-[var(--text)]"
                  >
                    <span
                      aria-hidden
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--l-work)] text-[var(--on-line)]"
                    >
                      <svg viewBox="0 0 10 10" className="ml-0.5 h-2.5 w-2.5" fill="currentColor">
                        <path d="M1 0l8 5-8 5z" />
                      </svg>
                    </span>
                    Watch the {demo.title} demo
                  </VideoTrigger>
                )}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <Reveal delay={160}>
              <div className="flex items-start gap-5">
                <p className="prose-body text-[16px] leading-[1.65] text-[var(--text)]">{profile.claim}</p>
                <Image
                  src="/images/profile.webp"
                  alt="Karthik Reddy Yalala"
                  width={1000}
                  height={1000}
                  priority
                  sizes="112px"
                  className="h-[112px] w-[88px] flex-none rounded-[14px] border-2 border-[var(--text)] object-cover object-top sm:h-[136px] sm:w-[108px]"
                />
              </div>
            </Reveal>

          </div>
        </div>

        <Reveal delay={260} className="mt-10 lg:mt-2">
          <SystemMap />
          <LineList />
        </Reveal>

        {/* Proof, set as the map's key. */}
        <Reveal delay={320}>
          <dl className="mt-12 grid grid-cols-2 border-y-2 border-[var(--text)] md:grid-cols-4 lg:mt-16">
            {profile.proof.map((p, i) => (
              <div
                key={p.label}
                className={`py-5 pr-6 ${i > 0 ? "md:border-l md:border-[var(--line-hi)] md:pl-6" : ""} ${
                  i % 2 ? "border-l border-[var(--line-hi)] pl-6" : ""
                } ${i < 2 ? "border-b border-[var(--line-hi)] md:border-b-0" : ""}`}
              >
                <dt className="mono tabular-nums text-[24px] font-bold text-[var(--text)] md:text-[28px]">
                  <CountUp value={p.value} />
                </dt>
                <dd className="mt-1 text-[13px] leading-snug text-[var(--muted)]">{p.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
