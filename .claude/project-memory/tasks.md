# Tasks

## Backlog

- [ ] Add `og.png` social card (1200×630) — meta tags already reference https://sdkv.in/og.png but the asset doesn't exist yet
- [ ] Replace the inline SVG favicon with a real favicon.ico / apple-touch-icon if desired
- [ ] Add downloadable resume PDF — link in hero or contact section
- [ ] Add sitemap.xml (single URL, trivial)
- [ ] Evaluate Plausible/Fathom analytics (privacy-first, no cookie banner)
- [ ] Self-host Inter font (remove Google Fonts CDN dependency)
- [ ] "Projects" section — freelance / side projects case studies
- [ ] Commit + push the rebuild to deploy it (master currently still serves the old placeholder)

## In Progress
_(nothing currently)_

## Completed (2026-06-28 — Kinetic Editorial redesign)

- [x] Built 3 creative concepts (Living Architecture, Kinetic Editorial, Spatial Depth)
- [x] User chose Kinetic Editorial; developed it into the full site
- [x] index.html / index.css rewritten in the editorial language
- [x] js/data.js (content) + js/kinetic.js (render + headline motion) added
- [x] animations.js + main.js rewritten; hero-canvas.js + concept files removed
- [x] Verified light/dark, kinetics, count-up, hover-expand, responsive, a11y; CNAME intact

## Completed (2026-06-28 — Apple-gallery rebuild, superseded same day)

- [x] Audit of v3 codebase (found drift + undeployed state)
- [x] Full reset — deleted old index.*, index-b.*, and all 21 js files (CNAME preserved)
- [x] index.css — Apple design system, light-dark() theming, tile layout, utility cards
- [x] index.html — tile stack, all 5 roles, 8 skills, 6 impact cards, SEO head, JSON-LD, a11y
- [x] js/hero-canvas.js — theme-aware particle render, IO+visibility pause, reduced-motion bail
- [x] js/animations.js — scroll reveal (unobserve), count-up, frosted sub-nav
- [x] js/main.js — nav, theme toggle (System/Light/Dark + localStorage), copy-email, init
- [x] Verified in browser: light + dark, toggle cycle, count-up, canvas pause/resume, responsive grid, CNAME intact
- [x] node --check on all JS

## Blocked
_(nothing currently)_
