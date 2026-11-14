# Redesign plan: "systems schematic meets technical editorial"

Status: **waiting for approval.** No code has changed. Reply "go", or send edits.

Baseline numbers are in [baseline.md](./baseline.md). The type specimen that the
font choice is based on is [type-specimen.jpg](./type-specimen.jpg).

---

## 0. Things you need to know before approving

These are findings from this session that change parts of the brief. Each has a
default I will follow unless you say otherwise.

| # | Finding | My default | Say this to change it |
|---|---|---|---|
| D1 | **21st: no MCP, but the CLI now works.** No 21st MCP is connected. After you saved a key on the card, the 21st CLI can search and retrieve. `21st usage` reports the free tier with **2 of 2 retrievals left today**. Search is free and I have spent no retrievals. `magicui.design`, `ui.aceternity.com` and Fontshare are still blocked by the network policy; GitHub, npm and Google Fonts work. | Spend the two retrievals on the two components that exist only on 21st (section 5). Take Magic UI components from their open-source repository on GitHub. Build the rest myself. | Name different components for the two retrievals. |
| D2 | **Cabinet Grotesk and Satoshi come from Fontshare**, which is blocked here, and their licence does not allow redistributing the font files, which committing them to a public repo would do. | **Archivo** (variable, width and weight axes, open licence) through `next/font/google`. In the specimen it is the most confident of the five I rendered. | "Use Cabinet Grotesk" and send me the files, or pick another row from the specimen. |
| D3 | **`deep-research-team.webp` is an AI-generated picture**, not a screenshot. It has garbled labels ("SYNTVESTZER", "SWC MAE3YER") and an image-generator watermark in the corner. Your brief also says "do not invent screenshots". A developer jury will spot it. | Give Deep Research a diagram poster (planner, executors, validator loop) like the other two media-less projects, and leave the image unused. | "Use the image". |
| D4 | **Goals 2 and 5f pull against each other.** The signature moment is the pipelines drawing on scroll, but 5f puts pipelines behind disclosure. | Initiative 01 is open by default and carries the scroll-drawn pipeline. Initiatives 02 to 04 start as summary rows and open on click; their pipelines draw when opened. | "All four open" or "all four closed". |
| D5 | **"Show each fact once" cannot be fully met without editing content.** `profile.ts`, `casestudy.ts` and `experience.ts` each contain "170+" and "4 initiatives", and every string has to stay on the page. | The four hero facts appear once, in a small drawing-style title block. The Avis header keeps its three count-ups. The ticker and the floating hero chips are removed. So the two facts appear twice (hero, Avis) instead of four times. | Tell me which of the two places to drop, and I will hide those strings visually but keep them for screen readers. |
| D6 | **Lenis.** It adds a script and a frame loop, and the brief only keeps it "if". | Remove it. Native scrolling, with CSS smooth scrolling for anchor jumps. | "Keep Lenis". |
| D7 | **The pinned project showcase and the magnetic buttons** from the last round are replaced by the even card grid and CSS spring states the brief asks for. | Replace them. | "Keep the showcase". |
| D8 | **New interface words.** Progressive disclosure needs a few button labels that do not exist yet. They are listed in section 9. No content string changes. | Use the labels in section 9. | Edit the list. |
| D9 | **Command menu.** The brief says keep its entries exactly. | I add nothing, so there is no "switch theme" entry. The theme toggle is in the nav, the mobile menu and the footer. | "Add a theme entry". |
| D10 | **Text Rotate on the role line.** The role is one string, "AI Engineer · SDE". Rotating it would hide half of it at any moment, and a rotating role word is a known template tell. | Not used. | "Use it". |
| D11 | **Tech glyphs.** 177 tags with inline brand icons are about 15% of the page's markup. | Brand glyphs stay in the Stack section, as the brief asks. Tags in Avis, Work and Path become plain mono text. | "Icons everywhere". |
| D12 | **Branch.** The session container is temporary. | I created `redesign/fable` now, holding only these documents and the baseline screenshots, so they survive. Code starts after "go". | Nothing needed. |

