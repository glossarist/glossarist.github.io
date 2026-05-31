---
title: Relationships
description: Typed semantic relationship types between concepts, defined by the Glossarist concept model
---

# Relationships

Concepts in Glossarist are connected by **typed semantic relationships** — directional links that express how one concept relates to another. Every relationship has a type, a source concept, and a target concept.

This page documents all relationship types organized by category, their ISO/SKOS alignment, and how to author them in YAML. The relationship definitions are derived from the Glossarist concept model.

## Overview

Relationships serve several purposes:

- **Navigation** — Users traverse concept systems by following relationships (e.g., "narrower" to drill into specifics)
- **Reasoning** — Hierarchical relationships enable inheritance of properties across the concept tree
- **Interoperability** — Standard relationship types map to SKOS and ISO 25964 properties for cross-vocabulary exchange
- **Provenance** — Lifecycle relationships track how concepts evolve over time (superseded, deprecated)

Each relationship is directional: `A --[type]--> B` means "A has relationship type to B." Many types have an inverse: if A `broader` B, then B `narrower` A.

## Relationship Types

<RelationshipTypes />

## YAML Authoring

Relationships are expressed in concept YAML files under the top-level `related` key. Each entry has a `type` and a `content` reference to the target concept.

### Hierarchical relationships

```yaml
termid: "3.1.1.1"
status: valid
eng:
  terms:
    - type: expression
      designation: "entity"
      normative_status: preferred
  definition:
    - content: "A concrete or abstract thing"
  sources:
    - type: authoritative
      origin: "ISO 19107:2003"

# Relationships to other concepts
related:
  - type: broader
    content: "3.1.1"          # This concept is narrower than 3.1.1
  - type: narrower
    content: "3.1.1.1.1"      # This concept is broader than 3.1.1.1.1
  - type: broader_generic
    content: "3.1.1"          # BTG: this is a kind of 3.1.1
  - type: narrower_partitive
    content: "3.1.1.1.2"      # NTP: 3.1.1.1.2 is a part of this
```

### Equivalence and mapping

```yaml
related:
  - type: exact_match
    content: "iso-19107:entity"   # Exact match in another vocabulary
  - type: broad_match
    content: "iso-19109:object"   # Broader concept in another vocabulary
  - type: equivalent
    content: "3.1.1.1"            # Equivalent concept in same vocabulary
```

### Associative and lifecycle

```yaml
related:
  - type: compare
    content: "3.1.1.2"            # Compare with another concept
  - type: see
    content: "3.1.2"              # See also
  - type: deprecates
    content: "3.1.1.0"            # This concept deprecates 3.1.1.0
  - type: supersedes
    content: "3.1.1.0"            # This concept supersedes 3.1.1.0
```

### Multiple relationships

A concept can have many relationships of different types:

```yaml
related:
  - type: broader_generic
    content: "3.1"
  - type: narrower_generic
    content: "3.1.1.1"
  - type: related_concept
    content: "3.2.5"
  - type: compare
    content: "3.1.2"
  - type: exact_match
    content: "iso-tc211:entity"
```

## SKOS Alignment

Glossarist relationship types map to standard SKOS and ISO 25964 ontology properties:

| Glossarist type | SKOS / ISO 25964 property | Notes |
|----------------|---------------------------|-------|
| `broader` | `skos:broader` | Generic broader |
| `narrower` | `skos:narrower` | Generic narrower |
| `broader_generic` | `iso-thes:broaderGeneric` | ISO 25964 BTG |
| `narrower_generic` | `iso-thes:narrowerGeneric` | ISO 25964 NTG |
| `broader_partitive` | `iso-thes:broaderPartitive` | ISO 25964 BTP |
| `narrower_partitive` | `iso-thes:narrowerPartitive` | ISO 25964 NTP |
| `broader_instantial` | `iso-thes:broaderInstantial` | ISO 25964 BTI |
| `narrower_instantial` | `iso-thes:narrowerInstantial` | ISO 25964 NTI |
| `exact_match` | `skos:exactMatch` | Cross-vocabulary |
| `close_match` | `skos:closeMatch` | Cross-vocabulary |
| `broad_match` | `skos:broadMatch` | Cross-vocabulary |
| `narrow_match` | `skos:narrowMatch` | Cross-vocabulary |
| `related_match` | `skos:relatedMatch` | Cross-vocabulary |
| `related_concept` | `skos:semanticRelation` | General associative |
| `equivalent` | `skos:exactMatch` | Within-vocabulary |

Types without a direct SKOS equivalent (`compare`, `contrast`, `see`, `deprecates`, `supersedes`, `homograph`, `false_friend`, etc.) are expressed as `gloss:` properties in the Glossarist OWL ontology and serialized as-is in TBX output using the corresponding TBX data category.

## Design Principles

1. **MECE coverage** — The relationship types form a mutually exclusive, collectively exhaustive set covering all ISO 10241-1, ISO 25964, SKOS, ISO 12620, and TBX relationship categories
2. **No overlap with SKOS** — Where SKOS defines a property, Glossarist reuses the exact same semantics (e.g., `broader` = `skos:broader`)
3. **Directional** — Every relationship has a source and target; inverse pairs are separate types (`broader`/`narrower`, `supersedes`/`superseded_by`)
4. **Typed hierarchy** — The three ISO 25964 hierarchy types (generic, partitive, instantial) are distinct because they carry different semantic meaning and affect how concept trees are rendered

See the [YAML Schema Reference](/docs/model/schemas/yaml-reference) for the JSON Schema definition of the RelatedConcept entity, or the [Entity Field Reference](/docs/model/schemas/entity-fields) for field-level details.
