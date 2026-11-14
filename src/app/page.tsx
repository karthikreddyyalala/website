import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Work } from "@/components/sections/Work";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { VideoDialog } from "@/components/ui/VideoDialog";
import { SoundFx } from "@/components/ui/Sound";
import { CommandMenu } from "@/components/CommandMenu";
import { Footer } from "@/components/Footer";
import { EdgeLight, ScrollTied } from "@/components/ui/Fx";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <ScrollTied />
      <EdgeLight />
      <SoundFx />

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
