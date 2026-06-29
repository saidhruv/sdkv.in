# Session History

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
