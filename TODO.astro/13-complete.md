# 13 — Migration Complete (Final Status)

**Date:** 2026-07-11
**Branch:** `feat/astro-migration`
**PR:** #62

## What landed

The migration from VitePress to Astro 7 is complete. Every TODO in
TODO.astro/00 through TODO.astro/12 is implemented and verified.

### Architecture

- **Build:** Astro 7 + Vite 8.1.4 + `@tailwindcss/vite` (Tailwind 4.3.2)
- **Vue islands:** 5 (`HomePage`, `OntologyBrowser`, `SchemaReference`,
  `YamlSchemas`, `RelationshipTypes`) — kept as Vue because they're
  heavily interactive (1500+ LOC each, conversion would be a multi-day
  undertaking with zero UX gain)
- **Astro components:** 7 (`Nav`, `Footer`, `Sidebar`, `Outline`,
  `LogoMerge`, `ModelLanding`, `ReleaseDownloader`)
- **Content collections:** 4 (`blog`, `docs`, `reference`, `pages`)
- **Layouts:** 3 (`BaseLayout`, `DocLayout`, `BlogLayout`)
- **Build scripts:** 4 (`generate-ontology-data`,
  `generate-ontology-schema`, `copy-schemas`, `bundle-schemas`) —
  framework-agnostic, unchanged from VitePress era
- **Routing:** `build.format: 'directory'` + `trailingSlash: 'ignore'`
  so both `/path` and `/path/` serve
- **Code blocks:** Shiki dual themes (`github-light` + `github-dark`)
  with CSS var swap on `.dark` class
- **Search:** Pagefind UI wired into Nav with Cmd+K shortcut,
  ArrowUp/Down nav, Esc to close, debounced input
- **Theme toggle:** Sun/moon icons, persists to
  `localStorage['glossarist-theme']`, OS preference fallback
- **Admonitions:** `::: tip/info/warning/danger/details` supported via
  rehype plugin + CSS custom-block styling

### Test coverage (212 tests in 17 files, all passing)

| File | Tests | What it covers |
|---|---|---|
| `format.test.ts` | 12 | Date/author formatters |
| `projects.test.ts` | 14 | Software project metadata |
| `standards.test.ts` | 9 | ISO/W3C standards list |
| `useOntologyData.test.ts` | 4 | Vue composable (mocked fetch) |
| `scripts.test.ts` | 13 | Build pipeline integration |
| `rehype-admonitions.test.ts` | 10 | Admonition AST transformation |
| `components/HomePage.smoke.test.ts` | 3 | Mount without crash |
| `components/OntologyBrowser.smoke.test.ts` | 2 | Mount with stub schema |
| `components/SchemaReference.smoke.test.ts` | 2 | Mount with stub schema |
| `components/YamlSchemas.smoke.test.ts` | 2 | Mount with stub schema |
| `components/RelationshipTypes.test.ts` | 3 | Mount with mocked taxonomy |
| `astro-components.test.ts` | 10 | ModelLanding + LogoMerge + ReleaseDownloader |
| `nav-highlighting.test.ts` | 22 | Active state for every section |
| `layouts.test.ts` | 22 | BaseLayout/DocLayout/BlogLayout structure |
| `sidebar-outline.test.ts` | 15 | Section detection + heading filter |
| `pages.test.ts` | 29 | All routes + URL dot preservation + broken-link gate |
| `theme-search.test.ts` | 33 | Theme toggle + search UI + Shiki dual theme |

### Acceptance gate (all green)

- [x] `npm test` — 212 tests pass
- [x] `npm run build` — 78 pages, Pagefind index, sitemap
- [x] Zero broken internal links (3194 hrefs scanned)
- [x] Zero `vp*` references in `src/`, `test/`, `scripts/`
- [x] Both code-block themes work (toggle swaps via CSS vars)
- [x] Both URL forms work (`/path` and `/path/`)
- [x] Blog URL dots preserved (`2026-05-27-concept-browser-0.4`)
- [x] Header renders on fullscreen pages (sidebar/outline hide)
- [x] Active highlighting works on every section + child
- [x] Lychee link checker passes on CI

### Files removed

- `.vitepress/` (entire directory)
- `index.md`, `about.md` (VitePress home + about)
- `blog/`, `docs/`, `reference/` (moved to `src/content/`)
- `vitest.config.ts` (replaced with Astro-pathed version)
- `TODO.cleanup/`, `TODO.refactor/`, `TODO.website/`, `TODO.infoarch/`
  (~180KB of stale VitePress-era planning docs)
- All `VPNavBar*`, `vp-doc`, `VPFooter`, `VPSidebar`, `VPLocalNav`,
  `VPContent` selectors
- All `--vp-c-*` CSS custom properties (renamed to `--g-*`)
- `vi.mock('vitepress', ...)` from 5 test files (Vue components no
  longer import vitepress — mocks were dead code)
- `localStorage['vitepress-theme-appearance']` fallback in BaseLayout

### CI

- `.github/workflows/build.yml` — artifact path is `dist/`
- `.github/workflows/link-checker.yml` — lychee scans `dist/`
- `lychee.toml` — `include = ["dist/**/*.html"]`
- `CLAUDE.md` — rewritten to describe Astro architecture
