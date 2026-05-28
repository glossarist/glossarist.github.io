# 07 - Embed Ontology Browser

Integrate the concept-browser's ontology view as an embedded Vue component.

## Source

The concept-browser (`glossarist-vocabulary-browser`) has:
- `src/views/OntologySchemaView.vue` — class tree + detail panel + taxonomy filtering
- `src/composables/use-ontology-nav.ts` — shared reactive state
- `scripts/generate-ontology-data.mjs` — parses TTL files → `public/data/taxonomies.json`
- `scripts/generate-ontology-schema.mjs` — generates class/shape definitions
- Reads TTL files from `../concept-model/ontologies/`

## Approach: Extract shared ontology components

### Option A: Git submodule (recommended)
1. Add concept-browser as a git submodule in a `vendor/` directory
2. Import and re-export the ontology-related Vue components
3. Share the generated JSON data files

### Option B: Copy components
1. Copy OntologySchemaView.vue → `.vitepress/theme/components/OntologyBrowser.vue`
2. Copy use-ontology-nav.ts composable
3. Adapt imports and remove concept-browser-specific dependencies (datasets, routing)
4. Pre-generate the JSON data as a build step

### Option C: Iframe embed
1. Deploy concept-browser somewhere (e.g., glossarist.github.io/concept-browser)
2. Embed via iframe with `/ontology` path
3. Least effort but poor integration (no shared navigation)

## Decision: Option B for MVP

Copy and adapt the ontology components. The ontology browser in this site is read-only
(no dataset switching, no concept search, no graph view). It only shows the model
class hierarchy, properties, and taxonomy details.

### Dependencies to include

The ontology browser needs:
- `taxonomies.json` — generated from TTL files
- `ontology-schema.json` — generated class/shape definitions
- Vue 3 composable (use-ontology-nav.ts)
- Tailwind CSS classes (must configure Tailwind in VitePress)

### Build pipeline

Add a script `scripts/generate-ontology-data.sh`:
1. Clone/update concept-model (or read from submodule)
2. Run the TTL parser scripts
3. Output JSON to `public/data/`

### VitePress page

```md
# docs/model/ontology.md
---
layout: page
title: Ontology Browser
---

<OntologyBrowser />
```
