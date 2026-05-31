# 7. Cross-Link Model Docs and Schema Reference

## Problem

The model docs and schema reference are parallel universes with almost no cross-links:

- `concepts.md` describes ManagedConcept fields but doesn't link to the JSON Schema definition or the entity field reference
- `designations.md` explains the designation hierarchy but doesn't link to the schema
- `relationships.md` shows relationship types but doesn't link to the YAML examples
- `sources.md` describes source types but doesn't link to the source schema definition
- The schema browser has no links back to the conceptual docs

A user reading about Designations in the model docs has no way to jump to the authoritative schema definition of what fields a Designation has. They'd have to navigate to Schemas → find the right definition → expand it.

## Proposed Cross-Links

### From model docs → schema reference

Each conceptual page should link to its corresponding schema entity:

```markdown
<!-- concepts.md -->
## ManagedConcept

See the [ManagedConcept schema definition](/docs/model/schemas/yaml-reference#managedconcept) for the authoritative field list.

<!-- designations.md -->
## Designation Types

See the [Designation schema](/docs/model/schemas/yaml-reference#designation) for all fields.

<!-- sources.md -->
## ConceptSource

See the [ConceptSource schema](/docs/model/schemas/yaml-reference#conceptsource) for the full field reference.
```

### From schema reference → model docs

The schema browser should add contextual links:

```markdown
<!-- In the schema definition for ManagedConcept -->
Description: "A managed concept entity."
Link: [Learn about concepts →](/docs/model/concepts)
```

This requires the schema browser to know which definitions map to which doc pages. Could be a static mapping in the component.

### From examples → model docs

Each example in the sidebar should have a one-line description and link to the relevant concept page:

```markdown
02-designation-abbreviation.yaml → "Abbreviation designations" → links to /docs/model/designations
06-related-relationships.yaml → "All relationship types" → links to /docs/model/relationships
```

## Static Mapping

Add a mapping file or inline map that connects schema `$defs` names to doc page paths:

```ts
const entityDocLinks: Record<string, string> = {
  ManagedConcept: '/docs/model/concepts',
  LocalizedConcept: '/docs/model/concepts',
  Designation: '/docs/model/designations',
  Abbreviation: '/docs/model/designations',
  // ...
  ConceptSource: '/docs/model/sources',
  RelationshipType: '/docs/model/relationships',
  // ...
}
```

## Files to Modify

- `docs/model/concepts.md` — Add cross-links to schema reference
- `docs/model/designations.md` — Add cross-links
- `docs/model/relationships.md` — Add cross-links
- `docs/model/sources.md` — Add cross-links
- `docs/model/term-types.md` — Add cross-links
- `SchemaReference.vue` — Add doc links to definition headers
