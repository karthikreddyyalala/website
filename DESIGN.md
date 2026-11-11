---
name: Karthik Reddy Yalala
description: A portfolio drawn as a transit system map. Bodies of work are lines, deliverables are stations.
colors:
  l-avis: "#dc2430"
  l-work: "#1a56db"
  l-stack: "#f4b400"
  l-path: "#0b8f4d"
  l-contact: "#11151c"
  branch: "#e8590c"
  accent: "#c81e2a"
  accent-hi: "#a51722"
  on-line: "#ffffff"
  bg: "#f5f6f4"
  bg-deep: "#ecedea"
  surface: "#ffffff"
  surface-hi: "#e9ebe7"
  text: "#11151c"
  muted: "#434a57"
  faint: "#626a78"
  line: "rgba(17, 21, 28, 0.12)"
  line-hi: "rgba(17, 21, 28, 0.24)"
typography:
  display:
    fontFamily: "Overpass, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 8.4vw, 5.25rem)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Overpass, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.5vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Overpass, ui-sans-serif, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Overpass, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Overpass, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 700
    lineHeight: 1.5
  data:
    fontFamily: "Overpass Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: '"tnum" 1'
rounded:
  focus: "4px"
  media: "12px"
  frame: "14px"
  full: "999px"
spacing:
  gutter: "20px"
  gutter-md: "40px"
  head-to-content: "56px"
  head-to-content-md: "80px"
  section: "96px"
  section-md: "144px"
  maxw: "1180px"
components:
  button-line:
    backgroundColor: "{colors.l-avis}"
    textColor: "{colors.on-line}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-ink:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
  button-outline-hover:
    backgroundColor: "{colors.text}"
    textColor: "{colors.bg}"
  chip-item:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  chip-code:
    backgroundColor: "{colors.surface-hi}"
    textColor: "{colors.muted}"
    typography: "{typography.data}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  line-bullet:
    backgroundColor: "{colors.l-avis}"
    textColor: "{colors.on-line}"
    rounded: "{rounded.full}"
    size: "2.1em"
  station:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.full}"
    size: "20px"
  glass-badge:
    textColor: "{colors.text}"
    rounded: "13px"
    size: "44px"
  media-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.media}"
---

# Design System: Karthik Reddy Yalala

## Overview

**Creative North Star: "The System Map"**

The site is a transit map of one engineer's work, and it behaves like one. Each body of work is a line with its own color, each deliverable is a station on that line, and every failure path in an architecture diagram is a branch line that leaves the track at 45 degrees. The hero is a working map: four lines draw themselves, the stations are links, and all of them end at one terminus, Contact. Below the hero the map keeps going as a rail down the left edge of every section, filling with that section's line color as the page scrolls.

The paper is cool white and the type is ink. Color comes only from the lines, at full saturation, each doing one job. Structure comes from line weight: thick round-capped routes, 3px rules that content hangs from, hairlines between rows. There are no cards, no gradients on surfaces and no shadows carrying hierarchy. The same network runs after dark as a "night service" theme on blue-black.

The type is signage. Overpass descends from Highway Gothic, the lettering on US road signs, and it sets everything from the name at display scale to the body. Overpass Mono appears only where a value is a code or a datum.

**Key Characteristics:**
- Five route lines with fixed roles, plus one branch color reserved for failure paths.
- Stations are paper-filled dots with a thick ink ring. Shared stops become capsules.
- Content hangs from rules, not from boxes.
- One type family at heavy weights; mono only for codes and data.
- Flat. The single shadow in the system belongs to the glass icon badge.
- Motion is route motion: lines draw, rails fill, a train rides the tip.

## Colors

Cool white map paper, ink type, and saturated route lines that never trade jobs.

### Primary
- **Avis Red** (`l-avis`): the Avis Budget Group line and the page's trunk. Rail, section rules, figures and links inside the case study, and the fill of the one primary action in the hero.
- **Signal Red** (`accent`, hover `accent-hi`): the darker red used where red must work as interface feedback rather than as a line: focus outline, text selection, the dot in the wordmark, hover color on utility links and controls.

