import Image from "next/image";
import { Github, Globe, Play, Plus } from "lucide-react";
import { Details, Sheet } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { TechTag } from "../ui/TechTag";
import { VideoPreview, VideoTrigger } from "../ui/VideoDialog";
import { DeskPoster, FigurePoster, LoopPoster } from "../ui/Posters";
import { projects, type Project } from "@/content/projects";

/** Product screenshot. Links to the live site when there is one. */
function Shot({ src, title, href }: { src: string; title: string; href?: string }) {
  const img = (
    <Image src={src} alt={`${title} screenshot`} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover object-top" />
  );
  const box = "group relative block aspect-video w-full overflow-hidden rounded-[3px] border border-[var(--rule)] bg-[var(--paper)]";

  if (!href) return <div className={box}>{img}</div>;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={box}>
      {img}
      <span
        aria-hidden
        className="mono absolute bottom-3 right-3 rounded-[3px] bg-[var(--ink)] px-3 py-1.5 text-[12.5px] text-[var(--paper)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Visit live site
      </span>
    </a>
  );
}

// Posters for the projects with no screenshot or video, drawn from their own text.
const POSTERS: Record<string, () => React.JSX.Element> = {
  "deep-research": LoopPoster,
  "trading-floor": DeskPoster,
  "stock-predictor": FigurePoster,
};

/** Every card gets a media slot: the demo, the screenshot, or a poster. */
function Media({ p }: { p: Project }) {
  if (p.video) return <VideoPreview {...p.video} title={`${p.title} demo`} />;
  if (p.image) return <Shot src={p.image} title={p.title} href={p.live} />;
  const Poster = POSTERS[p.id];
  return Poster ? <Poster /> : null;
}

// Rows alternate 7/5 and 5/7 of twelve columns, so no row is a set of equal cards.
const SPAN = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

/**
 * Sheet 03. Eight projects in one anatomy: media slot, year, title, one
 * line, tags, then links only where the project has some. The long
 * description opens under "How it works".
 */
export function Work() {
  return (
    <Sheet
      id="work"
      no="03"
      name="Work"
      title="Things I built to find out if they'd work."
      lede="Agent systems, mostly. A few are experiments I kept because of what they taught me."
    >
      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 70} className={SPAN[i % 4]}>
            <article id={`work-${p.id}`} className="panel glow-edge lift flex h-full flex-col p-3">
              <Media p={p} />

              <div className="flex flex-1 flex-col px-2 pb-2 pt-5 md:px-3">
                <div className="flex items-center gap-3">
                  <p className="note">{p.year}</p>
                  {p.badge && <span className="tag !border-[var(--signal)] !text-[var(--signal)]">{p.badge}</span>}
                </div>
                <h3 className="title mt-2">{p.title}</h3>
                <p className="mt-2.5 text-[16.5px] leading-snug text-[var(--ink)]">{p.tagline}</p>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <TechTag key={t} name={t} />
                  ))}
                </ul>

                <div className="mt-auto pt-4">
                  {(p.github || p.live || p.video) && (
                    <div className="flex flex-wrap gap-x-5">
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="icon-link">
                          <Github aria-hidden />
                          GitHub
                        </a>
                      )}
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noopener noreferrer" className="icon-link">
                          <Globe aria-hidden />
                          Live
                        </a>
                      )}
                      {p.video && (
                        <VideoTrigger {...p.video} title={`${p.title} demo`} className="icon-link !text-[var(--signal)]">
                          <Play aria-hidden fill="currentColor" />
                          Demo
                        </VideoTrigger>
                      )}
                    </div>
                  )}

                  <Details
                    summaryClassName="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-bold text-[var(--graphite)] transition-colors hover:text-[var(--ink)]"
                    summary={
                      <>
                        <Plus aria-hidden className="plus h-4 w-4" strokeWidth={2.25} />
                        How it works
                      </>
                    }
                  >
                    <p className="prose-body pb-2 pt-1 text-[16px]">{p.body}</p>
                  </Details>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Sheet>
  );
}
