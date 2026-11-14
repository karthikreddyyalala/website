import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";
import { profile } from "@/content/profile";
import { MotionToggle, ThemeToggle } from "./ui/Fx";
import { SoundToggle } from "./ui/Sound";
import { Meta } from "./ui/Section";
import { Reveal } from "./ui/Reveal";

const LINKS: { label: string; href: string; Icon?: LucideIcon }[] = [
  { label: "Email", href: `mailto:${profile.contact.email}`, Icon: Mail },
  { label: "LinkedIn", href: profile.contact.linkedin, Icon: Linkedin },
  { label: "GitHub", href: "https://github.com/karthikreddyyalala", Icon: Github },
  { label: "Back to top", href: "#top" },
];

const link = "icon-link";

/**
 * Colophon. Links, the three preferences (motion, sound, theme), and the
 * name set across the full width as the last line of the sheet set. The
 * wordmark is sized from its container (cqw), so it spans the page exactly
 * at any width; it rises into place once.
 */
export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-[var(--edge)] pt-12">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="note">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="mt-2 text-[15px] text-[var(--graphite)]">
            <Meta text={`${profile.location} · Open to work, May 2027`} />
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={link}
                >
                  {l.Icon && <l.Icon aria-hidden />}
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <MotionToggle className={link} />
            </li>
            <li>
              <SoundToggle label className={link} />
            </li>
            <li>
              <ThemeToggle label className={link} />
            </li>
          </ul>
        </nav>
      </div>

      <Reveal>
        <div aria-hidden className="shell mt-12 [container-type:inline-size] md:mt-16">
          <p className="display-xl hidden !text-[calc(100cqw/11.62)] !leading-[0.8] md:block">
            {profile.name}
            <span className="text-[var(--signal)]">.</span>
          </p>
          <p className="display-xl !text-[calc(100cqw/2.62)] !leading-[0.8] md:hidden">
            KRY<span className="text-[var(--signal)]">.</span>
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