---

## 1. Concept

The site is drawn like an engineering sheet set: matte paper, hairline rules, a
measured grid, numbered steps and mono annotations, with the pipelines, guardrails
and evals of the work itself as the imagery. Over that sits one heavy, wide
editorial grotesk at extreme sizes, one warm signal colour, and one moving piece
per screen.

## 2. Colour roles

Six roles per theme. Neutrals dominate; Signal is used on at most one or two
things per screen (the primary action, the active step, live state).

### Dark, "Carbon"

| Role | Value | Used for | Contrast |
|---|---|---|---|
| Paper | `#0f0e0c` | page ground | |
| Sheet | `#181613` | panels, cards, nav | |
| Ink | `#efe9dc` | text, drawn lines | 15.9:1 on Paper, 14.9:1 on Sheet |
| Graphite | `#aba396` | secondary text, annotations | 7.7:1 on Paper, 7.2:1 on Sheet |
| Rule / Edge | `#2b2822` / `#7a7263` | decorative hairlines / control outlines | Edge 4.1:1 on Paper |
| Signal | `#e6b563` | accent (text on it: `#17120a`) | 10.3:1 on Paper; text on Signal 9.9:1 |

### Light, "Vellum"

| Role | Value | Used for | Contrast |
|---|---|---|---|
| Paper | `#f2ede1` | page ground | |
| Sheet | `#fbf8f0` | panels, cards, nav | |
| Ink | `#17140f` | text, drawn lines | 15.7:1 on Paper, 17.3:1 on Sheet |
| Graphite | `#5a5347` | secondary text, annotations | 6.5:1 on Paper, 7.2:1 on Sheet |
| Rule / Edge | `#d5ccb9` / `#8d8472` | decorative hairlines / control outlines | Edge 3.2:1 on Paper |
| Signal | `#8a5510` | accent (text on it: `#fff9ec`) | 5.3:1 on Paper; text on Signal 5.9:1 |

Signal is the current champagne (`#d9bd8a`) pushed toward amber so it reads as a
decision, not a tint. In the light theme it deepens to ochre, because champagne
on paper fails contrast. All text pairs pass WCAG AA (4.5:1), and control
outlines pass 3:1. I will re-measure every pair in the built page, not only here.

Surfaces are matte: no frosted glass and no `backdrop-filter` anywhere. The one
material effect is a static paper grain (a tiny CSS noise tile, not blended).

## 3. Type

One family, **Archivo** (variable: weight 100 to 900, width 62 to 125), plus
**JetBrains Mono** for numbers and annotations.

| Role | Face and axes | Size | Line height | Tracking |
|---|---|---|---|---|
| Display XL (hero name) | Archivo 800, width 118 | `clamp(3.5rem, 11.5vw, 10.5rem)` | 0.86 | -0.035em |
| Display L (section heads) | Archivo 780, width 112 | `clamp(2.25rem, 5.2vw, 4.5rem)` | 0.95 | -0.03em |
| Title (card and step heads) | Archivo 700, width 104 | 1.5 to 1.75rem | 1.1 | -0.02em |
| Lead | Archivo 420, width 100 | 1.25 to 1.375rem | 1.45 | -0.01em |
| Body | Archivo 400, width 100 | 1.0625rem (17px) | 1.6 | 0 |
| Small | Archivo 450, width 100 | 0.9375rem (15px) | 1.5 | 0 |
| Readout (count-ups, big figures) | JetBrains Mono 600 | `clamp(2.25rem, 4.4vw, 3.75rem)` | 1 | -0.04em |
| Annotation (indices, years, tags, step numbers) | JetBrains Mono 500 | 0.8125rem (13px) | 1.4 | 0 |

