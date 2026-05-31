---
title: Concepts
description: ManagedConcept, LocalizedConcept, concept lifecycle, and multi-language localization
---

# Concepts

![Concepts UML](/images/model/Concepts.png)

## ManagedConcept

A `ManagedConcept` is the top-level concept entity in Glossarist. It represents a single concept in the terminology registry. See the [ManagedConcept entity definition](/reference/entity-fields#entity-ManagedConcept) for the authoritative field list.

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `identifier` | string | 1..1 | String identifier for the concept |
| `uri` | anyURI | 0..1 | URI for the concept |
| `status` | [conceptStatus](/reference/entity-fields) | 0..1 | Lifecycle status |
| `related` | [RelatedConcept](/reference/entity-fields)[] | 0..* | Related concepts |
| `dates` | [ConceptDate](/reference/entity-fields)[] | 0..* | Governance events |
| `sources` | [ConceptSource](/docs/model/sources)[] | 0..* | Concept-level sources |
| `domains` | [Reference](/reference/entity-fields)[] | 0..* | Subject area references |
| `localizations` | [LocalizedConcept](#localizedconcept){} | 0..* | Per-language data (keyed by language code) |

## LocalizedConcept

Localizations of the concept to different languages. Each language has its own definition, notes, examples, terms, and revision history. See the [LocalizedConcept entity definition](/reference/entity-fields#entity-LocalizedConcept) for the authoritative field list.

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `language` | string | 0..1 | ISO 639 3-letter language code |
| `script` | string | 0..1 | ISO 15924 4-letter script code |
| `system` | string | 0..1 | ISO 24229 conversion system code |
| `designations` | [Designation](/docs/model/designations)[] | 0..* | Terms under which the concept is known |
| `definition` | [DetailedDefinition](#detaileddefinition)[] | 0..* | Definitions |
| `notes` | [DetailedDefinition](#detaileddefinition)[] | 0..* | Notes |
| `examples` | [DetailedDefinition](#detaileddefinition)[] | 0..* | Examples |
| `entry_status` | [entryStatus](/reference/entity-fields) | 0..1 | `notValid`, `valid`, `superseded`, or `retired` |
| `classification` | string | 0..1 | `preferred`, `admitted`, or `deprecated` |
| `domain` | anyURI | 0..1 | URI reference to the subject area |
| `related` | [RelatedConcept](/reference/entity-fields)[] | 0..* | Per-language concept relationships |
| `sources` | [ConceptSource](/docs/model/sources)[] | 0..* | Per-language sources |
| `references` | [Reference](/reference/entity-fields)[] | 0..* | Typed references |
| `dates` | [ConceptDate](#conceptdate)[] | 0..* | Per-language governance events |
| `release` | string | 0..1 | Release version |
| `review_type` | string | 0..1 | `editorial` or `substantive` |
| `lineage_similarity` | integer | 0..1 | Lineage similarity score |

## DetailedDefinition

A definition, note, or example with optional per-item sources.

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `content` | string | 1..1 | The text content |
| `sources` | [ConceptSource](/docs/model/sources)[] | 0..* | Per-item sources |

## ConceptDate

A governance event in the concept lifecycle.

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `date` | dateTime | 1..1 | Date and time of the event |
| `type` | [dateType](/reference/entity-fields) | 1..1 | Event type (`accepted`, `amended`, `retired`, `review`, `reviewDecision`) |
| `description` | string | 0..1 | Event description |

## Concept lifecycle

Concepts follow a lifecycle through these statuses:

- **draft** — Initial proposed state
- **submitted** — Change request submitted for review
- **valid** — Accepted and current
- **superseded** — Replaced by a newer concept
- **retired** — No longer in use

## Multi-language localization

A single ManagedConcept can have localizations in any number of languages. Different languages may assign the same abstract concept to different domains, and concept hierarchies can differ across languages.

## ManagedConceptCollection

A collection for managed concepts. Includes the Ruby `Enumerable` module. Supports loading from and saving to YAML file datasets.

See the [YAML Schema Reference](/reference/schema-browser) for the complete JSON Schema definitions, or the [Entity Field Reference](/reference/entity-fields) for all entity types with types, cardinality, and allowed values.
