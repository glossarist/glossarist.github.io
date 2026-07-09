# 00 — Astro Migration Overview

## Why migrate

VitePress is optimized for documentation, but Glossarist.org has grown into a hybrid site: docs + blog + interactive viewers (OntologyBrowser, SchemaReference, RelationshipTypes) + a custom HomePage. The custom Vue work needed to express these in VitePress is fighting the framework — `frontmatter.fullscreen` hacks, layout overrides, manual `createContentLoader` usage.

Astro gives us:
- Native support for Vue islands (no theme override gymnastics).
- Content Collections with typed frontmatter schema validation (replaces hand-rolled `posts.data.ts`).
- File-based routing with dynamic params — easier to model the existing URL space.
- First-class integrations: `@astrojs/sitemap`, `@astrojs/mdx`, `astro-pagefind`, `@astrojs/rss`.
- A build pipeline that's friendlier to our existing `scripts/*.mjs` data generators.

## Scope: full UX/UI parity

The migration must reproduce **every URL, every interactive surface, every visual state** of the VitePress site. The acceptance bar is: a visitor cannot tell which framework is rendering the page.

Concretely, parity items:
- All 68 docs pages + 7 blog posts + 4 software pages + ~10 top-level pages render at the same URL paths.
- Dark mode works identically (CSS custom properties, `.dark` class, OS preference detection).
- The 10 Vue components render with the same DOM, props, and event behavior:
  - HomePage (1632 LOC) — hero, software grid, features
  - OntologyBrowser (1582 LOC) — class hierarchy, property drill-down
  - SchemaReference (744 LOC) — SHACL shapes table
  - YamlSchemas (499 LOC) — versioned YAML schema browser
  - RelationshipTypes (263 LOC) — 52 relationship types with categories + inverses
  - BlogIndex (192 LOC) — post listing with cards
  - ModelLanding (178 LOC) — model docs landing
  - BlogByline (124 LOC) — author/date byline
  - ReleaseDownloader (92 LOC) — GitHub release fetch with OS detection
  - LogoMerge (48 LOC) — animated SVG logo
- Sidebar nav per section (5 sidebars currently).
- Top nav (Model, Reference, Software, Docs, Blog, About).
- Local search.
- Sitemap at `/sitemap.xml` with `https://www.glossarist.org` hostname.
- `public/CNAME`, favicons, manifest, robots.txt — all preserved.
- The build-time data pipeline (`scripts/*.mjs`) keeps producing the same JSON outputs.

## Architecture decisions

### Hybrid: Astro layouts + Vue islands (not a full rewrite to Astro components)

The 10 Vue components stay as Vue SFCs. Astro mounts them as islands via `@astrojs/vue`. Layouts, nav, sidebar, and chrome are written as `.astro` files (cleaner, no client JS for static parts).

Rationale: rewriting 6789 LOC of working Vue into Astro syntax is high-risk for low gain. Vue components run unmodified in Astro. Static chrome moves to `.astro` for HTML-first output.

### Content Collections replace `posts.data.ts`

```ts
// astro/src/content/config.ts
import { defineCollection, z } from 'astro:content'
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    authors: z.array(z.string()).default([]),
    description: z.string().optional(),
  }),
})
const docs = defineCollection({ type: 'content', schema: z.object({ ... }) })
export const collections = { blog, docs }
```

This gives us type-checked frontmatter (which `posts.data.ts` did not) and a uniform API for listing, sorting, and rendering.

### URL parity table

| Route | VitePress | Astro |
|---|---|---|
| Home | `index.md` | `src/pages/index.astro` |
| About | `about.md` | `src/pages/about.astro` |
| Blog index | `blog/index.md` | `src/pages/blog/index.astro` |
| Blog post | `blog/<slug>.md` | `src/pages/blog/[slug].astro` |
| Docs page | `docs/<path>.md` | `src/pages/docs/[...path].astro` |
| Software page | `docs/software/<slug>.md` | `src/pages/docs/software/[slug].astro` |
| Reference | `reference/<slug>.md` | `src/pages/reference/[slug].astro` |

Trailing-slash behavior: VitePress serves `/docs/model/concepts` (no trailing slash, no `.html`). Astro defaults to directory-style with trailing slash. Match VitePress by setting `trailingSlash: 'never'` and `build.format: 'file'` in `astro.config.mjs` OR use redirects. **Decide in TODO 05.**

### Search: Pagefind (replaces VitePress local search)

`astro-pagefind` integration. Generates a `_pagefind/` directory at build time. Search UI lives at `/search/` (new) or in a modal. Wire up the search box in the header identically to VitePress.

### Build pipeline: keep `scripts/*.mjs`

The four build scripts (`generate-ontology-data.mjs`, `generate-ontology-schema.mjs`, `copy-schemas.mjs`, `bundle-schemas.mjs`) are framework-agnostic. They write to `public/data/`. Astro serves `public/` the same way VitePress does. The Astro build `package.json` script becomes:

```bash
"build": "npm run build:data && astro build"
```

### Deployment: same GitHub Actions workflow

`.github/workflows/build.yml` swaps `vitepress build` for `astro build`. Same `upload-pages-artifact` + `deploy-pages` flow. Same `public/CNAME` mechanism. Same `concept-model` checkout step.

## Phases (the other TODO files)

| # | File | Phase |
|---|---|---|
| 01 | `01-project-scaffolding.md` | Astro project init in `astro/` subdir |
| 02 | `02-theme-and-layouts.md` | custom.css port + Layout.astro, BlogLayout.astro, DocLayout.astro |
| 03 | `03-data-and-content-collections.md` | Move docs/, blog/ into content collections; port projects.ts, standards.ts, types.ts |
| 04 | `04-components-port.md` | Vue components as islands; hydration strategy per component |
| 05 | `05-pages-and-routing.md` | All pages at same URLs; dynamic `[...path].astro` for docs |
| 06 | `06-search-and-navigation.md` | Pagefind, sidebar per-section, top nav |
| 07 | `07-build-scripts-integration.md` | Wire `scripts/*.mjs` into Astro build; preserve outputs |
| 08 | `08-deployment-cutover.md` | Swap root package.json scripts, update CI, retire VitePress |
| 09 | `09-regression-tests.md` | Extend Vitest for Astro, visual diff, link check |

## Working location

Astro project lives in `astro/` subdirectory of this repo. Both VitePress (root) and Astro (`astro/`) coexist during migration. Final cutover (TODO 08) moves `astro/*` to root.

## Non-goals

- No new content. No redesign. No new features. The site must look and behave identically.
- No SEO changes (sitemap hostname stays `https://www.glossarist.org`).
- No URL changes.
- No new dependencies beyond the Astro ecosystem.

## Acceptance gate

The migration is complete when ALL of these pass:
1. `npm run test` — all Vitest tests pass against the Astro version.
2. `npm run build` — Astro build succeeds with no warnings.
3. Visual diff between VitePress build (`.vitepress/dist/`) and Astro build (`astro/dist/`) shows no regressions on key pages (home, blog index, a blog post, a docs page, an interactive viewer page).
4. `lychee` link checker passes.
5. Manual smoke test: dark mode toggle, search, sidebar nav, OS-detected download button, OntologyBrowser drill-down.
