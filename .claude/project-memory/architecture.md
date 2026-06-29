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
│   └── main.js         ← Main IIFE: topbar, theme toggle, mobile nav, copy-email, init
├── CNAME               ← "sdkv.in" — DO NOT DELETE
└── README.md
```

4 JS files. Content is data-driven: `data.js` holds the arrays, `kinetic.js` builds the DOM.

## JavaScript Architecture
Each JS file is a self-contained IIFE. `data.js` exposes a single global object `SITE_DATA`.
- `Kinetic.init()` — builds work/capabilities/impact DOM from SITE_DATA; starts headline parallax
- `Reveal.init()` — IntersectionObservers for entrance + count-up (unobserve after first trigger)
- `Main.init()` — runs on DOMContentLoaded; calls Kinetic + Reveal first, then nav/theme/copy

**Load order:** `data.js` → `kinetic.js` → `animations.js` → `main.js`.
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
- Google Fonts CDN: Fraunces (variable, incl. italic) + JetBrains Mono (`preconnect` + `display=swap`)
- Zero npm, zero bundler, zero framework

## Local Preview
`.claude/launch.json` defines a "static" server (`npx serve -l 4321 .`).
