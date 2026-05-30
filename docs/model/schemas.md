---
title: YAML Schema Reference
description: V2 and V3 YAML schema definitions and enumeration values, rendered from the Glossarist ontology
---

# YAML Schema Reference

Glossarist concept data is stored as YAML files following the [Glossarist concept model](https://github.com/glossarist/concept-model/tree/main).

The YAML schemas for `concept` and `localized_concept` are available at the [concept-model repository](https://github.com/glossarist/concept-model/tree/main/yaml_schemas).

## V2 and V3 schema

The concept model has two major schema versions:

- **V2** — The original format, with concepts and localized concepts in separate directories (`concept/` and `localized_concept/`)
- **V3** — The current format, supporting grouped concepts (all localizations in a single file), extended designation types, and ontology alignment

Both formats are supported by `glossarist-ruby` for reading and writing.

## Entity Schemas and Enumerations

The schemas below are rendered from the [Glossarist OWL ontology](/ontology) — the canonical source of truth. Every SHACL shape and SKOS ConceptScheme in the ontology is shown here.

<YamlSchemas />

## Links

- [Concept model repository](https://github.com/glossarist/concept-model)
- [YAML schemas](https://github.com/glossarist/concept-model/tree/main/yaml_schemas)
- [OWL ontology](https://github.com/glossarist/concept-model/tree/main/ontologies)
- [Ontology Browser](/ontology) — Interactive browser for the full ontology
