# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Glossarist.org is the website for [Glossarist](https://github.com/glossarist), open-source software for maintaining multi-language concept systems. Built with **VitePress** (v1.6), Vue 3, and TypeScript.

## Build & Development Commands

- `npm run dev` — Dev server with hot reload
- `npm run build` — Production build (output to `.vitepress/dist/`)
- `npm run preview` — Preview production build locally

Uses **npm** with `"type": "module"`.

## Architecture

### VitePress site structure

```
.vitepress/
├── config.ts              # Nav, sidebar, search, head, sitemap
├── theme/
│   ├── index.ts           # Theme setup, registers Vue components
│   ├── custom.css         # Brand colors (CSS custom properties), dark mode
│   └── components/
│       ├── HomePage.vue       # Landing page with hero, software grid, features
│       ├── BlogIndex.vue      # Blog listing with cards
│       ├── BlogByline.vue     # Author/date display for blog posts
│       └── ReleaseDownloader.vue  # GitHub release fetcher with OS detection
│       └── RelationshipTypes.vue  # 52 relationship types browser (categories, inverses, taxonomy data)
├── data/
│   ├── projects.ts        # Software project data (name, version, description, links)
│   ├── types.ts            # TypeScript types for taxonomy concepts
│   └── useOntologyData.ts  # Composable loading taxonomies.json into Vue reactive state
└── posts.data.ts          # Blog content loader (createContentLoader)
```

### Content organization

- `index.md` — Home page (uses `<HomePage />` component with `layout: home`)
- `docs/` — All documentation in Markdown
  - `desktop/` — Desktop app docs (getting-started, tutorials, UI reference, topics)
  - `model/` — Concept model docs (concepts, designations, relationships, sources, term types, schemas)
  - `core-concepts/` — Background on terminology management (ISO 704)
  - `adopt/` — Adoption guide (workflows, infrastructure, migration)
  - `software/` — Software product pages (glossarist-ruby, glossarist-js, concept-browser, desktop)
  - `standards.md` — ISO standards compliance reference
- `blog/` — Blog posts (frontmatter with title, date, authors, description)

### Sidebar navigation

Configured per-section in `config.ts`. Each docs section has its own sidebar. The Software nav dropdown is auto-generated from `.vitepress/data/projects.ts`.

### Custom components

- `ReleaseDownloader` — Client-side fetch of latest GitHub release via REST API, with localStorage caching (1h TTL) and OS detection from `navigator.userAgent`
- `HomePage` — Hero section, software cards grid (driven by `projects.ts`), "used by" section, features grid
- `BlogIndex` / `BlogByline` — Blog listing and post bylines, driven by `posts.data.ts`
- `RelationshipTypes` — 52 relationship types browser with categories, inverse pairs, and alphabetical reference. Reads from `public/data/taxonomies.json` via `useOntologyData` composable.

### Styling

CSS custom properties for brand colors (`--glossarist-primary`, `--vp-c-brand-*`). Dark mode via `.dark` class overrides. All in `.vitepress/theme/custom.css`.

### Images

Static images live in `public/images/`:
- `desktop/` — Screenshots for desktop app docs (from old `docs/` YAML media)
- `model/` — UML diagrams from concept-model repo

## Deployment

GitHub Actions workflow (`.github/workflows/build.yml`):
- Triggers on push to `main` branch
- Node 24, `npm ci && npm run build`
- Uploads `.vitepress/dist` via `upload-pages-artifact@v4`
- Deploys to GitHub Pages via `deploy-pages@v4`
- Link checker via lychee on every build

## Legacy code

The `src/`, `static.config.js`, `node.api.js`, `tsconfig.json`, `yarn.lock`, and old `docs/` YAML files are legacy React Static artifacts. They can be deleted once the VitePress migration is confirmed (see `TODO.website/14-cleanup-legacy.md`).
