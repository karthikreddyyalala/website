import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "../ui/Reveal";
import { Sheet } from "../ui/Section";
import { profile } from "@/content/profile";

/**
 * Sheet 06. The first paragraph is set large and its words darken as the
 * reader scrolls through it (opacity only). Screen readers get the paragraph
 * once, whole; the per-word spans are hidden from them.
 */
export function About() {
  const [lead, ...rest] = profile.about;
  const words = lead.split(" ");

  return (
    <Sheet id="about" no="06" name="About" title="About">
      <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-4">
          <Reveal delay={60}>
            <figure className="panel ticks p-2">
              <Image
                src="/images/about-photo.webp"
                alt="Karthik Reddy Yalala"
                width={560}
                height={700}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 340px"
                className="h-auto w-full object-cover"
              />
            </figure>
          </Reveal>
        </div>

        <div className="min-w-0 md:col-span-8">
          <Reveal delay={90}>
            <p className="title !text-[clamp(1.5rem,2.6vw,2.1rem)] !leading-[1.22]">
              <span className="sr-only">{lead}</span>
              <span aria-hidden data-tied className="read-along" style={{ "--n": words.length } as CSSProperties}>
                {words.map((word, i) => (
                  <span key={i} style={{ "--i": i } as CSSProperties}>
                    {word}{" "}
                  </span>
                ))}
              </span>
            </p>
          </Reveal>

          {rest.map((para, i) => (
            <Reveal key={i} delay={140 + i * 60}>
              <p className="prose-body mt-6">{para}</p>
            </Reveal>
          ))}

          <Reveal delay={300}>
            <div className="panel mt-10 p-5 md:p-6">
              <h3 className="flex items-baseline gap-3 text-[17px] font-bold text-[var(--ink)]">
                Currently
                <span className="note font-normal">{profile.currently.updated}</span>
              </h3>
              <p className="prose-body mt-3 text-[16px]">{profile.currently.text}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Sheet>
  );
}
