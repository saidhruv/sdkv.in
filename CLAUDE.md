# sdkv.in — Claude Code Instructions

## On Every Session Start

Read all files in `.claude/project-memory/` before doing any work:

1. `project-overview.md` — what this project is and its goals
2. `architecture.md` — file structure, JS module pattern, animation system
3. `design-system.md` — colors, typography, motion, component patterns
4. `decisions.md` — why things are built the way they are
5. `coding-standards.md` — naming, patterns, rules to follow
6. `roadmap.md` — what's planned, what to avoid
7. `tasks.md` — current backlog / in-progress / completed
8. `session-history.md` — what happened in previous sessions

Never assume a blank slate. These files are the source of truth for project state.

## After Every Significant Change

Update the relevant memory files:
- New feature → update `project-overview.md`, `tasks.md`, `changelog.md`
- Architectural change → update `architecture.md`, `decisions.md`
- Design change → update `design-system.md`
- Session end → append to `session-history.md`

## Critical Rules

- **NEVER delete the `CNAME` file** — it contains `sdkv.in` and is required for GitHub Pages custom domain
- **No build step** — this is a static site, no npm, no bundler, no framework
- **Deployment = git push to master** — GitHub Pages serves the root directly
- **JS must work from `file://`** — no ES module syntax (`import`/`export`), use IIFEs
- **Script load order:** `aurora.js` → `animations.js` → `main.js`
- **All animations must respect `prefers-reduced-motion`**
