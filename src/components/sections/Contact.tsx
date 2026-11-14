import type { CSSProperties } from "react";
import { Download, Github, Linkedin, Mail, Phone } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { Meta, Sheet } from "../ui/Section";
import { CopyButton } from "../ui/Fx";
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

/** Sheet 07. The ask, then a ruled sheet of the four ways to reach him and three actions. */
export function Contact() {
  return (
    <Sheet id="contact" no="07" name="Contact">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-6">
          <Reveal>
            <h2 className="display-l lg:!text-[min(3.6vw,3.25rem)]">
              Let&apos;s talk about
               what you&apos;re building.
            </h2>
          </Reveal>

          {availability.active && (
            <Reveal delay={80}>
              <p className="mt-7 flex items-baseline gap-2.5 text-[16.5px] text-[var(--graphite)]">
                <span aria-hidden className="inline-block h-2 w-2 flex-none translate-y-[-1px] rounded-full bg-[var(--signal)]" />
                <Meta text={availability.status} />
              </p>
            </Reveal>
          )}
        </div>

        <Reveal delay={120} className="min-w-0 lg:col-span-6">
          <div className="panel ticks">
            <ul>
              {CHANNELS.map((c) => (
                <li key={c.label} className="border-b border-[var(--rule)]">
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex min-h-[64px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5 transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--ink)_5%,transparent)] md:px-6"
                  >
                    <c.Icon aria-hidden className="h-[18px] w-[18px] flex-none max-[359px]:hidden text-[var(--graphite)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-[var(--signal)]" />
                    <span className="note flex-none sm:w-[72px]">{c.label}</span>
                    <span className="ml-auto min-w-0 text-right text-[clamp(12.5px,3.9vw,14.5px)] [overflow-wrap:anywhere] font-semibold text-[var(--ink)] sm:text-[17px]">{c.value}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 md:p-6">
              <a href={`mailto:${contact.email}`} className="btn btn-signal w-full sm:col-span-2" style={{ "--shine": "var(--ink)" } as CSSProperties}>
                <span aria-hidden className="shine" />
                <Mail aria-hidden />
                Send an email
              </a>
              <a href={contact.resume} target="_blank" rel="noopener noreferrer" className="btn btn-line w-full">
                <Download aria-hidden />
                Download résumé
              </a>
              <CopyButton text={contact.email} label="Copy email" className="btn btn-line w-full" />
            </div>
          </div>
        </Reveal>
      </div>
    </Sheet>
  );
}
