# 03 — Data and Content Collections

**Goal:** Move all markdown content into Astro Content Collections, port the data utilities (`projects.ts`, `standards.ts`, `types.ts`, `format.ts`, `useOntologyData.ts`), and replace `posts.data.ts` with typed collection queries.

## Source files to port

- `.vitepress/data/projects.ts` → `astro/src/data/projects.ts` (verbatim)
- `.vitepress/data/standards.ts` → `astro/src/data/standards.ts` (verbatim)
- `.vitepress/data/types.ts` → `astro/src/data/types.ts` (verbatim)
- `.vitepress/data/format.ts` → `astro/src/data/format.ts` (verbatim)
- `.vitepress/data/useOntologyData.ts` → `astro/src/data/useOntologyData.ts` (verbatim — works in Vue islands)
- `.vitepress/posts.data.ts` → replaced by `astro:content` query (see below)

## Tasks

### 3.1 — Define content collections

`astro/src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().refine(s => !isNaN(Date.parse(s))),
    authors: z.array(z.string()).default([]),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
  }),
})

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    fullscreen: z.boolean().optional(),
    sidebar: z.object({
      label: z.string().optional(),
      order: z.number().optional(),
    }).optional(),
  }),
})

export const collections { blog, docs }
```

### 3.2 — Move content files

Move `blog/*.md` → `astro/src/content/blog/*.md`
Move `docs/**/*.md` → `astro/src/content/docs/**/*.md`
Move `reference/**/*.md` → `astro/src/content/reference/**/*.md`
Move `about.md` → `astro/src/content/about.md` (or `astro/src/pages/about.astro`)
Move `index.md` → `astro/src/pages/index.astro` (uses HomePage component)

**Do not delete from VitePress root** until cutover (TODO 08). Copy for now.

### 3.3 — Replace `posts.data.ts` logic

Old:
```ts
import { createContentLoader } from 'vitepress'
export default createContentLoader('blog/*.md', { ... })
```

New — in any Astro page or component:
```ts
import { getCollection } from 'astro:content'
const posts = (await getCollection('blog'))
  .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date))
```

This is now type-safe and validated by the schema.

### 3.4 — Sidebar data

VitePress sidebars are configured inline in `.vitepress/config.ts`. Port each section's sidebar to a data file:

`astro/src/data/sidebars.ts`:
```ts
export const sidebars = {
  '/docs/desktop/': [ /* desktop sidebar from config.ts */ ],
  '/docs/model/': [ /* model sidebar */ ],
  '/docs/core-concepts/': [ /* core-concepts sidebar */ ],
  '/docs/adopt/': [ /* adopt sidebar */ ],
  '/docs/software/': [ /* software sidebar */ ],
}
```

This stays in sync with markdown frontmatter `sidebar.label` and `sidebar.order`.

### 3.5 — Top nav

`astro/src/data/nav.ts` mirrors the `nav` array in `.vitepress/config.ts`. Used by `Nav.astro`.

### 3.6 — Software projects data

`projects.ts` already exists as a typed export. Reuse verbatim. Astro components import it normally:

```astro
---
import { projects } from '../data/projects'
---
{projects.map(p => <a href={`/docs/software/${p.slug}`}>{p.name}</a>)}
```

### 3.7 — Build-time data outputs

The four scripts in `scripts/*.mjs` write to `public/data/`. This is unchanged. Astro's `public/` is the same. The Vue islands (`OntologyBrowser`, `RelationshipTypes`, etc.) still fetch `/data/*.json` at runtime via `useOntologyData`.

**Critical:** the build:data step must run before Astro build. Already specified in `astro/package.json` (TODO 01).

## Acceptance

- All content moved to `astro/src/content/`.
- `getCollection('blog')` returns the 7 posts in date-desc order.
- `getCollection('docs')` returns all 68 pages with valid frontmatter.
- Frontmatter schema rejects invalid dates / missing titles.
- `projects`, `standards`, `format`, `useOntologyData` all importable from Astro pages and Vue islands.

## Next

→ `04-components-port.md`
