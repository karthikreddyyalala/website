import Image from "next/image";
import type { CSSProperties } from "react";
import { FileText } from "lucide-react";
import { FieldSlot } from "../ui/FieldSlot";
import { Meta } from "../ui/Section";
import { profile } from "@/content/profile";

const k = (n: number) => ({ "--k": n }) as CSSProperties;

/**
 * Sheet 01. The name at display scale, what he does, and two actions; beside
 * it a plate that holds the signal field (the page's one WebGL piece), the
 * portrait, and a title block with the four proof facts, the way the corner
 * block of a drawing holds its facts.
 *
 * The headline is in the first paint and is the LCP element. The page-load
 * sequence uncovers it and raises the rest behind it (see "Page-load
 * sequence" in globals.css).
 */
export function Hero() {
  const [first, ...rest] = profile.name.split(" ");

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-center pb-10 pt-28 lg:pt-32">
      <div className="shell sheet-grid">
        <div aria-hidden className="rail">
          <div>
            <span className="note text-[var(--ink)]">01</span>
          </div>
        </div>

        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-12 lg:gap-10 lg:pl-8">
          <div className="min-w-0 lg:col-span-7">
            <h1 className="display-xl">
              <span className="sr-only">{profile.name}</span>
              <span aria-hidden>
                {[first, ...rest].map((word, i) => (
                  <span key={word} className="intro-line" style={k(i)}>
                    {word}
                  </span>
                ))}
              </span>
            </h1>

            <p className="intro-rise mt-7 text-[17px] font-semibold text-[var(--ink)]" style={k(0)}>
              <Meta text={`${profile.role} · ${profile.location}`} />
            </p>
            {profile.availability.active && (
              <p className="intro-rise mt-3" style={k(1)}>
                <span className="tag !text-[13px] !text-[var(--ink)]">
                  {/* A live state, not decoration: it is only here while he is available. */}
                  <span aria-hidden className="h-2 w-2 flex-none rounded-full bg-[var(--signal)]" />
                  <Meta text={profile.availability.status} />
                </span>
              </p>
            )}

            <p className="lead intro-rise mt-6 max-w-[54ch] text-[var(--graphite)]" style={k(2)}>
              {profile.claim}
            </p>

            <div className="intro-rise mt-8 flex flex-wrap gap-3" style={k(3)}>
              <a href="#work-avis" className="btn btn-signal w-full sm:w-auto">
                See the production work
              </a>
              <a href={profile.contact.resume} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full sm:w-auto">
                <FileText aria-hidden />
                Résumé
              </a>
            </div>
          </div>

          {/* The plate: signal field, portrait, title block. */}
          <div className="intro-rise min-w-0 lg:col-span-5" style={k(4)}>
            <div className="panel ticks">
              <div className="relative overflow-hidden rounded-t-[3px]">
                <div aria-hidden className="field-poster" />
                <FieldSlot />
                <figure className="relative ml-auto w-[58%] max-w-[270px] p-4 md:p-5">
                  <div className="border border-[var(--edge)] bg-[var(--sheet)] p-1.5">
                    <Image
                      src="/images/profile.webp"
                      alt="Karthik Reddy Yalala"
                      width={1000}
                      height={1000}
                      loading="eager"
                      sizes="(min-width: 1024px) 240px, 50vw"
                      className="aspect-[4/5] w-full object-cover object-top"
                    />
                  </div>
                </figure>
              </div>

              <dl className="grid grid-cols-2 border-t border-[var(--rule)]">
                {profile.proof.map((p, i) => (
                  <div
                    key={p.label}
                    className={`flex flex-col-reverse justify-end gap-1 p-4 ${i % 2 ? "border-l border-[var(--rule)]" : ""} ${
                      i > 1 ? "border-t border-[var(--rule)]" : ""
                    }`}
                  >
                    <dt className="text-[13.5px] leading-snug text-[var(--graphite)]">
                      <Meta text={p.label} />
                    </dt>
                    <dd className="title !text-[1.35rem] text-[var(--ink)]">{p.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className="shell mt-12 lg:mt-16">
        <div className="intro-rule h-px bg-[var(--edge)]" />
      </div>
    </section>
  );
}
