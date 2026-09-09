# Changelog

## 2026-09-09 — Résumé edition picker: highlighted strip + frosted popup + discoverability

### Changed
- **Relocated the edition picker into a dedicated red "EDITION —" strip** below the top bar (it previously sat among the top-bar controls and read like chrome). The top bar slims to Back · wordmark · theme · Download. The menu is **flush, borderless, and left-anchored** to the selector and equal width. Left-anchoring (`--ep-left = trigger.left`) is scrollbar-safe; the old right-anchor used `window.innerWidth`, which counts the scrollbar and shifted the menu left.
- **Frosted-glass backdrop on open** — content-only blur on desktop (backdrop below the chrome); full-cover haze on mobile (above the chrome).
- **Sequenced ~250ms animation:** backdrop fades in first, then the menu **rolls down** (desktop, `clip-path`) / **springs up** (mobile); dismiss is the exact reverse (menu leaves, then blur). Reduced-motion disables it.
- **Fixed a latent bug:** `--ease`/`--ease-out` were never defined on the résumé page, so every `transition` referencing them was silently invalid (instant). Defined them in the résumé `:root` (also repairs pre-existing hover transitions).

### Added (discoverability)
- **Auto-reveal on every visit** — the picker briefly opens on load (no focus steal; dismisses on interaction or a short hold) to advertise multiple editions.
- **Inline "Also available: <edition> →"** switch in the poster masthead and the ATS document (registry-driven; updates on switch).
- **Homepage hint** — an "AI & Frontend editions" caption beside the "Résumé →" pill (`index.html` + `.social-note` in `index.css`).

### Process
- Iterated in an isolated throwaway mock (`resume/_mock-edition.html`), then promoted into `resume/index.html`; mock removed. Verified headless: 38/38 picker checks + 6/6 discoverability checks, 0 console errors.

## 2026-09-04 (later) — Résumé selector redesign: adaptive edition picker

