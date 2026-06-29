# Changelog

## 2026-06-28 — Logo system + brand identity

### Context
User requested a premium personal logo system. Explored many directions (rejected an initial 6-concept set as "looks like a high schooler using Word", and a hand-drawn-vector approach). Landed on a **font-based** identity set in **Italiana** (a slender high-fashion serif), chosen from a live typeface specimen sheet. No star/emblem — user explicitly rejected those.

### New
- `logos/` directory: standalone exploration gallery + two final concepts (`concept-monogram` = "SD", `concept-wordmark` = single-line "SAI DHRUVA K V"), each with light/dark/animated SVGs and a preview page. (Not deployed; reference/source.)
- **Site integration:**
  - Topbar logo: `.tb-name` is now an `<a href="#home">` wrapping an inline SVG wordmark (`.tb-logo`, viewBox 0 0 760 120) — "SAI DHRUVA K V" in Italiana, `fill="currentColor"` so it adapts to theme + reddens on hover.
  - Favicon: SD monogram in Italiana (inline data-URI in `<head>` + regenerated theme-aware in `main.js setFavicon()`), replacing the old italic "S".
  - Added `Italiana` to the Google Fonts `<link>`.
- Logo animations are ink/cream only — no accent-color flash (user request).

### Known limitation
- ~~The data-URI SVG favicon cannot load the Italiana webfont~~ — RESOLVED: the favicon "SD" is now real Italiana **vector paths** (`SD_PATH` in `main.js`, extracted via opentype.js from the Italiana TTF), so it renders identically everywhere with no webfont dependency.

### Follow-ups (same day)
- Favicon outlined to vector paths (see above) — true Italiana in the tab.
- Topbar wordmark **animated**: one-time letter-by-letter `fill-opacity` reveal on load, ink-only, gated behind `.tb-animate` which `main.js` adds only when the tab is visible (prevents a background-tab load from freezing the logo invisible). Reduced-motion → instant.
- **Header is now two rows** (`.tb-row1` / `.tb-row2`): row 1 = big centered Italiana wordmark (`clamp(40px,5.6vw,68px)`) with theme toggle + burger on the right (3-col grid `1fr auto 1fr` keeps it optically centered); row 2 = nav links centered. Mobile: row-2 links collapse into the burger dropdown; wordmark shrinks to `clamp(30px,8vw,38px)`. Replaced the old single-row `.tb-nav` flex layout.
- **Sequenced page-load intro**: after the logo letters (0.15–0.69s), the nav links (0.95–1.23s), then hero eyebrow (1.4s) → headline lines (1.55–1.94s) → hero-foot (2.15s) fade in, in order. Driven by `body.intro` + `.topbar.tb-animate` (added together by `armIntro()` in main.js, gated on tab visibility). Headline lines fade **opacity-only** because kinetic.js owns their inline `transform` — verified the two don't conflict (anim leaves `transform:none`). Reduced-motion → all instant. Below-fold sections keep their existing scroll-triggered `.reveal`.
- **Animated favicon (sequenced S→D loop)**: the monogram is split into separate `S_PATH`/`D_PATH` vector paths, each with its own `fill-opacity`, driven by a throttled rAF timeline in `main.js` (`faviconTick`/`startFaviconLoop`/`stopFaviconLoop`/`initFaviconLoop`) that repaints the data-URI via `setFavicon()`. Cycle (17.4s): S fades in 1.2s → D fades in 1.2s → both hold 10s → both fade out 5s → repeat. Smoothstep easing (`favEase`). `faviconStart` is wall-clock so a hidden→visible resume lands at the right phase. Pauses on `visibilitychange` when hidden (browser also halts rAF). Reduced-motion → static full monogram (loop never starts, `setFavicon` forces both opacities to 1). Theme-aware bg/fg carried over. (Earlier rejected iterations: orbiting red arc, then a whole-monogram cosine breathe.)

## 2026-06-28 — v5.0.0 — "Kinetic Editorial" redesign

### Context
Right after the v4 Apple rebuild, user wanted something more creative/unique. Built 3 previewable concepts (Living Architecture, Kinetic Editorial, Spatial Depth); user picked Kinetic Editorial and it was developed into the full site.

