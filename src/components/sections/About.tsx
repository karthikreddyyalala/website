import Image from "next/image";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/Section";
import { Tilt } from "../ui/Fx";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="shell relative">
        <Reveal>
          <SectionHead>
            <h2 className="h-section">About</h2>
          </SectionHead>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <div data-scroll="drift">
              <Tilt max={7}>
                <div className="card overflow-hidden p-2.5">
                  <Image
                    src="/images/about-photo.webp"
                    alt="Karthik Reddy Yalala"
                    width={560}
                    height={700}
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="h-full w-full rounded-[13px] object-cover"
                  />
                </div>
              </Tilt>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            {profile.about.map((para, i) => (
              <Reveal key={i} delay={100 + i * 70}>
                {i === 0 ? (
                  // Each word is its own span so it can brighten as you scroll past it.
                  <p className="read-along h-section text-[24px] !leading-[1.28] text-[var(--text)] md:text-[32px]">
                    {para.split(" ").map((word, k) => (
                      <span key={k}>{word} </span>
                    ))}
                  </p>
                ) : (
                  <p className="prose-body mt-6 text-[17px]">{para}</p>
                )}
              </Reveal>
            ))}

            <Reveal delay={340}>
              <div className="card mt-12 p-6">
                <h3 className="h-section flex items-baseline gap-3 text-[18px] text-[var(--text)]">
                  Currently
                  <span className="mono text-[13px] font-normal tracking-normal text-[var(--faint)]">{profile.currently.updated}</span>
                </h3>
                <p className="prose-body mt-3 text-[16.5px]">
                  {profile.currently.text}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