Contrast in size: the hero name is roughly ten times the body size on desktop.
Annotations are sentence case, never tracked capitals. Running text is capped
at 66 characters.

## 4. Wireframes

`┆` is the margin rail: a narrow left column, desktop only, holding the sheet
number and the section's existing nav name in mono. Below 768px everything is
one column with a 20px gutter and no horizontal scroll.

### Nav

```
desktop                                                         mobile
        ┌──────────────────────────────────────────────┐        ┌───────────────────┐
        │ KRY.   Avis  Work  Stack  Path  Contact      │        │ KRY.        ⌕  ≡  │
        │        ▔▔▔▔  (lamp slides to the active one) │        └───────────────────┘
        │                    ⌕ Ctrl K  ◐  ♪  ✋  Résumé │         ≡ opens a sheet: links,
        └──────────────────────────────────────────────┘           theme, sound, résumé
```

### Hero (sheet 01)

```
desktop
 01 ┆ KARTHIK                                    ┌────────────── plate ──────────┐
 ·  ┆ REDDY                                      │ ┼                           ┼ │
    ┆ YALALA                                     │   ░ signal field (shader) ░   │
    ┆                                            │   routed lines, packets move  │
    ┆ AI Engineer │ SDE │ Tempe, Arizona         │            ┌──────────────┐   │
    ┆ ● Open to New Grad … roles │ May 2027      │            │   portrait   │   │
    ┆                                            │            │     4:5      │   │
    ┆ I find the business problem, … real users. │            └──────────────┘   │
    ┆                                            │ ┌─ title block ─────────────┐ │
    ┆ [ See the production work ] [ Résumé ]     │ │ Fortune 500   │ 4         │ │
    ┆                                            │ │ 170+          │ 4.0       │ │
    ┆                                            │ └───────────────────────────┘ │
 ───┴────────────────────────────────────────────┴───────────────────────────────┘

mobile
 KARTHIK
 REDDY
 YALALA
 AI Engineer │ SDE │ Tempe, Arizona
 ● Open to New Grad … │ May 2027
 I find the business problem, …
 [ See the production work     ]
 [ Résumé                      ]
 ┌───────────── plate ──────────┐
 │ static poster (no WebGL)     │
 │        ┌──────────┐          │
 │        │ portrait │          │
 │        └──────────┘          │
 │ Fortune 500   │ 4            │
 │ 170+          │ 4.0          │
 └──────────────────────────────┘
```

The four proof facts live in the title block, the way a drawing's corner block
holds its facts. No floating chips, no ticker.

### Avis Budget Group (sheet 02, `#work-avis`)

```
desktop
 02 ┆ Avis Budget Group
 ·  ┆ AI Enablement Intern │ Fortune 500 │ Parsippany, NJ │ May to Aug 2026
    ┆ ─────────────────────────────────────────────────────────────────────
    ┆ 170+                  $1,000,000+              4
    ┆ engineering & …       projected annual …       initiatives shipped
    ┆ ─────────────────────────────────────────────────────────────────────
    ┆                       Embedded with the Customer Experience team … CEO.
    ┆
    ┆ ┌ 01  Multilingual knowledge search service                    [open] ┐
    ┆ │ ┌ pipeline (sticky) ──┐   summary paragraph                         │
    ┆ │ │ 01 ○ Request        │   Outcomes                                  │
    ┆ │ │    │                │    · Cut repeat-query cost …                │
    ┆ │ │ 02 ◉ Input guard ───┼─ blocked → rephrase                         │
    ┆ │ │    │  (drawn as you │    · …                                      │
    ┆ │ │ 03 ○ Cache ─────────┼─ hit → skip retrieval                       │
    ┆ │ │    ┆   scroll)      │   tags                                      │
    ┆ │ └─────────────────────┘   ▸ Read the engineering decisions          │
    ┆ └─────────────────────────────────────────────────────────────────────┘
    ┆ ┌ 02  Internal AI assistant                    first outcome …   [ + ] ┐
    ┆ ├ 03  Natural-language-to-SQL analytics engine first outcome …   [ + ] ┤
    ┆ └ 04  AI delivery assistant                    first outcome …   [ + ] ┘
    ┆ ┌ AI visibility research │ Delivered to the VP of Customer Experience  ┐
    ┆ └ body …                         View the prototype dashboard          ┘

mobile
 Avis Budget Group
 AI Enablement Intern │ Fortune 500 │ …
 170+   engineering & product hours saved
 $1,000,000+   projected annual cost savings
 4   initiatives shipped
 Embedded with … CEO.
 ┌ 01 Multilingual knowledge …  [open] ┐
 │ pipeline, drawn as you scroll        │
 │ summary, outcomes, tags              │
 │ ▸ Read the engineering decisions     │
 └──────────────────────────────────────┘
 ┌ 02 Internal AI assistant        [ + ] ┐
 ├ 03 Natural-language-to-SQL …    [ + ] ┤
 └ 04 AI delivery assistant        [ + ] ┘
 ┌ AI visibility research …             ┐
```