### New
- Type-as-art editorial design: huge Fraunces serif + JetBrains Mono, warm paper palette, italic-red accents, film grain, marquee, numbered sections
- Kinetic hero headline — parallax to cursor + scroll-driven letter-spacing
- Work entries expand on hover/focus; bordered metric + capability grids; large red impact numbers
- Warm "ink-paper" dark variant via `light-dark()` (theme toggle + OS-honoring carried over from v4)
- Content moved to a data layer (`js/data.js`), rendered by `js/kinetic.js`
- Copy-email gained an `execCommand` fallback

### Removed
- v4 tile system + `js/hero-canvas.js`; the 3 concept preview files

---

## 2026-06-28 — v4.0.0 — Apple-Gallery Rebuild (from scratch)

### Context
A codebase audit found the v3 work had diverged badly (21 untracked JS files, WebGL aurora, an orphaned `index-b.*` variant) and, critically, was never committed — master still served a 64-line placeholder. User chose a full reset and a new visual direction from `~/Downloads/DESIGN.md` (Apple design system).

### New
- Apple-gallery aesthetic: edge-to-edge alternating "product tiles" (light / parchment / near-black), single Action-Blue accent, SF Pro / Inter with "Apple tight" tracking, body at 17px, exactly one product drop-shadow
- Light/dark mode honoring the OS via CSS `light-dark()`; nav toggle cycles System → Light → Dark (localStorage-persisted, flash-free)
- Hero canvas as the "product render": theme-aware particle network, mouse repulsion, paused offscreen, reduced-motion bail
- 5 experience roles as full-bleed alternating tiles; 8-card skills grid; 6 impact cards; frosted sticky sub-nav
- SEO: canonical, OG + Twitter image tags, consistent name everywhere, JSON-LD Person (incl. Instagram in sameAs), inline SVG favicon

### Technical
- Collapsed 21 JS files → 3 IIFEs: `hero-canvas.js`, `animations.js`, `main.js`
- Audit bugs designed out: RAF loops pause via IntersectionObserver + visibilitychange and expose destroy(); rects hoisted out of hot loops; single passive pointermove; observers unobserve after first trigger; no implicit init-order coupling (canvas inits before theme toggle; setTheme guards on ctx)
- All résumé content preserved from the old site before deletion; CNAME untouched

### Removed
- Old `index.html`, `index.css`, the entire `index-b.*` variant, and all 21 files in `js/`

---

## 2026-06-04 — v1.0.0 — Full Portfolio Launch

### New Features
- Aurora canvas background with 5 animated gradient blobs (violet, blue, cyan, purple, green) using `screen` composite blending
- Particle system (180 desktop / 60 mobile) with mouse attraction and connection lines
- Floating glassmorphism nav with scroll-aware border, active section highlighting, mobile hamburger menu
- Hero section: character-by-character name animation with staggered delay, cursor glow spotlight, scroll indicator
- About section: two-column layout with career narrative, 4 animated count-up metrics, tilt-on-hover glass cards
- Experience section: alternating timeline for 5 roles (iService → HPE → Goin → FINEOS → AMD), AMD dot has pulsing cyan glow
- Skills section: 8 glass cards (Architecture, Frontend, Mobile, Backend, Cloud/AWS, DevOps, Leadership, Design) with mouse-reactive inner glow
- Impact/Achievements: 6 cards with large gradient numerals (30×, 6.5, ♿, 20%, ∞, PMP)
- Technology marquee: infinite dual-row CSS animation, Row 1 scrolls left at 28s, Row 2 right at 32s
- Contact section: email link, copy-to-clipboard button, LinkedIn / GitHub / Twitter / Instagram links
- Footer: minimal, preserves "Designed to discourage printing. Save Paper. Save Trees." tagline

### Technical
- Full design system in CSS custom properties (no Tailwind, no external CSS library)
- Google Fonts: Inter + JetBrains Mono via CDN (preconnect + display=swap)
- Three JS modules as IIFEs: `aurora.js`, `animations.js`, `main.js`
- SEO: title, description, keywords, OG tags, Twitter card, JSON-LD Person schema
- `prefers-reduced-motion` respected across all animation paths
- `focus-visible` keyboard navigation styles
- All links: accessible labels, `noopener noreferrer` on external

### Replaced
- Old `index.html`: single-screen giphy background + social link list
- Old `index.css`: Montserrat font, grey background, link hover animations
