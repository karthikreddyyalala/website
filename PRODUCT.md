# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Everyone who evaluates Karthik for a role, with no single priority (confirmed by the owner):

- Recruiters and hiring managers screening for New Grad Software / AI Engineering roles starting May 2027. They skim quickly and need proof fast.
- Senior engineers and technical interviewers who read the architecture, evaluation numbers and code links closely.
- Startup founders deciding whether he can build and ship a whole product alone.

## Product Purpose

A personal portfolio for Karthik Reddy Yalala, a computer science senior at Arizona State University (4.0 GPA, class of 2027). It exists to get him interviews. Success is a visitor leaving convinced he ships real AI systems end to end, and remembering the site as the best portfolio they have seen.

## Positioning

He has already shipped production AI systems at a Fortune 500 company (four initiatives at Avis Budget Group in one summer) and measures his own projects with real evaluations (for example Crucible: 76 hand-labeled situations, run three times). The site itself is evidence: it includes a working webcam hand-control mode built on MediaPipe.

## Operating Context

- One long page: hero, Avis case study, selected work, stack, path (timeline), about, contact.
- Visitors arrive from a résumé link, LinkedIn or GitHub, on work laptops and phones.
- Deployed on Vercel at karthikreddyy.vercel.app.

## Capabilities and Constraints

- Next.js 15 App Router, React 19, Tailwind v4, TypeScript. Framer Motion is installed.
- All written content stays word for word (owner's requirement). It lives in `src/content/`.
- Existing functions that must keep working: project demo videos with hover preview and dialog, opt-in hands-free hand control, résumé download, contact links.
- The site has one dark theme. The owner did not require a light theme.
- Motion budget (owner's words): "whatever feels great and impressive".
- The owner must be able to revert the redesign at any time.

## Evidence on Hand

- Portrait: `public/images/profile.webp`, `public/images/about-photo.webp`.
- Project screenshots and posters: `public/images/projects/`.
- Demo videos: `public/videos/crucible-launch.mp4`, `public/videos/finrag-demo.mp4`, `public/videos/crucible-demo.mp4`.
- Case study, projects, timeline and profile copy: `src/content/`.
- No testimonials, client logos or press exist. Do not invent any.

## Product Principles

- Proof before polish: every impressive moment should carry a real fact, number, demo or diagram.
- Works for a 20-second skim and a 10-minute read.
- The site is itself a demonstration of engineering care: fast, accessible, nothing broken.
- Never fabricate claims, metrics or endorsements.

## Accessibility & Inclusion

- Respect `prefers-reduced-motion` with a still alternative for every animation.
- Keyboard access and visible focus for all controls.
