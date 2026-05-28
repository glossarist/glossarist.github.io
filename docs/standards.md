---
title: Standards Compliance
description: Which ISO standards Glossarist implements and how
---

# Standards Compliance

Glossarist implements and aligns with multiple ISO standards for terminology management.

## ISO 10241-1 — Terminology entries

Terminology entries in standardized terminology. Glossarist implements:

- Concept structure, designations, definitions, sources
- [ManagedConcept](/docs/model/concepts), [LocalizedConcept](/docs/model/concepts), [ConceptSource](/docs/model/sources)
- Relationship types: `deprecates`, `supersedes`, `compare`, `contrast`, `see`

## ISO 704 — Terminology work: principles and methods

Concept systems and the concept-term interaction cycle. Glossarist implements:

- Domain classification
- Hierarchical relationships (broader/narrower)
- [Concept-term interaction cycle](/docs/model/)

## ISO 30042 / TBX — Terminology markup framework

TBX-XML export via glossarist-ruby (tbx gem). Glossarist supports:

- Term types, abbreviation types, grammatical information
- GCR package format as TBX exchange medium
- [34 TBX term types](/docs/model/term-types)

## ISO 12620 — Data category registry

Term types and data category classifications. Glossarist implements:

- [34 term type values](/docs/model/term-types)
- Register values (7)
- Part of speech
- Source status/type

## ISO 25964 / SKOS — Thesaurus interoperability

SKOS concept schemes and mapping relationships. Glossarist implements:

- 14 SKOS concept schemes (taxonomy TTLs in concept-model)
- Hierarchical relationships: broader/narrower (generic, partitive, instantial)
- Mapping relationships: `exact_match`, `close_match`, `broad_match`, `narrow_match`, `related_match`
- SKOS/RDF export via glossarist-ruby

## Code systems

| Standard | Purpose | Examples |
|----------|---------|----------|
| ISO 639 | Language codes | `eng`, `fra`, `deu`, `jpn` |
| ISO 15924 | Script codes | `Latn`, `Arab`, `Cyrl`, `Hani` |
| ISO 24229 | Conversion system codes | `Var:jpn-Hrkt:Latn:Hepburn-1886` |

## IEC Electropedia compatibility

Glossarist maintains compatibility with IEC Electropedia data format, including URN resolution for IEC and ISO identifiers.

## Cross-references

- [Concept Model documentation](/docs/model/)
- [Software implementations](/docs/software/)
- [Concept model repository](https://github.com/glossarist/concept-model)
