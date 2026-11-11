import type { CSSProperties } from "react";
import { caseStudy } from "@/content/casestudy";
import { projects } from "@/content/projects";
import { stack } from "@/content/stack";
import { timeline } from "@/content/experience";
import { profile } from "@/content/profile";

// Map geometry, in viewBox units.
const W = 1200;
const H = 452;
const X_START = 28;
const X_END = 1042; // every line ends at the Contact interchange
const STOPS_FROM = 250; // first station on each line
const STOPS_TO = 905;
const JOG = 34; // height of the 45 degree bend near the start of each line

type MapLine = { id: string; href: string; name: string; color: string; y: number; jogAt: number; stops: string[] };

/** Every line and station is real content: change the content files and the map follows. */
const LINES: MapLine[] = [
  {
    id: "avis",
    href: "#work-avis",
    name: caseStudy.company,
    color: "var(--l-avis)",
    y: 142,
    jogAt: 186,
    stops: [...caseStudy.initiatives.map((i) => i.title), caseStudy.research.title],
  },
  {
    id: "work",
    href: "#work",
    name: "Selected work",
    color: "var(--l-work)",
    y: 238,
    jogAt: 206,
    stops: projects.map((p) => p.title),
  },
  {
    id: "stack",
    href: "#stack",
    name: "Stack",
    color: "var(--l-stack)",
    y: 334,
    jogAt: 120,
    stops: stack.map((g) => g.label),
  },
  {
    id: "path",
    href: "#path",
    name: "Path",
    color: "var(--l-path)",
    y: 430,
    jogAt: 150,
    // Oldest first, so the line reads left to right through time.
    stops: [...timeline].reverse().map((t) => t.org),
  },
];

/** Splits a station name into at most two lines so the angled labels stay short. */
function wrap(name: string): string[] {
  if (name.length <= 14 || !name.includes(" ")) return [name];
  const words = name.split(" ");
  let first = "";
  while (words.length > 1 && (first + " " + words[0]).trim().length <= name.length / 2 + 3) {
    first = (first + " " + words.shift()).trim();
  }
  return [first, words.join(" ")];
}

/**
 * The hero: a working transit map of the whole site. Lines draw themselves in,
 * then stations pop in along them. Each line is a link to its section, and all
 * of them end at the Contact interchange. Desktop only; small screens get
 * LineList below, because map labels do not survive being scaled down.
 */
export function SystemMap() {
  const top = LINES[0].y - JOG;
  const bottom = LINES[LINES.length - 1].y - JOG;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="group"
      aria-label="System map of this site"
      className="system-map hidden w-full overflow-visible lg:block"
    >
      {LINES.map((line, n) => {
        const y = line.y - JOG;
        const d = `M${X_START} ${line.y} H${line.jogAt} L${line.jogAt + JOG} ${y} H${X_END}`;
        return (
          <a key={line.id} href={line.href} className="map-line" style={{ "--n": n } as CSSProperties}>
            <title>{line.name}</title>
            <path d={d} pathLength={1} stroke={line.color} />
            <text x={X_START - 5} y={line.y - 16} className="fill-[var(--text)] text-[16px] font-extrabold">
              {line.name}
            </text>
            {line.stops.map((stop, i) => {
              const t = line.stops.length === 1 ? 0.5 : i / (line.stops.length - 1);
              const x = STOPS_FROM + t * (STOPS_TO - STOPS_FROM);
              return (
                <g
                  key={stop}
                  className="map-stop"
                  style={{ "--t": t, transformOrigin: `${x}px ${y}px` } as CSSProperties}
                >
                  <circle cx={x} cy={y} r={7.5} fill="var(--bg)" stroke="var(--text)" strokeWidth={3.5} />
                  <text
                    transform={`translate(${x + 9} ${y - 15}) rotate(-38)`}
                    className="fill-[var(--muted)] text-[13px] font-medium"
                  >
                    {wrap(stop).map((part, k, all) => (
                      <tspan key={part} x={0} dy={k === 0 ? (all.length - 1) * -14 : 14}>
                        {part}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </a>
        );
      })}

      {/* The terminus: one interchange where every line meets. */}
      <a href="#contact" className="map-stop" style={{ "--n": 3, "--t": 1, transformOrigin: `${X_END}px ${(top + bottom) / 2}px` } as CSSProperties}>
        <rect
          x={X_END - 15}
          y={top - 15}
          width={30}
          height={bottom - top + 30}
          rx={15}
          fill="var(--bg)"
          stroke="var(--text)"
          strokeWidth={5}
        />
        <text x={X_END + 30} y={(top + bottom) / 2 - 8} className="fill-[var(--text)] text-[22px] font-black">
          Contact
        </text>
        {profile.availability.active && (
          <text y={(top + bottom) / 2 + 16} className="fill-[var(--muted)] text-[12.5px]">
            {wrapWide(profile.availability.status).map((l, k) => (
              <tspan key={l} x={X_END + 30} dy={k === 0 ? 0 : 17}>
                {l}
              </tspan>
            ))}
          </text>
        )}
      </a>
    </svg>
  );
}

/** The availability line sits in a narrow column right of the interchange. */
function wrapWide(text: string): string[] {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    if ((cur + " " + w).trim().length > 19 && cur) {
      out.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  return [...out, cur];
}

/** Small screens: the same lines as a plain list, like the line index on a station wall. */
export function LineList() {
  return (
    <ul className="border-t border-[var(--line-hi)] lg:hidden">
      {[...LINES, { id: "contact", href: "#contact", name: "Contact", color: "var(--l-contact)", stops: [] as string[] }].map(
        (line) => (
          <li key={line.id} className="border-b border-[var(--line-hi)]">
            <a href={line.href} className="flex items-center gap-4 py-4">
              <span aria-hidden className="h-2.5 w-10 flex-none rounded-full" style={{ background: line.color }} />
              <span className="text-[17px] font-extrabold text-[var(--text)]">{line.name}</span>
              <span className="mono ml-auto text-[11px] text-[var(--faint)]">
                {line.stops.length ? `${line.stops.length} stops` : "Terminus"}
              </span>
            </a>
          </li>
        )
      )}
    </ul>
  );
}
