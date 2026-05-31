---
title: "Concept Model v3 — OWL ontology, SHACL shapes, and 14 SKOS concept schemes"
description: "The Glossarist concept model v3 introduces an OWL ontology, SHACL shapes for validation, and 14 SKOS taxonomy concept schemes."
authors:
  - Ribose
date: 2026-05-27
---

<BlogByline />

The Glossarist concept model v3 brings formal semantic web integration to terminology management.

## OWL ontology

The concept model now includes an [OWL ontology](https://github.com/glossarist/concept-model/tree/main/ontologies) that defines the complete class hierarchy:

- `ManagedConcept` and `LocalizedConcept` as core classes
- `Designation` hierarchy with subtypes (expression, abbreviation, symbol, letter_symbol, graphical_symbol, prefix, suffix)
- `ConceptSource` with type and status enumerations
- `RelatedConcept` with typed relationship kinds

## SHACL shapes

SHACL (Shapes Constraint Language) shapes provide formal validation rules for concept data. These shapes can be used to:

- Validate YAML datasets against the model
- Generate form schemas automatically
- Ensure data quality in CI/CD pipelines

## 14 SKOS concept schemes

The concept model includes 14 SKOS concept schemes as Turtle (TTL) files, covering:

- Abbreviation types, concept status, date types
- Designation types, entry status, grammar (gender, number)
- Normative status, part of speech, register
- Relationship types, source status, source types, term types

These taxonomies enable precise classification of designations and concepts according to ISO 12620 and ISO 25964.

## Upgrading

The V3 schema is fully supported by [glossarist-ruby 2.8+](/docs/software/glossarist-ruby). Both V2 and V3 formats can be read and written.

See the [concept model documentation](/docs/model/) for details.
