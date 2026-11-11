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
      label="Stack"
      title="What I actually use."
      lede="Grouped by what it's for. No proficiency bars, because a number I assign to my own skill isn't evidence of anything."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {stack.map((group, i) => (
          <Reveal key={group.id} delay={Math.min(i, 5) * 50}>
            <div id={`stack-${group.id}`} className="card group h-full p-6 md:p-7">
              <div className="flex items-center gap-4">
                {ICONS[group.id] &&
                  (() => {
                    const Icon = ICONS[group.id];
                    return (
                      <span aria-hidden className="glass">
                        <Icon />
                      </span>
                    );
                  })()}
                <h3 className="h-section text-[19px] text-[var(--text)]">
                  {group.label}
                </h3>
              </div>
              {group.note && <p className="mt-3 text-[13.5px] text-[var(--faint)]">{group.note}</p>}
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-[13.5px] text-[var(--text)] transition-colors duration-300 hover:border-[var(--signal)]"
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
