# Before this goes live

## Clear with your Avis manager

The site publishes only what already appears in the resume you hand out, and all
architecture is generalized. Three items are worth a two-minute conversation, because a
public page has a different audience than a recruiter's inbox.

| Item | Where | Why ask |
|---|---|---|
| **"$1M+ projected annual cost savings"** | Case study headline metric | Projected savings are often treated as internal financials. |
| **"Positioned to serve millions of customers globally"** | Initiative 01 outcomes | Reads as a claim about their roadmap, not only your work. |
| **"demoed to the CEO"** | Case study intro | True and strong, but names an executive interaction. |

If any is not cleared, delete the line. Each is a single entry in
`src/content/casestudy.ts` — nothing else depends on it.

## Deliberately excluded — do not add back without written clearance

Present in your source diagrams, kept off the site:

- Bucket and table names (`abg-kb-data-source`, `internal-chat-audit`)
- API endpoint formats, TTL values, model routing env vars, session-ID constraints
- Guardrail configuration: which PII classes are blocked in which direction, the
  contextual grounding threshold, which denied topics are disabled on output
- Live operational figures (the measured cache hit rate)
- Deployment status notes ("pending platform team")

The last group matters most: publicly describing which prompt-injection defenses are
enabled and which are off, on a system serving real customers, is a security disclosure
regardless of intent.

## Content still to supply

- [x] **Hero portrait** — professional headshot installed, cropped 4:5 from the top.
- [ ] **About-section photo.** `public/images/about-photo.webp` is still the casual
      shot. That's a deliberate contrast (formal in the hero, human further down);
      swap it if you'd rather it were something else.
- [ ] **Interviewer.ai repo link.** `src/content/projects.ts` has no `github` for it.
- [ ] **Live demo links** for Deep Research / Trading Floor, if any are deployed.
- [ ] Confirm dropping LeetCode Tracker was intended (cut as too slight next to the
      agent work).

## Technical

- [ ] Point `SITE` in `src/lib/site.ts` at the final domain if it changes from
      `karthikreddyy.vercel.app`. The sitemap, robots file, link preview and
      structured data all read it from there.
- [x] **Open Graph image.** `src/app/opengraph-image.tsx` generates a 1200×630 card
      from the name, the role line and the availability line only. It carries none
      of the Avis figures above, on purpose: keep it that way until they are cleared.
- [ ] Check on a real phone. Verified at desktop widths; the preview pane could not
      produce a trustworthy 375px measurement.
- [ ] Re-run `npm run build` after any content edit — type and lint checks are on now,
      so a bad edit fails the build instead of shipping.

## Positioning note

The resume this was built from (Aug 2026) leans **software engineer with AI depth**,
not pure AI engineer — it added a Software Engineering skills line (system architecture,
unit testing, code review, CI/CD) and reworded the Avis bullets from "AI initiatives" to
"software initiatives". The site's hero matches that. If you go back to an AI-engineer-
first resume, change `role` and `claim` in `src/content/profile.ts`.
