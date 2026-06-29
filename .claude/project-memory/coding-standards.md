# Coding Standards

## General
- No frameworks, no npm, no build step — native browser APIs only
- All JS must work from `file://` (local open) and `https://sdkv.in` (production)
- No comments unless the WHY is non-obvious; well-named code is self-documenting

## JavaScript
- **Module pattern:** IIFEs only. Pattern: `const ModuleName = (() => { ... return { init }; })();`
- **Global exposure:** Each file exposes exactly one global (`Aurora`, `Animations`, `Main`)
- **No `var`** — use `const` / `let`
- **Event listeners:** passive where possible (`{ passive: true }`)
- **Reduced motion check:** `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at the top of each animation function; bail out early and show the end state
- **IntersectionObserver:** always `unobserve` after first trigger for entrance animations
- **RAF loops:** store the handle, expose `destroy()` for cleanup
- **No `document.write`, no `eval`, no `innerHTML` from user data**

## CSS
- **Custom properties** for all design tokens (colors, radii, transitions) — defined in `:root`
- **`clamp()`** for fluid type and spacing (no redundant `@media` font overrides)
- **BEM-lite naming:** block-element with hyphens, e.g. `.timeline-card`, `.tc-achievements`, `.hero-eyebrow`
- **No `!important`** except for accessibility overrides (`prefers-reduced-motion`)
- **Vendor prefixes where needed:** `-webkit-backdrop-filter`, `-webkit-background-clip`, `-moz-background-clip`
- **Transitions:** always use `var(--transition)` (`0.3s cubic-bezier(0.4,0,0.2,1)`) for hover state changes
- **`will-change`** only on the aurora canvas element

## HTML
- One `index.html` — single page application structure
- **Semantic elements only:** `<nav>`, `<main>`, `<section>`, `<footer>`, `<header>`
- `aria-label` on all links that don't have visible text content
- `aria-hidden="true"` on: canvas, cursor glow div, duplicate marquee rows, decorative SVGs
- `rel="noopener noreferrer"` on all `target="_blank"` links
- Structured data JSON-LD in `<head>` for SEO (Person schema)

## File Naming
- `index.html`, `index.css` — flat in root (GitHub Pages convention)
- `js/aurora.js`, `js/animations.js`, `js/main.js` — all JS in `/js/`
- No other asset folders currently (no images — pure CSS/canvas visuals)

## Script Loading Order
Scripts at bottom of `<body>`, in this exact order:
1. `js/aurora.js` (defines `Aurora`)
2. `js/animations.js` (defines `Animations`)
3. `js/main.js` (defines `Main`, calls `Aurora` and `Animations` — must be last)
