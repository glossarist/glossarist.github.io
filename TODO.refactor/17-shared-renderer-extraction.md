# 17 — Shared concept-browser renderer extraction

## Status
☐ Not started (requires cross-repo coordination)

## Motivation

The HyperedgePlayground (PR #95) uses a hand-rolled inline SVG renderer. The concept-browser has its own (more sophisticated) renderer with the 3D sphere visualization. Both render the same data; both should look the same; they don't.

DRY violation: two rake renderers for the same data model.

## Scope

Extract concept-browser's `HyperedgeDiagram.vue` + supporting render code into a shared npm package (`@glossarist/diagram-kit` or similar). Both concept-browser and glossarist.org consume it.

## Implementation steps

1. **Identify the boundary** — what's the minimal API surface? Probably `renderHyperedge(hyperedge: HyperedgeYaml, options: { theme, layout }): SVGElement`
2. **Extract to a new repo** — `github.com/glossarist/diagram-kit`
3. **Concept-browser migration** — replace internal renderer with the shared package
4. **Glossarist.org migration** — replace HyperedgePlayground's hand-rolled renderer with the shared package
5. **Publish to npm** — `@glossarist/diagram-kit`

## API sketch

```ts
// @glossarist/diagram-kit
export interface HyperedgeDiagramOptions {
  theme: 'light' | 'dark' | 'auto'
  layout: 'rake' | 'tree-branch' | 'sphere'
  showLabels: boolean
  showWirePreview: boolean
}

export function renderHyperedge(
  edge: ParsedHyperedge,
  options: HyperedgeDiagramOptions,
): string  // returns SVG string
```

## Trade-offs

### Pros

- Single source of truth for rake rendering
- concept-browser improvements propagate to docs (and vice versa)
- New adopters can use the same renderer
- Aligns with glossarist-js's role as the SDK (single source for parsing) — diagram-kit would be the visual companion

### Cons

- Cross-repo coordination overhead (versioning, breaking changes)
- Initial extraction effort (~2-3 days)
- Bundle size: glossarist.org would import the package even on pages that don't show diagrams

## Acceptance criteria

- [ ] `@glossarist/diagram-kit` package created
- [ ] Concept-browser uses the package (no internal renderer)
- [ ] Glossarist.org HyperedgePlayground uses the package
- [ ] Versioning strategy documented (semver; breaking changes via major bump)
- [ ] Test fixtures shared between repos

## Why this TODO is lowest priority

- The hand-rolled renderer works for the playground's teaching scope
- Cross-repo coordination is expensive
- The two surfaces serve different audiences (readers vs authors) and may legitimately want different visuals

Revisit when:
- glossarist.org adds more diagram types (sequential hyperedges, etc.)
- concept-browser's renderer matures further
- A third consumer appears (e.g., an adoption tutorial site)