Three levels: header and figures, then four initiative rows you can scan, then
the build (pipeline, summary, outcomes) and, one level further, the decisions.
All content stays in the DOM when collapsed, so find-in-page and screen readers
still reach it.

### Selected work (sheet 03, `#work`)

```
desktop (rows alternate 7/5 and 5/7; never three equal cards)
 03 ┆ Things I built to find out if they'd work.
 ·  ┆ Agent systems, mostly. …
    ┆ ┌──────────── Crucible ────────────┐ ┌──── Open AutoData ─────┐
    ┆ │ media: video poster, plays on    │ │ media: screenshot      │
    ┆ │ hover, opens the dialog          │ │                        │
    ┆ │ 2026                             │ │ 2026 · Hack Day 2026   │
    ┆ │ Crucible                         │ │ Open AutoData          │
    ┆ │ An AI mock interviewer that …    │ │ Five local-model …     │
    ┆ │ tags                             │ │ tags                   │
    ┆ │ GitHub  Live  Demo   ▸ How it works │ GitHub  Live  ▸ How …  │
    ┆ └──────────────────────────────────┘ └────────────────────────┘
    ┆ ┌── MCP Knowledge Base ──┐ ┌────── Deep Research Agent Team ───┐
    ┆ │ screenshot             │ │ poster: planner → executors →     │
    ┆ │ …                      │ │ validator, looped                 │
    ┆ └────────────────────────┘ └───────────────────────────────────┘
    ┆ (FinRAG MCP 7 / Trading Floor 5, then Chatify 5 / Stock Predictor 7)

mobile: one card per row, same anatomy, media first.
```

Every card: media slot (16:10), year, title, one-line tagline, tags, then a links
row only if the project has links. The long description opens under "How it
works". Posters for the three projects without footage are built from their own
words:
- **Deep Research Agent Team:** a three-node loop diagram (planner, executors, validator).
- **Autonomous Trading Floor:** four agents (analyst, trader, risk manager, critic) around one decision.
- **Stock Price Predictor:** a typographic poster, "12%" at scale with "LSTM" over "linear baseline". No chart, because a chart would be invented data.

### Stack (sheet 04, `#stack`)

```
desktop                                              mobile
 04 ┆ What I actually use.                           one tile per row
 ·  ┆ Grouped by what it's for. …
    ┆ ┌─────── AI / GenAI ────────┐ ┌ Software Engineering ┐
    ┆ │ What I reach for first    │ │ How the work gets done│
    ┆ │ 18 chips with glyphs      │ │ 8 chips               │
    ┆ └───────────────────────────┘ └───────────────────────┘
    ┆ ┌ Web & APIs ─────┐ ┌─────────── Cloud (AWS) ─────────┐
    ┆ └─────────────────┘ └─────────────────────────────────┘
    ┆ ┌─────────── Languages ───────────┐ ┌─── Databases ───┐
    ┆ └─────────────────────────────────┘ └─────────────────┘
```

