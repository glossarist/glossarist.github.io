# 2. Move Ontology Browser into the Docs Tree

## Problem

The ontology browser lives at `/ontology` — a standalone page at the site root with:
- Its own `layout: page` (full-width, no sidebar)
- No breadcrumbs
- No relation to the docs sidebar
- No link from any docs page except the nav dropdown and `docs/model/ontology.md` (which is just a JS redirect)

The `docs/model/ontology.md` file is a redirect stub that does `window.location.replace('/ontology')`. This is a hack — it means `/docs/model/ontology` (which is in the docs tree) redirects to a completely separate layout outside the docs.

## Why This Is Wrong

1. The ontology browser documents the concept model — it belongs in `/docs/model/`
2. Users browsing the model sidebar never see it
3. It has no sidebar context, so users can't navigate to related model pages
4. The redirect stub in `docs/model/ontology.md` is dead weight — VitePress builds it just to redirect
5. Search engines index `/ontology.html` as a standalone page with no surrounding navigation context

## Proposed Fix

Move the ontology browser to `/docs/model/ontology.md`:

```
docs/model/ontology.md   ← Actual content (not a redirect)
```

### Changes to make:

1. **Replace `docs/model/ontology.md`** — remove the redirect stub, put `<OntologyBrowser />` here instead
2. **Remove `ontology.md` from the site root** — it's no longer needed
3. **Update the nav dropdown** — change `/ontology` to `/docs/model/ontology`
4. **Update the sidebar** — add "Ontology Browser" to the model sidebar
5. **Update `layout: page`** — the OntologyBrowser component needs the full-width `layout: page` frontmatter, which works fine within `/docs/model/`
6. **Update `docs/model/index.md`** — the "Reference sections" list already links to `/docs/model/ontology`, just make sure it points to the new location

### Sidebar:

```ts
'/docs/model/': [
  {
    text: 'Concept Model',
    items: [
      { text: 'Overview', link: '/docs/model/' },
      { text: 'Concepts', link: '/docs/model/concepts' },
      { text: 'Designations', link: '/docs/model/designations' },
      { text: 'Relationships', link: '/docs/model/relationships' },
      { text: 'Sources', link: '/docs/model/sources' },
      { text: 'Term Types', link: '/docs/model/term-types' },
      { text: 'YAML Schema Reference', link: '/docs/model/schemas/' },
      { text: 'Entity Field Reference', link: '/docs/model/schemas/entity-fields' },
      { text: 'Ontology Browser', link: '/docs/model/ontology' },
    ]
  },
]
```

### Cleanup:
- Delete root-level `ontology.md`
- Remove redirect JavaScript from `docs/model/ontology.md`

## Files to Modify

- `docs/model/ontology.md` — Replace redirect with actual OntologyBrowser component
- `ontology.md` — Delete
- `.vitepress/config.ts` — Update nav link and sidebar
