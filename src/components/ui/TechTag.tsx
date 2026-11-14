import {
  siClaude,
  siCplusplus,
  siCrewai,
  siDeepgram,
  siDeepseek,
  siDocker,
  siElevenlabs,
  siExpress,
  siFastapi,
  siFirebase,
  siGithub,
  siHtml5,
  siHuggingface,
  siJavascript,
  siJira,
  siLangchain,
  siLanggraph,
  siMeta,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNvidia,
  siOllama,
  siOpenrouter,
  siPandas,
  siPostgresql,
  siPytest,
  siPython,
  siPytorch,
  siReact,
  siRedis,
  siSnowflake,
  siSocketdotio,
  siSqlite,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

/**
 * Real product marks, in their own colors, for the tools that publish one.
 * Keys are the names exactly as written in src/content. Concepts (RAG, CI/CD)
 * and vendors that don't allow their mark in open icon sets (AWS, OpenAI)
 * stay as plain text tags.
 */
export const ICONS: Record<string, SimpleIcon> = {
  Claude: siClaude,
  "Claude Sonnet": siClaude,
  LangGraph: siLanggraph,
  LangChain: siLangchain,
  CrewAI: siCrewai,
  PyTorch: siPytorch,
  TensorFlow: siTensorflow,
  "Hugging Face": siHuggingface,
  Python: siPython,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "C/C++": siCplusplus,
  "HTML/CSS": siHtml5,
  React: siReact,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  FastAPI: siFastapi,
  Express: siExpress,
  "Tailwind CSS": siTailwindcss,
  Tailwind: siTailwindcss,
  Docker: siDocker,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  MongoDB: siMongodb,
  Redis: siRedis,
  Firebase: siFirebase,
  "Git / GitHub": siGithub,
  Deepgram: siDeepgram,
  ElevenLabs: siElevenlabs,
  OpenRouter: siOpenrouter,
  DeepSeek: siDeepseek,
  Snowflake: siSnowflake,
  pytest: siPytest,
  Ollama: siOllama,
  "Socket.io": siSocketdotio,
  Pandas: siPandas,
  Supabase: siSupabase,
  Vercel: siVercel,
  "Vercel AI SDK": siVercel,
  Stripe: siStripe,
  "Jira automation": siJira,
  Nemotron: siNvidia,
  "Llama 3.2": siMeta,
  "Meta Graph API": siMeta,
  "BM25 (SQLite FTS5)": siSqlite,
};

/** Brand colors that are too dark to see on the page are drawn in the text color instead. */
function visible(hex: string) {
  const v = parseInt(hex, 16);
  const luma = 0.2126 * (v >> 16) + 0.7152 * ((v >> 8) & 255) + 0.0722 * (v & 255);
  return luma < 70 ? "var(--ink)" : `#${hex}`;
}

/**
 * A tag for a tool or skill. With `icon`, it carries the tool's real mark,
 * drawn in the text colour until its group is hovered or focused, when it
 * takes the brand colour (see .tile in globals.css). The mark's outline is
 * not inlined: it is referenced from one cached sprite, /stack-icons.svg,
 * which keeps about sixty brand paths out of the HTML.
 */
export function TechTag({ name, icon = false, className = "" }: { name: string; icon?: boolean; className?: string }) {
  const mark = icon ? ICONS[name] : undefined;
  return (
    <li className={`tag ${className}`}>
      {mark && (
        <svg aria-hidden viewBox="0 0 24 24" className="glyph h-[1.05em] w-[1.05em] flex-none" style={{ "--brand": visible(mark.hex) } as React.CSSProperties}>
          <use href={`/stack-icons.svg#${mark.slug}`} />
        </svg>
      )}
      {name}
    </li>
  );
}
