import type { CSSProperties } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Work } from "@/components/sections/Work";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { VideoDialog } from "@/components/ui/VideoDialog";
import { CommandMenu } from "@/components/CommandMenu";
import { Footer } from "@/components/Footer";
import { Aurora, GlassLight, ScrollFx, SmoothScroll } from "@/components/ui/Fx";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      {/* Opening curtain. Pure CSS: it is in the first paint and lifts on its own. */}
      <div aria-hidden className="intro-curtain">
        <div>
          <p className="intro-mark h-display">
            {["K", "R", "Y"].map((letter, k) => (
              <span key={letter}>
                <span style={{ "--k": k } as CSSProperties}>{letter}</span>
              </span>
            ))}
            <span>
              <span className="text-[var(--signal)]" style={{ "--k": 3 } as CSSProperties}>
                .
              </span>
            </span>
          </p>
          <span className="intro-rule" />
        </div>
      </div>

      <Aurora />
      <GlassLight />
      <SmoothScroll />
      <ScrollFx />

      <Nav />

      <main id="main">
        <Hero />
        <CaseStudy />
        <Work />
        <Stack />
        <Timeline />
        <About />
        <Contact />
      </main>

      <Footer />

      <VideoDialog />
      <CommandMenu />

    </>
  );
}
