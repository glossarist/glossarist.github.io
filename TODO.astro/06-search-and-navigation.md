# 06 — Search and Navigation

**Goal:** Reproduce VitePress's local search + sidebar + top nav in Astro.

## Search

### Replace VitePress local search with Pagefind

VitePress ships a `flexsearch`-based local search built into the theme. In Astro, use `astro-pagefind`:

```bash
npm install astro-pagefind
```

```js
// astro.config.mjs
import pagefind from 'astro-pagefind'
export default defineConfig({
  integrations: [/* ... */, pagefind()],
})
```

Pagefind indexes the built HTML at build time and serves a search UI from `/_pagefind/`.

### Search UI

Two options:

**A. Native VitePress-style search box in nav (recommended for parity)**

Add a search input to `Nav.astro` that opens Pagefind's UI:

```astro
<!-- Nav.astro -->
<div class="search-box">
  <input type="text" placeholder="Search docs..." id="search-input" />
</div>
<script>
  import { PagefindUI } from '@pagefind/default-ui'
  new PagefindUI({ element: '#search-input', baseUrl: '/' })
</script>
```

**B. Dedicated /search/ page**

A modal or full-page search. Add a magnifier icon to nav that links to `/search/`.

Match VitePress behavior — it shows a search modal triggered by Ctrl/Cmd+K or clicking the box. Pick option A for parity.

### Keyboard shortcut

VitePress binds Cmd+K / Ctrl+K to focus search. Reproduce:

```js
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    document.getElementById('search-input')?.focus()
  }
})
```

## Navigation (top nav)

### Port from `.vitepress/config.ts`

The nav structure:
```
- Model (dropdown: Overview, Concepts, Designations, Relationships, Sources, Datasets & Sections, Non-verbal Entities, Term Types, Standards)
- Reference (dropdown: Overview, Schema Browser, Entity Fields, Ontology Browser)
- Software (dropdown: dynamic from projects.ts)
- Docs (dropdown: Desktop App, Core Concepts, Adopt Glossarist)
- Blog
- About
```

### Implementation

`src/components/Nav.astro`:

```astro
---
import { nav } from '../data/nav'
import { softwareNavItems } from '../data/projects'
---
<nav>
  {nav.map(item => (
    <div class="nav-item">
      {item.items ? (
        <>
          <button>{item.text}</button>
          <ul class="dropdown">
            {item.items.map(sub => <li><a href={sub.link}>{sub.text}</a></li>)}
          </ul>
        </>
      ) : (
        <a href={item.link}>{item.text}</a>
      )}
    </div>
  ))}
</nav>
```

The Software dropdown dynamically maps from `projects.ts`:

```ts
// src/data/nav.ts
import { softwareNavItems } from './projects'
export const nav = [
  { text: 'Model', items: [/* ... */] },
  { text: 'Reference', items: [/* ... */] },
  { text: 'Software', items: softwareNavItems },
  { text: 'Docs', items: [/* ... */] },
  { text: 'Blog', link: '/blog' },
  { text: 'About', link: '/about' },
]
```

## Sidebars

### Per-section sidebars

VitePress configures 5 distinct sidebars keyed by URL prefix:
- `/docs/desktop/`
- `/docs/model/`
- `/docs/core-concepts/`
- `/docs/adopt/`
- `/docs/software/`

Port each to `src/data/sidebars.ts`:

```ts
export const sidebars: Record<string, SidebarGroup[]> = {
  '/docs/desktop/': [
    {
      text: 'Desktop Application',
      items: [
        { text: 'Getting Started', link: '/docs/desktop/' },
        { text: 'Installation', link: '/docs/desktop/getting-started/installation' },
        { text: 'First Launch', link: '/docs/desktop/getting-started/initial-setup' },
      ],
    },
    // ... Tutorials, Interface Reference, Topics
  ],
  '/docs/model/': [ /* ... */ ],
  '/docs/core-concepts/': [ /* ... */ ],
  '/docs/adopt/': [ /* ... */ ],
  '/docs/software/': [ /* ... */ ],
}
```

### Active-link detection

`Sidebar.astro` walks the current path, marks the active entry:

```astro
---
import { sidebars } from '../data/sidebars'
const current = Astro.url.pathname
const prefix = Object.keys(sidebars).find(p => current.startsWith(p)) || ''
const sidebar = sidebars[prefix] || []
---
<aside>
  {sidebar.map(group => (
    <section>
      <h3>{group.text}</h3>
      <ul>
        {group.items.map(item => (
          <li class={current === item.link ? 'active' : ''}>
            <a href={item.link}>{item.text}</a>
          </li>
        ))}
      </ul>
    </section>
  ))}
</aside>
```

### Outline (right-side in-page nav)

VitePress shows an outline of h2/h3 anchors on the right. Reproduce in `Outline.astro`:

```astro
---
const headings = Astro.props.headings  // passed from page
---
<aside class="outline">
  <ul>
    {headings.filter(h => h.depth >= 2 && h.depth <= 3).map(h => (
      <li class={`depth-${h.depth}`}>
        <a href={`#${h.slug}`}>{h.text}</a>
      </li>
    ))}
  </ul>
</aside>
```

The page passes headings to the layout:

```astro
---
// src/pages/docs/[...path].astro
const { headings } = Astro.props  // Astro auto-extracts from rendered markdown
const { Content } = await entry.render()
---
<DocLayout headings={headings} sidebar={sidebar}>
  <Content />
</DocLayout>
```

### Mobile sidebar toggle

VitePress collapses sidebar on mobile (< 768px). Reproduce with a hamburger button that toggles a `.open` class via small inline script.

## Acceptance

- Pagefind builds a working search index at `/_pagefind/`.
- Search box in nav works; Cmd+K / Ctrl+K focuses it.
- Top nav dropdowns render all items from `nav.ts`.
- Software dropdown items come from `projects.ts`.
- Each `/docs/*` section shows the correct sidebar with active link.
- Right-side outline shows on desktop for doc pages with h2/h3.

## Next

→ `07-build-scripts-integration.md`
