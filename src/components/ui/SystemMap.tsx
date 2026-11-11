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
const JOG = 34; // height of the 45 degree bend near the start of each line

type Stop = { name: string; href: string };
type MapLine = {
  id: string;
  href: string;
  name: string;
  color: string;
  y: number;
  jogAt: number;
  /** Stations sit evenly between these x positions. */
  from: number;
  to: number;
  stops: Stop[];
};

// Oldest first, so the Path line reads left to right through time.
const pathStops = [...timeline].reverse();
const AVIS_AT = pathStops.findIndex((t) => t.id === "avis");
const AWS_AT = pathStops.findIndex((t) => t.id === "aws-cert");
const CLOUD_AT = stack.findIndex((g) => g.id === "cloud");

/**
 * Every line and station is real content: change the content files and the
 * map follows. Each station links to its own stop further down the page.
 */
export const LINES: MapLine[] = [
  {
    id: "avis",
    href: "#work-avis",
    name: caseStudy.company,
    color: "var(--l-avis)",
    y: 142,
    jogAt: 186,
    from: 250,
    to: 905,
    stops: [
      ...caseStudy.initiatives.map((i) => ({ name: i.title, href: `#avis-${i.id}` })),
      { name: caseStudy.research.title, href: "#avis-research" },
    ],
  },
  {
    id: "path",
    href: "#path",
    name: "Path",
    color: "var(--l-path)",
    y: 238,
    jogAt: 120,
    from: 250,
    to: 905,
    stops: pathStops.map((t) => ({ name: t.org, href: `#path-${t.id}` })),
  },
  {
    id: "stack",
    href: "#stack",
    name: "Stack",
    color: "var(--l-stack)",
    y: 334,
    jogAt: 150,
    from: 250,
    to: 741, // spaced so Cloud (AWS) sits directly under Amazon Web Services on Path
    stops: stack.map((g) => ({ name: g.label, href: `#stack-${g.id}` })),
  },
  {
    id: "work",
    href: "#work",
    name: "Selected work",
    color: "var(--l-work)",
    y: 430,
    jogAt: 206,
    from: 250,
    to: 905,
    stops: projects.map((p) => ({ name: p.title, href: `#work-${p.id}` })),
  },
];

const xOf = (line: MapLine, i: number) =>
  line.from + (line.stops.length === 1 ? 0.5 : i / (line.stops.length - 1)) * (line.to - line.from);

const [AVIS, PATH, STACK] = LINES;

/**
 * Interchanges: places where two lines really share a stop. Avis Budget Group
 * is both a stop on Path and the whole red line; AWS is a stop on Path (the
 * certification) and on Stack (Cloud).
 */
const INTERCHANGES = [
  { x: xOf(PATH, AVIS_AT), top: AVIS, bottom: PATH, at: AVIS_AT, label: PATH.stops[AVIS_AT] },
  { x: xOf(PATH, AWS_AT), top: PATH, bottom: STACK, at: CLOUD_AT, label: STACK.stops[CLOUD_AT] },
];
const isInterchange = (line: MapLine, i: number) =>
  (line === PATH && i === AVIS_AT) || (line === STACK && i === CLOUD_AT);

/** Splits a station name into at most two lines so the angled labels stay short. */
function wrap(name: string, max = 14): string[] {
  if (name.length <= max || !name.includes(" ")) return [name];
  const words = name.split(" ");
  let first = "";
  while (words.length > 1 && (first + " " + words[0]).trim().length <= name.length / 2 + 3) {
    first = (first + " " + words.shift()).trim();
  }
  return [first, words.join(" ")];
}

/** Breaks text to fit the narrow column right of the Contact interchange. */
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

const ring = { fill: "var(--bg)", stroke: "var(--text)" };

/**
 * The hero: a working transit map of the whole site. Lines draw themselves in,
 * then stations pop in along them. Every line and station is a link, shared
 * stops are joined by interchanges, and all lines end at Contact. Shown from
 * 1024px up; smaller screens get StripMap, the same network drawn vertically.
 */
