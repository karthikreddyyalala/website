const icons: Record<string, JSX.Element> = {
  LangGraph: (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.5L10.5 16M16 7.5L13.5 16M8.5 6H15.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  OpenRouter: (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M4 12h4m8 0h4M12 4v4m0 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "Llama 3.2": (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M12 3C8 3 5 6.5 5 10v5c0 1.5 1 3 2.5 3.5M12 3c4 0 7 3.5 7 7v5c0 1.5-1 3-2.5 3.5M12 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M7.5 18.5V21M16.5 18.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  DeepSeek: (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 7v10M7 9.5l5 3 5-3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  Nemotron: (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10v4M10 9v6M13 10v4M16 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Snowflake: (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M12 2v20M4.93 7l14.14 10M4.93 17L19.07 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 2l-2 2m2-2l2 2M12 22l-2-2m2 2l2-2M4.93 7L6.34 9.1m-1.41-2.1L3.52 8.31M19.07 7l-1.41 2.1m1.41-2.1l1.41 1.31M4.93 17l1.41-2.1m-1.41 2.1L3.52 15.69M19.07 17l-1.41-2.1m1.41 2.1l1.41-1.31" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  "Next.js": (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 16V8l10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  pytest: (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M9 3h6M12 3v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 8h10M7 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="19.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  Tailwind: (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path d="M6 12c1-4 3.5-5 6-5 3.5 0 4.5 2.5 7 3-1 4-3.5 5-6 5-3.5 0-4.5-2.5-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
};

export function TechIcon({ name }: { name: string }) {
  const icon = icons[name];
  if (!icon) return null;
  return <span className="flex-shrink-0 text-[var(--accent)]">{icon}</span>;
}
