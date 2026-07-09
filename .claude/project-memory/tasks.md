# Tasks

## Backlog

- [ ] "Projects" section — freelance / side projects case studies

## In Progress

- [ ] Résumé publish (built & verified locally; NOT yet committed/deployed — pending review/commit). Added a **"Résumé →"** accent-red pill (last in the Contact social row; `index.html` + `.social-accent` in `index.css`) opening the branded résumé page (`resume/index.html`) in a new tab. The page keeps its **anti-print** swap (Ctrl+P → "designed for screen" notice); a **Download button is the only way to get a copy** — JS blob-downloads (forces the filename **"Sai Dhruva K V - Resume.pdf"**) the branded poster PDF matching the viewer's light/dark mode: `resume/resume-light.pdf` / `resume/resume-dark.pdf`, rendered at **native poster page size** from `resume/index.html` via `tools/build-resume-pdf.mjs`. Added a readable mobile single-column fallback. Verified: button, download (light + dark), anti-print swap, mobile — no console errors.
  - Header bar added: Back (→ /), Italiana wordmark, theme toggle (System/Light/Dark, synced via the shared `theme` key + repaints the SD favicon), and the Download PDF button. Résumé now honors the saved theme and has a theme-aware favicon (previously it only followed OS and had no favicon).
  - **Download button made theme-dynamic** — `applyTheme()` keeps `#dl-btn`'s `href` in sync (`resume-dark.pdf`/`resume-light.pdf`) on load/toggle/OS-change; blob handler uses that href (single source of truth). Fixes stale-cache downloads always serving light. E2E-verified in headless Chrome.
  - **Dark PDF render fixed** — build was resolving `light-dark()` to light for both files (puppeteer `emulateMediaType` reset the colour-scheme feature). Build now drives `localStorage.theme` + one `setEmulatedMedia` CDP call; verified dark `body-bg rgb(17,17,19)`.
  - **Résumé is ONE page with a Normal ⇄ ATS mode toggle** (`resume/index.html`): Normal = branded poster (Fraunces, theme-aware light/dark); ATS = accessible **single-column, Atkinson-only, always-light** document. Toggle persists to `localStorage.resumeMode` (head bootstrap seeds `data-resume-mode`). Download picks the PDF by mode + colour (Normal → `resume-light`/`resume-dark.pdf`; ATS → `resume-ats.pdf`, one tall cream page). Both layouts live in the page; ATS `.doc` classes scoped/renamed so poster CSS doesn't leak. Superseded (all removed): plain-Arial `resume/ats.html`, the `?mode=ats` redirect, the poster-mirror, and the standalone `/resume/ats` page.
  - `tools/build-resume-pdf.mjs` is **self-serving**; seeds `resumeMode` (+theme) and emits all three PDFs from `/resume/` (posters = screen/native size; ats = print/one-tall-page, cream `.doc` stretched to full page height so no dark canvas strip).
  - Tradeoffs: anti-print only protects the web page (a downloaded PDF is a normal file); PDFs are ~3.2MB each (grain overlay) — regenerate with the tool when content changes.
  - Committing this also ships earlier uncommitted work (drafting-grid background + metrics refresh), intermixed in `index.html`/`index.css`; pushing makes it all public on sdkv.in.
  - Superseded the earlier "gated/encrypted vault" + "serverless-for-free" explorations (dropped — see decisions/session-history).

## Completed (2026-07-03)

- [x] Animated background — added a subtle **drafting-grid** layer (hairline minor + major rules in `--line`, cursor/scroll parallax via `js/backgrounds.js`, `z-index:-1` behind content, reduced-motion bail). Previewed 3 concepts (animated grain, ghost type, drafting grid) via a temporary `?preview` switcher; user chose the grid and dropped the grain. Losing concepts + the preview harness (`js/bg-preview.js`) removed.

## Completed (2026-07-01)

- [x] Cloudflare Web Analytics — cookieless beacon added before the JS tags in `index.html` (token `1c2c9246…`); privacy-first, no consent banner. (Chose Cloudflare over paid Plausible/Fathom.)
- [x] `sitemap.xml` (single URL `https://sdkv.in/`) + `robots.txt` (allow all, references sitemap) at repo root.
- [x] Real favicon fallbacks — `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `site.webmanifest`, all from the "SD" Italiana monogram. Animated inline SVG favicon kept as primary for capable browsers; rasters are the fallback.
- [x] Self-hosted fonts — Fraunces (roman+italic variable), JetBrains Mono (variable), Italiana in `fonts/` (latin woff2). `@font-face` in `index.css`; removed Google Fonts `<link>`/preconnect; added `<link rel=preload>` for Fraunces. No more `fonts.gstatic.com` request.
- [x] `og.png` social card (1200×630) — Kinetic Editorial layout (Fraunces heavy display, red italic "Leader.", mono meta, editorial rules). Rendered via a one-off `@resvg/resvg-js` run with the project fonts. Added `og:image:width/height/alt` meta.

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
