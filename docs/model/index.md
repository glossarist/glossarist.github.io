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
tags: [geometry, foundational]

eng:
  terms:
    - type: expression
      designation: "entity"
      normative_status: preferred
  definition:
    - content: "A concrete or abstract thing that exists, has existed, or can exist"
      examples:
        - content: "A bank account, a transaction, a customer"
      notes:
        - content: "Includes objects, concepts, and relationships"
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

## What's new in v3.1

The v3.1.0 release (July 2026) extends the concept model with **dataset-aware structure** and **non-verbal entities**. It is a fully additive release — no existing URI was renamed.

| Addition | What it adds |
|---|---|
| **[Dataset register & sections](/docs/model/datasets)** | Self-describing datasets with hierarchical sections, transitive membership, and ordering method (systematic / mixed / alphabetical) |
| **[Non-verbal entities](/docs/model/non-verbal)** | Dataset-level `Figure`, `Table`, `Formula` with localized captions, alt text, image variants, and subfigures |
| **[Designation relationships](/docs/model/designations#designation-relationships)** | First-class `DesignationRelationship` class for designation-level links (e.g. `abbreviated_form_for`) |
| **Scoped examples** | `examples` on `DetailedDefinition` for VIM 1993-style nested examples (MECE with concept-level `examples`) |
| **Annotations** | Editorial `annotations` field on `LocalizedConcept`, distinct from notes |
| **Inline mentions** | `ConceptSource#id` enables cite mentions in running text; fig mentions for figures (see [Sources](/docs/model/sources#inline-citations)) |
| **Tags** | Free-form `tags` array on concepts for grouping and filtering (distinct from terminological `domains`) |
| **52 relationship types** | MECE coverage of ISO 10241-1, ISO 19135, ISO 25964, SKOS, ISO 12620, and TBX |
| **Canonical prefixes** | `ontologies/prefixes.ttl` is the single source of truth for prefix bindings (`skosxl:` is canonical) |
| **2 new SKOS taxonomies** | `ordering-method` and `concept-reference-type` — bringing the total to **16 taxonomies** |

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
collection.load_from_files('./concepts/')

concept = collection['3.1.1.1']
puts concept.localizations['eng'].definition
```

## Reference sections

- [Concepts](/docs/model/concepts) — ManagedConcept, LocalizedConcept, concept lifecycle, collections
- [Designations](/docs/model/designations) — Designation type hierarchy, pronunciation, base properties
- [Relationships](/docs/model/relationships) — Typed relationship kinds across 4 standards
- [Sources](/docs/model/sources) — Authoritative source hierarchy and provenance
- [Datasets & sections](/docs/model/datasets) — DatasetRegister, hierarchical sections, ordering, bibliography
- [Non-verbal entities](/docs/model/non-verbal) — Figure, Table, Formula as dataset-level resources
- [Term Types](/docs/model/term-types) — ISO 12620 term type classifications
- [YAML Schemas](/docs/model/schemas/) — V2 and V3 schema overview and examples
- [YAML Schema Browser](/reference/schema-browser) — Interactive JSON Schema definitions
- [Entity Field Reference](/reference/entity-fields) — Per-entity field reference with types and cardinality
- [Ontology Browser](/reference/ontology) — Interactive OWL ontology and SHACL shape browser
