---
title: glossarist-ruby
description: Ruby gem implementing the Glossarist concept model with multi-language YAML serialization, GCR packages, dataset-aware sections, non-verbal entities, and TBX/SKOS/Turtle export with SHACL validation
---

# glossarist-ruby

Ruby gem implementing the [Glossarist concept model](https://github.com/glossarist/concept-model/tree/main) in Ruby. All the entities in the [concept model](/docs/model/) are available as classes and all the attributes are available as methods of those classes. The gem reads and writes Glossarist V2 and V3 datasets, packages them as portable GCR archives, and exports to TBX, SKOS, and Turtle with SHACL validation.

**Current version:** v2.9.1 — synced to [concept-model v3.1.0](/blog/2026-07-05-concept-model-v3.1).

## Install

Add this line to your application's Gemfile:

```ruby
gem 'glossarist'
```

And then execute:

```bash
bundle install
```

Or install it yourself as:

```bash
gem install glossarist
```

## Usage

### Reading a Glossarist model V2/V3 from files

A Glossarist dataset is a collection of concepts and their localizations in YAML, optionally accompanied by a `register.yaml` (V3 dataset metadata), `bibliography.yaml`, and dataset-level figures/tables/formulas.

The storage structure has 2 forms:

1. Each concept is stored in a concept YAML file and its localized concepts are stored in separate YAML files. The concept files live in `concept/` and localizations in `localized_concept/`.
2. Each concept and its related localizations are stored in a single YAML file, placed directly in the specified path.

```ruby
collection = Glossarist::ManagedConceptCollection.new
collection.load_from_files("path/to/glossarist-dataset")
```

### Writing a Glossarist model to files

```ruby
collection = Glossarist::ManagedConceptCollection.new
collection.load_from_files("path/to/glossarist-dataset")
# ... Update the collection ...
collection.save_to_files("path/to/glossarist-dataset")
```

To write with concepts and their localizations grouped into single files:

```ruby
collection.save_grouped_concepts_to_files("path/to/glossarist-dataset")
```

### GCR packages

A **GCR** (Glossarist Concept Resource) package is a portable ZIP archive of a dataset — concepts, register, bibliography, images, and any pre-compiled machine formats (TBX, JSON-LD, Turtle, JSONL).

```ruby
collection = Glossarist::ManagedConceptCollection.new
collection.load_from_files("path/to/dataset")

# Write a GCR package
collection.save_to_gcr("my-dataset.gcr")

# Read a GCR package
collection2 = Glossarist::ManagedConceptCollection.new
collection2.load_from_gcr("my-dataset.gcr")
```

### ManagedConcept

| Field | Description |
|-------|-------------|
| `id` | String identifier for the concept |
| `uuid` | UUID for the concept |
| `related` | Array of RelatedConcept |
| `status` | Lifecycle status (`valid`, `draft`, `submitted`, `superseded`, `retired`) |
| `dates` | Array of ConceptDate |
| `localized_concepts` | Hash of localizations (language code → UUID) |
| `domains` | Subject area references (rendered as `<domain>` in TBX) |
| `tags` | Free-form organizational tags for grouping/filtering (not rendered as terminological domains) |
| `sources` | Concept-level bibliographical sources |
| `localizations` | Hash of localizations (language code → LocalizedConcept) |

```ruby
concept = Glossarist::ManagedConcept.new({
  "data" => {
    "id" => "123",
    "localized_concepts" => { "ara" => "<uuid>", "eng" => "<uuid>" },
    "localizations" => [...],
    "domains" => [
      Glossarist::ConceptReference.new(concept_id: "103", ref_type: "domain"),
    ],
    "tags" => ["time-scales"],
  },
})
```

### LocalizedConcept

| Field | Description |
|-------|-------------|
| `id` | Optional identifier for cross-references |
| `uuid` | UUID for the concept |
| `designations` | Array of Designations |
| `domain` | URI reference to the subject area (URN, URL, or relative) |
| `related` | Array of per-language RelatedConcept |
| `subject` | Subject of the term |
| `definition` | Array of DetailedDefinition |
| `non_verb_rep` | Array of non-verbal representation references |
| `notes` | Zero or more notes |
| `examples` | Zero or more concept-level examples |
| `annotations` | Editorial annotations (distinct from notes) |
| `language_code` | ISO-639 3-letter language code |
| `script` | ISO 15924 4-letter script code |
| `system` | ISO 24229 conversion system code |
| `entry_status` | `notValid`, `valid`, `superseded`, or `retired` |
| `classification` | `preferred`, `admitted`, or `deprecated` |
| `references` | Typed references |
| `dates` | Per-language governance events |
| `release` | Release version |
| `review_type` | `editorial` or `substantive` |
| `lineage_similarity` | Lineage similarity score |

## What's new in 2.8–2.9

Recent releases sync `glossarist-ruby` to [concept-model v3.1.0](/blog/2026-07-05-concept-model-v3.1):

| Version | Highlights |
|---------|------------|
| **2.9.1** | Concept-model vendor pin bumped to v3.1.0 tag; `prefixes.ttl` documented |
| **2.9.0** | **WS-B:** per-concept SKOS export, deterministic UUIDs, SHACL gate, shared `Reference` protocol |
| **2.8.18** | V3 `ConceptDate` accepts any date string per v3 schema; wired through `date_accepted` and `to_yaml` callbacks |
| **2.8.17** | Scoped examples integrated with aggregations and RDF export |
| **2.8.16** | Non-verbal entity refactor — `images.yaml` removed, `NonVerbRep` reshaped to match v3.1 ontology |
| **2.8.15** | V3 dataset syntax: collection files wrapped under a single key |
| **2.8.13** | Section cascading membership — transitive ancestor traversal |
| **2.8.12** | ConceptReference `id` alias, 52 relationship types |
| **2.8.11** | `Register` and `Section` models with hierarchical section support |

### Dataset model (v3)

V3 datasets are self-describing — a `register.yaml` at the root captures identity, URNs, owner, languages, sections, and ordering. The gem reads and writes this structure:

```ruby
register = Glossarist::Register.from_yaml(File.read("datasets/vim/register.yaml"))
register.sections            # => [#<Section id="1" ...>, ...]
register.sections.first.children  # transitive section tree
register.ordering            # => "systematic"
```

Sections support **transitive cascading membership** — a concept placed in section `1.2.3` is automatically a member of `1.2` and `1`.

### Non-verbal entities (v3.1)

The gem models dataset-level non-verbal entities as first-class resources:

```ruby
figure = Glossarist::Figure.new(
  id: "quantity-classification",
  caption: { eng: "Classification of quantities" },
  alt: { eng: "Diagram showing the hierarchy of quantity types" },
  images: [{ src: "quantity-classification.svg", format: "svg" }],
)
```

See [Non-verbal entities](/docs/model/non-verbal) for the model details.

### Reference protocol (v2.9.0)

A shared `Reference` protocol underpins `ConceptReference`, `RelatedConcept`, `DesignationRelationship`, and other reference-shaped entities — eliminating duplicated logic and ensuring consistent UUID fallback behavior across all reference types.

### Per-concept SKOS export + SHACL gate (WS-B)

v2.9.0 introduces per-concept SKOS export with deterministic UUID v5 identifiers (based on dataset URN + concept id) and an optional SHACL validation gate that runs before serialization. This makes round-tripping through SKOS lossless and verifiable.

## Links

- [GitHub](https://github.com/glossarist/glossarist-ruby)
- [RubyGems](https://rubygems.org/gems/glossarist)
- [Concept model schemas](https://github.com/glossarist/concept-model/tree/main/schemas)
- [CHANGELOG](https://github.com/glossarist/glossarist-ruby/blob/main/CHANGELOG.md)

## See Also

- [Concept Model docs](/docs/model/) — the entity model this gem implements
- [Datasets & sections](/docs/model/datasets) — V3 self-describing dataset model
- [Non-verbal entities](/docs/model/non-verbal) — figures, tables, formulas
- [Standards compliance](/docs/standards) — ISO standard mappings for TBX, SKOS, and Turtle export
