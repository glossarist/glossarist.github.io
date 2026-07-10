---
title: Non-verbal Entities
description: Dataset-level figures, tables, and formulas with localized captions and image variants
---

# Non-verbal Entities

Glossarist distinguishes two layers of non-verbal representation:

- **Concept-level `NonVerbRep`** — A reference to a non-verbal representation embedded in a specific concept's definition or note.
- **Dataset-level entities** — First-class resources (`Figure`, `Table`, `Formula`) authored once at the dataset root and referenced by many concepts.

This separation mirrors how standards actually structure non-verbal material: ISO publications define figures once in a numbered registry (`Figure 1`, `Figure 2`, …) and reference them throughout. The v3.1 model formalizes this pattern.

## Class hierarchy

```
gloss:NonVerbalEntity                      (abstract base)
├── gloss:SharedNonVerbalEntity            (dataset-wide identity)
│   ├── gloss:Figure                       (with subfigures + image variants)
│   │   └── gloss:FigureImage              (one image variant)
│   ├── gloss:Table
│   └── gloss:Formula
└── gloss:NonVerbRep                       (concept-level reference)
```

`SharedNonVerbalEntity` is the abstract parent of the three dataset-level entity types. `Figure`, `Table`, and `Formula` inherit common fields (`id`, `caption`, `alt`, `description`, `sources`) from it.

## Figure

A dataset-level figure with localized caption, alt text, and one or more image variants.

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `id` | string | 1..1 | Stable identifier, dataset-unique (kebab-case recommended) |
| `identifier` | string | 0..1 | Display form (e.g. `"Figure 7c"`) |
| `caption` | localized string | 0..1 | Localized title/caption, keyed by ISO 639-2 |
| `description` | localized string | 0..1 | Localized long description (`aria-describedby`) |
| `alt` | localized string | 1..1 | Localized short alt text for screen readers |
| `images` | [FigureImage](#figureimage)[] | 1..* | Image variants (at least one required) |
| `subfigures` | [Figure](#figure)[] | 0..* | Recursive composite subfigures |
| `sources` | [ConceptSource](/docs/model/sources)[] | 0..* | Bibliographic sources |

### Example

```yaml
# figures/quantity-classification.yaml
id: quantity-classification
identifier: "Figure 2"
caption:
  eng: "Classification of quantities"
  fra: "Classification des grandeurs"
alt:
  eng: "Diagram showing the hierarchy of quantity types"
description:
  eng: >-
    A tree diagram showing how quantities branch into extensive,
    intensive, and derivative categories.
images:
  - src: quantity-classification.svg
    format: svg
    role: vector
  - src: quantity-classification-dark.svg
    format: svg
    role: dark
  - src: quantity-classification.png
    format: png
    role: raster
    width: 1920
    height: 1080
sources:
  - id: iso-80000-1
    type: authoritative
    status: identical
subfigures:
  - id: quantity-extensive
    alt: { eng: "Extensive quantity subtree" }
    images:
      - { src: quantity-extensive.svg, format: svg }
```

## FigureImage

A single image variant within a figure. Multiple variants allow dark-mode, print, vector/raster, and resolution alternatives.

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `src` | string | 1..1 | Filename in the dataset's `images/` directory |
| `format` | enum | 1..1 | `svg` \| `png` \| `jpg` \| `webp` \| `avif` \| `gif` |
| `role` | enum | 0..1 | `vector` \| `raster` \| `dark` \| `light` \| `print` |
| `width` | integer | 0..1 | Pixel width (raster only) |
| `height` | integer | 0..1 | Pixel height (raster only) |
| `scale` | integer | 0..1 | Resolution scale factor |

## Table

A dataset-level table. Tables follow the same shape as figures (localized caption/alt, sources) but carry tabular content rather than images.

```yaml
# tables/si-base-units.yaml
id: si-base-units
caption:
  eng: "SI base units"
alt:
  eng: "Table listing the seven SI base units, their names, and symbols"
content:
  eng: |
    | Quantity          | Unit     | Symbol |
    |-------------------|----------|--------|
    | length            | metre    | m      |
    | mass              | kilogram | kg     |
    | time              | second   | s      |
    | electric current  | ampere   | A      |
sources:
  - id: bipm-si-brochure
    type: authoritative
```

## Formula

A dataset-level formula with optional LaTeX form. The concept-browser renders formulas via KaTeX when a `latexForm` is provided.

```yaml
# formulas/euler-identity.yaml
id: euler-identity
caption: { eng: "Euler's identity" }
expression: "e^(iπ) + 1 = 0"
latexForm: "e^{i\\pi} + 1 = 0"
alt: { eng: "Euler's identity relating e, i, pi, and 1" }
```

## Concept-level NonVerbRep

The concept-level `NonVerbRep` is a *reference* to a non-verbal representation embedded inside a specific concept. It exists for backward compatibility with the V2 model and for cases where a non-verbal representation is truly local to one concept (not shared across the dataset).

| Field | Type | Card. | Description |
|-------|------|-------|-------------|
| `type` | enum | 1..1 | `figure` \| `table` \| `formula` \| `image` \| etc. |
| `id` | string | 0..1 | Reference to a dataset-level entity |
| `caption`, `alt`, `description` | localized string | 0..1 | Inline content (when not referencing a shared entity) |
| `sources` | [ConceptSource](/docs/model/sources)[] | 0..* | Per-reference sources |

## Inline figure mentions

Concepts reference dataset-level figures from running text via the fig mention syntax (analogous to the cite mention syntax for [sources](/docs/model/sources#inline-citations)):

::: v-pre
```yaml
eng:
  definition:
    - content: >-
        Quantities are classified hierarchically
        (see {{fig:quantity-classification}}).
```

:::

The concept-browser resolves these mentions to the figure's full caption, alt text, and image variant at render time.

## Why two layers?

Splitting concept-level references from dataset-level entities provides three benefits:

1. **Single source of truth** — A figure authored once can be referenced by every concept that needs it, without duplication.
2. **Stable identifiers** — `Figure 2` keeps its identity across the dataset, even as concepts are reorganized.
3. **Accessibility built-in** — Localized `alt` and `description` live with the figure, so every reference inherits accessible rendering without re-authoring.

See the [Figure YAML schema](/reference/schema-browser) for the formal definition, the [Datasets & sections](/docs/model/datasets) page for the surrounding dataset model, and the [Sources](/docs/model/sources) page for the related cite mention syntax.