### Changed
- Replaced the native `<select>` "Tailored for …" version dropdown (clashed with the mono/editorial chrome and crowded the top bar) with an **adaptive edition picker**: one `.edition-trigger` that opens a **popover on desktop** and a **bottom sheet on mobile**. Each row shows edition label + one-line focus; active marked with a red left-rule.
- **Folded the Normal|ATS Format toggle into the same panel**, dropping the top-bar action cluster from four controls to `[Edition ▾] · theme · Download`.
- Panel + backdrop render at `<body>` level (outside the header's `backdrop-filter`, which creates a containing block that would break a `position:fixed` bottom sheet). Desktop popover is positioned via `--ep-top`/`--ep-right` set from the trigger rect; the `max-width:700px` media query overrides to a viewport-anchored sheet + dim backdrop.
- JS refactored to `setVariant()` / `setMode()` cores (still writing the same `data-*` + `localStorage` + `updateDownload()` + `fit()`); registry-driven edition list; a11y (menu roles, `aria-checked`, `aria-expanded`, Esc, outside-click, focus return, arrow-key nav); reduced-motion disables the slide.

### Unchanged
- Résumé content, the 6 PDFs, `tools/build-resume-pdf.mjs`, `?variant=` deep links, theme + Download. No PDF regen. Verified headless: all 8 version×mode×theme combos, download href matrix, desktop popover + mobile sheet, focus/Esc, 0 non-beacon console errors (48/48 checks).

## 2026-09-04 — Résumé VERSION axis (registry-driven) + Frontend Architect variant

### Added
- **Third orthogonal résumé axis — VERSION** on `/resume`, alongside the existing **mode** (Normal | ATS) and **theme** (light/dark/system). Driven by a **`RESUME_VERSIONS` registry** (`{slug,label,focus,file,download}`) defined once at the top of the head in `resume/index.html` — the single source of truth for the dropdown options, `?variant=<slug>` deep-link validation, `html[data-resume-variant]`, the per-version PDF file names, and the forced download filename. Default version = `ai` (preserves the AI-first branding). Adding a future version = one registry entry + one `.rv-<slug>` block in the poster and the doc + one slug in the build tool.
- **"Tailored for: <Version> ▾" dropdown** in `.rz-actions` (before the Normal | ATS control) — a scalable styled native `<select>` (mono/red chrome, custom red chevron, focus-visible outline), options built from the registry in JS. One compact control regardless of version count (a segmented chip would overflow as versions grow). On small screens the "Tailored for:" prefix hides.
- **Frontend Architect version** (`frontend`) — a leadership-forward reframe of the real roles (no invented numbers): headline "Frontend Architect — Design Systems, Component Architecture & Performance at Scale"; specialties Design Systems · Component & State Architecture · Performance · Accessibility (WCAG); frontend-architecture + engineering-leadership summary; metrics kept to defensible figures only (10+ yrs, 6.5 yrs enterprise React platform, 10+ orgs, 20+ technologies; 20% faster TTM at HPE, WCAG-compliant delivery at Goin — the AI-specific 100%/~67%/~95%/~40% are dropped); competencies reordered (Frontend Architecture → Design Systems → Component/State → Performance → a11y → Design–Dev → leadership); technical skills reordered (Engineering first, then Cloud, AI & Data lower, DevOps, Tools/Design); experience reframed front-end-first (ReactJS analytics UIs at AMD, enterprise React portal + reusable component system at FINEOS, React Native + WCAG at Goin, cross-platform ReactJS 20% TTM at HPE, etc.). Present in both the Normal poster and the ATS doc. Existing AI content kept verbatim.
- **3 new PDFs** — `resume/resume-frontend-{light,dark,ats}.pdf` (frontend poster is shorter: 2480×3067 vs the AI 2480×3695). Frontend download filename is **"Sai Dhruva K V - Frontend Resume.pdf"** (AI stays "Sai Dhruva K V - Resume.pdf"); both come from the registry `download` field.

### Changed
- **Content wrapped in per-version `.rv-<slug>` blocks** inside the single `.sheet` (poster) and single `.doc` (ATS). Generic CSS show/hide: `.rv-frontend { display:none }` + `:root[data-resume-variant="frontend"] .rv-ai { display:none }` / `.rv-frontend { display:block }`. Only differing content is duplicated (title, specialties, summary+metrics, competencies, skills, experience); the name and contact line (with the current email) stay shared/single. One `#sheet`/`fit()` path is preserved — the hidden version collapses to zero height, so `fit()` still measures the visible content.
- **Head bootstrap** now also resolves the version pre-paint (flash-free), mirroring the `resumeMode` bootstrap. Resolution order: `?variant=` (registry-validated) → `localStorage.resumeVariant` → default `ai`. A registry-driven version-selector IIFE persists on change, sets `data-resume-variant`, refreshes the download href, and re-fits.
- **`updateDownload()` is now version × mode × theme** — derives the PDF base name from the registry (`resume` / `resume-frontend`), so Normal+light → `<file>-light.pdf`, Normal+dark → `<file>-dark.pdf`, ATS → `<file>-ats.pdf`. The blob download reads the per-version filename from the registry.
- **`tools/build-resume-pdf.mjs`** wraps its render logic in a `for (const version of VERSIONS)` loop (VERSIONS mirrors the page registry's slug + file), seeding `localStorage.resumeVariant` alongside theme/resumeMode, emitting **N×3 = 6** PDFs and reusing the existing ATS full-bleed one-tall-page handling per version. **All 6 regenerated** this session (`PUPPETEER_CACHE_DIR=%USERPROFILE%\.cache\puppeteer`, unsandboxed).

### Verified
- Headless render of **all 8 combos** (version {ai,frontend} × mode {normal,ats} × theme {light,dark}): correct visible content per version (only the active `.rv-*` blocks render), the download-button `href` matches the version×mode×theme matrix, dropdown options/selection correct, **no console errors** (only the expected off-domain Cloudflare beacon `ERR_FAILED`, ignored).
- Build tool: all 6 PDFs — posters `pageRanges:'1'` (1 page), light bg `rgb(243,239,231)` / dark bg `rgb(17,17,19)`; ATS one tall cream page (`rgb(243,239,231)`), Atkinson embedded. Frontend poster 2480×3067, AI poster 2480×3695.
- Per-PDF-render DOM check: the new email is present in all 6, AI PDFs show AI framing, frontend PDFs show frontend framing **and none of the invented AI numbers**. (A proper PDF text-extractor install was auto-blocked; the poster fonts are hex-glyph-subsetted so raw stream scraping can't read them — verified instead via the exact DOM each PDF renders from, which is faithful, plus the build tool's page/bg checks.)

### Notes
- `node --check tools/build-resume-pdf.mjs` passes. AI PDFs show as *modified* in git (re-rendered; byte-identical content); the 3 frontend PDFs are new. Left **uncommitted** for review.

## 2026-08-18 — Contact email + ATS default mode

### Changed
- **Email updated everywhere** from `sai_dhruv@hotmail.com` to **`saidhruvakv@outlook.com`**: `index.html` (JSON-LD `email`, contact `mailto:` link + visible text, copy-button `data-email`) and `resume/index.html` (Normal + ATS contact lines, `mailto:` + text). The `twitter.com/sai_dhruv` handle is unrelated and left unchanged.
- **All three résumé PDFs regenerated** (`resume/resume-light.pdf`, `resume-dark.pdf`, `resume-ats.pdf`) via `tools/build-resume-pdf.mjs` so the downloads carry the new email (verified present in the ATS PDF; light/dark render checks passed).
- **ATS is now the default résumé mode.** `/resume` opens in ATS unless the visitor previously chose Normal — head bootstrap flips to `(rm === 'normal') ? 'normal' : 'ats'` (so absent/`ats` → ATS), and the `currentMode()` / `updateDownload()` / `fit()` fallbacks changed `|| 'normal'` → `|| 'ats'`. Normal stays one click away on the toggle and, once chosen, persists.

### Build note
- Puppeteer lives in the **home** `node_modules` (not the project — repo stays dependency-free; `npm i puppeteer` reported "up to date" and created no project manifest). In this environment Puppeteer's cache pointed at an empty temp dir, so the build needs `PUPPETEER_CACHE_DIR=%USERPROFILE%\.cache\puppeteer` (which already holds the matching Chromium build). Terminal also requires running outside the sandbox on this machine.

## 2026-07-09 (later) — Footer background + résumé poster polish

### Changed
- **Main-site footer** now uses the same background as the topbar — translucent paper (`color-mix(in srgb, var(--paper) 82%, transparent)`) + `backdrop-filter: blur(10px)` (`.footer` in `index.css`). Theme-aware via `--paper`; lets the drafting grid show through like the header does.
- **Résumé Normal poster scaled to 75% of the viewport width** (was the full available width). `fit()` in `resume/index.html` multiplies `innerWidth` by `WIDTH_FRACTION = 0.75`; the poster stays centered in `.stage`. ATS mode and the mobile reflow are unaffected.

### Added
- **Paper drop shadow on the résumé** (screen-only, mimics a physical sheet). Two-layer `box-shadow` on the Normal poster's `.scaler` (theme-aware via `light-dark()`; applied to the screen-space scaler, not the `scale()`-transformed `.sheet`, so it isn't distorted) and on the ATS `.doc` (fixed always-light values). Excluded from the downloadable PDFs — `tools/build-resume-pdf.mjs` NEUTRALIZE (posters) and the ATS print override now set `box-shadow: none`. Deliberate résumé-only exception to the site's usual no-shadows rule.

## 2026-07-09 — Résumé consolidated: Normal ⇄ ATS mode toggle on /resume (removed /resume/ats)

### Changed
- **Merged the two résumés into one page.** `/resume` now has a **Normal | ATS segmented toggle** in the top bar; it shows either the branded poster (Normal) or the accessible single-column Atkinson document (ATS). Mode persists to `localStorage.resumeMode` (head bootstrap seeds `data-resume-mode` before paint, so no flash). Both the poster `.sheet` and the ATS `.doc` live in `resume/index.html`; CSS shows/hides by `:root[data-resume-mode]`. The ATS `.doc` styles are scoped (colliding classes renamed `.doc-spec` / `.doc-contact` / `.doc-summary`) so poster CSS doesn't leak. The `fit()` scaler is mode-aware (skips when the poster is hidden; re-runs when switching back to Normal).
- **Download button now picks the PDF from mode + colour** via a central `updateDownload()`: Normal+light → `resume-light.pdf`, Normal+dark → `resume-dark.pdf`, ATS → `resume-ats.pdf` (always the cream Atkinson one). Absolute `/resume/…` paths; blob download with forced filename kept.
- **`tools/build-resume-pdf.mjs`** renders all three PDFs from `/resume/` by seeding `resumeMode` (+ theme): posters via `normal` (screen media, native poster size), ats via `ats` (print media, one tall page). Also stretches the cream `.doc` to `min-height: <page-height>` so the trailing ~2mm **dark colour-scheme canvas strip** at the bottom is never exposed (verified via pdf.js: cream top-to-bottom, only a 1px AA edge).

### Removed
- **`/resume/ats` page** (`resume/ats/index.html`) — superseded by ATS mode on `/resume`; `/resume/ats/` now 404s.

### Print
- **Anti-print in BOTH modes** — printing (Ctrl+P) in Normal *or* ATS mode shows the "designed for screen · save paper · read it at sdkv.in" notice, never the résumé. The offline build tool (`tools/build-resume-pdf.mjs`) injects a print-media override that re-reveals the ATS document so `resume-ats.pdf` is still generated full-bleed (poster PDFs use screen media, unaffected). The build's sanity check now reads the `.sheet` background rather than `body` (the résumé `body` is transparent so the grid shows through). Verified: both modes → `notice=flex, stage=none`; all three PDFs still 1 page with correct backgrounds.

### Fixed
- **Top-bar wordmark centering** — `.rz-bar` was `flex` + `justify-content: space-between`, so the wordmark only centered when the Back and actions sides were equal width (they aren't — the mode+theme+download cluster is much wider, pushing it left). Switched to a 3-column grid `1fr auto 1fr` (Back `justify-self:start`, wordmark `center`, actions `end`) — matches the main site's centered-wordmark pattern; verified 0px offset at desktop width.
- **Résumé page footer added** — the site footer (`© <year> Sai Dhruva K V` + "Designed to discourage printing · Save Paper · Save Trees") now renders below the résumé on `/resume` in both modes (`.rz-foot`, matches the main site `.footer`); hidden in print; year set by JS.
- **Drafting-grid background blanked while scrolling (main site)** — `js/backgrounds.js` transformed `#bg-grid` itself, but that element is the `position:fixed; overflow:hidden` clip window, so the parallax `translate` moved the clip and exposed a blank strip (up to ~1 grid period ≈ 400px) at the viewport edge during scroll. Fix: apply the parallax to the grid PATTERN (`#bg-grid::before`) via `--bg-x`/`--bg-y` custom properties; `#bg-grid` is never transformed (clip stays pinned to the viewport). Verified: `#bg-grid` `transform:none`, covers the full viewport while scrolled, pattern still parallaxes (`--bg-y` updates).

### Added
- **Drafting-grid background on the résumé page** — the same `#bg-grid` layer + parallax as the main site, added to `resume/index.html` (inline CSS mirroring `index.css`, plus a small inline parallax IIFE mirroring `backgrounds.js`, both using the `--bg-x/--bg-y`-on-`::before` approach). The résumé `body` background is now transparent (paper fill stays on `<html>`) so the grid shows through; it's visible in the margins around the poster (Normal) and around the cream card (ATS), hidden in print and excluded from the poster-PDF build (`#bg-grid` in NEUTRALIZE). Reduced-motion → static grid (no rAF).

## 2026-07-09 — Accessible/ATS résumé at /resume/ats (single-column, Atkinson-only)

### New
- **`/resume/ats` is a static route** (`resume/ats/index.html`) — a **parser-friendly, single-column, semantic** résumé: `<h1>`/`<h2>`/`<h3>`, real `<ul>` bullets, standard section order (Professional Summary → Core Competencies → Technical Skills → Professional Experience → Education → Languages). Same content as the branded résumé. Rewritten from scratch (dropped the transform-scale poster + two-column rail/main), so text is normal-flow, resizable, and reflows on mobile.
- **Atkinson Hyperlegible is the only font in the résumé document** (accessible face) — self-hosted latin woff2 (400/700 + italics) in `fonts/atkinson-*.woff2` (`../../fonts/`). The **top bar keeps the original chrome faces** (Italiana wordmark + JetBrains Mono for Back/Download), matching `/resume`. Audited: `.doc` is Atkinson-only (no Fraunces/Italiana/JetBrains inside the document).
- **Document is always light** (cream `#f3efe7`, ink `#16140f`, red `#e8472b` accents) as a centered card; the **top bar/chrome still follows the site theme** (Back · wordmark · theme toggle · Download). Section rules, category labels, and bullet dashes use the red accent for a subtle brand tie-in (colour doesn't affect parsing).
- **`resume/resume-ats.pdf`** is a **single tall page — 210mm × content height, NO page breaks** (per request) — cream edge-to-edge, Atkinson. The page's `@media print` drops the top bar and renders the doc full width. Download button serves `/resume/resume-ats.pdf` (filename "Sai Dhruva K V - Resume.pdf").

### Changed / Removed
- Consolidated the same-day iterations: removed the `?mode=ats` query-param redirect and the plain-Arial `resume/ats.html`, and replaced the short-lived two-column **poster-mirror** `/resume/ats` (per "make it as parser-friendly as possible, Atkinson-only") with this single-column version. The ats PDF also went A4-multi-page → **one tall page** (user asked for no page breaks).
- `tools/build-resume-pdf.mjs` renders `resume-ats.pdf` from `/resume/ats/` as **one tall page**: it emulates print media, measures the print-layout `.doc` height, then overrides `@page { size: 210mm <h>mm; margin: 0 }` and renders with `preferCSSPageSize: true` (the CSS-`@page` path fills the cream background; puppeteer's `width`/`height` option instead exposed Chromium's dark canvas). Still emits all three PDFs and reports `atkinson`. Verified via pdf.js: `numPages: 1`, all corners `rgb(243,239,231)`.

### Fixed
- **`/resume/ats` Download button** — the href was **relative** (`../resume-ats.pdf`), which resolves to `/resume-ats.pdf` (404) when the page is opened at `/resume/ats` **without a trailing slash** (as `dev` `serve` serves it, in place with no redirect). Changed to an **absolute** path `/resume/resume-ats.pdf` (href + JS fallback), so it resolves correctly regardless of trailing slash and on GitHub Pages. (The stylized `/resume/` download uses the same relative pattern but is normally reached with a trailing slash / GitHub Pages' directory redirect, so it works; can be made absolute too if desired.)
- **`resume-ats.pdf` had black page margins.** Chromium bakes a **dark `color-scheme` canvas** into the PDF (root is `light dark` for the top bar). Neither `color-scheme: only light` nor root-background propagation covered the `@page` margin area — verified with a pdf.js raster onto a magenta base that the margins were literally `rgb(18,18,18)` (Chrome's own PDF viewer had masked this by compositing on a light background). **Real fix:** paint a cream rectangle over the whole sheet — `@media print` uses `@page { margin: 0 }` with cream `html/body/.doc` and insets the text via `.doc { padding: 16mm }`; the build renders with `preferCSSPageSize: true` (+ light media emulation). pdf.js now samples the page background as `rgb(243,239,231)` (cream) edge-to-edge on every page. (Middle-page top/bottom spacing comes from section/job margins + `break-inside: avoid`.) `tools/build-resume-pdf.mjs` ats block updated accordingly. Lesson: verify PDF output with pdf.js rasterization, not a browser's PDF viewer.

## 2026-07-08 — Résumé: ATS PDF + theme-dynamic download + dark-PDF render fix

### New
- **ATS-friendly résumé** — `resume/ats.html`: a plain, single-column, black-on-white document in a standard system font (Arial/Helvetica), with real `<h2>` section headings, `<ul>` bullet lists, and no graphics/columns/colour so applicant-tracking parsers read clean linear text. Same content as the branded résumé (Summary, Highlights, Core Competencies, Technical Skills, Experience, Education, Languages). Rendered to **`resume/resume-ats.pdf`** (A4, ~3 pages, real print pagination, `break-inside: avoid` per role). `noindex` + `format-detection` off so nothing is auto-linked/coloured.
- **`tools/build-resume-pdf.mjs` now also emits `resume-ats.pdf`** and is **self-serving** — it starts an in-process static server (no separate `npx serve` needed) and has a built-in sanity check that logs the rendered `body` background per mode and flags `WRONG` if it doesn't match the requested colour.

### Fixed
- **Dark PDF was rendering light.** The build set `emulateMediaFeatures(prefers-color-scheme)` and then called `emulateMediaType('screen')`, which *resets* the colour-scheme feature — so both poster PDFs resolved the `light-dark()` tokens to light (identical byte size, only PDF metadata differed). The build now **drives the résumé's own theme** by seeding `localStorage.theme` (via `evaluateOnNewDocument`), so the page sets an explicit inline `color-scheme`, and sets media type + colour-scheme in **one** `Emulation.setEmulatedMedia` CDP call. Verified: light `body-bg rgb(243,239,231)`, dark `body-bg rgb(17,17,19)`; files now genuinely differ.
- **Download button is now theme-dynamic end to end.** `applyTheme()` in `resume/index.html` keeps `#dl-btn`'s `href` in sync with the theme (`resume-dark.pdf` / `resume-light.pdf`) on load, on every toggle, and on OS change; the blob-download handler reads that href as the single source of truth (still forces the filename "Sai Dhruva K V - Resume.pdf"; falls back to navigating to the href). Previously the href was hard-coded to the light PDF, so a stale/cached page could download light in dark mode. E2E-verified in headless Chrome (light → light bytes, dark → dark bytes, correct filename).

## 2026-07-08 — Résumé published: Contact button + anti-print + download-only PDF

### New
- **Contact "Résumé →" link** in `index.html` — an accent-red pill (last item in the social row) that opens the branded résumé page (`resume/`) in a new tab. New `.social-accent` style in `index.css`.
- **Résumé page is now public** (`resume/index.html`), keeping its **anti-print** swap (Ctrl+P / browser print shows the "designed for screen — save paper — read it at sdkv.in" notice, not the résumé).
- **Download PDF button** on the résumé page (screen-only, hidden in print) — the ONLY sanctioned way to get a copy. JS fetches the PDF as a blob and saves it as **"Sai Dhruva K V - Resume.pdf"** (blob download forces the filename regardless of the server's `Content-Disposition`), choosing the light or dark PDF to match the viewer's `prefers-color-scheme`.
- **`resume/resume-light.pdf` + `resume/resume-dark.pdf`** — the downloadable PDFs, rendered from the actual résumé page (`resume/index.html`) at its **native poster page size** (a single ~2480×3695px page each) in each colour mode, so the download matches the on-screen styling and light/dark. Built by **`tools/build-resume-pdf.mjs`** (offline Puppeteer; screen media to bypass the anti-print swap; run manually when content changes; not deployed runtime). (An earlier clean-A4 `pdf.html`/`resume.pdf` approach was replaced per user request to render the HTML as-is.)
- **Mobile fallback** on the résumé page: below ~700px it reflows the scaled poster into a readable single column.
- **Résumé header bar** (fixed, blurred): a **Back** link (→ `/`), the Italiana **wordmark**, a **theme toggle** (System → Light → Dark, persisted to the shared `theme` key, repaints the SD favicon, kept in sync with the main site), and the **Download PDF** button (moved into the header). The résumé page also now honors the saved theme (and paints a theme-aware SD favicon it previously lacked), so it matches the site's light/dark instead of only following the OS.

### Notes
- Accepted tradeoff: the anti-print only protects the web page; once someone clicks Download, that PDF is a normal printable file. The Download button is simply the single path to a copy.
- This shelved the earlier explorations (gated/encrypted "vault" + serverless-for-free) — the user chose a simple public résumé with anti-print + download instead.

## 2026-07-06 — Résumé: expanded AMD/FINEOS + sidebar/main restructure

### Changed
- **Expanded & fine-tuned** the AMD (9→11 bullets) and FINEOS (5→7 bullets) experience entries in `resume/index.html` — stronger lead verbs, player-coach leadership + AI framing, outcome-first wording; wove in the measured outcomes. Team sizes later filled (AMD ~30, FINEOS ~20); the FINEOS personalization clause made qualitative ("measurably lifting user engagement and conversion"). No placeholders remain.
- **Restructured the layout for clean information flow with no blank gaps** (final structure): full-width masthead → a **sidebar + main** body. Left rail (`.rail`): Professional Summary, "At a glance" + "Measured outcomes" metrics, Core Competencies, Technical Skills, Education, Languages. Right main (`.main`): Experience, all roles top-to-bottom. The **sheet is content-sized** now (`--sheet-w` 2480px, `height: auto` — no forced page height, so no blank before the footer). The rail uses `align-items: stretch` + `flex-direction: column; justify-content: space-between` so it fills to the experience column's height (verified rail == main == 2848px; sheet 3695px; no clipping/console errors). Auto-scales to any viewport, honors OS light/dark, anti-print swap intact (`@page A2`).
- Progression this session: fixed-A0 magazine layout (two-column experience + 3-col lower band) was built and fit A0, then **replaced** with the sidebar/main content-sized layout above for clearer flow and even fill (per user feedback about blank space).

## 2026-07-06 — Metrics refresh (résumé + site)

### Changed (user-supplied metrics)
- **Summary / "at a glance" metrics** (both the résumé summary band and the site About count-up grid): 10+ years leading at enterprise scale, 8+ years of AI/ML platform ownership, 10+ organizations shaped, 20+ technologies delivered. (Site About dropped "Languages spoken" and "Companies shaped (5)" to make room; languages still listed on the résumé.)
- **Measured outcomes** (résumé summary "Measured outcomes" row + site Impact section, now a 2x2 grid of 4): 100% AI-coded products delivered, ~67% less development time using AI, ~95% fewer critical errors (Playwright + AI), ~40% faster delivery with AI solutioning.
- Résumé summary band restructured into two labeled rows ("At a glance" + "Measured outcomes"), 4 each. Site `.impact` grid changed from 3-col to 2-col.

### Removed
- Old impact items (30x benchmark, 6.5 yrs, WCAG, 20% TTM, agentic-AI patterns, LLM product) and the résumé's old 3-metric band (10+/30x/20%). This also retires the unsupported "30x" figure (the "one month → under four days" math is ~7–8x, not 30x).

## 2026-07-05 — Branded résumé (standalone, not deployed)

### New
- Added `resume/index.html` — a self-contained branded résumé in the site's Kinetic Editorial language (Fraunces display, Italiana "SD" mark, JetBrains Mono metadata, red accent, film-grain, hairline rules). Reuses the repo's `../fonts/` woff2; honors OS light/dark via `light-dark()` tokens.
- Rendered as a literal **A1 sheet** (2245×3179px) that auto-scales to fit the viewport (`--s` set by a tiny resize script; `.scaler`/`.sheet` transform pattern). Editorial two-column layout: masthead + summary + red metric highlights, Experience (all roles), and a rail (Core Competencies, Technical Skills, Education 2015, Languages).
- **Anti-print by design** (on-brand with "Save Paper. Save Trees."): `@page { size: A1 }` won't fit normal printers, and `@media print` hides the sheet and shows a full-page "This résumé is designed for screen — save paper, read it at sdkv.in" notice. Verified the print PDF carries only the notice (no résumé content leaks). Not true DRM (screenshots/save-page bypass) — deliberate strong discouragement.

### Status
- Independent artifact: NOT linked from `index.html`, NOT committed, NOT deployed. Built for preview; site integration (`/resume` page + nav link) is a separate pending task.

## 2026-07-03 — Drafting-grid background

### New
- Added a subtle drafting-grid background layer (`#bg-grid`): three tiers of hairlines (fine cells every `--cell` = `clamp(22px,2.4vw,34px)`, mid rules every 4 cells, bold major every 12) in the theme-aware `--line` token, behind all content at `z-index:-1` (paper fill moved from `body` to `<html>`). Drifts toward the cursor and has a continuous scroll parallax (moves at ~18% of scroll, wrapped seamlessly by the 12-cell period) via a new `js/backgrounds.js` (`Backgrounds` IIFE — one lerped RAF, passive listeners, `visibilitychange` pause, reduced-motion bail). Wired into `Main.init()`.

### Process
- Explored 3 concepts (animated grain, ghost kinetic type, drafting grid) built as shippable, token-gated (`html[data-bg]`) layers with a temporary `?preview` switcher. User chose the grid and dropped the animated grain (didn't add enough over the existing static film grain).

### Removed
- The animated-grain and ghost-type concepts (CSS + DOM), the `data-bg`/`data-force-reduce` token machinery, and the preview harness `js/bg-preview.js`. The grid now renders unconditionally.

## 2026-07-01 — og.png social card

### New
- Added `og.png` (1200×630) — the OG/Twitter card meta already referenced it but the asset was missing. Designed in the Kinetic Editorial language: cream paper, Fraunces heavy display "AI & Technology" + red italic "Leader.", JetBrains Mono metadata ("SDKV.IN", "// PORTFOLIO — 2026", "Consulting Architect @ AMD"), editorial hairline + strong rule, name + tagline footer.
- Added `og:image:width`, `og:image:height`, and `og:image:alt` meta to `index.html` for cleaner unfurls.

### How
- Authored as an SVG and rendered to PNG with a one-off `@resvg/resvg-js` run (in a temp dir, using the project's font files as variable TTFs). No dependency added to the repo.

## 2026-07-01 — Self-hosted fonts + real favicon set

### Self-hosted fonts (removed Google Fonts CDN)
- Added `fonts/` with latin-subset woff2: `fraunces-latin.woff2` (roman variable 300–900), `fraunces-italic-latin.woff2`, `jetbrains-mono-latin.woff2` (variable 400–500), `italiana-latin.woff2` (400).
- Added `@font-face` blocks at the top of `index.css` with `font-display: swap`.
- Removed the two `preconnect` links and the Google Fonts `<link>` from `index.html`; added `<link rel="preload">` for `fonts/fraunces-latin.woff2`. No runtime request to `fonts.googleapis.com` / `fonts.gstatic.com` anymore (privacy + one fewer external dependency). All three families are OFL-licensed.

### Real favicon / app icons
- Generated from the existing "SD" Italiana monogram (`S_PATH`/`D_PATH`): `favicon.ico` (16/32/48), `apple-touch-icon.png` (180, padded), `icon-192.png`, `icon-512.png` (padded), plus `site.webmanifest`.
- Added `<link>` tags for the `.ico`, apple-touch-icon, and manifest. The existing JS-animated inline SVG data-URI favicon stays the primary `rel="icon"` for capable browsers; the raster files are fallbacks for Safari/iOS/older browsers that don't render (animated) SVG favicons.
- Icons generated via a one-off `sharp` + `png-to-ico` script run in a temp dir (no dependency added to the repo).

## 2026-07-01 — sitemap.xml + robots.txt

### New
- `sitemap.xml` at repo root — single URL (`https://sdkv.in/`) with `lastmod`, `changefreq`, `priority`.
- `robots.txt` at repo root — allows all crawlers and points to the sitemap.

## 2026-07-01 — Cloudflare Web Analytics

### New
- Added Cloudflare Web Analytics beacon (`static.cloudflareinsights.com/beacon.min.js`, deferred) just before the JS module tags in `index.html`. Cookieless and privacy-first, so no consent banner is required. Token: `1c2c924612d349f7b9bf26b846779ffa`.

### Context
- Chosen over paid Plausible/Fathom for the free, privacy-friendly tier. Site is on GitHub Pages (not proxied through Cloudflare), so the manual beacon + token approach is used rather than automatic injection.

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
