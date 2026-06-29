# Architectural & Design Decisions

## 2026-06-28 (later same day)

**Decision:** Switched design language from Apple-gallery to "Kinetic Editorial"
**Reason:** User wanted the site to feel more creative and unique — the Apple language read as polished-but-familiar. Built 3 distinct previewable concepts (Living Architecture node-graph, Kinetic Editorial bold-type, Spatial Depth flow-field); user chose Kinetic Editorial.
**Impact:** New look = Fraunces serif at massive display sizes + JetBrains Mono, warm paper palette (with a dark "ink-paper" variant via `light-dark()`), italic-red accents, film-grain overlay, marquee strip, expanding work entries, editorial numbered sections. Content now lives in `js/data.js` and is rendered by `js/kinetic.js`. The Apple-era `hero-canvas.js` and the tile system were removed. The light-dark() theming + reduced-motion + a11y decisions carried over unchanged.

---

## 2026-06-28

**Decision:** Full rebuild from scratch — Apple-gallery design, 3 JS files, down from 21
**Reason:** An audit found the v3 codebase had badly diverged: 21 untracked JS files, a WebGL aurora, a full orphaned `index-b.*` variant, and — critically — NONE of it was committed/deployed (master held only a 64-line placeholder). Rather than untangle drift, the user chose a clean reset. Adopted the Apple design system from `~/Downloads/DESIGN.md` for a fresh visual direction.
**Alternatives Considered:** Incremental cleanup of v3; keeping one of the two variants
**Impact:** Site is now 1 HTML + 1 CSS + 3 small IIFE JS files. All résumé content was extracted from the old `index.html` before deletion and preserved. The audit's specific bugs were designed out (see below).

---

## 2026-06-28

**Decision:** Light/dark mode via CSS `light-dark()`, not a JS-driven `[data-theme]` swap
**Reason:** User wanted the site to honor the OS setting automatically. `light-dark()` (Chrome/Edge 123+, Safari 17.5+, Firefox 120+ — all 2024) does this in pure CSS with zero JS. The toggle is an *optional override* that sets `color-scheme` (System/Light/Dark); "System" clears the override so CSS follows the OS again.
**Alternatives Considered:** `[data-theme]` attribute + duplicated token blocks + JS to read prefers-color-scheme (more JS, more flash risk)
**Impact:** One semantic token set, resolved by the browser. A tiny inline head script only handles the flash-free case for users who picked an explicit override. Dark "product tiles" intentionally keep near-black surfaces in both themes to preserve the gallery rhythm.

---

## 2026-06-28

**Decision:** Hero canvas as the "product render"; audit bugs designed out
**Reason:** Apple is photography-first but there are no product photos, so an animated particle-network canvas stands in as the hero artifact (resting on the surface with the one system shadow). The old code's RAF loops never paused offscreen, called getBoundingClientRect in hot loops, and had implicit init-order coupling.
**Impact:** HeroCanvas pauses via IntersectionObserver + visibilitychange, hoists rects, uses one passive pointermove, stores its RAF handle, exposes destroy(), and is theme-aware. Main.init() initializes the canvas BEFORE the theme toggle (which calls setTheme), and setTheme guards on ctx — no ordering trap.

---

## 2026-06-04

**Decision:** Vanilla static HTML/CSS/JS — no framework, no build step
**Reason:** Site is hosted on GitHub Pages. Keeping it static means deploy = git push. Zero CI/CD complexity, zero dependency management, loads instantly.
**Alternatives Considered:** Next.js static export, Next.js on Vercel
**Impact:** All features must be achievable in native browser APIs. No JSX, no npm, no bundler.

---

## 2026-06-04

**Decision:** Aurora + full-black aesthetic (Gemini-inspired)
**Reason:** User explicitly chose this over dark-with-glowing-accents or light+dark toggle. Signals technical ambition and modern sensibility.
**Alternatives Considered:** Linear/Vercel dark aesthetic, light+dark toggle
**Impact:** Canvas aurora is the main visual differentiator. No light mode implemented.

---

## 2026-06-04

**Decision:** IIFE module pattern for JS (no ES modules)
**Reason:** Static file serving without a bundler means no `import`/`export` across files. IIFEs give encapsulation without module syntax. Scripts load sequentially, `Main.init()` calls `Aurora.init()` and `Animations.init()` by global reference.
**Alternatives Considered:** ES modules with `<script type="module">` (would require CORS-safe server, breaks `file://` locally)
**Impact:** Each JS file exports one global (`Aurora`, `Animations`, `Main`). No tree-shaking possible — acceptable given small file sizes.

---

## 2026-06-04

**Decision:** `screen` composite mode for aurora blobs
**Reason:** Screen blending causes overlapping blobs to brighten rather than muddy. Produces the luminous aurora glow on black background without needing WebGL/shaders.
**Alternatives Considered:** `source-over` (muddier), `lighten` (too harsh), WebGL shaders (overkill for static site)
**Impact:** Must clear canvas each frame and re-apply `ctx.globalCompositeOperation = 'screen'` before blob pass, then reset to `source-over` for particles.

---

## 2026-06-04

**Decision:** Duplicate marquee rows in HTML (not JS-cloned)
**Reason:** Pure CSS infinite marquee requires the content to be present twice so the second copy seamlessly replaces the first as it scrolls off. Doing this in HTML avoids JS dependency for a purely visual effect.
**Alternatives Considered:** JS-based cloning on init, single-row with very long content
**Impact:** Each tech pill appears twice in source. `aria-hidden="true"` on duplicate rows prevents screen reader repetition.

---

## 2026-06-04

**Decision:** Character split for hero name done in JS (not hardcoded spans in HTML)
**Reason:** Screen readers need the plain text version. `#hero-name` starts as plain text with `aria-label`, JS wraps chars in `<span aria-hidden="true">` for animation. Graceful degradation if JS fails — name still renders.
**Alternatives Considered:** Hardcoded spans (breaks screen readers), CSS animation on whole word (less premium feel)
**Impact:** `initTextSplit()` must run before first paint ideally — currently runs on `DOMContentLoaded` which is acceptable.

---

## 2026-06-04

**Decision:** `clamp()` for all fluid type and spacing
**Reason:** Eliminates most breakpoint-specific font-size overrides. Scales smoothly between mobile and desktop viewport widths.
**Impact:** Fewer `@media` queries needed for typography. Breakpoints reserved for layout changes (grid → single column).