export function SystemMap() {
  const top = LINES[0].y - JOG;
  const bottom = LINES[LINES.length - 1].y - JOG;
  const mid = (top + bottom) / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="group"
      aria-label="System map of this site"
      className="system-map hidden w-full overflow-visible lg:block"
    >
      {LINES.map((line, n) => {
        const y = line.y - JOG;
        return (
          <g key={line.id} className="map-line" style={{ "--n": n } as CSSProperties}>
            <a href={line.href}>
              <path
                d={`M${X_START} ${line.y} H${line.jogAt} L${line.jogAt + JOG} ${y} H${X_END}`}
                pathLength={1}
                stroke={line.color}
              />
              <text x={X_START - 5} y={line.y - 16} className="fill-[var(--text)] text-[16px] font-extrabold">
                {line.name}
              </text>
            </a>
            {line.stops.map((stop, i) => {
              const x = xOf(line, i);
              const t = (x - line.from) / (W - line.from);
              // Interchange stations are drawn once, as capsules, below.
              if (isInterchange(line, i)) return null;
              return (
                <a
                  key={stop.name}
                  href={stop.href}
                  className="map-stop"
                  style={{ "--t": t, transformOrigin: `${x}px ${y}px` } as CSSProperties}
                >
                  <circle cx={x} cy={y} r={7.5} strokeWidth={3.5} {...ring} />
                  <text
                    transform={`translate(${x + 9} ${y - 15}) rotate(-38)`}
                    className="fill-[var(--muted)] text-[13px] font-medium"
                  >
                    {wrap(stop.name).map((part, k, all) => (
                      <tspan key={part} x={0} dy={k === 0 ? (all.length - 1) * -14 : 14}>
                        {part}
                      </tspan>
                    ))}
                  </text>
                </a>
              );
            })}
          </g>
        );
      })}

      {INTERCHANGES.map(({ x, top: a, bottom: b, label }) => {
        const y1 = a.y - JOG;
        const y2 = b.y - JOG;
        return (
          <a
            key={label.name}
            href={label.href}
            className="map-stop"
            style={{ "--n": 1, "--t": 0.6, transformOrigin: `${x}px ${(y1 + y2) / 2}px` } as CSSProperties}
          >
            <rect x={x - 11} y={y1 - 11} width={22} height={y2 - y1 + 22} rx={11} strokeWidth={3.5} {...ring} />
            <text x={x + 19} y={(y1 + y2) / 2 - 2} className="fill-[var(--text)] text-[13px] font-bold">
              {wrap(label.name, 12).map((part, k) => (
                <tspan key={part} x={x + 19} dy={k === 0 ? 0 : 15}>
                  {part}
                </tspan>
              ))}
            </text>
          </a>
        );
      })}

      {/* The terminus: one interchange where every line meets. */}
      <a
        href="#contact"
        className="map-stop"
        style={{ "--n": 3, "--t": 1, transformOrigin: `${X_END}px ${mid}px` } as CSSProperties}
      >
        <rect x={X_END - 15} y={top - 15} width={30} height={bottom - top + 30} rx={15} strokeWidth={5} {...ring} />
        <text x={X_END + 30} y={mid - 8} className="fill-[var(--text)] text-[22px] font-black">
          Contact
        </text>
        {profile.availability.active && (
          <text y={mid + 16} className="fill-[var(--muted)] text-[12.5px]">
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

/**
 * The same network for small screens, drawn the way a strip map runs down a
 * carriage wall: the four lines share one corridor, each stops at its own
 * stations, and they all run into the Contact terminus at the bottom.
 */
export function StripMap() {
  const lane = (n: number) => 4 + n * 12; // x of each line in the corridor, px

  return (
    <div className="lg:hidden">
      <div className="relative pb-5 pl-[62px]">
        {LINES.map((line, n) => (
          <span
            key={line.id}
            aria-hidden
            className="absolute bottom-0 top-1 w-[6px] rounded-t-full"
            style={{ left: lane(n), background: line.color }}
          />
        ))}
        {LINES.map((line, n) => (
          <div key={line.id} className="pb-4">
            <a href={line.href} className="relative block py-1.5 text-[17px] font-extrabold text-[var(--text)]">
              <span
                aria-hidden
                className="absolute top-1/2 h-[6px] -translate-y-1/2 rounded-full"
                style={{ left: lane(n) - 62 + 6, right: "calc(100% + 8px)", background: line.color }}
              />
              {line.name}
            </a>
            <ul>
              {line.stops.map((stop) => (
                <li key={stop.name}>
                  <a href={stop.href} className="relative block py-[5px] text-[14px] leading-snug text-[var(--muted)]">
                    <span
                      aria-hidden
                      className="absolute top-[7px] h-[14px] w-[14px] rounded-full border-[3.5px] border-[var(--text)] bg-[var(--bg)]"
                      style={{ left: lane(n) - 62 - 4 }}
                    />
                    {stop.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <a
        href="#contact"
        className="-mt-1 flex flex-wrap items-baseline gap-x-3 rounded-[22px] border-[4px] border-[var(--text)] bg-[var(--bg)] px-5 py-3"
      >
        <span className="text-[19px] font-black text-[var(--text)]">Contact</span>
        {profile.availability.active && (
          <span className="text-[13px] text-[var(--muted)]">{profile.availability.status}</span>
        )}
      </a>
    </div>
  );
}
