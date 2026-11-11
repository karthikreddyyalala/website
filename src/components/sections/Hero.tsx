import Image from "next/image";
import type { CSSProperties } from "react";
import { Building2, Clock, FileText, GraduationCap, Play, Rocket, type LucideIcon } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Parallax } from "../ui/Fx";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { VideoTrigger } from "../ui/VideoDialog";

const demo = projects.find((p) => p.video);

// One icon and one position per proof point, in the order they appear in profile.proof.
const PROOF: { Icon: LucideIcon; place: string; depth: number }[] = [
  { Icon: Building2, place: "sm:left-0 sm:top-[5%]", depth: 38 },
  { Icon: Rocket, place: "sm:right-0 sm:top-[49%]", depth: 52 },
  { Icon: Clock, place: "sm:left-0 sm:bottom-[27%]", depth: 30 },
  { Icon: GraduationCap, place: "sm:right-[4%] sm:bottom-[2%]", depth: 44 },
];

/**
 * First screen: the name at display scale, and a portrait in glass with the
 * proof points floating around it at different depths, so the group shifts
 * like layered glass as the pointer moves. A ticker repeats the proof below.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 lg:pt-36">
      <div data-scroll="hero">
      <Parallax className="shell relative">
        <div className="relative lg:max-w-[56%]">
          <Reveal>
            <h1 className="h-display hero-title" aria-label="Karthik Reddy Yalala">
              <span className="line-rise">
                <span>Karthik</span>
              </span>
              <span className="line-rise" style={{ "--rise-delay": "80ms" } as CSSProperties}>
                <span>Reddy</span>
              </span>
              <span className="line-rise" style={{ "--rise-delay": "160ms" } as CSSProperties}>
                <span className="sheen">Yalala</span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-7 text-[15px] font-medium text-[var(--ice)]">
              {profile.role} · {profile.location}
            </p>
            <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.6] text-[var(--text)]">{profile.claim}</p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work-avis" className="btn btn-signal">
                See the production work
              </a>
              <a href={profile.contact.resume} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
                <FileText className="h-4 w-4" strokeWidth={2.25} />
                Résumé
              </a>
              {demo?.video && (
                <VideoTrigger {...demo.video} title={`${demo.title} demo`} className="btn btn-glass">
                  <Play className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                  Watch the {demo.title} demo
                </VideoTrigger>
              )}
            </div>
          </Reveal>
        </div>

        {/* Portrait in glass, with the proof points floating at their own depths. */}
        <Reveal
          delay={260}
          className="relative mt-12 grid grid-cols-2 gap-3 sm:mx-auto sm:block sm:h-[500px] sm:max-w-[470px] lg:absolute lg:right-10 lg:top-0 lg:mt-0 lg:h-[560px] lg:w-[40%] lg:max-w-none"
        >
          <figure
            data-depth="16"
            className="card col-span-2 p-2.5 sm:absolute sm:inset-x-[17%] sm:top-[7%]"
          >
            <Image
              src="/images/profile.webp"
              alt="Karthik Reddy Yalala"
              width={1000}
              height={1000}
              priority
              sizes="(min-width: 640px) 300px, 90vw"
              className="aspect-[4/5] w-full rounded-[18px] object-cover object-top"
            />
            {profile.availability.active && (
              <figcaption className="flex items-center gap-2.5 px-2 pb-1.5 pt-3 text-[13.5px] leading-snug text-[var(--muted)]">
                <span aria-hidden className="h-2 w-2 flex-none rounded-full bg-[var(--signal)]" />
                {profile.availability.status}
              </figcaption>
            )}
          </figure>

          {profile.proof.map((p, i) => {
            const { Icon, place, depth } = PROOF[i];
            return (
              <div
                key={p.label}
                data-depth={depth}
                className={`card group flex items-center gap-3 !rounded-[20px] p-3 pr-4 sm:absolute sm:max-w-[215px] ${place}`}
              >
                <span aria-hidden className="glass">
                  <Icon />
                </span>
                <p className="text-[13px] leading-snug text-[var(--muted)]">
                  <span className="h-section block text-[19px] text-[var(--text)]">{p.value}</span>
                  {p.label}
                </p>
              </div>
            );
          })}
        </Reveal>
      </Parallax>
      </div>

      <div
        aria-hidden
        className="ticker mt-16 border-y border-[var(--line)] py-4 text-[14px] font-medium text-[var(--muted)] lg:mt-24"
      >
        <div data-scroll="slide">
        <div>
          {[0, 1].map((k) => (
            <span key={k}>
              {profile.proof.map((p) => (
                <span key={p.label}>
                  {p.value} {p.label}
                  <span className="mx-7 text-[var(--signal)]">/</span>
                </span>
              ))}
              {profile.availability.status}
              <span className="mx-7 text-[var(--signal)]">/</span>
            </span>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
