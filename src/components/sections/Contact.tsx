import { Reveal } from "../ui/Reveal";
import { Rail, SectionHead, lineStyle } from "../ui/Section";
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
    <section id="contact" className="relative py-24 md:py-36" style={lineStyle("contact")}>
      <Rail />
      <div className="shell relative">
        <Reveal>
          <SectionHead index="06" label="Contact">
            <h2 className="h-display max-w-[16ch] text-[clamp(2.2rem,6vw,4rem)]">
              Let&apos;s talk about
              <span className="text-[var(--muted)]"> what you&apos;re building.</span>
            </h2>
          </SectionHead>
        </Reveal>

        {availability.active && (
          <Reveal delay={130}>
            <p className="mt-7 flex items-center gap-2.5 text-[15px] text-[var(--muted)]">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full border-[2.5px] border-[var(--text)]" />
              {availability.status}
            </p>
          </Reveal>
        )}

        <Reveal delay={190}>
          <ul className="mt-16 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {CHANNELS.map((c) => (
              <li key={c.label} className="border-t-[3px] border-[var(--text)]">
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group -mt-[13px] flex items-end gap-4"
                >
                  {/* The badge sits across the ink line, so it shows through the glass. */}
                  <span aria-hidden className="glass">
                    <c.Icon />
                  </span>
                  <span className="pb-1 text-[14px] text-[var(--muted)]">{c.label}</span>
                  <span className="ml-auto pb-1 text-right text-[16px] font-bold text-[var(--text)] transition-colors duration-200 group-hover:text-[var(--accent)]">
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
              className="rounded-full bg-[var(--text)] px-6 py-3 text-[14.5px] font-bold text-[var(--bg)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Mail className="mr-2 inline h-4 w-4" />
              Send an email
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-[var(--text)] px-6 py-[10px] text-[14.5px] font-bold transition-colors duration-200 hover:bg-[var(--text)] hover:text-[var(--bg)]"
            >
              <Download className="mr-2 inline h-4 w-4" />
              Download résumé
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
