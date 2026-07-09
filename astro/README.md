# Astro Migration — In Progress

This subdirectory is the **target** of the VitePress → Astro migration.

**Status:** scaffolding complete; see [`../TODO.astro/00-overview.md`](../TODO.astro/00-overview.md) for the full plan.

## What works right now

- `npm install` installs Astro 7 + Vue + sitemap + mdx + pagefind integrations
- `npm run build` produces a working Astro build with 3 placeholder pages
- Pagefind search index generated
- `public/` is shared with VitePress root via `publicDir: '../public'`
- Vue components copied to `src/components/` (with import paths adjusted)
- Data utilities copied to `src/data/`
- BaseLayout, Nav, Footer implemented in `.astro`
- Content collections schema defined (`src/content.config.ts`)

## What's pending (see TODO.astro/)

The full migration plan lives in [`TODO.astro/`](../TODO.astro/). The remaining work, in order:

1. **02 — Theme and Layouts**: DocLayout (with sidebar), BlogLayout, ThemeToggle island
2. **03 — Content Collections**: move `blog/*.md`, `docs/**/*.md`, `reference/*.md` into `src/content/`
3. **04 — Components Port**: refactor Vue components that use `useData()` / `createContentLoader` to accept props
4. **05 — Pages and Routing**: 80+ pages at exact same URLs as VitePress
5. **06 — Search and Navigation**: wire Pagefind UI into Nav, sidebar per-section
6. **07 — Build Scripts**: keep `scripts/*.mjs` writing to `public/data/`
7. **08 — Deployment Cutover**: swap root package.json, CI workflow; retire VitePress
8. **09 — Regression Tests**: extend Vitest for layouts, routes, content schema

## Coexistence with VitePress

The repo root still has the VitePress site. Both can build in parallel during migration:

```bash
# VitePress (root) — current production
npm run build

# Astro (this directory) — migration target
cd astro && npm run build
```

VitePress files (`.vitepress/`) are **not modified** during migration. They are retired in TODO.astro/08.
