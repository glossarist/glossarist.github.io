# 1. Split schemas.md into Dedicated Pages

## Problem

`/docs/model/schemas` is a single page that tries to be three things:
1. An intro explaining JSON Schema and V2/V3 differences
2. A schema browser (`<SchemaReference />`) — a full-page component crammed into a markdown section
3. An ontology entity view (`<YamlSchemas />`) — another full-page component buried at the bottom

The result: neither component gets the space or context it needs. The schema browser has 14 collapsed definitions, a sidebar, version switching — all fighting for screen space alongside prose and tables. The ontology view is hidden below the fold with no way to discover it.

Additionally, `<SchemaReference />` is entirely client-rendered: it fetches YAML files at runtime, shows a loading spinner, and is invisible to search engines. For static documentation, this is wrong.

## Proposed Structure

Replace the single `schemas.md` with a `schemas/` directory:

```
docs/model/schemas/
├── index.md              ← Intro page: what schemas are, V2/V3 overview, links to sub-pages
├── yaml-reference.md     ← The schema browser (dedicated full page)
└── entity-fields.md      ← The YamlSchemas entity view (dedicated full page)
```

### `schemas/index.md`
- Intro text about JSON Schema, V2/V3 differences, links to glossarist-ruby and glossarist-js
- Card grid linking to YAML Reference and Entity Fields
- Examples table (moved here from current schemas.md)
- Links to GitHub example directories

### `schemas/yaml-reference.md`
- Full-page schema browser component
- Change `<SchemaReference />` to pre-render at build time instead of client-fetching:
  - `copy-schemas.mjs` already copies schemas to `public/data/schemas/`
  - Add a new build script that generates a JSON representation of all schemas (properties, types, enums, definitions) into `public/data/schemas/processed.json`
  - Or better: generate a VitePress data loader that makes the schema available at build time
  - The component should hydrate from pre-rendered HTML, not fetch on mount
- Remove the examples sidebar from this component (examples live on index.md)

### `schemas/entity-fields.md`
- `<YamlSchemas />` gets its own page with proper heading and context
- Or better: inline the entity field reference as pre-rendered tables

## Sidebar Update

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
      // Replace single "Schemas" with group
      { text: 'YAML Schema Reference', link: '/docs/model/schemas/' },
      { text: 'Entity Field Reference', link: '/docs/model/schemas/entity-fields' },
    ]
  },
]
```

## Build-Time Pre-Rendering (Critical)

The current `<SchemaReference />` fetches YAML at runtime. This needs to change:

**Option A: Build-time data generation**
- Extend `copy-schemas.mjs` to generate a `processed.json` with all schema properties, types, enums, and definitions pre-extracted
- The component loads from this JSON (smaller payload, no YAML parsing needed)
- Still client-rendered but faster

**Option B: VitePress data loader**
- Use VitePress's `createLoader` or a custom plugin to inject schema data at build time
- The component renders server-side during VitePress build
- Full SEO, no spinner, instant load
- This is the correct approach

**Option C: Static markdown generation**
- Build script generates `.md` files from schemas at build time
- Pure static HTML, no component needed
- Most SEO-friendly but loses interactivity (version switcher, collapsible defs)

Recommendation: **Option B**. Pre-render the schema data at build time using VitePress's data loading, then hydrate the component for interactivity.

## Files to Modify

- Delete `docs/model/schemas.md`
- Create `docs/model/schemas/index.md`
- Create `docs/model/schemas/yaml-reference.md`
- Create `docs/model/schemas/entity-fields.md`
- Update `.vitepress/config.ts` sidebar
- Update `.vitepress/config.ts` nav dropdown
- Possibly modify `SchemaReference.vue` for SSR compatibility
- Possibly add build-time schema processing script
