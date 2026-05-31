---
title: YAML Schema Reference
description: V2 and V3 YAML schema definitions and enumeration values defined by the Glossarist concept model
---

# YAML Schema Reference

Glossarist concept data is stored as YAML files following the [Glossarist concept model](https://github.com/glossarist/concept-model/tree/main).

The YAML schemas for `concept` and `localized_concept` are available at the [concept-model repository](https://github.com/glossarist/concept-model/tree/main/yaml_schemas).

## V2 and V3 schema

The concept model has two major schema versions:

- **V2** — The original format, with concepts and localized concepts in separate directories (`concept/` and `localized_concept/`)
- **V3** — The current format, supporting grouped concepts (all localizations in a single file), extended designation types, and a formally defined OWL ontology and SHACL shapes for validation

Both formats are supported by `glossarist-ruby` for reading and writing.

## Entity Schemas and Enumerations

The schemas below reflect the Glossarist concept model's entity types and controlled vocabularies. The same definitions are available as an OWL ontology with SHACL shapes in the [Ontology Browser](/ontology).

<YamlSchemas />

## Links

- [Concept model repository](https://github.com/glossarist/concept-model)
- [YAML schemas](https://github.com/glossarist/concept-model/tree/main/yaml_schemas)
- [OWL ontology](https://github.com/glossarist/concept-model/tree/main/ontologies)
- [Ontology Browser](/ontology) — Interactive browser for the full ontology
