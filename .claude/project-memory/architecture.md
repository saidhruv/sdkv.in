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

## Testing & CI (dev-tooling only — not part of the deployed site)
The live site itself stays zero-build/zero-dependency; a real `package.json` was
added purely to scaffold Playwright E2E/visual/a11y tests + CI, mirroring what
`tools/build-resume-pdf.mjs` already informally required (`npm i puppeteer`).

```
package.json                      ← devDependencies only: @playwright/test,
                                     @axe-core/playwright, puppeteer, pdfjs-dist
playwright.config.js              ← webServer (tests/dev-server.mjs on :4173),
                                     chromium-only project, toHaveScreenshot maxDiffPixelRatio 0.01
tests/
  dev-server.mjs                  ← tiny zero-dep static server (mirrors the
                                     inline server in build-resume-pdf.mjs),
                                     used only by Playwright's webServer
  e2e/
    homepage.spec.js              ← nav, mobile-menu regression, theme, sections
                                     (work/caps/impact), copy-email, a11y, visual (2 snapshots)
    resume.spec.js                ← edition picker, mode toggle, theme, print
                                     anti-swap, download flow, a11y, visual
                                     (full 3 editions × 2 modes × 2 themes = 12 snapshots)
    *.spec.js-snapshots/*.png     ← COMMITTED baselines (source of truth for diffing)
  pdf/
    verify-pdfs.mjs               ← plain Node script (not Playwright): runs
                                     tools/build-resume-pdf.mjs, asserts all 9
                                     PDFs exist/sized/have real text, and don't
                                     contain the edition-picker's own chrome text
                                     ("Format"/"Edition" headings) — the exact
                                     regression class of the picker-leaked-into-PDF bug
.github/workflows/ci.yml          ← push to master + PR (any branch): `e2e` job
                                     (Playwright) + `pdf-smoke` job (build + verify-pdfs)
```

`.gitignore` excludes Playwright's `test-results/`, `playwright-report/`,
`blob-report/`, `playwright/.cache/` — but the snapshot baselines above ARE committed.

**Gotchas discovered while writing these tests (see also `decisions.md`):**
- The résumé edition-picker has a timed "auto-reveal" (`setTimeout(fn, 600)`, opens
  itself briefly to advertise editions) that races any test clicking the trigger
  around the same time — a blind click can toggle an already-(silently)-open
  panel CLOSED. Functional tests neutralize it deterministically by no-op'ing
  that one `setTimeout(..., 600)` call (`disableAutoReveal()` in `resume.spec.js`);
  visual-regression tests instead just force-hide `.edition-panel`/`.edition-backdrop`
  via an injected stylesheet, since timing doesn't matter for a screenshot.
- The About-section count-up metrics (`[data-count]`) are gated by their OWN
  `IntersectionObserver` (independent of `.reveal`'s reduced-motion fast-path) —
  they only resolve once scrolled into view, even under `prefers-reduced-motion`.
  Visual-regression/functional tests must `scrollIntoViewIfNeeded()` them first.
- Chromium logs a generic, URL-less `"Failed to load resource: net::ERR_*"`
  (the exact code varies by environment — `ERR_FAILED`, `ERR_NAME_NOT_RESOLVED`,
  etc.) console error for the Cloudflare beacon's blocked cross-origin request on
  localhost/CI — tests correlate it against an actual failed request to
  `cloudflareinsights.com` (via the `requestfailed` page event) before excusing it,
  so a genuinely broken resource elsewhere still fails the test.
- axe-core's `color-contrast` scan can race any in-flight CSS transition/animation
  and sample a transient, partially-blended color as a "violation" that doesn't
  match any real, settled page state. Two instances found (2026-09-16): the
  résumé edition-picker's axe test was missing the `disableAutoReveal()` call
  used elsewhere (its silent auto-open transition got sampled mid-fade); the
  homepage's one-time ~2s intro nav-link stagger-fade had no guard at all (fixed
  by emulating `prefers-reduced-motion: reduce`, which the site's own CSS already
  uses to force instant `opacity:1; animation:none` on those elements). If a
  future axe run reports a "violation" color that doesn't match any CSS custom
  property, suspect this before suspecting the design — solve for the alpha-blend
  factor between the token and background color to confirm.
- The `--red`/`--faint` tokens are `light-dark()` pairs — when fixing a contrast
  issue, check whether ONE side already passes (it usually does; dark paper is
  very dark, so a mid-tone dark-mode accent color often already clears AA) before
  touching both. `--red`'s dark half (`#ff6347`, ~6.4:1) didn't need touching in
  2026-09-16's fix; `--faint`'s dark half (`#71717a`, ~3.9:1) did.
- axe's `color-contrast` rule only checks whatever theme/mode the page is in when
  `analyze()` runs — a dark-mode-only failure won't surface unless a test
  explicitly seeds dark theme. Both spec files now loop `['light', 'dark']` for
  their a11y tests specifically to prevent this blind spot recurring.
- Playwright bakes the OS into visual-regression snapshot filenames (e.g.
  `homepage-light-chromium-win32.png`). The baselines here were generated on
  Windows, so `.github/workflows/ci.yml`'s `e2e` job runs on `windows-latest`
  (not `ubuntu-latest`, which `pdf-smoke` still uses) — running on a different
  OS would look for `-linux.png` files that don't exist and fail every visual
  test regardless of any real change. If baselines are ever regenerated on
  Linux (e.g. via the official `mcr.microsoft.com/playwright` Docker image),
  switch the runner back and drop the win32-suffixed files.
- Sandbox/CI environment gotcha: the temp cache housing Playwright's and
  puppeteer's downloaded browser binaries can get cleared between sessions,
  breaking `npx playwright test` ("Executable doesn't exist") and
  `npm run test:pdf` ("Could not find Chrome") independently of any code change.
  Re-run `npx playwright install chromium` / `npx puppeteer browsers install chrome`
  first when either fails with that specific error class.
