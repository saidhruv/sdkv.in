# Roadmap

## Completed (v5 — 2026-06-28 — "Kinetic Editorial" — CURRENT)
- Type-as-art editorial design (Fraunces + mono, paper palette, red accent, grain)
- Kinetic cursor/scroll headline; expanding work entries; data-driven content
- Carried over: light-dark() theming, reduced-motion, a11y, SEO
- Chosen from 3 previewed concepts (A: node-graph, B: editorial ✓, C: flow-field)

## Superseded same day (v4 — 2026-06-28 — Apple-gallery rebuild)
- Full reset; new Apple design system from `~/Downloads/DESIGN.md`
- Tile-stack layout (roles as product tiles), single Action-Blue accent
- Light/dark mode via CSS `light-dark()` + System/Light/Dark toggle
- Theme-aware hero canvas ("product render"), audit bugs designed out
- 3 JS files (down from 21); SEO + a11y baked in

## Completed (v1 — 2026-06-04)
- Aurora canvas background with particle system
- Hero section with character animation
- About section with count-up metrics
- Experience timeline (5 roles)
- Skills grid (8 categories)
- Achievements section (6 impact cards)
- Technology marquee (infinite CSS scroll)
- Contact section with copy-to-clipboard
- Glassmorphism nav with mobile menu
- Full accessibility pass (reduced motion, aria, focus-visible)
- SEO meta, OpenGraph, Twitter card, JSON-LD structured data

## Potential Enhancements (not yet scoped)

### Content
- Add a "Projects" section (freelance work or notable side projects)
- ~~Downloadable résumé~~ — DONE: `/resume` page with a Normal ⇄ ATS mode toggle; per-mode/theme PDF downloads (`resume-light/dark/ats.pdf`), linked from Contact. (Pending commit/deploy.)
- Update experience when new roles / milestones are reached
- Add PMP certification badge when certified

### Visual / Interaction
- Typing cursor effect on hero subtitle
- Scroll progress indicator (thin top bar)
- Smooth page transition effect on first load
- "Currently at AMD" live status indicator (green dot + text)

### Performance
- Preload Inter font subsets (woff2) locally instead of Google Fonts CDN (eliminates external request)
- Add `<link rel="preload">` for critical CSS
- Service Worker for offline support (low priority for portfolio)

### SEO / Meta
- Add Open Graph image (og:image) — generate a custom 1200×630 card
- Add canonical URL tag
- Add sitemap.xml

### Analytics
- Add privacy-respecting analytics (Plausible or Fathom — no cookies, GDPR safe)

## Breaking Changes to Avoid
- Do NOT add a build step without migrating all JS to proper ES modules
- Do NOT switch to a framework without a full rewrite (no incremental React injection)
- Do NOT delete or move CNAME
- Do NOT introduce a second accent color — Action Blue is the only "click me" signal
- Do NOT add shadows to cards/buttons/text — the one shadow is reserved for the hero render
- Keep design tokens semantic (`light-dark()`); don't hardcode hex in components
- Do NOT let the working tree drift uncommitted again — commit + push to actually deploy
