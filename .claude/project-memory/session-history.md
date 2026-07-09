# Session History

## 2026-07-09 (evening) — Résumé: ATS mode, one-page consolidation, grid/footer/anti-print

**Summary:** Big résumé pass. Built an accessible **ATS** version, then consolidated everything into a single `/resume` page with a **Normal ⇄ ATS** mode toggle (removed the separate `/resume/ats` route the user briefly had), and rounded it out with the site's grid background, a footer, wordmark centering, and anti-print in both modes.

**ATS résumé + PDF (the hard part):** Built a parser-friendly single-column semantic doc (h1/h2/h3, real `<ul>` bullets), set entirely in **Atkinson Hyperlegible** (the accessible face; the top bar keeps Italiana + JetBrains Mono chrome), always light. The ATS PDF fought back: Chromium bakes a **dark `color-scheme` canvas** into `printToPDF` (root is `light dark` for the top bar), so the page **margins came out near-black** — and Chrome's own PDF viewer *masked* it by compositing on a light background (my early "it's cream" claim was wrong). Verified the truth with a **pdf.js raster onto a magenta canvas** (margins were literally `rgb(18,18,18)`). Real fix: paint a real cream rectangle over the whole sheet (`@page margin:0` + cream `body/.doc` + text inset via padding; `.doc { min-height }` so the trailing mm never expose the canvas). Then made it **one tall page, no breaks** (measure the print-layout height, override `@page { size: 210mm <h>mm }`, `preferCSSPageSize`). Lesson recorded: verify PDF output with pdf.js rasterization, never a browser's PDF viewer.

**Consolidation (the main ask):** Merged the standalone `/resume/ats` into `/resume`. The page now holds BOTH layouts (`.sheet` poster + `.doc` ATS, colliding classes renamed `.doc-spec/.doc-contact/.doc-summary`); a themed **Normal | ATS segmented toggle** in the top bar switches them, persisted to `localStorage.resumeMode` (head-bootstrapped, no flash). One combined script drives theme + mode + fit + download. **Download picks the PDF by mode + theme** (Normal light/dark → `resume-light/dark.pdf`, ATS → `resume-ats.pdf`), absolute `/resume/…` paths. `tools/build-resume-pdf.mjs` now emits all three PDFs from `/resume/` by seeding `resumeMode` (+theme). Deleted `resume/ats/`.

**Also this session:**
- **Download button 404** — the ATS href was relative (`../resume-ats.pdf`), which resolves to `/resume-ats.pdf` (404) when `/resume/ats` was opened without a trailing slash (dev `serve` serves it in place). Fixed with absolute paths.
- **Top-bar wordmark not centered** — `.rz-bar` was flex `space-between` (only centers when both sides are equal width); switched to grid `1fr auto 1fr` (0px offset at desktop).
- **Footer** added to `/resume` (both modes, matches main site, hidden in print, year via JS).
- **Drafting-grid scroll bug (main site)** — `backgrounds.js` transformed `#bg-grid` itself, but that's the `position:fixed; overflow:hidden` clip window, so scrolling shifted the clip and blanked a strip. Fixed by parallaxing the PATTERN (`#bg-grid::before`) via `--bg-x/--bg-y`; the container is never transformed. Then **added the same grid to `/resume`** (résumé `body` made transparent so the grid on `<html>` shows through; hidden in print/PDF build).
- **Anti-print in BOTH modes** — printing either mode now shows the "designed for screen" notice; the build injects a print override to still capture the ATS doc for the PDF.

**Verified:** headless screenshots of both modes × light/dark (correct layout/fonts/download href); pdf.js on all 3 PDFs (1 page each, correct backgrounds — light cream, dark, ATS cream top-to-bottom); anti-print `notice=flex, stage=none` in both modes; grid covers the full viewport while scrolled (`#bg-grid transform:none`).