Six groups, their subtitles, simple-icons glyphs, no proficiency bars. Glyphs are
ink-coloured at rest and take their brand colour when the tile is hovered or
focused.

### Path (sheet 05, `#path`)

```
desktop                                              mobile
 05 ┆ How I got here.                                period above each entry,
 ·  ┆ Sep 2026 to Apr 2027 ●─ AI Systems Architect … progress line on the left
    ┆                      │  ProfessorDM … │ ASU Capstone …
    ┆                      │  · points
    ┆ May to Aug 2026      ●─ AI Enablement Intern → links to #work-avis
    ┆ 2025                 ○─ AWS Certified Cloud Practitioner
    ┆                      ┆  (line fills as you scroll)
```

### About (sheet 06, `#about`)

```
desktop                                              mobile
 06 ┆ About                                          photo, then text
 ·  ┆ ┌────────┐  I'm a senior at Arizona State …   (first paragraph large,
    ┆ │ photo  │  (large; words darken as you read)  words darken on scroll)
    ┆ │        │  This summer at Avis Budget Group …
    ┆ └────────┘  The part I care about most …
    ┆             ┌ Currently │ September 2026 ─────────────────┐
    ┆             └ Back at ASU for senior year. …              ┘
```

### Contact (sheet 07, `#contact`) and footer

```
desktop                                              mobile
 07 ┆ Let's talk about                               headline, status,
 ·  ┆ what you're building.                          rows, then buttons
    ┆ ● Open to New Grad … │ May 2027                full width
    ┆ ┌─────────────────────────────────────────────┐
    ┆ │ Email      karthikreddyy386@gmail.com       │
    ┆ │ LinkedIn   in/kyalala                       │
    ┆ │ GitHub     karthikreddyyalala               │
    ┆ │ Phone      +1 (623) 888-4033                │
    ┆ ├─────────────────────────────────────────────┤
    ┆ │ [ Send an email ] [ Download résumé ] [ Copy email ✓ ] │
    ┆ └─────────────────────────────────────────────┘
 ───┴───────────────────────────────────────────────────────────
 © 2026 Karthik Reddy Yalala        Email LinkedIn GitHub Back to top
 Tempe, Arizona │ Open to work, May 2027      Pause motion · Sound · Theme
 KARTHIK REDDY YALALA.   (wordmark at full width, rises once)
```

### Command menu and video dialog

Same entries, same actions, same keys. Restyled as a matte sheet with rules.

---

## 5. Component map

Routes: **21st** = retrieved through the 21st CLI, **OSS** = taken from the
open-source original, **Custom** = built here. Two components are 21st
retrievals (D1). Everything is restyled to the tokens above; nothing ships as
pasted.

