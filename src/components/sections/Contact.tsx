import { Reveal } from "../ui/Reveal";
import { profile } from "@/content/profile";

const { contact, availability } = profile;

const CHANNELS = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  { label: "LinkedIn", value: "in/kyalala", href: contact.linkedin },
  { label: "GitHub", value: "karthikreddyyalala", href: "https://github.com/karthikreddyyalala" },
  {
    label: "Phone",
    value: contact.phone,
    href: `tel:${contact.phone.replace(/[^+\d]/g, "")}`,
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-36">
      <div className="shell">
        <Reveal>
          <p className="eyebrow flex items-center gap-3">
            <span>06</span>
            <span aria-hidden className="h-px w-8 bg-[var(--line-hi)]" />
            <span>Contact</span>
          </p>
        </Reveal>

        <Reveal delay={70}>
          <h2 className="h-display mt-6 max-w-[16ch] text-[clamp(2.2rem,6vw,4rem)]">
            Let&apos;s talk about
            <span className="text-[var(--muted)]"> what you&apos;re building.</span>
          </h2>
        </Reveal>

        {availability.active && (
          <Reveal delay={130}>
            <p className="mono mt-7 flex items-center gap-2.5 text-[12px] text-[var(--muted)]">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              {availability.status}
            </p>
          </Reveal>
        )}

        <Reveal delay={190}>
          <ul className="mt-14 grid border-t border-[var(--line)] sm:grid-cols-2">
            {CHANNELS.map((c) => (
              <li key={c.label} className="border-b border-[var(--line)]">
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-baseline justify-between gap-6 py-5 pr-2 sm:pr-8"
                >
                  <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--faint)]">
                    {c.label}
                  </span>
                  <span className="text-[14.5px] text-[var(--muted)] transition-colors duration-200 group-hover:text-[var(--accent)]">
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
              className="rounded-full px-6 py-3 text-[14px] font-medium transition-transform duration-200 active:translate-y-px"
              style={{ background: "var(--accent)", color: "#14100a" }}
            >
              Send an email
            </a>
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--line-hi)] px-6 py-3 text-[14px] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Download résumé
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