**Env notes:** Puppeteer's Chromium kept getting evicted from the shifting sandbox cache dir; pinned `PUPPETEER_CACHE_DIR=C:\Users\sadhruva\puppeteer-cache` (outside the repo). Non-allowlisted shell needs `required_permissions:["all"]`. **All uncommitted**; preview server on `:4324`.

## 2026-07-09 (later) — Footer + résumé UI polish

**Summary:** Small polish pass alongside a résumé ATS-score review. UI changes: (1) gave the main-site footer the topbar's translucent-paper + `blur(10px)` background (`.footer` in `index.css`); (2) scaled the résumé Normal poster to 75% of the viewport width (centered) instead of full width (`WIDTH_FRACTION` in `resume/index.html`'s `fit()`); (3) added a two-layer paper drop shadow to the résumé — Normal `.scaler` (theme-aware `light-dark()`) and ATS `.doc` (always light) — and set `box-shadow: none` in `tools/build-resume-pdf.mjs` (NEUTRALIZE + ATS print override) so downloaded PDFs stay flat.

**Also this session (no code):** reviewed the résumé for ATS — produced a scorecard canvas (`canvases/resume-ATS-analysis.canvas.tsx`, ~76/100 for the PDF/`AI & Technology Leader` version) and drafted paste-ready fixes (flatten multi-column Skills, remove the `/301225` footer artifact, rename "Introduction" → "Professional Summary", add city, relabel the overlapping freelance dates, add graduation year). Clarified for the user that the only timeline note was the freelance overlap, not graduation (2015 grad is consistent).

**State:** these three tweaks were the ones missing from project memory when the user asked if context was saved — recorded now. Still uncommitted; couldn't verify live git state (terminal returned no output this session).

## 2026-07-08 — Résumé published (Contact button + anti-print + download-only PDF)

**Summary:** Explored gating the résumé (encrypted "vault" chunks on GitHub + questionnaire + unique 10-char PDF password + email evaluation), then how to do it serverless-for-free (Cloudflare Workers 100k/day but 10ms CPU; Vercel/Netlify free functions for real server-side assembly; Resend free 3k/mo for email — MailChannels free is dead). **User dropped all of that** ("never mind all these") in favor of a simple public résumé.

**Built (final):** a **"Résumé →"** accent-red pill (last in the Contact social row; `.social-accent`) opening `resume/` in a new tab. Kept the résumé page's **anti-print** swap; made a **Download button the only way to get a copy** — JS blob-downloads it as **"Sai Dhruva K V - Resume.pdf"** (a blob download forces the filename past the server's Content-Disposition), choosing the PDF matching the viewer's light/dark mode. The downloadables are `resume/resume-light.pdf` + `resume/resume-dark.pdf`, rendered from the actual résumé page at its **native poster page size** in each colour mode via `tools/build-resume-pdf.mjs` (Puppeteer, screen media to bypass the anti-print swap). Added a mobile single-column fallback.

**Iterations:** started with a clean-A4 PDF (`pdf.html`/`resume.pdf`); switched per user request to rendering the HTML as-is at native poster size in both modes (A4 files removed). Fixed the download filename — the dev server's `Content-Disposition: inline; filename="resume.pdf"` overrode the `download` attribute, so moved to a blob download. Moved the Résumé link into the social row and recoloured it to the accent (kept the arrow).

**Verified:** Contact pill present; print emulation shows the notice + hides the sheet; mobile readable; light + dark PDFs generated and differ (dark render confirmed dark); download picks by `prefers-color-scheme`; zero console errors. **NOT yet committed/deployed** — user is reviewing first. A pending broad commit would also bundle the earlier uncommitted drafting-grid background + metrics-refresh work (intermixed in the same files).

