import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowDown, FileText, Play } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { CountUp } from "../ui/CountUp";
import { SystemMap, StripMap } from "../ui/SystemMap";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { VideoTrigger } from "../ui/VideoDialog";

const demo = projects.find((p) => p.video);

// Which line each proof point belongs to, in the order they appear in profile.proof.
const KEY_LINES = ["avis", "avis", "avis", "path"];

/**
 * First viewport: the name as the map's title, the claim as its caption, and
 * the system map itself. The map is the navigation and the proof at once.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 lg:pt-[104px]">
      <div className="shell">
        <div className="relative">
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

          <Reveal delay={140}>
            <div className="mt-5 flex items-start gap-5 lg:mt-4">
              <p className="max-w-[64ch] text-[16px] leading-[1.6] text-[var(--text)] lg:text-[17px]">
                {profile.claim}
              </p>
              <Image
                src="/images/profile.webp"
                alt="Karthik Reddy Yalala"
                width={1000}
                height={1000}
                priority
                sizes="(min-width: 1024px) 150px, 88px"
                className="h-[112px] w-[88px] flex-none rounded-[14px] border-2 border-[var(--text)] object-cover object-top lg:absolute lg:right-0 lg:top-1 lg:h-[188px] lg:w-[150px]"
              />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
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
                  className="flex items-center gap-2.5 px-2 py-3 text-[14.5px] font-bold text-[var(--text)]"
                >
                  <span
                    aria-hidden
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--l-work)] text-[var(--on-line)]"
                  >
                    <Play className="ml-0.5 h-3 w-3" fill="currentColor" strokeWidth={0} />
                  </span>
                  Watch the {demo.title} demo
                </VideoTrigger>
              )}
              <p className="text-[14px] text-[var(--muted)] lg:ml-auto">
                {profile.role} · {profile.location}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={260} className="map-frame relative mt-10 lg:mt-3">
          {/* The red line leaves the map here and becomes the trunk that runs down the page. */}
          <span aria-hidden className="map-trunk" />
          <SystemMap />
          <StripMap />
        </Reveal>

        {/* Proof, set as the map's key: each fact carries the line it belongs to. */}
        <Reveal delay={320}>
          <dl className="mt-10 grid gap-x-10 gap-y-6 pb-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {profile.proof.map((p, i) => (
              <div key={p.label} className="flex items-start gap-3">
                <span aria-hidden className="relative mt-[13px] h-[6px] w-9 flex-none rounded-full" style={{ background: `var(--l-${KEY_LINES[i]})` }}>
                  <span className="absolute left-1/2 top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3.5px] border-[var(--text)] bg-[var(--bg)]" />
                </span>
                <div>
                  <dt className="text-[26px] font-black leading-none tabular-nums text-[var(--text)] md:text-[30px]">
                    <CountUp value={p.value} />
                  </dt>
                  <dd className="mt-1.5 text-[13.5px] leading-snug text-[var(--muted)]">{p.label}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
