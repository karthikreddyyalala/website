import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { stack } from "@/content/stack";

export function Stack() {
  return (
    <Section
      id="stack"
      index="03"
      label="Stack"
      title="What I actually use."
      lede="Grouped by what it's for. No proficiency bars, because a number I assign to my own skill isn't evidence of anything."
    >
      <div className="grid md:grid-cols-2">
        {stack.map((group, i) => (
          <Reveal key={group.id} delay={Math.min(i, 5) * 50}>
            <div className="h-full border-t border-[var(--line)] py-7 md:pr-10">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[15px] font-medium text-[var(--text)]">
                  {group.label}
                </h3>
                {group.note && (
                  <p className="mono text-[10.5px] text-[var(--faint)]">{group.note}</p>
                )}
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-[12.5px] text-[var(--muted)] transition-colors duration-200 hover:border-[var(--line-hi)] hover:text-[var(--text)]"
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
