import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/Section";
import { CopyButton } from "../ui/Fx";
import { Download, Github, Linkedin, Mail, Phone } from "lucide-react";
import { profile } from "@/content/profile";

const { contact, availability } = profile;

const CHANNELS = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, Icon: Mail },
  { label: "LinkedIn", value: "in/kyalala", href: contact.linkedin, Icon: Linkedin },
  {
    label: "GitHub",
    value: "karthikreddyyalala",
    href: "https://github.com/karthikreddyyalala",
    Icon: Github,
  },
  {
    label: "Phone",
    value: contact.phone,
    href: `tel:${contact.phone.replace(/[^+\d]/g, "")}`,
    Icon: Phone,
  },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="shell relative">
        <div data-scroll="rise" className="card p-5 sm:p-7 md:p-14">
        <Reveal>
          <SectionHead label="Contact">
            <h2 className="h-display max-w-[15ch] text-[clamp(2.2rem,6vw,4.2rem)]">
              Let&apos;s talk about
               what you&apos;re building.
            </h2>
          </SectionHead>
        </Reveal>

        {availability.active && (
          <Reveal delay={130}>
            <p className="mt-7 flex items-center gap-2.5 text-[16.5px] text-[var(--muted)]">
              <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[var(--signal)]" />
              {availability.status}
            </p>
          </Reveal>
        )}

        <Reveal delay={190}>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {CHANNELS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="card group flex items-center gap-3 !rounded-[18px] p-3 pr-4 sm:gap-4 sm:p-3.5 sm:pr-5"
                >
                  <span aria-hidden className="glass">
                    <c.Icon />
                  </span>
                  <span className="sr-only text-[15px] text-[var(--muted)] sm:not-sr-only">{c.label}</span>
                  <span className="ml-auto min-w-0 text-right text-[14px] font-semibold sm:text-[16.5px] text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                    {c.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href={`mailto:${contact.email}`}
              className="btn btn-signal"
            >
              <Mail className="h-4 w-4" />
              Send an email
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-glass"
            >
              <Download className="h-4 w-4" />
              Download résumé
            </a>
            <CopyButton text={contact.email} label="Copy email" className="btn btn-glass" />
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
