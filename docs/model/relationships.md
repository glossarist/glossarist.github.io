---
title: Relationships
description: Typed semantic relationship types between concepts, defined by the Glossarist concept model
---

# Relationships

Concepts in Glossarist are connected by **typed semantic relationships** — directional links that express how one concept relates to another. Every relationship has a type, a source concept, and a target concept. See the [RelatedConcept entity definition](/reference/entity-fields#entity-RelatedConcept) for the authoritative field list.

This page documents all relationship types organized by category, their ISO/SKOS alignment, and how to author them in YAML. The relationship definitions are derived from the [Glossarist concept model ontology](https://github.com/glossarist/concept-model/blob/main/ontologies/taxonomies/relationship-type.ttl).

## Overview

Relationships serve several purposes:

- **Navigation** — Users traverse concept systems by following relationships (e.g., "narrower" to drill into specifics)
- **Reasoning** — Hierarchical relationships enable inheritance of properties across the concept tree
- **Interoperability** — Standard relationship types map to SKOS and ISO 25964 properties for cross-vocabulary exchange
- **Provenance** — Lifecycle relationships track how concepts evolve over time (superseded, deprecated)
- **Cross-dataset linking** — Relationships connect concepts across datasets and editions (e.g., VIM editions, G18 to VIM/VIML)

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

### Cross-dataset relationships

When linking to a concept in a different dataset, use the `ref` object with a `source` URN and concept `id`:

```yaml
related:
  - type: supersedes
    ref:
      source: urn:oiml:pub:v:1:2013
      id: '2.1'
  - type: see
    ref:
      source: urn:oiml:pub:v:2-200:2012
      id: '2.13'
```

The `source` URN identifies the target dataset, and `id` is the concept identifier within that dataset. The concept-browser resolves these at build time into navigable cross-dataset edges.

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

### Designation-level relationships

Designation-level relationships (`abbreviated_form_for`, `short_form_for`) link designations of the **same concept** to each other. They appear on designations rather than concepts, and use `target` (designation text) instead of `ref` (concept identifier).

```yaml
terms:
  - type: expression
    designation: Light Emitting Diode
    normative_status: preferred
  - type: abbreviation
    designation: LED
    normative_status: admitted
    acronym: true
    related:
      - type: abbreviated_form_for
        target: Light Emitting Diode
```

See [Designations](/docs/model/designations#designation-relationships) for the full DesignationRelationship model. The `ref.text` field on concept-level relationships serves a different purpose — it provides designation text when the concept is identified by text rather than by registry reference.

## Inverse Derivation

Glossarist derives inverse relationships automatically from the relationship graph. When concept A declares `supersedes` concept B, the system derives `superseded_by` on concept B at render time — without requiring the inverse to be explicitly authored.

This means you only author the forward direction. Inverse relationships appear in the concept-browser automatically:

| Authored type | Derived inverse |
|---|---|
| `supersedes` | `superseded_by` |
| `deprecates` | `deprecated_by` |
| `replaces` | `replaced_by` |
| `invalidates` | `invalidated_by` |
| `retires` | `retired_by` |
| `broader` | `narrower` |
| `has_part` | `is_part_of` |
| `instance_of` | `has_instance` |
| `has_version` | `version_of` |

Symmetric types (`equivalent`, `compare`, `contrast`, `close_match`, `related_match`, `related_concept`) are their own inverse — no derivation needed.

## Cross-Dataset Navigation

Glossarist's concept-browser supports **cross-dataset relationships** — links between concepts in different datasets loaded from the same deployment. This enables multi-edition navigation for terminology systems like OIML VIM/VIML.

### How it works

1. Each dataset defines concepts with unique URNs (e.g., `urn:oiml:pub:v:1:2022`)
2. Concepts declare `related` entries using `ref.source` to target a different dataset
3. At build time, the concept-browser resolves all cross-dataset references into an edge graph
4. The UI renders these as navigable links with category-colored badges

### Example: VIM multi-edition navigation

The OIML VIM (International Vocabulary of Metrology) has four editions (1993, 2007, 2010, 2012). Each edition is a separate dataset. Concepts in newer editions declare `supersedes` relationships to their predecessors:

```yaml
# In datasets/vim-2012/concepts/2.13.yaml
related:
  - type: supersedes
    ref:
      source: urn:oiml:pub:v:2-200:2007
      id: '2.13'
```

When rendered, the VIM 2012 concept 2.13 shows a "supersedes" link to VIM 2007 concept 2.13, and the VIM 2007 concept automatically shows "superseded by" pointing back.

### Example: G18 cross-references to VIM/VIML

OIML G 18 is an alphabetical glossary of 2132 terms sourced from 88 OIML publications. Many terms originate from VIM or VIML. Cross-dataset `see` relationships link G18 terms to their authoritative definitions:

```yaml
# In datasets/g18/concepts/00079.yaml (measuring instrument)
related:
  - type: see
    ref:
      source: urn:oiml:pub:v:2-200:2007
      id: '3.1'
```

This enables users navigating G18 to jump directly to the authoritative VIM definition with full notes and examples.

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

Types without a direct SKOS equivalent (`compare`, `contrast`, `see`, `deprecates`, `supersedes`, `homograph`, `false_friend`, ISO 19135 register management types, etc.) are expressed as `gloss:` properties in the Glossarist OWL ontology and serialized as-is in TBX output using the corresponding TBX data category.

## Design Principles

1. **MECE coverage** — The relationship types form a mutually exclusive, collectively exhaustive set covering all ISO 10241-1, ISO 19135, ISO 25964, SKOS, ISO 12620, and TBX relationship categories
2. **No overlap with SKOS** — Where SKOS defines a property, Glossarist reuses the exact same semantics (e.g., `broader` = `skos:broader`)
3. **Directional** — Every relationship has a source and target; inverse pairs are separate types (`broader`/`narrower`, `supersedes`/`superseded_by`)
4. **Typed hierarchy** — The three ISO 25964 hierarchy types (generic, partitive, instantial) are distinct because they carry different semantic meaning and affect how concept trees are rendered
5. **Cross-dataset by design** — Relationships use URN-based references that span datasets, enabling multi-edition and cross-vocabulary navigation

See the [YAML Schema Reference](/reference/schema-browser) for the JSON Schema definition of the RelatedConcept entity, the [Entity Field Reference](/reference/entity-fields) for field-level details, and the [Standards compliance reference](/docs/standards) for ISO standard mappings.