### Secondary
- **Work Blue** (`l-work`): the Selected work line.
- **Stack Yellow** (`l-stack`): the Stack line. It is a line and a rule color only; it never carries type.
- **Path Green** (`l-path`): the Path (timeline) line.
- **Terminus Ink** (`l-contact`): the Contact and About line. It is the text color used as a line, so the route ends in ink.

### Tertiary
- **Branch Orange** (`branch`): failure-path branch lines in pipeline diagrams, with their small ringed stop.

### Neutral
- **Map Paper** (`bg`): page ground, and the fill of every station dot so the line appears to pass behind it.
- **Paper Shade** (`bg-deep`): scrollbar track.
- **Sheet White** (`surface`): chips and the ground behind media while it loads.
- **Sheet Grey** (`surface-hi`): filled mono chips.
- **Ink** (`text`): headings, station rings, outline buttons, the footer rule.
- **Ink Soft** (`muted`): body copy and secondary labels.
- **Ink Faint** (`faint`): dates, notes, the least important metadata.
- **Hairline** (`line`) and **Hairline Strong** (`line-hi`): row dividers, unfilled track, chip outlines.
- **On Line** (`on-line`): type set on a red, blue, green or orange fill.

### Night service

The `[data-theme="dark"]` set redefines every token. The frontmatter holds the day values; these are the night ones.

| Token | Night | Token | Night |
|---|---|---|---|
| bg | #0e1118 | l-avis | #ff5a5f |
| bg-deep | #090b10 | l-work | #5b9bff |
| surface | #161b25 | l-stack | #ffcb2e |
| surface-hi | #1f2532 | l-path | #3ddc84 |
| text | #eef1f6 | l-contact | #eef1f6 |
| muted | #b3bac6 | branch | #ff8a3d |
| faint | #8d96a5 | accent | #ff6b70 |
| line | rgba(238, 241, 246, 0.12) | accent-hi | #ff8f93 |
| line-hi | rgba(238, 241, 246, 0.24) | on-line | #0e1118 |

### Named Rules

**The One Job Rule.** A line color means one body of work everywhere on the page: on the hero map, in the nav, on the rail, in rules and links inside its section. A section sets `--line-color` once and everything inside reads it. Never borrow a line color for a different section because it looks better there.

**The Branch Rule.** Orange is a failure path and nothing else. It appears only as the spur and its stop in a pipeline diagram.

**The Bullet Ink Rule.** Type on a line fill uses `on-line`, with two overrides the build makes by hand: ink on yellow, and paper on the ink line.

**The Small Type Rule.** In day service only blue and Signal Red clear 4.5:1 as small text on paper. Yellow never carries type. Use red and green as text at heading scale or on night service; for small links on those lines, prefer ink.

## Typography

