# 09 — Regression Tests

**Goal:** Extend the existing Vitest suite to cover Astro-specific surfaces: layouts, page routes, content collections, and visual regression snapshots.

## Existing coverage (from VitePress era)

The `test/` directory already has:
- `format.test.ts` — date/author formatters
- `projects.test.ts` — software project metadata
- `standards.test.ts` — ISO/W3C standards list
- `useOntologyData.test.ts` — Vue composable with mocked fetch
- `scripts.test.ts` — integration tests for build output JSON shapes
- `components/*.test.ts` — Vue component tests (LogoMerge, BlogByline, ReleaseDownloader, ModelLanding, RelationshipTypes)
- `components/*.smoke.test.ts` — mount-without-crash tests for heavy components (HomePage, BlogIndex, OntologyBrowser, SchemaReference, YamlSchemas)

**Total: 95 tests across 15 files.**

## Astro-specific gaps to fill

### 9.1 — Content collection schema tests

`astro/test/content-schema.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getCollection } from 'astro:content'  // mocked via vitest setup

describe('blog collection', () => {
  it('every post has a valid ISO date', async () => {
    const posts = await getCollection('blog')
    for (const p of posts) {
      expect(Date.parse(p.data.date)).not.toBeNaN()
    }
  })

  it('every post has at least one author', async () => {
    const posts = await getCollection('blog')
    for (const p of posts) {
      expect(p.data.authors.length).toBeGreaterThan(0)
    }
  })
})
```

### 9.2 — Route generation tests

`astro/test/routes.test.ts` — verify every URL in the VitePress sitemap has a corresponding Astro route:

```ts
import { describe, it, expect } from 'vitest'
import { getCollection } from 'astro:content'

describe('route parity with VitePress', () => {
  it('every blog post produces /blog/{slug}', async () => {
    const posts = await getCollection('blog')
    for (const p of posts) {
      expect(p.slug).toMatch(/^[\w-]+$/)
    }
  })

  it('every docs page has a non-empty title in frontmatter', async () => {
    const docs = await getCollection('docs')
    for (const d of docs) {
      expect(d.data.title).toBeTruthy()
    }
  })
})
```

### 9.3 — Layout tests

`astro/test/layouts/DocLayout.test.ts` — render the layout with sample content, verify:
- Sidebar appears for paths under `/docs/`
- Active link is highlighted
- Outline populates from headings
- Breadcrumb shows correct hierarchy

Astro layouts can be tested via the Astro container API (render to string):

```ts
import { experimental_AstroContainer } from 'astro/container'
import DocLayout from '../../src/layouts/DocLayout.astro'

const container = await experimental_AstroContainer.create()
const result = await container.renderToString(DocLayout, {
  slots: '<p>test</p>',
  props: { entry: { /* ... */ } },
})
```

### 9.4 — Visual regression (optional but recommended)

Add `@vitest/snapshot` or `playwright` for visual diff:

```bash
npm install --save-dev @playwright/test
```

```ts
// astro/test/visual/home.spec.ts
import { test, expect } from '@playwright/test'

test('home page hero', async ({ page }) => {
  await page.goto('http://localhost:4321/')
  await expect(page.locator('.hero')).toBeVisible()
  await expect(page).toHaveScreenshot('home.png')
})
```

Run against both VitePress (port 5173) and Astro (port 4321) servers, diff screenshots.

### 9.5 — Link check test

Replace the manual lychee step with a vitest test:

```ts
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

describe('no broken internal links', () => {
  const distDir = 'dist'
  const htmlFiles: string[] = []
  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (entry.endsWith('.html')) htmlFiles.push(full)
    }
  }
  walk(distDir)

  for (const file of htmlFiles) {
    it(`${file} has no broken internal links`, () => {
      const content = readFileSync(file, 'utf-8')
      const links = Array.from(content.matchAll(/href="([^"]+)"/g)).map(m => m[1])
      for (const link of links) {
        if (link.startsWith('http') || link.startsWith('#')) continue
        // verify the target file exists in dist
        // ...
      }
    })
  }
})
```

### 9.6 — Move existing tests

After Astro promotion (TODO 08), move `test/` → root-level `test/` (it's already there). Update imports:
- `../.vitepress/data/...` → `../src/data/...`
- `../.vitepress/theme/components/...` → `../src/components/...`

The `vitest.config.ts` `coverage.include` array updates accordingly.

### 9.7 — CI test job

`.github/workflows/test.yml` (new):

```yaml
name: test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
        if: always()
```

Add this alongside `build.yml`. Tests run on every push and PR.

## Acceptance

- Vitest suite has 100+ tests covering data, components, layouts, routes, content schema.
- CI runs `npm test` on every PR.
- Coverage report shows ≥80% for `src/data/`, ≥60% for `src/components/`, ≥40% for `src/layouts/` and `src/pages/`.
- Visual regression snapshots committed and reviewed.

## Done

Migration complete. The site is fully Astro, fully tested, fully deployed.
