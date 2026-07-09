# Architecture

## System Type
Vanilla static site — HTML + CSS + JS, no framework, no build step.
Deployed directly to GitHub Pages on push to master.

## File Structure
```
sdkv.in/
├── index.html          ← single page, editorial section stack
├── index.css           ← full Kinetic Editorial design system (light-dark tokens)
├── js/
│   ├── data.js         ← SITE_DATA: roles, capabilities, impact (single source of content)
│   ├── kinetic.js      ← Kinetic IIFE: renders content from data + animates the headline
│   ├── animations.js   ← Reveal IIFE: scroll reveal + count-up metrics
│   ├── backgrounds.js  ← Backgrounds IIFE: cursor/scroll parallax for the drafting-grid layer
│   └── main.js         ← Main IIFE: topbar, theme toggle, mobile nav, copy-email, init
├── fonts/              ← self-hosted latin woff2 (Fraunces roman+italic, JetBrains Mono, Italiana; Atkinson Hyperlegible 400/700 + italics for the résumé's ATS mode)
├── resume/
│   ├── index.html      ← résumé page. Header: Back + wordmark + Normal|ATS mode toggle + theme toggle + Download. Contains BOTH the branded poster (.sheet, Normal) AND the accessible single-column Atkinson doc (.doc, ATS, always light); mode persists via localStorage.resumeMode. Download picks the PDF by mode+theme. Anti-print in BOTH modes (Ctrl+P → "designed for screen" notice). Has the drafting-grid background + site footer; honors shared `theme` key + theme-aware favicon. Linked from Contact; public.
│   ├── resume-light.pdf ← downloadable PDF: Normal-mode poster, native size, light
│   ├── resume-dark.pdf  ← downloadable PDF: Normal-mode poster, native size, dark
│   └── resume-ats.pdf   ← downloadable PDF: ATS mode, single tall page (no breaks), Atkinson, cream
├── tools/build-resume-pdf.mjs  ← offline Puppeteer renderer (self-serving): emits all 3 PDFs from /resume/ by seeding resumeMode(+theme) — Normal light/dark posters (screen media) + ATS single page (print media, injects a reveal override past anti-print); manual, not deployed runtime
├── favicon.ico · apple-touch-icon.png · icon-192.png · icon-512.png · site.webmanifest
├── sitemap.xml · robots.txt
├── CNAME               ← "sdkv.in" — DO NOT DELETE
└── README.md
```

4 JS files. Content is data-driven: `data.js` holds the arrays, `kinetic.js` builds the DOM.

## JavaScript Architecture
Each JS file is a self-contained IIFE. `data.js` exposes a single global object `SITE_DATA`.
- `Kinetic.init()` — builds work/capabilities/impact DOM from SITE_DATA; starts headline parallax
- `Reveal.init()` — IntersectionObservers for entrance + count-up (unobserve after first trigger)
- `Main.init()` — runs on DOMContentLoaded; calls Kinetic + Reveal first, then nav/theme/copy

**Load order:** `data.js` → `kinetic.js` → `animations.js` → `backgrounds.js` → `main.js`.
`Main.init()` calls `Backgrounds.init()` (guarded) after Kinetic/Reveal.

**Drafting-grid background:** one fixed `.bg-layer` div (`#bg-grid`) at `z-index:-1`; paper fill lives on `<html>` so the grid renders above it but below content. Grid drawn with CSS `linear-gradient` hairlines (minor + major) in `--line`. `backgrounds.js` drifts it with a single lerped RAF (passive `mousemove` + per-frame `scrollY`, `visibilitychange` pause, `reduce()` bail). (Earlier previewed animated-grain and ghost-type concepts were removed once the grid was chosen.)
`Main.init()` calls `Kinetic.init()` BEFORE `Reveal.init()` so the dynamically-built `.reveal`
elements exist before the reveal observer wires up. Every init guards on element/global presence.

## Theme System (light/dark)
- `:root { color-scheme: light dark; }` + every semantic token is `light-dark(<light>, <dark>)` → OS preference honored with zero JS.
- Toggle cycles System → Light → Dark; System clears `colorScheme`, Light/Dark set it. Persisted to `localStorage['theme']`. Flash-free inline `<head>` bootstrap for explicit overrides.
- Dark variant is a warm "ink-paper" (cream type on near-black, brighter tomato-red accent) — same editorial identity, inverted.

## Animation System
- **Entrance:** CSS transition on `.reveal` + IntersectionObserver adds `.in` (unobserve after first)
- **Count-up:** RAF cubic ease, IO-triggered; writes into a `.cv` span inside each metric so the red "+" unit stays static; reduced-motion shows final value
- **Kinetic headline:** the 3 display lines parallax to cursor (lerped RAF) and shift letter-spacing on scroll (rAF-throttled, passive); paused on visibilitychange; fully disabled under reduced-motion (JS bail + CSS `transform:none`)
- **Marquee strip:** pure CSS `translateX`, duplicated content; disabled under reduced-motion
- **Work entries:** CSS-only hover/focus-within expand (max-height + opacity), red left-bar grows
- **Topbar:** `.scrolled` border toggled on scroll (passive, rAF-throttled)

## Accessibility
- All motion respects `prefers-reduced-motion` (JS bails + CSS `@media` fallback forces end state, stops marquee, neutralizes headline transform)
- Skip-to-content link; `<main id="main">`; one `<h1>`, `<h2>` per section
- `aria-hidden` on decorative marquee; `aria-label` only on icon-only controls
- Work entries expand on `:focus-within` too (keyboard reachable)
- `role="status"` live region announces copy + theme changes
- `rel="noopener noreferrer"` on all external links; `:focus-visible` red outline
- Copy-email has an `execCommand` fallback for when the async Clipboard API is blocked

## External Dependencies
- **Fonts are self-hosted** in `fonts/` (latin-subset woff2): Fraunces (roman + italic variable), JetBrains Mono (variable), Italiana. Declared via `@font-face` in `index.css` (`font-display: swap`); `index.html` preloads `fonts/fraunces-latin.woff2`. No Google Fonts CDN request. Atkinson Hyperlegible (400/700 + italics) is also self-hosted here but used only by the résumé's ATS-mode document (`@font-face` in `resume/index.html`).
- Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js`, deferred) — the only third-party runtime request; cookieless.
- Zero npm, zero bundler, zero framework (a one-off `sharp`/`png-to-ico` run generated the icons; not a repo dependency).

## Local Preview
`.claude/launch.json` defines a "static" server (`npx serve -l 4321 .`).
