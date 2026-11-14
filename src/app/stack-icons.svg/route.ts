import { ICONS } from "@/components/ui/TechTag";
import { stack } from "@/content/stack";

// Built once at build time and served as a static file.
export const dynamic = "force-static";

/**
 * One SVG sprite holding the brand marks used in the Stack section. Tags
 * reference a mark with <use href="/stack-icons.svg#slug">, so the outlines
 * are downloaded once and cached instead of being repeated in the HTML.
 */
export function GET() {
  const marks = new Map(
    stack
      .flatMap((group) => group.items)
      .map((name) => ICONS[name])
      .filter(Boolean)
      .map((icon) => [icon.slug, icon.path] as const)
  );
  const symbols = [...marks].map(([slug, path]) => `<symbol id="${slug}" viewBox="0 0 24 24"><path d="${path}"/></symbol>`).join("");
  return new Response(`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`, {
    headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=31536000, immutable" },
  });
}