**Display Font:** Overpass (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Overpass
**Label/Mono Font:** Overpass Mono (with ui-monospace, monospace), tabular figures on

**Character:** Road-sign lettering at heavy weights, tightly tracked at large sizes and plain at small ones. The contrast is weight and scale, not a second family.

### Hierarchy
- **Display** (900, clamp(3rem, 8.4vw, 5.25rem), 0.92, -0.035em): the name as the map's title. Drops to 4.25rem on wide screens shorter than 860px so the whole map stays in the first viewport. The Contact heading reuses the display style at clamp(2.2rem, 6vw, 4rem).
- **Headline** (800, clamp(2rem, 4.5vw, 3.25rem), 1.02, -0.025em): section headings on the station sign. Balanced wrapping.
- **Title** (800, 19 to 28px, 1.02): stop names: initiatives 24/28px, projects 22/26px, timeline entries 19px, stack groups 18px.
- **Body** (400, 15 to 16.5px, 1.75, max 66ch, Ink Soft): running copy. The page base is 17px; the hero claim sets 16/17px in Ink at 1.6.
- **Label** (700, 13.5 to 14.5px): buttons, nav stops, text links, the line's name at the end of a station sign. Sentence case, no tracking.
- **Data** (Overpass Mono 400, 10 to 12.5px, tabular): years, date ranges, technology chips, badges, the numeral in a line bullet (700), copyright.

### Named Rules

**The Signage Rule.** One family sets everything. Mono is for values that are codes or data, never for atmosphere and never for headings.

**The Plain Label Rule.** Labels are sentence case at bold weight. No component in the build sets uppercase or wide tracking.

## Layout

One column inside a centered shell (max 1180px; 20px side gutter, 40px from 768px). Sections stack with 96px vertical padding (144px from 768px), and 56px (80px) between a section's sign and its content.

The left gutter belongs to the network. Every section carries a rail there (4px wide, 6px from 768px) whose center lines up with the section's station and with each smaller stop beside a deliverable. Stacked sections read as one continuous route that changes color at each station. On screens 1024px and wider, the hero map's red line turns down through a rounded corner and becomes this trunk.

Inside a section, content sits on a 12-column grid from 768px: a narrow column for the stop's name and metadata (3 or 4 columns) and a wide one for its copy (9 or 8). The timeline uses a fixed 200px date column. Below 768px everything is a single column and the rail stays.

The hero map is an SVG route diagram from 1024px. Below that it becomes a strip map: the four lines share one vertical corridor at 12px spacing, each with its own stations, running into a Contact capsule at the bottom.

Rows are separated by rules, not by boxes: a 3px rule in the line color opens a group, and 1px Hairline Strong rules divide rows inside it.

## Elevation & Depth

Flat. Depth comes from overlap on the map plane: a station's paper fill hides the line behind it, an interchange capsule spans two lines, a badge sits across a rule. The nav gains a paper background and a hairline once the page scrolls; it does not gain a shadow or blur.

### Shadow Vocabulary
- **Glass badge** (`box-shadow: inset 0 1px 0 var(--glass-hi), 0 2px 4px -1px rgba(8, 10, 14, 0.22)`): the only shadow in the system, on the 44px glass icon badge, together with `backdrop-filter: blur(5px) saturate(1.5)`.

### Named Rules

**The Bounded Glass Rule.** Blur and shadow exist only on the small glass badge, which must sit across a line so the line shows through it. Larger surfaces and anything inside a scrolling container stay solid: blur there was a measured source of scroll jank. The video dialog uses a solid scrim for the same reason.

## Shapes

Round where the map is round, square everywhere else.

- **Routes:** round caps and round joins, bends at 45 degrees. Stroke 9 units on the 1200-unit hero map, 6px for rails, strip-map lines and pipeline track, 5px for branch spurs and key swatches.
- **Stations:** circles with a paper fill and a thick ink ring (20px with a 5px ring; 16px with 4px below 768px). Deliverable stops are one size down (16px with 4px; 12px with 3px).
- **Interchanges:** vertical capsules with the same paper fill and ink ring, spanning the lines that share the stop. The terminus is the largest capsule and has the heaviest ring.
- **Controls and chips:** fully round pills.
- **Raster media:** softly rounded frames (12px for screenshots and video, 14px for the hero portrait) with a border.
- **Rules:** square-ended, 3px when they open a group, 1px between rows.

## Components

### Buttons
- **Shape:** pill (999px), label type, 24px side padding.
- **Line button:** filled with the line color, `on-line` text, 12px vertical padding. The hero's primary action, on Avis Red.
- **Ink button:** Ink fill, Map Paper text. The Contact section's primary action.
- **Outline button:** 2px Ink border, transparent, 10px vertical padding so it matches the filled height. Used for the résumé everywhere, smaller (4px by 16px, 13.5px) in the nav.
- **Hover / Focus:** filled buttons rise 2px (transform, 200ms) and settle on press. The outline button inverts to Ink fill with paper text. Focus is a 2px Signal Red outline at 3px offset on every control.
- **Icons:** lucide, 16px, inline before or after the label.

### Text links
Bold label type with a lucide icon at 1.05em and 6px gap. On hover the icon shifts 1px up and right. Inside a section the link takes the line color or turns to it on hover (see the Small Type Rule); utility links in the footer and contact rows turn Signal Red.

### Chips
- **Item chip:** Sheet White pill with a Hairline Strong outline, 13px Ink text; outline turns Ink on hover. Stack items.
- **Code chip:** mono 11px pill, either filled Sheet Grey with no outline or outlined with no fill. Technologies on projects, initiatives and timeline entries.
- **Badge:** mono 10px pill filled with the line color, `on-line` text.

### Media frames
Screenshots and video previews: 16:9, softly rounded (12px), 1px Hairline border that strengthens on hover, image scales to 1.02 over 500ms. Portraits take a 2px Ink border instead. Text laid over video sits on a black-to-transparent scrim; this is the one place a gradient appears, and it exists for legibility over footage.

### Navigation
Fixed 68px bar, transparent over the hero, Map Paper with a bottom hairline after scrolling. Wordmark "KRY." at 17px/900 with a Signal Red dot. Each link is a nav stop: a 12px ring in its line's color that fills with that color when its section is current, beside a 14px bold label (Ink Soft, Ink when current). Small round outline controls (28px high) for hands-free and theme. A 3px Ink bar under the nav grows left to right with scroll position. Below 768px the links collapse into a full-width sheet of hairline-divided rows.

### Station sign (signature)
Every section heading: a station on the rail level with the first line of the heading, a numbered line bullet (a roundel in the line color, mono 700 numeral, 2.1em at 0.42 of the heading size), the headline, and the line's name in 15px bold Ink Soft at the far end.

### Rail and train (signature)
The section's track in Hairline, filled from the top with the line color as the section scrolls through the middle of the viewport. A 14 by 26px Ink capsule rides the tip. Without scroll-driven animation support or with reduced motion, the rail is simply solid and the train is hidden.

### System map and strip map (signature)
The hero diagram. Lines run left to right with one 45 degree jog near the start, station names set at -38 degrees in 13px, line names in 16px/800 above the start, and every line and station is a link to its section or stop. Hovering or focusing a line thickens it to 12 units and dims the others to 28% opacity. On entry, lines draw over 1.5s staggered by 140ms and stations pop in along them. Stations come from the content files; none are decorative.

### Pipeline (signature)
Architecture as a vertical line diagram: a station per stage (20px, 5px ring), a 6px track that fills with the line color on scroll, stage name in 16px/800 with its detail in 14px Ink Soft. A failure path is a Branch Orange spur leaving the track at 45 degrees to its own small ringed stop, labelled in 13px.

### Glass icon badge (signature)
A 44px clear tile (13px radius) holding a 20px lucide icon at stroke 2. It straddles the 3px rule that opens a group, so the rule's color shows through. Rises 2px when its row is hovered. Used for stack groups and contact channels.

### Map key
Proof points under the hero map: a short 5px swatch of the line the fact belongs to with a small station on it, the figure in 15px/800 tabular, the label in Ink Soft.

### Motion
Entrances are a 500ms opacity fade toggled by an observer; the hero name rises line by line from behind a mask (900ms). State changes use 200ms with `cubic-bezier(0.16, 1, 0.3, 1)`. Scroll-linked effects (rail, train, pipeline track, nav progress, footer wordmark) are CSS scroll-driven, transform-only, and their resting state is the finished state. Under `prefers-reduced-motion` everything is still and fully visible.

## Do's and Don'ts

### Do:
- **Do** give every new section one line: set `--line-color` on it and let the rail, station, bullet, rules and links read that variable.
- **Do** make every station on a map a real, linked piece of content.
- **Do** fill stations with Map Paper and ring them in Ink so the line passes behind them. The nav stop is the one variant ringed in its line color.
- **Do** open content groups with a 3px rule and divide rows with 1px Hairline Strong.
- **Do** bend routes at 45 degrees with round caps and joins.
- **Do** set type on a line fill in `on-line`, ink on yellow, paper on the ink line.
- **Do** keep icons to lucide at one stroke weight per context (2 in badges, 2.25 in links).
- **Do** leave every animated element in its finished state by default, and give it a still fallback under reduced motion.
- **Do** redefine every color token for night service when adding one.

### Don't:
- **Don't** reuse a line color for a different body of work, or use Branch Orange for anything but a failure path.
- **Don't** set type in Stack Yellow, or small day-service text in Path Green or Avis Red.
- **Don't** put content in bordered or shadowed cards. Groups hang from rules.
- **Don't** add shadows or blur beyond the glass badge, or blur anything inside a scrolling container.
- **Don't** put gradients or glows on surfaces, lines or type. The legibility scrim over video is the only gradient.
- **Don't** set headings or atmosphere in Overpass Mono, and don't add uppercase tracked labels.
- **Don't** draw stations or lines that link to nothing.
