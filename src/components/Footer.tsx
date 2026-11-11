import { profile } from "@/content/profile";

const LINKS = [
  { label: "Email", href: `mailto:${profile.contact.email}` },
  { label: "LinkedIn", href: profile.contact.linkedin },
  { label: "GitHub", href: "https://github.com/karthikreddyyalala" },
  { label: "Back to top ↑", href: "#top" },
];

/**
 * Edge-to-edge wordmark standing on the bottom edge of the page, descenders cut off. SVG text with a
 * pinned textLength, so it spans the viewport exactly at any width and with
 * any fallback font. `width` is the text's natural width at font-size 100.
 */
function Wordmark({ text, width, className }: { text: string; width: number; className: string }) {
  return (
    <svg viewBox={`0 0 ${width} 71`} aria-hidden className={`w-full ${className}`}>
      <text
        y="71"
        textLength={width}
        fontSize="100"
        fontWeight="600"
        letterSpacing="-0.04em"
        fill="currentColor"
        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
      >
        {text}
        <tspan fill="var(--accent)">.</tspan>
      </text>
    </svg>
  );
}

/** Colophon. Says a person chose these things, which a template cannot. */
export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-[var(--line)] pt-12">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono text-[11px] text-[var(--faint)]">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="mt-2 text-[13px] text-[var(--muted)]">
            {profile.location} · Open to work, May 2027
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mono text-[11px] text-[var(--muted)] transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="wordmark-rise mt-14 px-[2vw] text-[var(--text)] md:mt-20">
        <Wordmark text="Karthik Reddy Yalala" width={884} className="hidden md:block" />
        <Wordmark text="KRY" width={197} className="md:hidden" />
      </div>
    </footer>
  );
}
