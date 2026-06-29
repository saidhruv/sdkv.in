# Project Overview

## Purpose
Personal portfolio website for Sai Dhruva K V (Consulting Architect at AMD), hosted at sdkv.in via GitHub Pages.

## Key Objectives
- Present Sai's career, skills, and impact as a premium "museum gallery" experience
- Feel immediately credible to hiring managers, CTOs, and engineering leaders
- Remain fast, accessible, and zero-dependency (no build step, no framework)

## Design Language (v5 — 2026-06-28 — "Kinetic Editorial")
Type-as-art editorial direction (chosen from 3 previewed concepts):
- Massive **Fraunces** serif display + **JetBrains Mono** metadata
- Warm paper palette (cream ↔ "ink-paper" near-black dark variant), film-grain overlay
- Single accent: red (#e8472b light / #ff6347 dark) — italic display words, units, section numbers, hover bars
- Signature moves: italic weight-300 red words, `-webkit-text-stroke` outlined text, numbered sections, marquee strip
- Kinetic headline: parallax to cursor + scroll-driven letter-spacing
- Light/dark honors the OS via CSS `light-dark()`; toggle overrides (System → Light → Dark)
- (Replaced the short-lived v4 Apple-gallery look the same day — see decisions.md)

## Major Features
- **Hero** — kinetic Fraunces headline ("Architect / of intelligent / systems.") that reacts to cursor + scroll
- **About** — narrative prose + 4 count-up metrics in a bordered grid
- **Work** — 5 roles as editorial entries that expand on hover/focus (AMD, FINEOS/Spraoi, Goin, HPE, iService)
- **Capabilities** — 8-cell bordered grid with numbered red superscripts + mono skill lists
- **Impact** — 6 outcomes with large red display numbers
- **Contact** — big italic headline, underlined email + copy-to-clipboard, mono social pills
- **Topbar** — sticky blurred bar + theme toggle + mobile hamburger
- **Footer** — preserves "Save Paper · Save Trees" tagline
- Content is data-driven from `js/data.js`

## Hosting
- GitHub Pages, custom domain sdkv.in
- CNAME file must NEVER be deleted
- No build step — deploy by pushing to master
