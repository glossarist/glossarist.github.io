# 04 — Components Port (Vue Islands)

**Goal:** Port all 10 Vue components into `astro/src/components/` and mount them as islands with explicit hydration strategies.

## Source components

| Component | LOC | Hydration strategy | Reason |
|---|---|---|---|
| HomePage | 1632 | `client:load` | Hero, software grid, features — interactive on first paint |
| OntologyBrowser | 1582 | `client:visible` | Heavy; only runs when scrolled into view |
| SchemaReference | 744 | `client:visible` | Same |
| YamlSchemas | 499 | `client:visible` | Same |
| RelationshipTypes | 263 | `client:visible` | Same |
| BlogIndex | 192 | `client:idle` | Filters/sort after first paint |
| ModelLanding | 178 | `client:load` | Visible on first paint |
| BlogByline | 124 | `client:load` | Renders byline immediately |
| ReleaseDownloader | 92 | `client:idle` | Fetches from GitHub; can wait |
| LogoMerge | 48 | Static (no hydration) | Pure SVG, no interactivity |

## Tasks

### 4.1 — Copy Vue SFCs

Copy `.vitepress/theme/components/*.vue` → `astro/src/components/*.vue`. No source changes for the first pass.

### 4.2 — Replace VitePress-specific imports

Some components use `vitepress` APIs:
- `BlogByline.vue` — `useData()` for frontmatter + page.lastUpdated
- `BlogIndex.vue` — `createContentLoader`
- `HomePage.vue`, `ModelLanding.vue` — possibly `useData`

For Astro, replace these with props passed from the parent `.astro` file:

```astro
---
// in astro/src/pages/blog/[slug].astro
import { getEntry } from 'astro:content'
const entry = await getEntry('blog', Astro.params.slug!)
const { Content } = await entry.render()
import BlogByline from '../components/BlogByline.vue'
---
<BlogByline client:load authors={entry.data.authors} date={entry.data.date} lastUpdated={entry.body ? Date.now() : undefined} />
```

Refactor `BlogByline.vue` to accept `authors`, `date`, `lastUpdated` as props (with VitePress fallback for transitional period):

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'  // optional fallback for VitePress
import { formatDate, formatLastUpdated, formatAuthors } from '../data/format'

const props = defineProps<{
  authors?: string[]
  date?: string
  lastUpdated?: number
}>()

// Use props if provided, otherwise fall back to VitePress useData
let frontmatter = { authors: props.authors, date: props.date }
let page = { lastUpdated: props.lastUpdated }
try {
  const vp = useData()
  if (!props.authors) frontmatter = vp.frontmatter.value
  if (props.lastUpdated === undefined) page = vp.page.value
} catch { /* not in VitePress */ }
</script>
```

### 4.3 — Replace `createContentLoader`

In VitePress:
```ts
import { createContentLoader } from 'vitepress'
export default createContentLoader('blog/*.md')
```

In Astro, the parent `.astro` page passes the post list as a prop:

```astro
---
// astro/src/pages/blog/index.astro
import { getCollection } from 'astro:content'
import BlogIndex from '../components/BlogIndex.vue'
const posts = (await getCollection('blog'))
  .sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date))
  .map(p => ({
    url: `/blog/${p.slug}`,
    title: p.data.title,
    date: p.data.date,
    authors: p.data.authors,
    description: p.data.description,
  }))
---
<BlogIndex client:idle posts={posts} />
```

Refactor `BlogIndex.vue` to accept `posts` as a prop instead of using the loader.

### 4.4 — Island mounting examples

```astro
<!-- astro/src/pages/index.astro -->
<BaseLayout title="Glossarist">
  <HomePage client:load />
</BaseLayout>
```

```astro
<!-- astro/src/pages/reference/schema-browser.astro -->
<BaseLayout title="Schema Browser" fullscreen={true}>
  <SchemaReference client:visible />
</BaseLayout>
```

```astro
<!-- astro/src/pages/index.astro hero -->
<LogoMerge />  <!-- no hydration directive = server-rendered only -->
```

### 4.5 — Vitest coverage for ported components

Existing tests in `test/components/*.test.ts` continue to work because:
- Tests import directly from `astro/src/components/*.vue` (after path update)
- Mocked `vitepress` module still works (fallback path takes over)

Move test files to `astro/test/components/*.test.ts` and update paths.

### 4.6 — LogoMerge as `.astro`?

LogoMerge is 48 LOC of pure SVG with no script. Consider porting to `LogoMerge.astro` for zero-JS output. The decision: **leave as `.vue` for now** to avoid breaking changes during migration. Can revisit post-cutover.

## Acceptance

- All 10 components mount correctly in Astro pages.
- Hydration directives are correct (visible components hydrate when scrolled to; load components hydrate immediately; static components never hydrate).
- Component tests in `test/components/*.test.ts` pass against the new locations.
- No component uses `vitepress` API without a fallback path.

## Next

→ `05-pages-and-routing.md`
