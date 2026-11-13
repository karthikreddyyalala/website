import Image from "next/image";
import type { CSSProperties } from "react";
import { Building2, Clock, FileText, GraduationCap, Rocket, type LucideIcon } from "lucide-react";
import { Parallax } from "../ui/Fx";
import { Meta } from "../ui/Section";
import { profile } from "@/content/profile";

// One icon and one position per proof point, in the order they appear in profile.proof.
// `from` is the side each chip slides in from: -1 left, 1 right.
const PROOF: { Icon: LucideIcon; place: string; depth: number; from: number }[] = [
  { Icon: Building2, place: "sm:left-0 sm:top-[5%]", depth: 38, from: -1 },
  { Icon: Rocket, place: "sm:right-0 sm:top-[44%]", depth: 52, from: 1 },
  { Icon: Clock, place: "sm:left-0 sm:bottom-[27%]", depth: 30, from: -1 },
  { Icon: GraduationCap, place: "sm:right-[3%] sm:bottom-[17%]", depth: 44, from: 1 },
];

/**
 * First screen: the name at display scale, what he does, and two actions. A
 * portrait in glass has the proof points floating around it at different
 * depths, so the group shifts like layered glass as the pointer moves.
 *
 * Everything here enters in sequence as the opening curtain lifts (see the
 * "Opening" block in globals.css): the name rises line by line, the portrait
 * slides in and wipes open, and the chips slide in from their own side.
 *
 * Scrolling away plays a second scene ("Hero scroll scene" in globals.css):
 * the name lines slide apart, the copy lifts, the portrait hangs back and the
 * chips drift outward, each at its own depth.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 lg:pt-36">
      <div data-scroll="hero">
      <Parallax className="shell relative">
        <div className="relative lg:max-w-[56%]">
          <div>
            <h1 className="h-display hero-title" aria-label="Karthik Reddy Yalala">
              <span className="line-rise">
                <span>Karthik</span>
              </span>
              <span className="line-rise" style={{ "--rise-delay": "90ms" } as CSSProperties}>
                <span>Reddy</span>
              </span>
              <span className="line-rise" style={{ "--rise-delay": "180ms" } as CSSProperties}>
                <span>Yalala</span>
              </span>
            </h1>
          </div>

          <div className="intro-up" style={{ "--d": "380ms" } as CSSProperties}>
            <p className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 text-[16.5px] font-medium text-[var(--ice)]">
              <Meta text={`${profile.role} · ${profile.location}`} />
              {profile.availability.active && (
                <span className="tag inline-flex items-center gap-2 text-[14.5px] font-normal !text-[var(--text)]">
                  <span aria-hidden className="h-2 w-2 flex-none rounded-full bg-[var(--signal)]" />
                  <Meta text={profile.availability.status} />
                </span>
              )}
            </p>
            <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.6] text-[var(--text)]">{profile.claim}</p>
          </div>

          <div className="intro-up" style={{ "--d": "500ms" } as CSSProperties}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work-avis" data-magnetic className="btn btn-signal w-full justify-center sm:w-auto">
                See the production work
              </a>
              <a href={profile.contact.resume} target="_blank" rel="noopener noreferrer" data-magnetic className="btn btn-glass w-full justify-center sm:w-auto">
                <FileText className="h-4 w-4" strokeWidth={2.25} />
                Résumé
              </a>
            </div>
          </div>
        </div>

        {/* Portrait in glass, with the proof points floating at their own depths. */}
        <div
          className="relative mt-12 grid grid-cols-2 gap-3 sm:mx-auto sm:block sm:h-[500px] sm:max-w-[470px] lg:absolute lg:right-10 lg:top-0 lg:mt-0 lg:h-[560px] lg:w-[40%] lg:max-w-none"
        >
          <figure
            data-depth="16"
            className="intro-portrait card col-span-2 p-2.5 sm:absolute sm:inset-x-[17%] sm:top-[7%]"
          >
            <div className="intro-wipe overflow-hidden rounded-[18px]">
            <Image
              src="/images/profile.webp"
              alt="Karthik Reddy Yalala"
              width={1000}
              height={1000}
              priority
              sizes="(min-width: 640px) 300px, 90vw"
              className="aspect-[4/5] w-full object-cover object-top"
            />
            </div>
            {/* A band of light that crosses the glass once the portrait has arrived, and again on hover. */}
            <span aria-hidden className="sheen" />
          </figure>

          {profile.proof.map((p, i) => {
            const { Icon, place, depth, from } = PROOF[i];
            return (
              <div
                key={p.label}
                data-depth={depth}
                className={`intro-chip card card-smoke group flex items-center gap-3 !rounded-[20px] p-3 pr-4 sm:absolute sm:max-w-[215px] ${place}`}
                style={{ "--from": `${from * 64}px`, "--d": `${650 + i * 120}ms`, "--lift": `${-depth}px` } as CSSProperties}
              >
                <span aria-hidden className="glass">
                  <Icon />
                </span>
                <p className="text-[14.5px] leading-snug text-[var(--muted)]">
                  <span className="h-section block text-[19px] text-[var(--text)]">{p.value}</span>
                  <Meta text={p.label} />
                </p>
              </div>
            );
          })}
        </div>
      </Parallax>
      </div>

      <div
        aria-hidden
        style={{ "--d": "900ms" } as CSSProperties}
        className="intro-up ticker mt-16 border-y border-[var(--line)] py-4 text-[15px] font-medium text-[var(--muted)] lg:mt-24"
      >
        <div data-scroll="slide">
        <div>
          {[0, 1].map((k) => (
            <span key={k}>
              {profile.proof.map((p) => (
                <span key={p.label}>
                  {p.value} <Meta text={p.label} />
                  <span className="mx-7 text-[var(--signal)]">/</span>
                </span>
              ))}
              <Meta text={profile.availability.status} />
              <span className="mx-7 text-[var(--signal)]">/</span>
            </span>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