| Section | Shortlist pick | What I will build | Route | Why |
|---|---|---|---|---|
| Nav | Tubelight Navbar (ayushmxxn, 21st id 1432) | Floating pill; a short lit "lamp" bar slides to the active section with a spring. Merged into the existing nav so the command menu, hand control and mobile sheet keep working | **21st retrieval 1**, then restyled | Exists only on 21st; the most specific interaction on the shortlist |
| Theme toggle | Theme Toggle (ayushmxxn) | Sun/moon button that rotates and swaps; the page changes with a circular wipe from the button (View Transitions), instant where unsupported | Custom | Small enough to build; saves a retrieval |
| Hero focal piece | Shader Animation / Paper shader / Animated Shader Background | "Signal field": a fragment shader drawing routed schematic lines (a Truchet tiling) with packets moving along them, in Ink and Signal | Custom, raw WebGL, no library | three.js would add a large library for one effect, against a first-load budget of 143 kB; a small hand-written shader adds no dependency |
| Hero text | Blur Fade (Magic UI) | Staged line reveal with covers that slide off | Custom CSS | Blur Fade animates `filter: blur`, which the brief's "transform and opacity only" rule excludes |
| Labels, command menu | Hyper Text (Magic UI) | Scramble that settles on the exact string, on hover or focus only | OSS: `magicuidesign/magicui` on GitHub (MIT), rewritten without its Motion dependency | Reachable |
| Avis pipeline | Custom + Shine Border (Magic UI) | SVG pipeline drawn by scroll with `stroke-dashoffset`; a rotating highlight ring on the active step only | Custom; ring idea from Magic UI, rebuilt with a rotating transform | Magic UI's version animates `background-position` |
| Decision blocks | Layout transitions | Opening content fades in; the blocks below slide with FLIP transforms | Motion (already installed), loaded only when an expander is first touched | Keeps it out of first-load JS |
| Selected work | Bento (kinfe123), 3D Card / Glowing Effect (Aceternity) | Asymmetric 7/5 grid, even anatomy; hover lifts the card 3px and a hairline highlight follows the pointer. No tilt | Custom | No retrieval left; Aceternity's registry is blocked; tilt was dropped in an earlier round |
| Stack | Interactive Tech Stack Bento Grid (themeocean, 21st id 43096) | Six-tile bento; glyphs colour in on hover or focus | **21st retrieval 2**, then restyled to my six groups | Exists only on 21st |
| Path | Timeline (Aceternity) | Timeline with a line that fills on scroll | Custom, restyling the existing one | Aceternity's registry is blocked |
| About | Text Gradient Scroll (bundui) | Words darken with scroll; full paragraph kept as one accessible string | Custom, restyling the existing one | Only on 21st |
| Contact | Contact Card (efferd), Shine Border | Rule-based contact sheet; highlight ring on "Send an email"; "Copy email" morphs to a drawn check | Custom | Only on 21st |
| Footer | Motion Footer (jahed) | Wordmark rises once; Pause motion, Sound and Theme controls | Custom | Only on 21st |
| Texture | Dot Pattern (Magic UI) | A dot grid in CSS `radial-gradient` | Custom CSS | Three lines of CSS |
| Icons | none | lucide icons with small CSS transforms on hover and focus | Custom | As the brief says |
| Not used | Text Rotate, Floating Dock, Liquid Glass Button, Spline, cursor effects | | | D10; the dock duplicates the contact rows; liquid glass contradicts "matte" |

**Retrieval order (2 of 2 available today, none spent yet):**
1. Tubelight Navbar, `ayushmxxn/tubelight-navbar`, id 1432.
2. Interactive Tech Stack Bento Grid with Hover Effects, `themeocean`, id 43096.

I will run `21st usage` again right before each one, read the component's
dependency list first, and add no dependency the repo does not already have.
If a third component turns out to need its original code, it comes from GitHub
(Magic UI) or I build it.

I will take the code with `21st get <id>` and place it by hand, so the shadcn
installer never rewrites `globals.css`. If an install through `npx shadcn add`
turns out to be cleaner, I will first add a `components.json` that points at the
`@/*` alias the repo already has and leaves `globals.css` and the tokens alone.

---

## 6. Motion map

Only `transform` and `opacity` move, plus `stroke-dashoffset` on the pipelines.
Interactive states use spring-shaped easing. Nothing loops except the hero shader.

