---
stage: inbox
type: website
created: 2026-03-16
priority: high
tags: [portfolio, resume, personal-brand, astro, vercel, client-facing]
---

# PhilipLudington.com

Professional one-page portfolio and resume site — the canonical "who is Philip?" destination for potential clients arriving from GitHub, LinkedIn, or any of my products.

## Key Concepts

- **One-pager** — everything on a single scrollable page. No navigation complexity, no reason to bounce. The scroll tells a story: who I am, what I build, what I've done, how to reach me.
- **Client trust-building** — professional tone, clean design, social proof. The site exists to answer "should I hire/work with this person?" with a confident yes.
- **Canonical hub** — GitHub, LinkedIn, ChangeSmith, SheetSmith, GameLegend, and MrPhilGames all link here. Every profile bio points to PhilipLudington.com.
- **Manually curated** — no auto-syncing from GitHub or APIs. Each project card and resume entry is intentionally chosen and worded for maximum impact.
- **Custom email** — philip@PhilipLudington.com for professional correspondence.

## Page Sections (top to bottom)

| Section | Purpose |
|---------|---------|
| **Hero** | Name, professional title, one-liner value prop, CTA (contact or scroll) |
| **About** | Brief bio — who I am, what I specialize in, why clients trust me |
| **Projects** | Curated cards for ChangeSmith, SheetSmith, GameLegend, MrPhilGames — each with a screenshot, short description, and link |
| **Experience** | Traditional resume: work history, skills, education |
| **Contact** | philip@PhilipLudington.com, GitHub, LinkedIn — clear and simple |

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Framework | Astro | Fast static output, component islands if needed later, great DX |
| Hosting | Vercel | Free tier, instant deploys, custom domain support |
| Styling | Tailwind CSS | Rapid iteration, consistent design system |
| Domain | PhilipLudington.com | Already owned |

## Design Principles

- **White space over clutter** — let the content breathe
- **Professional photography or clean avatar** — first impression matters
- **Readable typography** — system fonts or a single professional typeface
- **Mobile-first** — clients may check on their phone after a meeting
- **Fast** — static site, no JS bloat, sub-second load times
- **Accessible** — semantic HTML, good contrast, screen-reader friendly

## Writing

A small, curated blog lives at `/blog` (Astro content collection, markdown in `src/content/blog/`).
This is deliberately *not* a general dev-log — MrPhilGames.com still owns game dev and frequent posting.
PhilipLudington.com carries a few high-signal, evergreen pieces on engineering craft and working with
coding agents — the kind of writing a potential client or employer reads to answer "does this person
know what they're doing?" Each post is intentional, like everything else on the site.

## What It Doesn't Do

- Not a high-frequency dev blog — that cadence lives at MrPhilGames.com; here it's a few evergreen pieces
- Not an app showcase with live demos — just curated descriptions and links
- Not auto-updating — every change is intentional
- Not a freelance marketplace profile — it's owned real estate
