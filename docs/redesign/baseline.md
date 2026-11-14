# Baseline (before the "systems schematic" redesign)

Measured on 2026-11-14 against `main` at `1eb1897` (PR #22 merged), which is the
site as it stands today.

## How it was measured

- `next build --turbopack` (production), then `next start`, one server only.
- Lighthouse 13.6.0, mobile form factor, simulated throttling, three runs, median kept.
- Chromium headless in the build sandbox. **The sandbox has no GPU**: WebGL, blur
  and compositing are done in software on a shared CPU, so absolute numbers are
  worse and noisier than on a real phone. Lighthouse's own CPU benchmark swung from
  1190 to 1935 across these three runs. The same commit scored 71 to 76 in a quieter
  session the day before. Read the numbers as a like-for-like yardstick for this
  sandbox, not as what a visitor sees.

## Build

| Route | Size | First-load JS |
|---|---|---|
| `/` | 28 kB | **143 kB** |
| `/_not-found` | 0 B | 115 kB |
| Shared by all | | 127 kB |

## Lighthouse, mobile

| Run | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Speed Index | CPU benchmark |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 49 | 100 | 96 | 100 | 1.39 s | 4.04 s | 6,611 ms | 0 | 7.88 s | 1935 |
| 2 | 58 | 100 | 96 | 100 | 1.37 s | 3.85 s | 1,675 ms | 0 | 4.78 s | 1786 |
| 3 | 52 | 100 | 96 | 100 | 1.37 s | 4.23 s | 3,132 ms | 0 | 5.29 s | 1191 |
| **Median** | **52** | **100** | **96** | **100** | **1.37 s** | **4.04 s** | **3,132 ms** | **0** | **5.29 s** | |

The missing best-practices points are the Vercel Analytics script, which returns
404 anywhere but Vercel.

## Page weight

| Measure | Value |
|---|---|
| HTML document | 526,547 bytes (115,478 gzipped) |
| DOM elements at 412 px wide | 1,843 (436 of them inside SVGs) |
| Elements with `backdrop-filter` | 43 |
| Canvas / WebGL contexts | 1 (full-page backdrop) |
| Total transfer (Lighthouse) | 395 KiB |

## Page length

| Viewport width | Full page height |
|---|---|
| 360 px | 26,958 px |
| 390 px | 25,734 px |
| 768 px | 20,718 px |
| 1440 px | 17,850 px |

No horizontal scroll at any of the four widths.

## Screenshots

In `docs/redesign/screenshots/baseline/`, one first-screen and one full-page
capture per width: `360-top.jpg`, `360-full.jpg`, `390-top.jpg`, `390-full.jpg`,
`768-top.jpg`, `768-full.jpg`, `1440-top.jpg`, `1440-full.jpg`.

## Targets the redesign has to meet (from the brief)

| Metric | Baseline (median) | Target |
|---|---|---|
| LCP | 4.04 s | at or under 2.5 s, and no worse than baseline |
| CLS | 0 | at or under 0.1, and no worse than baseline |
| TBT | 3,132 ms | under 200 ms |
| Performance | 52 | at least 90 |
| Accessibility | 100 | at least 95 |
| First-load JS for `/` | 143 kB | at or under 143 kB |
