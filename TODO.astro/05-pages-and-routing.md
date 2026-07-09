# 05 — Pages and Routing

**Goal:** Reproduce every URL from VitePress exactly. Same paths, same trailing-slash behavior, same content at each path.

## URL inventory (must all work after migration)

### Top-level
- `/` (home, uses HomePage component)
- `/about`

### Blog
- `/blog/` (index, uses BlogIndex component)
- `/blog/{slug}` (7 posts)

### Docs
- `/docs/` (model landing)
- `/docs/standards`
- `/docs/model/`, `/docs/model/concepts`, `/docs/model/designations`, `/docs/model/relationships`, `/docs/model/sources`, `/docs/model/datasets`, `/docs/model/non-verbal`, `/docs/model/term-types`
- `/docs/model/schemas/`
- `/docs/core-concepts/`, `/docs/core-concepts/intro-to-concept-systems`, `/docs/core-concepts/concepts-and-terms`, `/docs/core-concepts/registers`
- `/docs/adopt/`, `/docs/adopt/1-workflows/`, `/docs/adopt/2-infrastructure/`, `/docs/adopt/3-migration/`
- `/docs/desktop/` and ~30 sub-pages (getting-started, tutorials, ui/{modules,panels,widgets}, topics)
- `/docs/software/`, `/docs/software/{glossarist-ruby,glossarist-js,concept-browser,desktop}`

### Reference
- `/reference/`, `/reference/schema-browser`, `/reference/entity-fields`, `/reference/ontology`

**Total: 80+ distinct routes.**

## Routing strategy

### Static `.astro` files for top-level
```
src/pages/index.astro           → /
src/pages/about.astro           → /about
src/pages/blog/index.astro      → /blog/
src/pages/docs/index.astro      → /docs/
src/pages/reference/index.astro → /reference/
```

### Dynamic `[...path].astro` for content collections
```
src/pages/blog/[slug].astro     → /blog/{slug}
src/pages/docs/[...path].astro  → /docs/{any-path}
src/pages/reference/[slug].astro → /reference/{slug}
```

The `[...path]` catch-all reads from the `docs` content collection:

```astro
---
// src/pages/docs/[...path].astro
import { getEntry } from 'astro:content'
import DocLayout from '../../layouts/DocLayout.astro'

const path = Astro.params.path
const entry = await getEntry('docs', path || '')
if (!entry) return Astro.redirect('/404')

const { Content } = await entry.render()
const { sidebar } = entry.data.sidebar || {}
---
<DocLayout entry={entry} sidebar={sidebar}>
  <Content />
</DocLayout>
```

### Trailing-slash decision

VitePress serves `/docs/model/concepts` — no `.html`, no trailing slash.

Astro options:
1. `trailingSlash: 'never'` + `build.format: 'file'` — emits `/docs/model/concepts.html` directly. **Closest match.**
2. `trailingSlash: 'always'` — emits `/docs/model/concepts/index.html`. Requires redirects.

**Pick option 1.** Add to `astro.config.mjs`:
```js
trailingSlash: 'never',
build: { format: 'file' },
```

Verify with `lychee` link checker after build.

## Tasks

### 5.1 — Create all top-level pages

- [ ] `src/pages/index.astro`
- [ ] `src/pages/about.astro`
- [ ] `src/pages/blog/index.astro`
- [ ] `src/pages/docs/index.astro`
- [ ] `src/pages/reference/index.astro`

### 5.2 — Create dynamic route handlers

- [ ] `src/pages/blog/[slug].astro`
- [ ] `src/pages/docs/[...path].astro`
- [ ] `src/pages/reference/[slug].astro`

### 5.3 — Move all markdown content

- [ ] `blog/*.md` → `src/content/blog/`
- [ ] `docs/**/*.md` → `src/content/docs/` (preserve nested dirs)
- [ ] `reference/*.md` → `src/content/reference/`
- [ ] `about.md` → render via `src/pages/about.astro` (or move to content collection)

### 5.4 — Page-specific behaviors

**Home page** (`src/pages/index.astro`):
- Frontmatter: `layout: home`
- Renders `<HomePage client:load />`
- No sidebar, no doc chrome

**Blog post** (`src/pages/blog/[slug].astro`):
- Renders markdown Content + `<BlogByline client:load ... />`
- BlogLayout (no sidebar)

**Doc page** (`src/pages/docs/[...path].astro`):
- DocLayout with sidebar + outline
- Per-section sidebar from `src/data/sidebars.ts`

**Software pages** (`src/pages/docs/software/[slug].astro`):
- Static for now (4 known slugs) OR catch-all driven by `projects.ts`
- Render the markdown content from `docs/software/{slug}.md`

**Schema browser / Ontology browser / RelationshipTypes**:
- fullscreen layout
- Render markdown (if any) + the relevant Vue component island

### 5.5 — 404 page

`src/pages/404.astro` — match VitePress's 404 style.

### 5.6 — Sitemap

`@astrojs/sitemap` integration generates `/sitemap.xml` automatically. Configure:

```js
// astro.config.mjs
sitemap: {
  hostname: 'https://www.glossarist.org',
  filter: (page) => !page.includes('/_pagefind/'),
}
```

### 5.7 — robots.txt + CNAME

`public/robots.txt` and `public/CNAME` already in repo root. Either:
- Copy to `astro/public/` (and keep in sync until cutover), OR
- Use symlink / shared publicDir

## Acceptance

- `astro build` produces HTML for every URL listed above.
- Visiting each URL locally serves the expected content.
- `curl -I http://localhost:4321/docs/model/concepts` returns 200 (not 301/302).
- Sitemap at `/sitemap.xml` lists all 80+ pages.
- lychee link checker passes against the Astro build.

## Next

→ `06-search-and-navigation.md`
