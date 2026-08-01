# TODO 17 — Shared Renderer Extraction: EXECUTION STATUS

## Status
◑ Partially executed — extraction plan documented, package skeleton created.

## Extraction plan

### Target package: `@glossarist/diagram-kit`

```
packages/diagram-kit/
  src/
    index.ts                 # Public API
    render-hyperedge.ts      # renderHyperedge(edge, options) → SVG string
    render-multiplicity.ts   # MECE table renderer
    types.ts                 # Shared types (re-export from @glossarist/types)
  test/
    render-hyperedge.test.ts # Test suite
  package.json
  README.md
```

### API sketch

```typescript
export interface RenderOptions {
  theme: 'light' | 'dark' | 'auto'
  layout: 'rake' | 'tree-branch'
  showLabels: boolean
  showWirePreview: boolean
}

export function renderHyperedge(
  edge: ParsedHyperedge,
  options: RenderOptions,
): string  // returns SVG string
```

### Migration steps

1. Extract the inline SVG renderer from `HyperedgePlayground.vue`
2. Extract the rake renderer from concept-browser's `HyperedgeDiagram.vue`
3. Merge into `@glossarist/diagram-kit`
4. Replace both consumers with the shared package
5. Publish to npm

### Consumers

- glossarist.org `/playground/hyperedges` (currently hand-rolled)
- glossarist.org `/model/hyperedges` (currently static SVG files)
- concept-browser sphere visualization (currently internal)
- Future: adoption tutorial sites

## Why this is lower priority

The two current surfaces (playground + docs) serve different audiences
(authors vs readers) and may legitimately want different visuals. A
third consumer would make extraction clearly worthwhile. The hand-rolled
playground renderer works for its teaching scope.

Revisit when:
- glossarist.org adds more interactive diagram types
- concept-browser's renderer matures
- A third consumer appears
