---
title: Concept Model
description: The Glossarist concept model — a self-contained, technology-neutral information model for structured terminology management
---

# The Glossarist Concept Model

A self-contained information model for terminology management, aligned with ISO 10241-1, 704, 30042, 12620, and 25964 — designed to handle everything from simple glossaries to complex multilingual concept systems, with interoperability across multiple technology ecosystems.

<ModelLanding />

## How concepts work

Every Glossarist concept is a **ManagedConcept** — a language-independent entity that groups per-language **LocalizedConcept** instances. Each localization carries its own definitions, designations, notes, examples, and source references.

![Concept-Term interaction cycle](/images/model/concept-term-cycle.png)

The model separates *what a concept is* (its identity, lifecycle, relationships) from *how it is expressed* (terms, abbreviations, symbols in different languages). This separation lets you maintain concept-level relationships (broader, narrower, equivalent) independently of language-specific terminology.

## Authoring concepts in YAML

Concepts are authored in structured YAML files. The V3 schema consolidates all localizations into a single file per concept:

```yaml
# concepts/3.1.1.1.yaml
termid: "3.1.1.1"
termid_uuid: "a1b2c3d4-..."
status: valid

eng:
  terms:
    - type: expression
      designation: "entity"
      normative_status: preferred
  definition:
    - content: "A concrete or abstract thing that exists, has existed, or can exist"
  notes:
    - "This includes objects, concepts, and relationships"
  sources:
    - type: authoritative
      origin: "ISO 19107:2003, 4.5"
      status: identical

fra:
  terms:
    - type: expression
      designation: "entité"
      normative_status: preferred
  definition:
    - content: "chose concrète ou abstraite qui existe, a existé ou peut exister"
  sources:
    - type: authoritative
      origin: "ISO 19107:2003, 4.5"
      status: identical
```

See the [YAML Schema Reference](/reference/schema-browser) for complete field documentation and enum values, or the [Entity Field Reference](/reference/entity-fields) for per-entity field lists with types and cardinality.

## Standards alignment

Every entity in the Glossarist model maps to established international standards:

| Standard | Role in Glossarist |
|----------|-------------------|
| **ISO 10241-1** | Terminology entries in standardized vocabularies — concept structure, designations, sources |
| **ISO 704** | Principles and methods — concept systems, definitions, term formation rules |
| **ISO 30042 / TBX** | Terminology markup framework — data exchange format |
| **ISO 12620** | Data category registry — term type classifications |
| **ISO 25964** | Thesauri — hierarchical and mapping relationships (BTG/NTG, BTP/NTP, BTI/NTI) |
| **OWL 2 / SHACL** | Formal model definition — the concept model is expressed as an OWL ontology with SHACL shapes for validation and Semantic Web interoperability |
| **SKOS / SKOS-XL** | Knowledge organization — concept schemes and reified labels for linked data mapping |

## Processing with code

### JavaScript (glossarist-js)

```js
import { loadGcr, readConcepts } from 'glossarist';

const concepts = readConcepts('./geolexica-v2/');
concepts.forEach(c => {
  console.log(c.id, c.primaryDesignation('eng'));
});
```

### Ruby (glossarist-ruby)

```ruby
require 'glossarist'

collection = Glossarist::ManagedConceptCollection.new
collection.from_yaml('./concepts/')

concept = collection['3.1.1.1']
puts concept.localizations['eng'].definition
```

## Reference sections

- [Concepts](/docs/model/concepts) — ManagedConcept, LocalizedConcept, concept lifecycle, collections
- [Designations](/docs/model/designations) — Designation type hierarchy, pronunciation, base properties
- [Relationships](/docs/model/relationships) — Typed relationship kinds across 4 standards
- [Sources](/docs/model/sources) — Authoritative source hierarchy and provenance
- [Term Types](/docs/model/term-types) — ISO 12620 term type classifications
- [YAML Schemas](/docs/model/schemas/) — V2 and V3 schema overview and examples
- [YAML Schema Browser](/reference/schema-browser) — Interactive JSON Schema definitions
- [Entity Field Reference](/reference/entity-fields) — Per-entity field reference with types and cardinality
- [Ontology Browser](/reference/ontology) — Interactive OWL ontology and SHACL shape browser
