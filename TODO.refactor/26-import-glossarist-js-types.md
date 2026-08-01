# TODO 26 — Import glossarist-js types when *Json interfaces are public

## Status
☐ Not started — blocked on glossarist-js re-exporting `*Json` interfaces from its public API

## Motivation

glossarist-js v0.4.51 is now fully TypeScript. It exports:
- Runtime model classes: `Concept`, `PartitiveHyperedge`, `PartitiveMember`, `GenericMember`, etc.
- Enum constants: `RELATIONSHIP_TYPES`, `PARTITIVE_ENUMERATION_VALUES`, etc.
- Internal `*Json` interfaces: `ConceptJson`, `AbstractHyperedgeJson`, `ConceptRefJson`, etc.

The `*Json` interfaces are used internally by model constructors and `toJSON()`/`fromJSON()` methods. They describe the exact wire/YAML shape — which is what our hand-rolled `src/types/concept-yaml.ts` also describes.

Currently our hand-rolled types can drift from the SDK. If glossarist-js adds a field, our types won't know until someone manually updates them.

## What's needed from glossarist-js

glossarist-js should re-export its `*Json` interfaces from `src/models/index.ts`:

```ts
// src/models/index.ts addition:
export type { ConceptJson } from './concept.js';
export type { LocalizedConceptJson } from './localized-concept.js';
export type { AbstractHyperedgeJson } from './abstract-hyperedge.js';
export type { HyperedgeMemberJson } from './hyperedge-member.js';
export type { ConceptRefJson } from './concept-ref.js';
export type { RelatedConceptJson } from './related-concept.js';
// ... etc
```

Then the root `src/index.ts` already re-exports from `./models/index.js`, so these become available at `import type { ConceptJson } from 'glossarist'`.

## What we'll do when unblocked

Replace `src/types/concept-yaml.ts` with:

```ts
// src/types/concept-yaml.ts (rewritten as thin re-exports)
export type {
  ConceptJson as ConceptYaml,
  AbstractHyperedgeJson as HyperedgeYaml,
  HyperedgeMemberJson as HyperedgeMemberYaml,
  ConceptRefJson as ConceptRef,
} from 'glossarist'

export { RELATIONSHIP_TYPES as RELATED_TYPE_ENUM } from 'glossarist'
```

This eliminates ~250 lines of hand-rolled types and makes us a pure consumer of the SDK's type definitions. Adding a field to glossarist-js automatically appears in our types.

## Why not install glossarist as a dependency now?

Installing glossarist pulls in n3, @rdfjs/data-model, @rdfjs/dataset, jsonld, jszip, rdf-validate-shacl — ~5MB of Node-targeted deps. Even though `import type` is erased at compile time (zero runtime cost), the install bloats node_modules and may confuse Vite's dependency optimizer.

When glossarist-js ships a browser-safe type-only subpath (`glossarist/types`), this concern goes away. Until then, the hand-rolled types are the pragmatic choice.

## Acceptance criteria

- [ ] glossarist-js re-exports `*Json` interfaces from public API
- [ ] glossarist-js ships `glossarist/types` subpath (type-only, zero runtime deps)
- [ ] Our `src/types/concept-yaml.ts` becomes thin re-exports
- [ ] Cross-repo test verifies enum values match
- [ ] All existing tests pass with the SDK types

## Dependencies

- glossarist-js PR to re-export `*Json` interfaces
- glossarist-js PR to add `glossarist/types` subpath export
