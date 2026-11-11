import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { stack } from "@/content/stack";
import { Braces, BrainCircuit, Cloud, Database, Globe, Workflow, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  engineering: Workflow,
  ai: BrainCircuit,
  languages: Braces,
  web: Globe,
  cloud: Cloud,
  data: Database,
};

export function Stack() {
  return (
    <Section
      id="stack"
      index="03"
      label="Stack"
      line="stack"
      title="What I actually use."
      lede="Grouped by what it's for. No proficiency bars, because a number I assign to my own skill isn't evidence of anything."
    >
      <div className="grid md:grid-cols-2">
        {stack.map((group, i) => (
          <Reveal key={group.id} delay={Math.min(i, 5) * 50}>
            <div className="h-full border-t-[3px] border-[var(--line-color)] py-7 md:mr-10">
              <div className="group flex items-center gap-4">
                {ICONS[group.id] &&
                  (() => {
                    const Icon = ICONS[group.id];
                    return (
                      <span aria-hidden className="glass">
                        <Icon />
                      </span>
                    );
                  })()}
                <h3 className="text-[17px] font-extrabold text-[var(--text)]">
                  {group.label}
                </h3>
                {group.note && (
                  <p className="mono ml-auto text-right text-[10.5px] text-[var(--faint)]">{group.note}</p>
                )}
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--line-hi)] bg-[var(--surface)] px-3 py-1.5 text-[13px] text-[var(--text)] transition-colors duration-200 hover:border-[var(--text)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