**Header + theme (added after the download work):** user reported the résumé download/page not matching dark mode. Root cause: the résumé page only followed the OS, not the site's theme toggle. Fixed by having the résumé read the shared `localStorage['theme']` (bootstrap applies it early; download resolver + favicon use it). Then, per request, added a **fixed header** to the résumé page: Back (→ `/`), Italiana wordmark, a full **theme toggle** (System/Light/Dark, cycles like the main site, persists, repaints a theme-aware SD favicon the page previously lacked), and the Download button moved into it. Verified via headless: toggle cycles + persists + flips sheet bg and favicon; back href `/`; download picks by mode; print hides the header; no console errors. (Much of the earlier "download gives light in dark mode" back-and-forth was the user viewing a stale résumé tab / OS-vs-toggle mismatch — the in-page toggle now makes theme control explicit on the résumé itself.)

**Env notes:** fresh environment (OS build changed) re-downloaded Puppeteer's Chromium (~6 min). `npx serve` / node still need `required_permissions:["all"]`. Session briefly reverted to plan mode mid-execution; switched back to agent to finish.

## 2026-07-06 (latest) — Résumé: filled metrics + sidebar/main restructure

**Summary:** Filled the remaining placeholders (AMD ~30, FINEOS ~20 team sizes; dropped the FINEOS engagement/conversion percentages → "measurably lifting user engagement and conversion" — no placeholders remain). Then, on user feedback that the A0 magazine layout had "a lot of blank spaces" and didn't "follow a well-defined flow," restructured it.

**New structure (chosen by user from options):** sidebar + main, sheet **content-sized** (not a fixed standard page). `--sheet-w` 2480px, `.sheet` `height: auto` (removed min-height) → height flows to content, so no forced blank before the footer. Full-width masthead → `.body` grid `1fr 2.25fr`: left `.rail` (summary, "at a glance" + "measured outcomes" metrics, competencies, skills, education, languages) + right `.main` (experience, all roles top-to-bottom). Removed the rail's inter-section rules; rail is a flex column with `align-items: stretch` (on `.body`) + `justify-content: space-between` so it distributes to exactly match the experience column height. Verified rail == main == 2848px (perfectly balanced, diff 0), sheet 3695px, light+dark, zero console errors. Anti-print swap retained (`@page A2`).

**Why content-sized (not A0):** the fixed A0 page forced blank space (content shorter than the page) and uneven columns; letting the sheet flow + balancing the two columns removes both. Anti-print no longer depends on page size (the `@media print` swap handles it).

## 2026-07-06 (later) — Résumé: expand AMD/FINEOS + reorganize to A0

**Summary:** Two-phase résumé work. Phase 1 (delegated to a background worker during Multitask Mode): expanded/fine-tuned AMD (9→11) and FINEOS (5→7) bullets with leadership+AI framing, leaving placeholders for real figures. Phase 2 (this turn): reorganized the résumé from the old A1-width single-column layout (which overflowed) into a **true A0 magazine page**.

**A0 reorg details:** `--sheet-w/h` → A0 (3179×4494px); `@page` → A0; JS `SHEET_W` → 3179. New layout: masthead → `.summary-grid` (prose + the two metric groups side-by-side) → `.xp-list` (Experience as CSS 2-column multicol, `break-inside: avoid` per `.role`) → `.lower` (3-col band: Competencies · Technical Skills · Education/Languages). First pass overshot A0 by 383px (offsetHeight 4877); tightened type/spacing/padding and re-measured to **exactly 4494 (fits, no clipping)**. Balances well: AMD+FINEOS fill the left experience column, the four shorter roles the right.

**Verification:** used a headless Chrome (Puppeteer) render to measure `sheet.offsetHeight` vs A0 and screenshot light+dark — this was justified as the core "does it fit a standard page" check (earlier a tangential screenshot got auto-review-blocked). Preview server still on `:4324`.

**Still open:** placeholders need the user's real numbers (`[team size]` ×2, FINEOS engagement/conversion `~[X]%`/`~[Y]%`); and the "put it on sdkv.in as /resume" step remains a separate task. Not committed/deployed.

## 2026-07-06 — Metrics refresh + résumé fixes

