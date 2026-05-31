---
title: YAML Schemas
description: JSON Schema definitions for Glossarist concept data — V2 and V3 format, examples, and field reference
---

# YAML Schemas

Glossarist concept data is stored as YAML files validated against [JSON Schema](https://json-schema.org/) definitions. The canonical schemas live in the [concept-model repository](https://github.com/glossarist/concept-model/tree/main/schemas).

The concept model has two major schema versions:

- **V2** — Original format, with concepts and localized concepts in separate directories
- **V3** — Current format, with all localizations in a single file per concept, extended designation types, and a formally defined OWL ontology with SHACL shapes for validation

Both formats are supported by [glossarist-ruby](/docs/software/glossarist-ruby) and [glossarist-js](/docs/software/glossarist-js) for reading and writing.

## Reference

| Section | Description |
|---------|-------------|
| [YAML Schema Reference](/reference/schema-browser) | Interactive browser for JSON Schema definitions — properties, types, enums, and definitions for V2 and V3 |
| [Entity Field Reference](/reference/entity-fields) | Field-level reference for every entity type, with types, cardinality, and allowed values |

## Examples

Each schema feature is demonstrated with standalone YAML examples in the concept-model repository:

| # | Topic | What it shows |
|---|-------|---------------|
| 01 | Minimal concept | Smallest valid concept + localization |
| 02 | Designations | All 7 designation types, grammar info, term types |
| 03 | Pronunciation | IPA, Hepburn romanization, script cascade |
| 04 | Definition, notes, examples | DetailedDefinition with per-item sources |
| 05 | Domains | Classification and subject area references |
| 06 | Relationships | All 32 typed semantic relationship types |
| 07 | Sources & citations | All 10 source statuses, locality, custom locality |
| 08 | Multi-language | Four scripts (Latn, Arab, Hani, Cyrl) in one concept |
| 09 | Non-verbal representations | Images, tables, formulas |
| 10 | Concept references | Local, URN, and designation references |
| 11 | Lifecycle & review | Status transitions, review metadata, release version |
| 12 | Absent designations | Explicitly missing designations, international symbols |
| 13 | Superseded & deprecated | Full deprecation lifecycle |
| 14 | Term types | All 34 ISO 12620 term type values |
| 15 | Citation features | Locality ranges, custom locality, links |

- [V3 examples (GitHub)](https://github.com/glossarist/concept-model/tree/main/schemas/v3/examples)
- [V2 examples (GitHub)](https://github.com/glossarist/concept-model/tree/main/schemas/v2/examples)
