# Tasks

## Backlog

- [ ] "Projects" section — freelance / side projects case studies

## In Progress

- [ ] **Résumé version axis + Frontend Architect variant** (built & verified locally 2026-09-04; NOT committed). Added a scalable, registry-driven **version** axis to `/resume` (orthogonal to Normal|ATS mode and theme) via a **"Tailored for: <Version> ▾" dropdown** built from `RESUME_VERSIONS` (single source of truth; default `ai`). Shipped a **Frontend Architect** version (design systems / component & state architecture / performance / a11y; real facts only, AI-specific numbers dropped, leadership retained) as parallel `.rv-frontend` blocks alongside the verbatim `.rv-ai` content, in both the Normal poster and the ATS doc. Head bootstrap sets `data-resume-variant` pre-paint (`?variant=` → localStorage → default). `updateDownload()` derives the PDF from version×mode×theme; frontend download filename is "Sai Dhruva K V - Frontend Resume.pdf". `tools/build-resume-pdf.mjs` loops the registry to emit **6 PDFs** (`resume-{light,dark,ats}.pdf` + `resume-frontend-{light,dark,ats}.pdf`); all regenerated. Verified all 8 combos (content, download hrefs, no console errors), all 6 PDFs (1 page, backgrounds, email, framing). Future version = 1 registry entry + 1 `.rv-<slug>` block in poster & doc + 1 slug in the build tool.
  - **Selector redesigned (2026-09-04 later):** the "Tailored for" native `<select>` is now an **adaptive edition picker** — popover on desktop, bottom sheet on mobile — that also houses the Normal|ATS Format toggle; top bar reduced to `[Edition ▾] · theme · Download`. Panel is body-level (escapes the header `backdrop-filter`). Pure UI refactor (no content/PDF/build changes); verified headless 48/48.
  - **Picker finalized + discoverability (2026-09-09):** relocated the picker into a dedicated red "EDITION —" strip below the top bar; menu flush/borderless/left-anchored (scrollbar-safe) + equal width; frosted-glass backdrop (content-only desktop / full-cover mobile); sequenced ~250ms animation (blur → roll-down/spring-up) with reverse dismiss; **`--ease`/`--ease-out` defined in the résumé `:root`** (were undefined → transitions ran instantly). Discoverability: **auto-reveal on every visit** (no focus steal), inline **"Also available: <edition> →"** (poster + ATS), homepage **"AI & Frontend editions"** hint. Built in an isolated mock then ported to `resume/index.html`; verified 38/38 + 6/6, 0 console errors. Also touches `index.html` + `index.css` (homepage hint). (Base feature — version axis + Frontend edition + adaptive picker — was committed in `d2c4f4d` on Sep 8; this Sep 9 refinement commits on top.)
- [ ] Résumé publish (built & verified locally; NOT yet committed/deployed — pending review/commit). Added a **"Résumé →"** accent-red pill (last in the Contact social row; `index.html` + `.social-accent` in `index.css`) opening the branded résumé page (`resume/index.html`) in a new tab. The page keeps its **anti-print** swap (Ctrl+P → "designed for screen" notice); a **Download button is the only way to get a copy** — JS blob-downloads (forces the filename **"Sai Dhruva K V - Resume.pdf"**) the branded poster PDF matching the viewer's light/dark mode: `resume/resume-light.pdf` / `resume/resume-dark.pdf`, rendered at **native poster page size** from `resume/index.html` via `tools/build-resume-pdf.mjs`. Added a readable mobile single-column fallback. Verified: button, download (light + dark), anti-print swap, mobile — no console errors.
  - Header bar added: Back (→ /), Italiana wordmark, theme toggle (System/Light/Dark, synced via the shared `theme` key + repaints the SD favicon), and the Download PDF button. Résumé now honors the saved theme and has a theme-aware favicon (previously it only followed OS and had no favicon).
  - **Download button made theme-dynamic** — `applyTheme()` keeps `#dl-btn`'s `href` in sync (`resume-dark.pdf`/`resume-light.pdf`) on load/toggle/OS-change; blob handler uses that href (single source of truth). Fixes stale-cache downloads always serving light. E2E-verified in headless Chrome.
  - **Dark PDF render fixed** — build was resolving `light-dark()` to light for both files (puppeteer `emulateMediaType` reset the colour-scheme feature). Build now drives `localStorage.theme` + one `setEmulatedMedia` CDP call; verified dark `body-bg rgb(17,17,19)`.
  - **Résumé is ONE page with a Normal ⇄ ATS mode toggle** (`resume/index.html`): Normal = branded poster (Fraunces, theme-aware light/dark); ATS = accessible **single-column, Atkinson-only, always-light** document. Toggle persists to `localStorage.resumeMode` (head bootstrap seeds `data-resume-mode`). Download picks the PDF by mode + colour (Normal → `resume-light`/`resume-dark.pdf`; ATS → `resume-ats.pdf`, one tall cream page). Both layouts live in the page; ATS `.doc` classes scoped/renamed so poster CSS doesn't leak. Superseded (all removed): plain-Arial `resume/ats.html`, the `?mode=ats` redirect, the poster-mirror, and the standalone `/resume/ats` page.
  - `tools/build-resume-pdf.mjs` is **self-serving**; seeds `resumeMode` (+theme) and emits all three PDFs from `/resume/` (posters = screen/native size; ats = print/one-tall-page, cream `.doc` stretched to full page height so no dark canvas strip).
  - Tradeoffs: anti-print only protects the web page (a downloaded PDF is a normal file); PDFs are ~3.2MB each (grain overlay) — regenerate with the tool when content changes.
  - Committing this also ships earlier uncommitted work (drafting-grid background + metrics refresh), intermixed in `index.html`/`index.css`; pushing makes it all public on sdkv.in.
  - Superseded the earlier "gated/encrypted vault" + "serverless-for-free" explorations (dropped — see decisions/session-history).

