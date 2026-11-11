import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowDown, Building2, Clock, FileText, GraduationCap, Play, Rocket, type LucideIcon } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { AgentGraph, Parallax } from "../ui/Fx";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { VideoTrigger } from "../ui/VideoDialog";

const demo = projects.find((p) => p.video);

// The five LangGraph agents that run each Crucible interview, in pipeline order.
const AGENTS = ["intake", "planner", "interviewer", "evaluator", "memory"];

// One icon per proof point, in the order they appear in profile.proof.
const PROOF_ICONS: LucideIcon[] = [Building2, Rocket, Clock, GraduationCap];

/**
 * First screen: the name at poster scale, a live 3D network of the Crucible
 * agents passing messages, and the proof points as glass cards floating at
 * different depths. A ticker repeats the proof along the bottom.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 lg:pt-32">
      <Parallax className="shell relative">
        {/* The network sits behind the copy on small screens and to the right on large ones. */}
        <div
          aria-hidden
          data-depth="10"
          className="pointer-events-none absolute -right-[10%] top-[38%] h-[420px] w-[120%] opacity-70 sm:top-[30%] lg:-right-[6%] lg:top-0 lg:h-[640px] lg:w-[64%] lg:opacity-100"
        >
          <AgentGraph agents={AGENTS} />
        </div>

        <div className="relative lg:max-w-[62%]">
          <Reveal>
            <h1 className="h-display hero-title" aria-label="Karthik Reddy Yalala">
              <span className="line-rise">
                <span>Karthik</span>
              </span>
              <span className="line-rise" style={{ "--rise-delay": "80ms" } as CSSProperties}>
                <span>Reddy</span>
              </span>
              <span className="line-rise" style={{ "--rise-delay": "160ms" } as CSSProperties}>
                <span className="stroke-text">Yalala</span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mono mt-7 text-[12.5px] uppercase tracking-[0.16em] text-[var(--ice)]">
              {profile.role} · {profile.location}
            </p>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-[1.65] text-[var(--text)]">{profile.claim}</p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work-avis" className="btn btn-signal">
                See the production work
                <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
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

        {/* Proof points as glass cards, each at its own depth. */}
        <Reveal delay={380}>
          <div className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[auto_1fr_1fr_1fr_1fr] lg:items-stretch">
            <figure data-depth="22" className="card flex items-center gap-4 p-3 pr-5 sm:col-span-2 lg:col-span-1">
              <Image
                src="/images/profile.webp"
                alt="Karthik Reddy Yalala"
                width={1000}
                height={1000}
                priority
                sizes="72px"
                className="h-[72px] w-[60px] flex-none rounded-[12px] object-cover object-top"
              />
              {profile.availability.active && (
                <figcaption className="max-w-[20ch] text-[13.5px] leading-snug text-[var(--muted)]">
                  <span className="mb-1.5 flex items-center gap-2 font-bold text-[var(--text)]">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--signal)]" />
                    Open to work
                  </span>
                  May 2027
                </figcaption>
              )}
            </figure>
            {profile.proof.map((p, i) => {
              const Icon = PROOF_ICONS[i];
              return (
                <div key={p.label} data-depth={14 + i * 7} className="card group flex items-center gap-3.5 p-4">
                  <span aria-hidden className="glass">
                    <Icon />
                  </span>
                  <p className="text-[13.5px] leading-snug text-[var(--muted)]">
                    <span className="h-section block text-[21px] text-[var(--text)]">{p.value}</span>
                    {p.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Parallax>

      <div aria-hidden className="ticker mono mt-14 border-y border-[var(--line)] py-4 text-[13px] uppercase tracking-[0.16em] text-[var(--muted)]">
        <div>
          {[0, 1].map((k) => (
            <span key={k}>
              {profile.proof.map((p) => (
                <span key={p.label}>
                  {p.value} {p.label}
                  <span className="mx-6 text-[var(--signal)]">/</span>
                </span>
              ))}
              {profile.availability.status}
              <span className="mx-6 text-[var(--signal)]">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
