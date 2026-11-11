import Image from "next/image";
import { Reveal } from "../ui/Reveal";
import { Rail, SectionHead, lineStyle } from "../ui/Section";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-36" style={lineStyle("about")}>
      <Rail />
      <div className="shell relative">
        <Reveal>
          <SectionHead index="05">
            <h2 className="h-section">About</h2>
          </SectionHead>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <div className="overflow-hidden rounded-[16px] border-2 border-[var(--text)]">
                <Image
                  src="/images/about-photo.webp"
                  alt="Karthik Reddy Yalala"
                  width={560}
                  height={700}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            {profile.about.map((para, i) => (
              <Reveal key={i} delay={100 + i * 70}>
                <p
                  className={
                    i === 0
                      ? "text-[19px] leading-relaxed text-[var(--text)] md:text-[22px]"
                      : "prose-body mt-6 text-[15.5px]"
                  }
                >
                  {para}
                </p>
              </Reveal>
            ))}

            <Reveal delay={340}>
              <div className="mt-12 border-t border-[var(--line)] pt-6">
                <p className="eyebrow flex items-baseline gap-3">
                  <span>Currently</span>
                  <span className="normal-case tracking-normal text-[var(--faint)]">
                    {profile.currently.updated}
                  </span>
                </p>
                <p className="prose-body mt-3 text-[15px]">
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
