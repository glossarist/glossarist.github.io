---
title: glossarist-ruby
description: Ruby gem implementing the Glossarist concept model with multi-language YAML serialization, GCR packages, and TBX/SKOS/Turtle export
---

# glossarist-ruby

Ruby gem implementing the [Glossarist concept model](https://github.com/glossarist/concept-model/tree/main) in Ruby. All the entities in the model are available as classes and all the attributes are available as methods of those classes. This gem also allows you to read/write data to concept datasets or create your own collection and save that to Glossarist model V2 dataset.

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

### Reading a Glossarist model V2 from files

Glossarist model V2 dataset is a collection of concepts and their localized concepts in the form of YAML files. The storage structure of the dataset has 2 forms:

1. Each concept is stored in a concept YAML file and its localized concepts are stored in separate YAML files. The concept files are stored in the `concept` folder and its localized concepts are stored in the `localized_concept` folder.
2. Each concept and its related localized concepts are stored in a single YAML file. These concept files are stored directly in the specified path.

To load the Glossarist model V2 dataset:

```ruby
collection = Glossarist::ManagedConceptCollection.new
collection.load_from_files("path/to/glossarist-v2-dataset")
```

### Writing a Glossarist model V2 to files

```ruby
collection = Glossarist::ManagedConceptCollection.new
collection.load_from_files("path/to/glossarist-v2-dataset")
# ... Update the collection ...
collection.save_to_files("path/to/glossarist-v2-dataset")
```

To write with concepts and their localized concepts grouped into single files:

```ruby
collection.save_grouped_concepts_to_files("path/to/glossarist-v2-dataset")
```

### ManagedConceptCollection

This is a collection for managed concepts. It includes the Ruby `Enumerable` module.

```ruby
collection = Glossarist::ManagedConceptCollection.new
```

### ManagedConcept

Following fields are available for ManagedConcept:

| Field | Description |
|-------|-------------|
| `id` | String identifier for the concept |
| `uuid` | UUID for the concept |
| `related` | Array of RelatedConcept |
| `status` | Enum for the normative status of the term |
| `dates` | Array of ConceptDate |
| `localized_concepts` | Hash of localizations (language code → UUID) |
| `domains` | Array of ConceptReference — upper concepts |
| `localizations` | Hash of localizations (language code → LocalizedConcept) |

```ruby
concept = Glossarist::ManagedConcept.new({
  "data" => {
    "id" => "123",
    "localized_concepts" => {
      "ara" => "<uuid>",
      "eng" => "<uuid>"
    },
    "localizations" => [...],
    "domains" => [
      { "concept_id" => "103", "ref_type" => "domain" },
    ],
  },
})
```

### LocalizedConcept

Localizations of the term to different languages.

| Field | Description |
|-------|-------------|
| `id` | Optional identifier for cross-references |
| `uuid` | UUID for the concept |
| `designations` | Array of Designations |
| `domain` | URI reference to the subject area |
| `related` | Array of per-language RelatedConcept |
| `subject` | Subject of the term |
| `definition` | Array of DetailedDefinition |
| `non_verb_rep` | Array of non-verbal representations |
| `notes` | Zero or more notes |
| `examples` | Zero or more examples |
| `language_code` | ISO-639 3-letter language code |
| `script` | ISO 15924 4-letter script code (optional) |
| `entry_status` | `notValid`, `valid`, `superseded`, or `retired` |
| `classification` | `preferred`, `admitted`, or `deprecated` |

## Links

- [GitHub](https://github.com/glossarist/glossarist-ruby)
- [RubyGems](https://rubygems.org/gems/glossarist)
- [Concept model YAML schemas](https://github.com/glossarist/concept-model/tree/main/yaml_schemas)
