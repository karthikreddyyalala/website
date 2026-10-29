import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { Work } from "@/components/sections/Work";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { profile } from "@/content/profile";
import { VideoDialog } from "@/components/ui/VideoDialog";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

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

      {/* Colophon. Says a person chose these things, which a template cannot. */}
      <footer className="border-t border-[var(--line)] py-12">
        <div className="shell grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mono text-[11px] text-[var(--faint)]">
              © {new Date().getFullYear()} {profile.name}
            </p>
            <p className="mt-2 text-[13px] text-[var(--muted)]">
              {profile.location} · Open to work, May 2027
            </p>
          </div>

        </div>
      </footer>

      <VideoDialog />

    </>
  );
}
