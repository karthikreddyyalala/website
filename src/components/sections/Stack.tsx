import { Sheet } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { TechTag } from "../ui/TechTag";
import { stack } from "@/content/stack";

// Rows of two tiles with unequal widths, so no row is a set of equal cards.
const SPAN = ["lg:col-span-5", "lg:col-span-7", "lg:col-span-5", "lg:col-span-7", "lg:col-span-7", "lg:col-span-5"];

/**
 * Sheet 04. Six groups as a bento of matte tiles. Each tool carries its real
 * mark, in ink until its tile is hovered or holds focus, when the marks take
 * their brand colours. Layout and the edge light are adapted from the
 * Interactive Tech Stack Bento Grid on 21st.dev (themeocean); its sample
 * charts and terminal are dropped. No proficiency bars.
 */
export function Stack() {
  return (
    <Sheet
      id="stack"
      no="04"
      name="Stack"
      title="What I actually use."
      lede="Grouped by what it's for. No proficiency bars, because a number I assign to my own skill isn't evidence of anything."
    >
      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        {stack.map((group, i) => (
          <Reveal key={group.id} delay={(i % 2) * 70} className={SPAN[i]}>
            <div id={`stack-${group.id}`} className="panel tile glow-edge h-full p-5 md:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-[var(--rule)] pb-4">
                <h3 className="title">{group.label}</h3>
                {group.note && <p className="note">{group.note}</p>}
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <TechTag key={item} name={item} icon className="!text-[13.5px] !text-[var(--ink)]" />
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Sheet>
  );
}
