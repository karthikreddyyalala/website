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
      <div className="grid md:grid-cols-2 md:gap-x-10">
        {stack.map((group, i) => (
          <Reveal key={group.id} delay={Math.min(i, 5) * 50}>
            <div id={`stack-${group.id}`} className="h-full border-t-[3px] border-[var(--line-color)] pb-9">
              {/* The badge sits across the line, so the yellow shows through the glass. */}
              <div className="group -mt-[13px] flex items-end gap-4">
                {ICONS[group.id] &&
                  (() => {
                    const Icon = ICONS[group.id];
                    return (
                      <span aria-hidden className="glass">
                        <Icon />
                      </span>
                    );
                  })()}
                <h3 className="pb-1 text-[18px] font-extrabold text-[var(--text)]">
                  {group.label}
                </h3>
                {group.note && (
                  <p className="ml-auto pb-1.5 text-right text-[13px] text-[var(--faint)]">{group.note}</p>
                )}
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
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
