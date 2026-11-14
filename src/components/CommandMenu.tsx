"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, FileText, Github, Hash, Linkedin, Pause, Search, Volume2, type LucideIcon } from "lucide-react";
import { play, toggleSound } from "./ui/Sound";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

// Any element can open the menu with this event (see CommandButton).
const OPEN_EVENT = "command-menu:open";

type Item = { group: string; label: string; done?: string; hint?: string; Icon: LucideIcon; href?: string; run?: () => void };

/** A button that opens the command menu. */
export function CommandButton({ className = "" }: { className?: string }) {
  const [keys, setKeys] = useState("⌘K");
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setKeys("Ctrl K");
  }, []);

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label="Search and jump"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={className}
    >
      <Search />
      <kbd aria-hidden className="note hidden lg:inline">{keys}</kbd>
    </button>
  );
}

/**
 * Command menu: Command-K (or Ctrl-K) opens it from anywhere. Type to filter,
 * arrow keys to move, Enter to go. It jumps to any section or project, opens
 * the résumé and profiles, copies the email and pauses motion.
 */
export function CommandMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const items = useMemo<Item[]>(
    () => [
      { group: "Go to", label: "Avis Budget Group", hint: "Production work", Icon: Hash, href: "#work-avis" },
      { group: "Go to", label: "Selected work", Icon: Hash, href: "#work" },
      { group: "Go to", label: "Stack", Icon: Hash, href: "#stack" },
      { group: "Go to", label: "Path", Icon: Hash, href: "#path" },
      { group: "Go to", label: "About", Icon: Hash, href: "#about" },
      { group: "Go to", label: "Contact", Icon: Hash, href: "#contact" },
      ...projects.map((p) => ({ group: "Projects", label: p.title, hint: p.year, Icon: Hash, href: `#work-${p.id}` })),
      { group: "Actions", label: "Open résumé", Icon: FileText, href: profile.contact.resume },
      {
        group: "Actions",
        label: "Copy email address",
        done: "Email copied", // shown after it runs; the filter keeps matching the label
        hint: profile.contact.email,
        Icon: Copy,
        run: () =>
          navigator.clipboard?.writeText(profile.contact.email).then(
            () => {
              setCopied(true);
              play("success");
            },
            () => {}
          ),
      },
      { group: "Actions", label: "GitHub", Icon: Github, href: "https://github.com/karthikreddyyalala" },
      { group: "Actions", label: "LinkedIn", Icon: Linkedin, href: profile.contact.linkedin },
      {
        group: "Actions",
        label: "Pause or play motion",
        Icon: Pause,
        run: () => window.dispatchEvent(new Event("motion:toggle")),
      },
      { group: "Actions", label: "Turn sound on or off", Icon: Volume2, run: toggleSound },
    ],
    []
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  useEffect(() => {
    const open = () => {
      setQuery("");
      setActive(0);
      setCopied(false);
      if (dialog.current?.open) return;
      dialog.current?.showModal();
      play("open");
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, open);
    };
  }, []);

  // Keep the highlighted row in view.
  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active, shown]);

  const choose = (item: Item) => {
    if (item.run) return item.run(); // stays open so the result ("Email copied") is visible
    dialog.current?.close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + shown.length) % Math.max(shown.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      list.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.click();
    }
  };

  let lastGroup = "";

  return (
    <dialog
      ref={dialog}
     
      aria-label="Command menu"
      onClose={() => play("close")}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      className="command-menu m-auto mt-[14vh] w-[min(620px,calc(100vw-24px))] max-w-none bg-transparent p-0 text-[var(--text)]"
    >
      <div className="panel overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]" onKeyDown={onKeyDown}>
        <label className="flex items-center gap-3 border-b border-[var(--line)] px-5">
          <Search aria-hidden className="h-5 w-5 flex-none text-[var(--faint)]" />
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-label="Search sections, projects and actions"
            placeholder="Jump to a section, project or action"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            className="h-[60px] w-full bg-transparent text-[17px] outline-none placeholder:text-[var(--faint)]"
          />
          <kbd className="mono hidden rounded-md border border-[var(--line-hi)] px-1.5 py-0.5 text-[12.5px] text-[var(--faint)] sm:inline">
            esc
          </kbd>
        </label>

        <div ref={list} id="command-list" role="listbox" className="max-h-[min(52vh,420px)] overflow-y-auto p-2">
          {shown.length === 0 && <p className="px-3 py-8 text-center text-[15px] text-[var(--muted)]">Nothing matches that.</p>}
          {shown.map((item, i) => {
            const heading = item.group !== lastGroup ? (lastGroup = item.group) : null;
            const row = "flex min-h-[46px] w-full items-center gap-3 rounded-[3px] px-3 text-left text-[15px] transition-colors duration-150 aria-selected:bg-[color-mix(in_srgb,var(--ink)_9%,transparent)]";
            const body = (
              <>
                <item.Icon aria-hidden className="h-4 w-4 flex-none text-[var(--faint)]" />
                <span className="font-medium" aria-live="polite">{(copied && item.done) || item.label}</span>
                {item.hint && <span className="ml-auto truncate pl-4 text-[13px] text-[var(--faint)]">{item.hint}</span>}
              </>
            );
            return (
              <div key={item.group + item.label}>
                {heading && (
                  <p className="px-3 pb-1.5 pt-3 text-[13px] text-[var(--faint)]">{heading}</p>
                )}
                {item.href ? (
                  <a
                    role="option"
                    aria-selected={i === active}
                    href={item.href}
                    target={item.href.startsWith("#") ? undefined : "_blank"}
                    rel={item.href.startsWith("#") ? undefined : "noopener noreferrer"}
                    onPointerMove={() => setActive(i)}
                    onClick={() => choose(item)}
                    className={row}
                  >
                    {body}
                  </a>
                ) : (
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onPointerMove={() => setActive(i)}
                    onClick={() => choose(item)}
                    className={row}
                  >
                    {body}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="mono flex gap-5 border-t border-[var(--line)] px-5 py-3 text-[12.5px] text-[var(--faint)]">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </p>
      </div>
    </dialog>
  );
}