## Completed (2026-09-16)

- [x] **Accessibility: fixed brand-red + faint color-contrast gaps** — darkened `--red` from `#e8472b` → `#c53016` (3.41:1 → 4.81:1 on `--paper`; same hue/saturation, ~10pt lower lightness) in `index.css` and both `resume/index.html` locations (the shared root token + the ATS `.doc`-scoped hardcoded fallback + the print-notice fallback). Dark-mode `--red` (`#ff6347`, ~6.4:1) was already compliant and left untouched. Separately found and fixed `--faint` (`#9a9486`/`#71717a`, 2.63:1 / 3.90:1 on paper) → `#6f6a5d`/`#85858e` (4.70:1 / 5.16:1) in both files — this one only surfaced after removing the previous blanket `.disableRules(['color-contrast'])` exclusion, and the dark-mode half was failing silently (no existing test scanned dark theme). Verified live via CDP color-override screenshots before locking in the red shade (user picked candidate A over a safer/darker candidate B). All 14 visual-regression baselines regenerated; axe-core `color-contrast` rule now runs unexcluded on both pages. Added dark-theme axe coverage (homepage + résumé, both modes) specifically to close the blind spot that let the dark-mode faint failure go undetected. See `decisions.md` for the full color-math reasoning and `architecture.md`/`changelog.md` for what changed.
- [x] **Two E2E test-flakiness bugs found and fixed while re-enabling the axe gate**: (1) résumé edition-picker's axe scan didn't call the existing `disableAutoReveal()` helper, letting the picker's silent auto-open race axe's scan and get sampled mid-CSS-transition (partial-opacity blended colors reported as phantom violations); (2) homepage's one-time ~2s intro fade-in (topbar nav links stagger from opacity:0→1) had the same race — fixed by emulating `prefers-reduced-motion: reduce` for that test (the site's own CSS already forces instant opacity:1 under reduced motion, matching the pattern used elsewhere in the suite). Also broadened the Cloudflare-beacon console-error filter from `net::ERR_FAILED` to `net::ERR_/i` after the sandbox's flaky DNS surfaced `net::ERR_NAME_NOT_RESOLVED` for the same benign cross-origin beacon failure.

## Completed (2026-09-15)

- [x] **E2E testing suite + CI** — Playwright-based functional + accessibility (axe-core) + visual-regression tests covering the homepage and résumé page, plus a PDF-build smoke/regression test, wired into a GitHub Actions workflow (push to `master` + PRs to any branch). Dev-tooling-only `package.json` (devDependencies: `@playwright/test`, `@axe-core/playwright`, `puppeteer`, `pdfjs-dist`) — live site stays zero-build/zero-dependency. 35 Playwright tests (verified 105/105 across 3 repeats, zero flakiness) + `tests/pdf/verify-pdfs.mjs` (runs `tools/build-resume-pdf.mjs`, verifies all 9 PDFs). 14 visual-regression baselines committed (2 homepage + full 3-edition×2-mode×2-theme résumé matrix = 12). See `architecture.md` (Testing & CI section) and `decisions.md` for the full breakdown, including the pre-existing color-contrast a11y gap this surfaced (fixed 2026-09-16, see above) and two real test-writing gotchas fixed along the way (résumé edition-picker's auto-reveal timer racing clicks; About-section counters needing an explicit scroll to trigger their own IntersectionObserver).

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
