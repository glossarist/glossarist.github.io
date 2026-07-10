---
title: "Concept Model v3.1 — datasets, non-verbal entities, designation relationships, scoped examples"
description: "The Glossarist concept model v3.1.0 is an additive release that introduces dataset-aware structure (DatasetRegister + Section), first-class non-verbal entities (Figure/Table/Formula), a DesignationRelationship class, scoped examples for VIM-style nesting, inline citations, 52 relationship types, and two new SKOS taxonomies — now synced across glossarist-ruby, glossarist-js, and concept-browser."
authors:
  - Ribose
date: 2026-07-05
---

<!-- byline rendered by BlogLayout -->
Today we're releasing **concept-model v3.1.0**, an additive update that extends Glossarist with **dataset-aware structure** and **first-class non-verbal entities**. The release is fully backwards compatible — no existing URI was renamed or removed — and the three downstream consumers ([glossarist-ruby](/docs/software/glossarist-ruby), [glossarist-js](/docs/software/glossarist-js), [concept-browser](/docs/software/concept-browser)) are already synced and released.

## What's new in the model

v3.1 adds seven ontology classes, six SHACL shapes, two SKOS taxonomies, a canonical prefix file, and a handful of cross-cutting features that close long-standing gaps with how standards actually structure terminological data.

### Dataset register & hierarchical sections

Vocabularies aren't flat lists — they're organized into chapters, sections, and subsections with their own ordering and metadata. v3.1 introduces a self-describing **`DatasetRegister`** (authored as `register.yaml` at the dataset root) and a transitive **`Section`** hierarchy.

A concept placed in section `1.2.3` is automatically a member of `1.2` and `1`, because `gloss:hasChildSection` is declared as an `owl:TransitiveProperty` and `gloss:hasParentSection` as its inverse. Sections can override the dataset's default `ordering` method (`systematic`, `mixed`, or `alphabetical`).

```yaml
schema_type: glossarist
schema_version: "3"
id: vim-2022
urn: urn:iso:iso-iec:guide:99:2022
status: current
supersedes: vim-2012
owner: ISO/IEC
ordering: systematic
sections:
  - id: "1"
    names: { eng: "Quantities and units", fra: "Grandeurs et unités" }
    children:
      - id: "1.1"
        names: { eng: "General" }
```

See the new [Datasets & Sections](/docs/model/datasets) page for the full register schema, transitive cascading, and the ordering-method taxonomy.

### Non-verbal entities

Standards publish figures, tables, and formulas once in a numbered registry and reference them throughout a document. v3.1 formalizes this pattern with a `NonVerbalEntity` hierarchy:

```
gloss:NonVerbalEntity                  (abstract)
└── gloss:SharedNonVerbalEntity        (dataset-wide identity)
    ├── gloss:Figure                   (+ FigureImage, + subfigures)
    ├── gloss:Table
    └── gloss:Formula
```

A `Figure` carries localized caption, alt text, long description, multiple image variants (vector / raster / dark / light / print), recursive subfigures, and bibliographic sources. Tables and Formulas share the same shape with their own content fields.

::: v-pre
Concepts reference them via the `{{fig:id}}` mention syntax — analogous to `{{cite:id}}` for sources.

:::

The concept-level `NonVerbRep` is preserved as a *reference* layer, so existing V2 datasets keep working unchanged.

See the new [Non-verbal Entities](/docs/model/non-verbal) page for the full hierarchy, the `FigureImage` role/format enums, and the rationale for the two-layer split.

### DesignationRelationship

Designations of the same concept are often related to each other: an abbreviation to its full form, a short form to its expanded form. Previously these were modeled as a generic relationship field on `Designation`. v3.1 promotes them to a first-class **`gloss:DesignationRelationship`** class, linked from `gloss:Designation` via the new `gloss:hasDesignationRelationship` property.

This MECE separation from concept-level `gloss:hasRelatedConcept` keeps designation-level semantics cleanly distinct from concept-level relationships like broader/narrower/equivalent — and makes the ontology graph trivially queryable for "find all abbreviations of this designation."

### Scoped examples (VIM 1993 style)

The ISO/IEC VIM (International Vocabulary of Metrology) and several ISO standards nest examples inside the note or definition they elaborate on, rather than at the concept top level. v3.1 models this with `examples` on `DetailedDefinition`, MECE with the existing concept-level `examples`.

```yaml
eng:
  definition:
    - content: "A property of a phenomenon, body, or substance"
      notes:
        - content: "Notes can themselves have examples"
          examples:
            - content: "Mass, weight, and volume are quantities"
```

Both layers propagate through every representation layer (YAML, RDF, TBX), and aggregations respect the nesting.

### Annotations, tags, inline mentions

Three smaller additions round out the model:

- **`annotations`** on `LocalizedConcept` — editorial annotations distinct from `notes`
- **`tags`** on `ManagedConcept` — free-form organizational labels for filtering and retrieval (not rendered as terminological domains)

::: v-pre
- **`ConceptSource#id`** — enables `{{cite:id}}` inline mentions in running text; concept-browser resolves these to full citations at render time

:::

### 52 relationship types

The `related_concept_type` enum now covers **52 types** across ISO 10241-1, ISO 19135, ISO 25964, SKOS, ISO 12620, and TBX — a MECE set with explicit inverse pairs. See the [Relationship Types](/docs/model/relationships) page for the full reference, organized by category.

### Two new SKOS taxonomies (now 16 total)

The taxonomy count grows from 14 to **16**, adding:

- `ordering-method` — `systematic` / `mixed` / `alphabetical`
- `concept-reference-type` — `domain` / `section` / `local` / `designation`

Both are SKOS `ConceptScheme`s with proper definitions and are surfaced in the [Ontology Browser](/reference/ontology).

