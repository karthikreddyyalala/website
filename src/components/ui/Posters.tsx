import type { ReactNode } from "react";

/**
 * Posters for the three projects that have no screenshot or video. Each is
 * drawn from the project's own words (its tagline and description); nothing
 * here is a picture of software that was not captured. They are decorative:
 * the same words are in the card's text, so screen readers skip them.
 */

function Frame({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden className="poster relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[3px] border border-[var(--rule)]">
      {children}
    </div>
  );
}

const label = { fontFamily: "var(--font-code), monospace", fontSize: 13, fill: "var(--ink)" } as const;
const line = { fill: "none", stroke: "var(--ink)", strokeWidth: 1.3 } as const;

/** Deep Research Agent Team: "A planner, executor, and validator loop". */
export function LoopPoster() {
  return (
    <Frame>
      <svg viewBox="0 0 480 270" className="h-full w-full">
        {/* three stages */}
        {[
          { x: 40, name: "planner" },
          { x: 180, name: "executor" },
          { x: 320, name: "validator" },
        ].map((n, i) => (
          <g key={n.name}>
            <rect x={n.x} y={96} width={120} height={46} rx={3} {...line} stroke={i === 2 ? "var(--signal)" : "var(--ink)"} />
            <text x={n.x + 60} y={124} textAnchor="middle" {...label} fill={i === 2 ? "var(--signal)" : "var(--ink)"}>
              {n.name}
            </text>
          </g>
        ))}
        <path d="M160 119H180M300 119H320" {...line} />
        {/* the loop back from the validator to the planner */}
        <path d="M380 142V190Q380 200 370 200H110Q100 200 100 190V142" {...line} strokeDasharray="4 5" />
        <circle cx="100" cy="142" r="3.5" fill="var(--ink)" />
        <circle cx="380" cy="96" r="3.5" fill="var(--signal)" />
        <path d="M380 96V62" {...line} stroke="var(--signal)" />
        <circle cx="380" cy="58" r="5" {...line} stroke="var(--signal)" />
      </svg>
    </Frame>
  );
}

/** Autonomous Trading Floor: "Four agents that argue about a trade before making it." */
export function DeskPoster() {
  const agents = [
    { x: 92, y: 62, name: "analyst" },
    { x: 388, y: 62, name: "trader" },
    { x: 92, y: 208, name: "risk manager" },
    { x: 388, y: 208, name: "critic" },
  ];
  return (
    <Frame>
      <svg viewBox="0 0 480 270" className="h-full w-full">
        {agents.map((a) => (
          <g key={a.name}>
            <path d={`M${a.x} ${a.y}L240 135`} {...line} strokeDasharray="4 5" />
            <rect x={a.x - 62} y={a.y - 21} width={124} height={42} rx={3} fill="var(--sheet)" stroke="var(--ink)" strokeWidth={1.3} />
            <text x={a.x} y={a.y + 5} textAnchor="middle" {...label}>
              {a.name}
            </text>
          </g>
        ))}
        <circle cx="240" cy="135" r="34" fill="var(--sheet)" stroke="var(--signal)" strokeWidth={1.3} />
        <text x="240" y="140" textAnchor="middle" {...label} fill="var(--signal)">
          decision
        </text>
      </svg>
    </Frame>
  );
}

/** Stock Price Predictor: "An LSTM that beat the linear baseline by 12%." Type only: a chart would be invented data. */
export function FigurePoster() {
  return (
    <Frame>
      <div className="flex items-center gap-5 px-6 sm:gap-8">
        <p className="display-l !text-[clamp(3.25rem,9vw,5.5rem)] text-[var(--signal)]">12%</p>
        <div className="mono text-[13px] leading-none text-[var(--ink)]">
          <p className="pb-2.5">LSTM</p>
          <p className="border-t border-[var(--ink)] pt-2.5 text-[var(--graphite)]">linear baseline</p>
        </div>
      </div>
    </Frame>
  );
}
