---
title: Designations
description: Designation types forming a MECE hierarchy — expression, abbreviation, symbol, letter_symbol, graphical_symbol, prefix, suffix
---

# Designations

![Designations UML](/images/model/Designations.png)

A **designation** is a name under which a managed term is known. Designations follow an inheritance hierarchy based on ISO 10241-1 and the Glossarist concept model.

Designations form a **MECE** (Mutually Exclusive, Collectively Exhaustive) hierarchy:

| Type | Extends | Description |
|------|---------|-------------|
| `expression` | Base | A word or phrase used as a designation |
| `abbreviation` | Expression | A shortened form (acronym, initialism, or truncation) |
| `symbol` | Base | A non-letter symbol representing a concept |
| `letter_symbol` | Symbol | A single letter used as a symbol |
| `graphical_symbol` | Symbol | An iconic or graphical symbol |
| `prefix` | Base | A prefix that attaches before a designation |
| `suffix` | Base | A suffix that attaches after a designation |

## Base properties (common to all types)

Every designation type inherits these fields from the `Designation` base:

| Field | Type | Card. | Standard | Description |
|-------|------|-------|----------|-------------|
| `designation` | string | 1..1 | — | The term text or symbol |
| `normative_status` | [normativeStatus](/reference/entity-fields) | 0..1 | — | `preferred`, `admitted`, `deprecated`, or `superseded` |
| `term_type` | [termType](/docs/model/term-types) | 0..1 | ISO 12620 | Classification of the designation's term type |
| `related` | [RelatedConcept](/reference/entity-fields)[] | 0..* | — | Designation-level concept relationships |
| `sources` | [ConceptSource](/docs/model/sources)[] | 0..* | ISO 10241-1 §6.8 | Bibliographic sources |
| `pronunciation` | [Pronunciation](#pronunciation)[] | 0..* | — | Pronunciation entries |
| `language` | string | 0..1 | ISO 639 | Language of this designation |
| `script` | string | 0..1 | ISO 15924 | Script of the designation text (e.g. `Latn`, `Cyrl`) |
| `system` | string | 0..1 | ISO 24229 | Conversion system code |
| `international` | boolean | 0..1 | — | Whether used internationally |
| `absent` | boolean | 0..1 | — | Whether intentionally absent in this language |
| `register` | string | 0..1 | — | Register information |

## Expression-specific fields

Expression designations add:

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `grammar_info` | [GrammarInfo](#grammar-information)[] | 0..* | Grammatical information |

## Abbreviation-specific fields

Abbreviation designations (extends Expression) add:

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `is_acronym` | boolean | 0..1 | Whether this is an acronym |
| `is_initialism` | boolean | 0..1 | Whether this is an initialism |
| `is_truncation` | boolean | 0..1 | Whether this is a truncation |

## Symbol-specific fields

Symbol designations add:

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `text` | string | 0..1 | Text representation of the symbol |

Graphical symbols add:

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `image` | anyURI | 0..1 | Image URI for the graphical symbol |

## Pronunciation

Each Pronunciation entry has:

| Field | Type | Card. | Standard | Description |
|-------|------|-------|----------|-------------|
| `content` | string | 1..1 | — | The pronunciation text |
| `language` | string | 0..1 | ISO 639 | Language/dialect being pronounced (3-letter code) |
| `script` | string | 0..1 | ISO 15924 | Script of the pronunciation text (4-letter code) |
| `country` | string | 0..1 | ISO 3166-1 | Country variant (2-letter code) |
| `system` | string | 0..1 | ISO 24229 | Conversion system code (e.g. `IPA`, `Var:jpn-Hrkt:Latn:Hepburn-1886`) |

## Grammar Information

Each GrammarInfo entry has:

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `gender` | [gender](/reference/entity-fields) | 0..* | Grammatical gender |
| `number` | [number](/reference/entity-fields) | 0..* | Grammatical number |
| `part_of_speech` | string | 0..1 | Part of speech |

See the [YAML Schema Reference](/reference/schema-browser) for the complete JSON Schema definitions, or the [Entity Field Reference](/reference/entity-fields) for all entity types.
