---
title: Concepts
description: ManagedConcept, LocalizedConcept, concept lifecycle, and multi-language localization
---

# Concepts

![Concepts UML](/images/model/Concepts.png)

## ManagedConcept

A `ManagedConcept` is the top-level concept entity in Glossarist. It represents a single concept in the terminology registry.

| Field | Description |
|-------|-------------|
| `id` | String identifier for the concept |
| `uuid` | UUID for the concept |
| `status` | Normative status of the term |
| `related` | Array of RelatedConcept |
| `dates` | Array of ConceptDate |
| `localized_concepts` | Hash mapping language codes to localized concept UUIDs |
| `domains` | Array of ConceptReference — upper concepts (subject areas, concept schemes) |
| `localizations` | Hash mapping language codes to LocalizedConcept instances |

## LocalizedConcept

Localizations of the concept to different languages. Each language has its own definition, notes, examples, terms, and revision history.

| Field | Description |
|-------|-------------|
| `id` | Optional identifier for cross-references |
| `uuid` | UUID |
| `designations` | Array of Designations under which the concept is known |
| `domain` | URI reference to the subject area |
| `related` | Per-language concept relationships |
| `subject` | Subject of the term |
| `definition` | Array of DetailedDefinition |
| `non_verb_rep` | Array of non-verbal representations |
| `notes` | Zero or more notes |
| `examples` | Zero or more examples |
| `language_code` | ISO-639 3-letter language code |
| `script` | ISO 15924 4-letter script code (optional) |
| `system` | ISO 24229 conversion system code (optional) |
| `entry_status` | `notValid`, `valid`, `superseded`, or `retired` |
| `classification` | `preferred`, `admitted`, or `deprecated` |

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
