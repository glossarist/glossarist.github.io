# 12 — Test Coverage Strategy

## Goal

Every user-visible feature has at least one Vitest test. Tests run on every CI
build and gate merges. The suite is the regression safety net that lets us
refactor (e.g. convert Vue islands to .astro, or upgrade Astro versions)
without silently breaking behavior.

## Test layers

### Layer 1 — Pure logic (in-process)

Fast, deterministic, no I/O. These run first and fail fast.

- `test/format.test.ts` — date / author formatters
- `test/projects.test.ts` — software project metadata invariants
- `test/standards.test.ts` — ISO / W3C standards list
- `test/useOntologyData.test.ts` — Vue composable (mocked fetch)
- `test/rehype-admonitions.test.ts` — rehype plugin AST transformation

### Layer 2 — Vue components (jsdom + @vue/test-utils)

Mount the component, assert on rendered DOM and events.

- `test/components/HomePage.smoke.test.ts`
- `test/components/OntologyBrowser.smoke.test.ts`
- `test/components/SchemaReference.smoke.test.ts`
- `test/components/YamlSchemas.smoke.test.ts`
- `test/components/RelationshipTypes.test.ts`

### Layer 3 — Astro components (build-output integration)

Render the actual built HTML and assert on the output. This catches issues
that pure unit tests miss (Astro's compile-time transformations, layout
composition, frontmatter handling).

- `test/astro-components.test.ts` — ModelLanding, LogoMerge, ReleaseDownloader,
  Pagefind search UI
- `test/layouts.test.ts` — BaseLayout, DocLayout, BlogLayout
- `test/nav-highlighting.test.ts` — Nav active state for every section
- `test/sidebar-outline.test.ts` — Sidebar section detection, Outline filter
- `test/pages.test.ts` — every route renders expected elements
- `test/theme-toggle.test.ts` — dark mode init script + toggle behavior

### Layer 4 — Build pipeline (integration)

Verify the four `scripts/*.mjs` produce the expected JSON shapes.

- `test/scripts.test.ts`

## Running

```bash
npm test              # all layers
npm run test:watch    # watch mode
npm run test:coverage # with v8 coverage report
```

## Coverage targets

| Surface | Target |
|---|---|
| `src/data/*.ts` | 100% (pure logic) |
| `scripts/*.mjs` | integration — output shape verified |
| `src/components/*.astro` | rendered HTML assertions |
| `src/components/*.vue` | mount + behavior |
| `src/layouts/*.astro` | structure assertions on built HTML |
| `src/pages/*.astro` | route coverage |

We do NOT chase line-coverage percentages on Astro components — the rendered
HTML integration tests are a more honest signal. A 100% line-coverage unit
test of an Astro component mock is worth less than one assertion against the
real built output.

## Future work

- Visual regression testing with Playwright + screenshot diffs against the
  pre-migration VitePress build (see `TODO.astro/09-regression-tests.md`)
- Performance budget assertions (build time, page weight)
- Accessibility audit with axe-core
