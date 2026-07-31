# ADR 0002: Hand-rolled playground validators, not bundled glossarist-js

## Status

Accepted (2026-07-31)

## Context

The Hyperedge and Validator Playgrounds (`/playground/hyperedges`, `/playground/validators`) need to validate user-entered YAML in the browser. The canonical validators live in `glossarist-js`, which is a Node-targeted library that pulls in:

- `n3` (RDF parser)
- `@rdfjs/data-model`, `@rdfjs/dataset` (RDF data model)
- `jsonld` (JSON-LD processor)
- `jszip` (archive handling)
- `rdf-validate-shacl` (SHACL validation engine)

Bundling these for the browser is technically possible but fragile:

- Several deps assume Node `Buffer` / `fs` / `path` APIs
- Vite's `optimizeDeps` struggles with some of them; breaks across Vite minor versions
- Bundle size: ~1.5 MB+ just for the validators
- The browser environment doesn't need SHACL or RDF — only the structural checks

## Decision

Hand-roll the structural validators in TypeScript, mirroring glossarist-js's `check-*` rule semantics. Each hand-rolled rule:

- Cites the same ISO standard section as the SDK equivalent
- Produces the same error messages
- Lives in `src/components/HyperedgePlayground.vue` and `src/components/ValidatorPlayground.vue`
- Imports canonical enumerations from `src/types/concept-yaml.ts` (single source of truth)

The playground pages explicitly document what the hand-rolled rules do NOT cover (SHACL, cross-concept reference resolution, dataset coherence) and point users to glossarist-js for production validation.

## Consequences

**Pros**
- Playground loads fast (~50 KB validators vs ~1.5 MB bundled SDK)
- No Vite optimization fragility
- Self-contained — playground works even if glossarist-js's deps break

**Cons**
- Two implementations of each rule. Risk of drift.
  - **Mitigation**: canonical enumerations in `src/types/concept-yaml.ts` are shared. Tests in `test/canonical-enums.test.ts` enforce uniqueness + completeness.
  - **Mitigation**: field-name regression test (`test/content-references.test.ts`) catches `characteristic:` vs `delimitingCharacteristic:` drift.

**When to revisit**
- If glossarist-js ships a browser-compatible build (`glossarist-js/browser`), swap the hand-rolled rules for the SDK and delete the duplicate.
- If a third playground is added, extract the rule implementations into a shared module.

## Alternatives considered

- **Bundle glossarist-js as-is** — rejected for bundle size + Vite fragility
- **Server-side validation via edge function** — would require a non-static deployment; breaks the GitHub Pages model
- **Subset of glossarist-js (tree-shaken)** — `rdf-validate-shacl` and `n3` aren't tree-shakeable; can't reduce enough

## References

- TODO.refactor/17 (shared renderer extraction) — related but different concern
- /playground/validators page footer — explicit user-facing scope statement
