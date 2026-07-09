# Design System

## Visual Direction
"Kinetic Editorial" (v5 — 2026-06-28). Type-as-art: massive Fraunces serif display,
warm paper palette, italic-red accents, film grain, mono metadata. Reads like an
award-winning design publication. Honors OS light/dark via CSS `light-dark()`.
Chosen over two alternatives (Living Architecture node-graph, Spatial Depth flow-field).

## Color — semantic tokens (swap via `light-dark()`)
```css
--paper:    light-dark(#f3efe7, #14120e)   /* warm cream ↔ near-black */
--paper-2:  light-dark(#ebe5d9, #1c1915)
--ink:      light-dark(#16140f, #f3efe7)   /* primary text */
--muted:    light-dark(#6b6457, #a39a89)
--faint:    light-dark(#9a9486, #6a6356)
--line:     light-dark(#d8d2c6, #322d25)   /* hairlines */
--line-2:   light-dark(#16140f, #f3efe7)   /* strong rules (= ink) */
--red:      light-dark(#e8472b, #ff6347)   /* the single accent */
```
Components reference ONLY semantic tokens. The toggle overrides via `color-scheme`.
The red is the sole accent — used for italic display words, units (+), section numbers, hover bars, links.

## Typography
- **Display/headings:** `'Fraunces', Georgia, serif` — variable, optical-sizing, weights 300/400/600/900, incl. italic
- **Meta/UI/labels:** `'JetBrains Mono', monospace`
- **Accessible face:** `'Atkinson Hyperlegible'` (400/700 + italics, self-hosted) — the only font in the résumé's **ATS mode** document (parser-friendly single-column, always-light `.doc` on `/resume`); the top bar keeps the Italiana + JetBrains Mono chrome. Not part of the main site's kinetic type.
- **Signature moves:**
  - Display at weight 900, very tight tracking (-0.04em), line-height 0.86
  - Italic weight-300 words in red for emphasis ("of", "ships.", "stack", "that matters.")
  - Outlined text via `-webkit-text-stroke` (e.g. hero "systems.")
  - All metadata/labels in uppercase mono with wide tracking

## Type Scale
| Element | Size | Weight |
|---|---|---|
| Hero display | clamp(3rem, 13vw, 11.5rem) | 900 |
| Contact "big" | clamp(2.4rem, 7vw, 6rem) | 900 |
| Section title | clamp(2rem, 5vw, 3.6rem) | 600 |
| Work company | clamp(1.7rem, 4vw, 3.2rem) | 600 |
| Metric number | clamp(2.6rem, 5vw, 4rem) | 900 |
| Impact number | clamp(3rem, 6vw, 5rem) | 900, red |
| Body/lead | ~1.05–1.4rem | 400 |
| Labels/meta | 11–14px mono | 400/500 |

## Layout & Texture
- Container max-width 1280px; padding `clamp(20px, 5vw, 64px)`
- Section padding `clamp(70px, 11vw, 150px)`
- **Film grain:** fixed SVG-noise overlay at ~3.5% opacity, `mix-blend-mode: multiply`
- **Drafting-grid background:** a single `#bg-grid` layer behind all content (`z-index:-1`; paper fill moved to `<html>`). Three tiers of hairlines in `--line` for depth: fine cells every `--cell` (`clamp(22px,2.4vw,34px)`, ~35% line), mid rules every 4 cells (~70%), bold major rules every 12 cells (full). Drifts toward the cursor and has a continuous **scroll parallax** (grid moves at ~18% of scroll, wrapped by the 12-cell period in `js/backgrounds.js` so it loops seamlessly); static under reduced motion. Chosen over animated grain and ghost-type concepts (previewed then removed).
- **Bordered grids:** metrics (2×2) and capabilities (4-col) use 1px gaps over a `--line` background to draw internal rules — editorial table feel
- **Marquee strip:** mono keywords between two strong `--line-2` rules
- Numbered sections: `// 01 — The story`, `// 02 — Selected work`, etc.

## Motion Principles
- **Ease:** `cubic-bezier(0.4,0,0.2,1)`; reveals use `cubic-bezier(0.2,0.7,0.2,1)`
- **Kinetic headline:** cursor parallax (depth per line) + scroll-driven letter-spacing spread
- **Work entries:** hover/focus expands detail (max-height + opacity), red left-bar grows, padding shifts
- **Reveal:** translateY(34px)→0, opacity, 0.8s
- **Count-up:** 1500ms cubic ease-out
- **Marquee:** 34s linear, duplicated content
- **`prefers-reduced-motion`:** all disabled; reveals/headline forced to end state; marquee stopped

## Component Patterns
- **Topbar:** sticky, blurred, name left + mono nav + theme toggle + burger; `.scrolled` adds bottom rule
- **Footer:** shares the topbar's surface — translucent paper (`color-mix(var(--paper) 82%, transparent)`) + `blur(10px)` so the drafting grid shows through; top rule in `--line-2`
- **Résumé paper (résumé page only):** the Normal poster (`.scaler`, 75% viewport width) and ATS `.doc` carry a soft two-layer drop shadow to read as a physical sheet — a deliberate, screen-only exception to the site's no-shadows rule (stripped from the built PDFs)
- **Theme toggle:** cycles System/Light/Dark, icon via `[data-theme-mode]`
- **Work entry:** `.entry` grid (num · company · meta) with expanding `.detail` + tag pills
- **Capability:** `.cap` cell, numbered red superscript + mono list
- **Impact:** `.imp` big red number + title + description
- **Buttons/links:** mono uppercase; copy-btn inverts on hover; social pills border-to-red on hover; email underlined in red