| What moves | Trigger | Duration | Reduced motion or "Pause motion" |
|---|---|---|---|
| **Hero signal field** (the one GPU piece) | Starts after first paint, on md and up only | Continuous, about 30 fps, DPR capped at 1.5; stops when off screen or the tab is hidden | Static poster |
| Page-load sequence: rules draw, name lines uncover top to bottom, meta and actions rise, plate and title block settle | Once, on load. Any key, click or scroll finishes it at once | About 0.9 s in total, 60 ms stagger | Everything in place at first paint |
| Nav lamp | Active section changes, or pointer or focus on a link | Spring, about 350 ms | Jumps |
| Theme change | Toggle | 450 ms circular wipe; icon turns 90 degrees | Instant swap |
| Section reveal (heads and blocks rise 16px and fade in) | Once per section, on first entry | 500 ms, 50 ms stagger | Already visible |
| **Avis pipeline draw** (signature scroll moment): rail, nodes, connectors and branch spurs draw; step labels fade in; the active step gets the highlight ring | Scroll position through the pipeline | Tied to scroll | Fully drawn, no ring motion |
| Count-ups (170+, $1,000,000+, 4) | Once, when the row enters | 1.6 s | Final values, which are also what the server sends |
| Initiative, decision and "How it works" expanders | Click or Enter | Spring, about 400 ms, FLIP transforms | Instant open |
| Project card hover: 3px lift, pointer-following hairline | Hover or focus | Spring, about 250 ms | Colour change only |
| Video preview | Hover or focus on the media, as now | n/a | Unchanged: never autoplays on load |
| Stack glyph colour | Tile hover or focus | 200 ms opacity cross-fade | Kept (it is feedback) |
| Path progress line | Scroll through the section | Tied to scroll | Fully filled |
| About read-along | Scroll through the paragraph | Tied to scroll | Fully dark |
| Text scramble on nav links and rail labels | Hover or focus only | 280 ms, settles on the exact string | Off |
| Buttons, toggles, icons: press, nudge, rotate, draw-on check | Hover, focus, press, success | 120 to 250 ms | Kept: focus, pressed and copied states stay |
| Footer wordmark | Once, on entry | 700 ms | In place |

Removed: the aurora, the opening curtain that covers the page, the ticker, the
chip float and parallax, the hero scroll scene, momentum scrolling, magnetic
buttons, the pointer highlight on glass, and the endless pipeline pulse.

---

## 7. Performance plan

Targets are in baseline.md: mobile LCP at or under 2.5 s, CLS at or under 0.1,
TBT under 200 ms, Performance 90 or more, Accessibility 95 or more, first-load
JS at or under 143 kB.

1. **One WebGL context, in the hero only.** Loaded with `next/dynamic`
   (`ssr: false`) after first paint and idle. Below 768px, with Save-Data, with
   reduced motion or without WebGL, a static CSS poster shows and no canvas is
   created. The phone that Lighthouse simulates therefore runs no shader at all.
2. **LCP is the H1.** It is in the first paint at full opacity; the load sequence
   uncovers it instead of fading it in, so it does not push LCP later. The font
   is preloaded with a size-matched fallback. The portrait is `priority` with
   exact `sizes`.
3. **No continuous loops.** Lenis and the old scroll loop go. Scroll-tied effects
   share one passive, frame-throttled listener that only runs while the Avis
   pipeline, the Path line or the About paragraph is on screen.
4. **Less to hydrate.** No `backdrop-filter` (43 elements today), brand glyphs
   only in Stack, collapsed sections by default. Target: under 1,400 elements
   and an HTML document under 320 kB (today 1,843 and 527 kB).
5. **JS budget.** No three.js and no new runtime dependency. Motion loads only
   when an expander is first used. The command menu, the video dialog, hand
   control and the shader are separate lazy chunks. Lenis is uninstalled.
6. **CLS.** Every media slot has a fixed aspect ratio, fonts have matched
   fallbacks, and nothing is inserted above existing content after load.
7. **Measuring.** The sandbox is noisy (see baseline.md), so after each section I
   run before and after back to back and compare medians. Final: production
   build and three mobile Lighthouse runs.

I expect to meet the Lighthouse targets here, but the sandbox has no GPU and a
shared CPU. If a target is missed because of the machine and not the page, I
will show the evidence and not claim a pass.

---

## 8. Audit fixes (goal 5)

