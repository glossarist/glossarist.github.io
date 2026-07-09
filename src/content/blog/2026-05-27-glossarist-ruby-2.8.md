---
title: "Glossarist Ruby 2.8 — V3 schema support and RDF ontology"
description: "Glossarist-ruby 2.8 adds V3 concept model support, OWL ontology alignment, and SKOS taxonomy integration."
authors:
  - Ribose
date: 2026-05-27
---

<BlogByline />

Glossarist-ruby 2.8 brings significant enhancements to the Ruby gem for managing terminology concepts.

## V3 schema support

The V3 concept model introduces extended designation types, grouped concept files (all localizations in a single YAML), and improved cross-reference resolution. Glossarist-ruby 2.8 fully supports reading and writing both V2 and V3 formats.

## OWL ontology alignment

The concept model is now formally expressed as an OWL ontology with class hierarchy, property definitions, and SHACL shapes for validation. This enables seamless interoperability with semantic web tooling and SPARQL endpoints.

## SKOS taxonomy integration

14 SKOS concept schemes are now available as Turtle (TTL) files in the concept-model repository. Glossarist-ruby can export concepts as SKOS/RDF, enabling interoperability with thesaurus management systems.

## Upgrading

```bash
gem install glossarist
```

Or update your Gemfile:

```ruby
gem 'glossarist', '~> 2.8'
```

See the [glossarist-ruby documentation](/docs/software/glossarist-ruby) for full usage details.