### Canonical prefixes.ttl

A new `ontologies/prefixes.ttl` is the **single source of truth** for prefix bindings. Every serializer — glossarist-ruby, glossarist-js, concept-browser — references this file verbatim. The canonical SKOS-XL prefix is now `skosxl:` (was `xl:` in v3.0); the IRI binding is unchanged.

## Cross-layer MECE cleanup

The release also fixes a class of MECE (mutually exclusive, collectively exhaustive) violations between the OWL ontology layer and the SHACL shapes layer. SHACL class declarations have been moved to the ontology — shapes now only constrain, classes only define — and `Figure` / `Table` / `Formula` inherit through `SharedNonVerbalEntity` consistently across both layers and the Lutaml model.

## Downstream releases

The three consumers are already synced and released:

### glossarist-ruby v2.9.1

- Vendor pin bumped from a tracking SHA to the **v3.1.0 tag**
- **WS-B complete:** per-concept SKOS export with deterministic UUID v5 identifiers, SHACL validation gate, and a shared `Reference` protocol across `ConceptReference` / `RelatedConcept` / `DesignationRelationship`
- V3 `ConceptDate` accepts any date string per v3 schema
- Scoped examples integrated with aggregations and RDF export
- Non-verbal entity model refactored to match the v3.1 ontology (`images.yaml` removed, `NonVerbRep` reshaped)
- Section cascading membership with transitive ancestor traversal

Bump your project's `glossarist` gem to **2.9.1** to pick up all of the above.

### glossarist-js v0.4.5

- Concept-model vendored data synced to **v3.1.0**
- **RDF serializers** (Turtle, N-Triples, JSON-LD) and a **SHACL validator** in a new `glossarist/rdf` subpath export
- Browser-safe main entry: RDF and transforms moved out of `glossarist` proper into dedicated subpaths, so bundlers don't pull Node-only deps into browser builds
- New domain models: `Register`, `Section`, `Figure`, `Table`, `Formula`, `SharedNonVerbalEntity`, `BibliographyData`, `DesignationRelationship`
- Mention syntax with URN + designation forms; out-of-line citation references
- Annotations support and improved search
- ISO 19135 relationship types in the `RELATIONSHIP_TYPES` enum
- Scoped examples in `DetailedDefinition` with `walkTexts` text-walking

```bash
npm install glossarist@latest
```

### concept-browser v0.7.58

The concept-browser picks up all the model-side additions and ships several new UI features of its own:

- **3D relation sphere** — interactive force-directed sphere visualization of a concept's neighborhood, with per-relationship-type colors and degree filtering
- **Edition series** — sidebar timeline for vocabulary edition groups (VIM 1968/2000/2013/2022) with current-edition markers and supersession chain navigation
- **Dataset groups** — four group kinds (`lineage`, `topic`, `publisher`, `curated`), each with distinct sidebar rendering, registered through an OCP group registry
- **Per-dataset color theming** — `{ light, dark }` pairs per dataset; per-relationship-type colors in `site-config.yml`
- **Sections tree** — sidebar navigation mirroring the dataset's `register.yaml`, with transitive membership
- **Rich sidebar provenance** — publication reference, owner, status, concept/language counts
- **Build provenance** — `prov:Activity` per build, `foaf:Person` / `prov:SoftwareAgent` contributor records, `prov:Entity` version chain
- **Per-concept RDF outputs** — every concept emits SHACL-conformant Turtle + JSON-LD; dataset-level `dcat:Dataset` + group-level `dcat:DatasetSeries` / `dcat:Catalog`

Existing deployments just need to bump their `@glossarist/concept-browser` version and re-run `npx concept-browser build`.

## Upgrading

The release is additive. To upgrade:

```bash
# concept-model (if you vendor it directly)
git fetch --tags && git checkout v3.1.0

# glossarist-ruby
bundle update glossarist     # → 2.9.1

# glossarist-js
npm install glossarist@latest # → 0.4.5

# concept-browser (in your deployment repo)
npm install --ignore-scripts @glossarist/concept-browser@latest
npx concept-browser build
```

Datasets authored against v3.0 keep working unchanged. The `xl:` → `skosxl:` prefix spelling change preserves the same IRI binding — only the preferred prefix spelling changes.

## What's next

We have a focused roadmap for the rest of 2026:

- **Emitter-level SHACL conformance** in glossarist-ruby (PR #188 Phase 2) — closing the remaining gaps between the gem's RDF output and the canonical shapes
- **Single source of truth for dataset metadata** — see the [SSOT proposal](https://github.com/glossarist/concept-browser/blob/main/PROPOSAL.uri-pattern-index.md) in concept-browser
- **Browser-side relation sphere improvements** — semantic zoom, multi-hop traversal
- **V4 schema drafting** — flattening some long-standing V2/V3 divergences

If you build terminology tooling, glossaries, or standards vocabularies, we'd love to hear from you. [Open an issue](https://github.com/glossarist/concept-model/issues) on any of the repositories, or come say hi on the [Ribose community channels](https://www.ribose.com).

## Further reading

- [Concept Model docs](/docs/model/) — full entity reference
- [Datasets & Sections](/docs/model/datasets) — register.yaml, sections, ordering, bibliography
- [Non-verbal Entities](/docs/model/non-verbal) — Figure, Table, Formula
- [Relationships](/docs/model/relationships) — 52 typed relationship kinds
- [glossarist-ruby](/docs/software/glossarist-ruby) — Ruby SDK
- [glossarist-js](/docs/software/glossarist-js) — JavaScript SDK
- [Concept Browser](/docs/software/concept-browser) — static SPA
- [Ontology Browser](/reference/ontology) — interactive OWL ontology and SHACL shapes
