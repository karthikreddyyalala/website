import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { profile } from "@/content/profile";
import { MotionToggle } from "./ui/Fx";
import { Meta } from "./ui/Section";

const LINKS: { label: string; href: string; Icon?: LucideIcon }[] = [
  { label: "Email", href: `mailto:${profile.contact.email}`, Icon: Mail },
  { label: "LinkedIn", href: profile.contact.linkedin, Icon: Linkedin },
  { label: "GitHub", href: "https://github.com/karthikreddyyalala", Icon: Github },
  { label: "Back to top", href: "#top" },
];

/**
 * Edge-to-edge outlined wordmark standing on the bottom edge of the page, descenders cut off. SVG text with a
 * pinned textLength, so it spans the viewport exactly at any width and with
 * any fallback font. `width` is the text's natural width at font-size 100.
 */
function Wordmark({ text, width, className }: { text: string; width: number; className: string }) {
  return (
    <svg viewBox={`0 0 ${width} 74`} aria-hidden className={`w-full ${className}`}>
      <text
        y="74"
        textLength={width}
        fontSize="100"
        fontWeight="650"
        letterSpacing="-0.05em"
        fill="var(--bg)"
        stroke="var(--ice)"
        strokeWidth="2.4"
        paintOrder="stroke" // the fill covers the contour overlaps a bare outline would show inside the letters
        style={{ fontFamily: "var(--font-body), sans-serif" }}
      >
        {text}
        <tspan fill="var(--signal)" stroke="none">.</tspan>
      </text>
    </svg>
  );
}

/** Colophon. Says a person chose these things, which a template cannot. */
export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-[var(--line-hi)] pt-12">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[13px] text-[var(--faint)]">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="mt-2 text-[14.5px] text-[var(--muted)]">
            <Meta text={`${profile.location} · Open to work, May 2027`} />
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
                  className="icon-link text-[15px] font-bold text-[var(--text)] transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  {l.Icon && <l.Icon />}
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <MotionToggle className="icon-link text-[15px] font-bold text-[var(--text)] transition-colors duration-200 hover:text-[var(--accent)]" />
            </li>
          </ul>
        </nav>
      </div>

      <div className="wordmark-rise mt-14 px-[2vw] text-[var(--text)] md:mt-20">
        <Wordmark text="Karthik Reddy Yalala" width={856} className="hidden md:block" />
        <Wordmark text="KRY" width={196} className="md:hidden" />
      </div>
    </footer>
  );
}
