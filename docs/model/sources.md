---
title: Authoritative Sources
description: Multi-level source hierarchy for bibliographic references in terminological entries
---

# Authoritative Sources

![ConceptSource UML](/images/model/ConceptSource.png)

An **authoritative source** is the "source of truth" for a terminological entry or any of its parts. It is the bibliographic reference from which the content originates, represented in the model by the `ConceptSource` class.

## Source type

Each `ConceptSource` carries a `type` attribute distinguishing between two kinds of source:

- **`authoritative`** — The source is the definitive origin of the content.
- **`lineage`** — The source documents the historical derivation or provenance of the content, but is not itself the authoritative reference.

For example, a term may originate from ISO 19101 (authoritative) but also reference an earlier ITU definition from which the ISO definition was derived (lineage).

## Source status

The `status` attribute describes the relationship between the entry content and the cited source:

| Status | Description |
|--------|-------------|
| `identical` | The content is identical to what appears in the source |
| `modified` | The content has been modified from the source |
| `restyled` | The content has been restyled (e.g. formatting changes) |
| `context-added` | Additional context has been added to the source content |
| `generalisation` | The content is a generalisation of the source content |
| `specialisation` | The content is a specialisation of the source content |
| `unspecified` | The relationship to the source is unspecified |

The optional `modification` attribute can provide a description of any change made relative to the cited source.

## Multi-level source hierarchy

Sources can be attached at multiple levels of the model:

| Level | Scope |
|-------|-------|
| `ManagedConcept.sources` | Applicable to the concept as a whole |
| `Concept.sources` | Applicable to a specific language version |
| `Designation.sources` | Sources for individual terms |
| `DetailedDefinition.sources` | Sources for individual definitions, notes, or examples |
| `NonVerbRep.sources` | Sources for non-verbal representations |

This hierarchy means that a concept may have multiple authoritative sources. A concept's definition may come from one standard while a specific term for that concept comes from another.

## The glossary as authoritative source

In some cases, the glossary itself is the authoritative source — when a term and its definition originate within the glossary rather than being adopted from an external standard.