**Summary:** Proposed a "top 20 metrics" list (canvas `canvases/resume-metrics.canvas.tsx`) for the professional summary; flagged that the site/résumé "30x" benchmark figure isn't supported by the "one month → under four days" math (~7–8x). User picked a new metric set and asked to apply it to both the résumé and the main site.

**Applied (user-supplied):**
- At-a-glance metrics (résumé summary band + site About count-up): 10+ yrs leading, 8+ yrs AI/ML platform ownership, 10+ organizations shaped, 20+ technologies delivered. (Site About dropped Languages + the old "Companies 5".)
- Measured outcomes (résumé "Measured outcomes" row + site Impact, now 2×2): 100% AI-coded products, ~67% less dev time (AI), ~95% fewer critical errors (Playwright+AI), ~40% faster delivery (AI solutioning). Old impact items + the 30x figure retired.
- Résumé summary prose trimmed (dropped the benchmark clause; ends "measurable business value").

**Also this session (earlier):** removed the Certifications section from the résumé (renumbered //05 Education, //06 Languages); put the name on one line; fixed a real A1-sheet clipping bug (sheet was fixed-height with overflow:hidden → switched to min-height + JS-measured scaler so nothing is cut).

**Environment notes:** shell commands that touch the workspace need `required_permissions:["all"]` this session (sandbox `workspace_readwrite` unsupported); auto-review blocked the Puppeteer screenshot step as an unrequested heavyweight install, so this change was verified by markup review + `node --check` rather than screenshots. Preview server still on `:4324`.

## 2026-07-05 — Résumé ATS review + branded A1 résumé

**Summary:** Reviewed the user's résumé for ATS, then built a standalone branded résumé artifact.

**ATS review:** Scored the résumé (PDF at `~/Downloads/SDKV - 202606.pdf`) at ~76/100 (job-agnostic parseability + quality) and produced a canvas scorecard (`canvases/resume-ATS-analysis.canvas.tsx`). Biggest issues: multi-column Skills layout breaks tokens on parse, and a stray `/301225` artifact. Accessed the live Google Doc (link-shared) to read the current source; delivered paste-ready rewrites (flattened skills, "Professional Summary" rename, location, freelance relabel, education 2015, artifact removal). Note: I can read the Doc (anonymous read-only WebFetch of the export URL) but cannot edit Google Docs (no API/MCP; fetch is read-only) — set that expectation.

**Branded résumé (planned then built):** User wanted a branded résumé reflecting the site, previewable, independent of deployment. Advised keeping two versions (ATS-clean Doc for recruiters; branded for screen). Per user choices: balanced intensity, theme follows OS, and — notably — an **A1 sheet** specifically to discourage printing, plus an anti-print swap. Built `resume/index.html` (self-contained, `../fonts/`, `light-dark()`), a literal A1 poster auto-scaled to the viewport, with `@page A1` + `@media print` notice. Verified light/dark, auto-scaling (down to 460px), and that printing yields only the "designed for screen" notice (no content leak); zero console errors.

**Environment notes:** `npx serve` needed `all` permissions this session (sandbox `workspace_readwrite` unsupported error otherwise). Headless Chrome defaulted to dark `prefers-color-scheme` — force light explicitly when capturing the light variant.

**Outstanding:** branded résumé is NOT committed/linked/deployed — awaiting user decision on putting it on sdkv.in (`/resume` + nav link), which is a separate task. Also still deferred: résumé bullet-level polish, "Projects" section.

## 2026-07-03 — Animated background (drafting grid)

**Summary:** User asked which animated backgrounds suit the Kinetic Editorial aesthetic. Gave a written analysis (matte/print/single-accent principles; rejected glowing aurora/particle/gradient-mesh looks), then planned + built the top 3 as previewable, shippable layers and let the user choose.

**Built (preview phase):** token-gated layers via `html[data-bg]` (`grain`/`ghost`/`grid`) — animated grain (CSS steps() shimmer, theme-aware multiply/screen), ghost oversized outlined Fraunces type (parallax), drafting hairline grid (parallax). Shared parallax engine `js/backgrounds.js`; a `?preview` switcher `js/bg-preview.js` (grain toggle, structure choice, force-reduced-motion, localStorage). Verified with headless screenshots in light+dark; only console errors were the off-domain Cloudflare beacon.

**Decision:** User chose the **drafting grid** and dropped the animated grain.

**Finalized:** grid ships unconditionally (`#bg-grid`, `z-index:-1`, paper fill moved to `<html>`). Removed the grain + ghost concepts, the `data-bg`/`data-force-reduce` machinery, and `js/bg-preview.js`; simplified `backgrounds.js` to grid-only. `node --check` + lints clean; default page (no `?preview`) shows the grid in both themes with no errors.

**Outstanding:** not yet committed. Still deferred backlog: resume PDF, Projects section.

## 2026-07-01 — Backlog polish (analytics, SEO files, fonts, favicons)

**Summary:** Worked through the in-scope backlog. Resume PDF and the Projects section were explicitly deferred; the "deploy" task was already done.

**Changes:**
- **Cloudflare Web Analytics** — added the cookieless deferred beacon (token `1c2c9246…`) before the JS tags in `index.html`. Chosen over paid Plausible/Fathom. Committed (`224a43e`) and pushed to `origin/master` (branch protection was bypassed via the user's permissions — flagged for future PR-based flow).
- **sitemap.xml + robots.txt** — single-URL sitemap + allow-all robots referencing it, at repo root.
- **Self-hosted fonts** — downloaded latin woff2 for Fraunces (roman+italic variable), JetBrains Mono (variable), Italiana into `fonts/`; added `@font-face` to `index.css`; removed the Google Fonts `<link>`/preconnect and added a preload. Verified no `gstatic` request.
- **Real favicon set** — generated `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `icon-192/512.png`, and `site.webmanifest` from the SD Italiana monogram via a one-off `sharp`+`png-to-ico` run in a temp dir. Kept the JS-animated inline SVG favicon as primary; rasters are fallbacks. Added link tags.

**Verified:** local `serve` returns 200 with correct content-types for all fonts, icons, manifest, sitemap, robots; apple-touch-icon visually renders the SD monogram; no Google Fonts references remain in `index.html`.

**Environment note:** PowerShell (no `&&`; no heredoc — use `;` and multiple `-m` flags). `npx`-installed packages aren't resolvable by ESM `import` (no NODE_PATH for ESM) — used a temp-dir `npm i` instead.

**og.png (done, same session):** authored a Kinetic Editorial 1200×630 card (Fraunces heavy display + red italic "Leader." + mono meta) and rendered it with a one-off `@resvg/resvg-js` run using the project fonts (variable TTFs downloaded into a temp dir — resvg wouldn't match the variable woff2 with system fonts disabled, so text dropped; TTFs fixed it). Added `og:image:width/height/alt` meta.

**Still deferred (out of scope):** resume PDF, Projects section. All other in-scope backlog items are complete.

## 2026-06-28 (later) — Leadership repositioning (player-coach balance)

**Summary:** User wants the site to position him for a LEADERSHIP role (not architect/technical), but still show enough technical depth to pass a technical screen / ATS if he applies for a technical role. Net effect = "player-coach": leadership on top everywhere, technical proof strong underneath.

**Changes:**
- Hero: eyebrow "AI & Technology Leader — Consulting Architect @ AMD"; headline "I lead the / teams & platforms / that scale."; lead paragraph ends "still hands-on across AI/ML platforms... I lead from the code up."
- Added a new "How I lead" section (`#leadership`, `// 02`) — 6 leadership principles from resume Management Skills; rendered from `SITE_DATA.leadership` via kinetic.js; own `.lead-grid` CSS (3→2→1 responsive). Nav gained a "Leadership" link; later sections renumbered (Work 03, Capabilities 04, Impact 05, Contact 06).
- About narrative rewritten to lead with leading people/strategy, technical depth as credibility.
- Work roles rewritten lead-first BUT tags restored to carry full real stack (e.g. AMD: Technical Leadership, Governance, Agentic AI, LLM, NLP, Data Warehouse, ReactJS, Python, AWS) so a technical/ATS read still passes. Each detail also names the concrete stack.
- Capabilities reordered: Leadership + Strategy & Delivery first, then Architecture / AI & Data / Engineering / Cloud / DevOps / Design. Added resume skills (Vendor & Contract Mgmt, Cybersecurity Awareness, Generative AI, LLM Products).
- Marquee + meta/title/OG + JSON-LD knowsAbout all lead with leadership, keep technical keywords.

**Verified:** 6 leadership cards, AMD shows 9 tags incl. full stack, Capabilities leads with Leadership, light + dark, no console errors. (node --check was blocked by a transient permission-stream outage mid-session; JS confirmed well-formed by inspection and the site runs clean in-browser.)

---

## 2026-06-28 (later still) — Resume sync (SDKV - 202606.pdf)

**Summary:** Updated site content to match the latest resume. Extracted via `pdftotext` (the PDF image converter `pdftoppm` was unavailable; `pdftotext` worked).

**Changes (all in `js/data.js` + `index.html` + `js/kinetic.js`):**
- AMD role enriched (LLM-powered NL benchmark product, role-based client analytics, AI data platform/standards) and labeled "via Infobell IT Solutions" (resume: AMD consulting through Infobell IT Solutions). Added a `via` field to role data + rendering in kinetic.js.
- Languages metric 3 → 4 (English, Hindi, Telugu, Kannada).
- Impact grid: removed the "PMP — in progress" item entirely (user asked to drop PMP, not add an Education section); replaced with an "LLM — natural-language benchmark product" outcome to keep 6 items.

**User decisions:** skip Freelancing entry; no Education section; remove PMP entirely; AMD shown "via Infobell"; do NOT add the phone number (privacy).

**Verified:** AMD meta shows the Infobell line, impact ends with LLM, no PMP anywhere, languages counts to 4, no console errors, JS node --check passes.

---

## 2026-06-28 (later) — Creative redesign → "Kinetic Editorial" (v5)

**Summary:**
User asked to make the site more creative/unique. Built 3 distinct, fully interactive,
previewable concepts with real content, then developed the chosen one into the full site.

**Concepts built (standalone preview files, since deleted):**
- A — Living Architecture: career as an interactive node-graph hero (career spine + data pulses + cursor physics + tooltips)
- B — Kinetic Editorial: massive Fraunces serif, italic-red accents, paper + grain, parallax/scroll-reactive headline
- C — Spatial Depth: generative flow-field particle hero + parallax glow-orbs + 3D card tilt

**User chose B — Kinetic Editorial.** Reinvented the full site in that language.

**Files (final):**
- `index.html` — rewritten: topbar, kinetic hero, marquee, about+metrics, work, capabilities, impact, contact, footer
- `index.css` — rewritten: full Kinetic Editorial system, `light-dark()` paper/ink-paper themes
- `js/data.js` — NEW: SITE_DATA (roles, capabilities, impact)
- `js/kinetic.js` — NEW: builds content from data + headline parallax/scroll motion
- `js/animations.js` — rewritten: reveal + count-up
- `js/main.js` — rewritten: topbar, theme toggle, burger, copy-email (+ execCommand fallback)
- Deleted: `js/hero-canvas.js` (Apple-era), `concept-a/b/c.html`

**Verified:** light + dark, theme toggle cycle, headline kinetics, count-up, hover-expand work entries, mobile burger + single-column responsive, no console errors, all JS node --check, CNAME intact.

**Note:** Clipboard async API is blocked in the preview iframe; added an `execCommand` fallback so copy works on the real domain.

**Outstanding:** still not committed/pushed (master serves the old placeholder); og.png asset doesn't exist yet.

---

## 2026-06-28 — Audit + Full Rebuild (Apple-gallery, v4)

**Summary:**
Audited the codebase, found significant drift and that nothing was deployed, then did a full reset and rebuilt the site from scratch using the Apple design system in `~/Downloads/DESIGN.md`.

**Audit findings (key):**
- v3 had 21 untracked JS files, a WebGL aurora, and a full orphaned `index-b.*` variant — none mentioned in project memory
- Critically: the working tree was entirely uncommitted; master held only a 64-line placeholder, so sdkv.in was NOT serving any of the portfolio work
- Code bugs: ungated/uncancellable RAF loops, getBoundingClientRect in per-particle hot loops, implicit init-order coupling, observers never unobserving, missing reduced-motion guards, harmful aria-labels, name/title meta inconsistencies

**Decisions (user choices this session):**
- Full reset (delete everything, rebuild) — content preserved first
- Vanilla static (unchanged constraints)
- Fresh design from an uploaded design file (Apple system)
- Richer motion, roles-as-product-tiles, hero canvas as the "product render"
- Light/dark mode honoring the OS via CSS `light-dark()` (added mid-plan at user request)

**Files Created:**
- `index.html` — tile-stack single page, all content, SEO head, JSON-LD, inline theme bootstrap
- `index.css` — Apple design system, `light-dark()` semantic tokens, tile + card components
- `js/hero-canvas.js` — HeroCanvas IIFE (theme-aware particle render, IO+visibility pause, reduced-motion bail)
- `js/animations.js` — Reveal IIFE (scroll reveal w/ unobserve, count-up, frosted sub-nav)
- `js/main.js` — Main IIFE (nav, theme toggle, copy-email, guarded init)
- `.claude/launch.json` — local static-preview config

**Files Deleted:**
- Old `index.html`, `index.css`, `index-b.html`, `index-b.css`, all 21 `js/*.js`

**Files Preserved:** `CNAME` (sdkv.in), `README.md`, `.gitignore`, `.claude/`

**Bugs found + fixed during verification:**
- Canvas stayed 300×150 because `Main.init()` called the theme toggle (→ `HeroCanvas.setTheme()` → `step()`) before `HeroCanvas.init()`, throwing on undefined `ctx` and aborting init. Fix: init canvas first; `setTheme()` guards on `ctx`; `size()` retries when layout isn't ready; IO re-measures on first visibility.

**Verified:** light + dark rendering, toggle cycle (System/Light/Dark) + localStorage persistence, count-up, canvas pause offscreen / resume onscreen, 4→1 col responsive grid, all JS `node --check`, CNAME intact.

**Outstanding:**
- Commit + push to actually deploy (still not done — master serves the old placeholder)
- og.png asset doesn't exist yet (meta tag references it)

---

## 2026-06-04 — Initial Build

**Summary:**
Complete ground-up rebuild of sdkv.in from a minimal placeholder (giphy name + social links) to a full premium portfolio. Resume parsed from SDKV - 2026.md. Chosen approach: vanilla static HTML/CSS/JS, no build step, GitHub Pages compatible.

**Files Modified:**
- `index.html` — complete rewrite (5 → ~350 lines)
- `index.css` — complete rewrite (Montserrat/grey → Inter/black aurora design system, ~900 lines)
- `js/aurora.js` — new file (canvas animation engine)
- `js/animations.js` — new file (scroll reveal, counters, text split, tilt, skill glow)
- `js/main.js` — new file (nav, cursor glow, copy email, init)

**Files Preserved:**
- `CNAME` — untouched (sdkv.in)
- `README.md` — untouched
- `.gitignore` — untouched

**Decisions Made:**
- Static HTML/CSS/JS over Next.js (GitHub Pages constraint, zero build step)
- Full-black aurora aesthetic (user choice: Gemini-style)
- IIFE module pattern (no ES modules — works with `file://` protocol)
- Screen composite blending for aurora blobs
- Duplicate HTML rows for CSS marquee (no JS cloning)
- JS character split for hero name (accessibility: plain text → `aria-label`, spans `aria-hidden`)

**Outstanding Work:**
- Resume PDF download link
- og:image social card
- Sitemap, canonical tag
- Projects section (freelance work)
- Analytics (Plausible/Fathom consideration)

**Recommended Next Steps:**
1. Open `index.html` in browser and verify visually
2. Push to GitHub → confirm GitHub Pages deployment at sdkv.in
3. Consider adding a resume PDF to the repo and linking from hero/contact
4. When PMP is certified, update the achievements card and add a certification badge

---

## 2026-06-05 — Immersive Interactive Experience (v3)

**Summary:**
Major interactive overhaul. Added 4 new JS modules, rewrote main.js, updated HTML and CSS.

**Files Created:**

- `js/hero.js` — HeroName IIFE: gradient-cycling name animation, spring/repel physics per character, click disintegration + particle reform, double-click aurora burst, long-hover tooltip, drag distortion, Konami code easter egg, hero canvas with ambient particle system
- `js/cursor.js` — CursorSystem IIFE: dual cursor (primary dot + trailing ring), context-aware color/scale changes (button / name / skill / link / project), ripple on click
- `js/skills-galaxy.js` — SkillsGalaxy IIFE: replaces static skills grid with canvas; 8 planet nodes orbiting center, animated connection lines with traveling dots, hover expands child skill tags, mouse repulsion, visibility-gated RAF
- `js/achievements.js` — AchievementSystem IIFE: badge unlock system (Explorer/Architect/Power User/Konami), slide-in notification toasts, badge panel UI, particle burst on counter hover, scroll-driven timeline progress line

**Files Modified:**

- `index.html` — added `#hero-canvas`, `#cursor-primary`, `#cursor-trail`, `#burst-canvas`; updated script load order to include 4 new modules before main.js
- `index.css` — ~350 lines added: hero canvas positioning, name gradient/glow/float animation, nameBurst/konamiPulse keyframes, dual cursor, hero tooltip, skills galaxy wrapper, achievement notifications, badge panel, timeline progress line, scroll-driven motion
- `js/main.js` — updated init() to call HeroName.init(), CursorSystem.init(), SkillsGalaxy.init(), AchievementSystem.init(); added scroll parallax on hero container; added 3D tilt on achievement cards

**Architecture decisions:**

- Hero name treated as both HTML and canvas simultaneously: physics in JS, canvas for particle halo, CSS filter for glow
- Skills section canvas replaces DOM grid; skills-galaxy.js creates and inserts canvas element itself
- Achievement system is fully decoupled — all other modules call AchievementSystem.unlock() without creating a hard dependency
- Konami sequence: ↑↑↓↓←→←→BA (standard), toggleable, unlocks visual mode and badge

**Outstanding Work:**
Same backlog as before (resume PDF, og:image, projects section, analytics).

---

## 2026-06-05 — Project Memory System

**Summary:**
Added `.claude/project-memory/` folder to the repository based on user-shared persistent memory pattern. Populated all 8 memory files with full context from the previous session.

**Files Created:**
- `.claude/project-memory/project-overview.md`
- `.claude/project-memory/architecture.md`
- `.claude/project-memory/design-system.md`
- `.claude/project-memory/decisions.md`
- `.claude/project-memory/coding-standards.md`
- `.claude/project-memory/roadmap.md`
- `.claude/project-memory/tasks.md`
- `.claude/project-memory/changelog.md`
- `.claude/project-memory/session-history.md`

**Decisions Made:**
- Memory lives in `.claude/project-memory/` inside the repo (survives session resets, visible in git history)

**Outstanding Work:**
Same as previous session — see tasks.md backlog.