| Item | Plan |
|---|---|
| a. Open Graph, robots, sitemap, JSON-LD | `app/opengraph-image.tsx` with the name, the role line and the availability line only. `app/robots.ts`, `app/sitemap.ts`. Person JSON-LD with name, URL, job title, location, university and profile links: facts already on the page, and none of the uncleared Avis claims. |
| b. Even project cards | Section 4, Selected work. |
| c. Repeated proof facts | D5. |
| d. Count-ups | Already server-render final values; I will keep that and make the accessible text the original content string ("$1M+"). |
| e. Open AutoData link | Untouched. It will be listed in the final summary. |
| f. Avis scannability | Section 4, Avis, and D4. |

---

## 9. New interface strings (D8)

No string in `src/content/*.ts` or in existing components is edited. These are
the only new visible or spoken labels:

| String | Where |
|---|---|
| "Open" / "Close" | Initiative rows 02 to 04 (button, with the initiative title as its accessible name) |
| "How it works" | Project card expander for the long description |
| "Theme", "Switch to light theme", "Switch to dark theme" | Theme toggle label and its spoken name |
| "01" to "07" | Sheet numbers in the margin rail, next to the existing nav names |
| "Skip intro" is not needed | The load sequence ends on any input and is under a second |

Existing labels ("Read the engineering decisions", "Pause motion", "Sound on",
and so on) stay as they are.

## 10. Accessibility

- Contrast as in section 2, re-measured in the built page for both themes.
- Split or animated text keeps the full original string as the accessible name;
  fragments are `aria-hidden`. This includes the pipeline branch notes and the
  role line, so each content string is in the DOM once, verbatim.
- All toggles are real buttons with `aria-pressed` or `aria-expanded`. Anything
  that appears on hover also appears on focus or click.
- Theme: follows `prefers-color-scheme`, stores the choice, and is set before
  paint by a small inline script. No new dependency.
- Skip link, heading order and visible focus rings are kept.

## 11. Build order after "go"

1. Tokens, fonts, both themes, the theme script and toggle, grid and rail.
2. Nav and command menu restyle.
3. Hero: layout, title block, load sequence, static poster, then the shader.
4. Avis: summary layer, disclosure, the scroll-drawn pipeline.
5. Selected work: grid, anatomy, three posters.
6. Stack, Path, About.
7. Contact, footer.
8. Open Graph image, robots, sitemap, JSON-LD.
9. Remove dead code and dependencies, update the stale checklist.

One commit per step. After each: `tsc`, lint, screenshots at 390, 768 and 1440
in both themes. Then the fresh-context verifier, then the final Lighthouse runs.

---

## 12. Self-critique against the brief's aesthetics list, and what I changed

First draft problems, and the revision already applied above:

1. **A mono label above every section heading.** That is the "eyebrow on every
   section" tell in a different font. *Changed:* labels moved out of the heading
   stack into the margin rail as sheet numbers, desktop only, sentence case.
2. **Champagne kept as it was.** Timid, and it fails contrast on paper.
   *Changed:* one amber Signal, deepened to ochre in the light theme, used on one
   or two things per screen.
3. **Three equal cards in a row for Stack and Work.** *Changed:* every row is
   7/5 or 5/7.
4. **Rounded cards everywhere.** *Changed:* panels are square-cornered with a 4px
   radius and rule borders; only controls are pills.
5. **A glow under the nav "tubelight".** Neon glows are on the avoid list.
   *Changed:* a flat 2px lamp bar and a faint tint, no blur or outer glow.
6. **Too many moving things in the hero** (shader, parallax, chips, ticker).
   *Changed:* the shader is the only thing that moves after load.
7. **Flat page background.** *Changed:* dot grid and paper grain in CSS, rules
   and a visible margin rail give depth without gradients.
8. **Still open after revision:** Archivo is less unusual than Cabinet Grotesk.
   It is here because of D2. The width axis at 118 and weight 800 is what keeps
   it from reading as a default.
