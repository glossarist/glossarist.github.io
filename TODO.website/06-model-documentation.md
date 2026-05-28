# 06 - Create Model documentation pages

Port the concept-model README.adoc content into VitePress Markdown pages.

## Source

The concept-model repo has a comprehensive README.adoc covering:
- Designation types (7)
- Relationship types (32)
- Term types (34)
- Authoritative source hierarchy
- UML diagrams (4 PNGs)

## Pages to create

### `/docs/model/index.md` — Concept Model overview
- What is the Glossarist concept model
- ISO standards it implements (10241-1, 704, 30042, 12620, 25964)
- Links to sub-pages
- Concept-term interaction cycle diagram

### `/docs/model/concepts.md` — Concepts
- ManagedConcept, LocalizedConcept, Concept hierarchy
- ManagedConceptCollection
- Concept lifecycle: draft → submitted → valid → superseded → retired
- Multi-language localization
- UML: Concepts.png

### `/docs/model/designations.md` — Designations
- MECE hierarchy (7 types): expression, abbreviation, symbol, letter_symbol, graphical_symbol, prefix, suffix
- Base properties: normative_status, geographical_area, language, script, system, pronunciation, sources, term_type, register
- UML: Designations.png

### `/docs/model/relationships.md` — Relationship Types
- 32 types across 4 standards
- Categories: lifecycle, hierarchical, equivalence, comparative, associative, spatiotemporal, lexical, designation-level
- Tables matching current README.adoc structure

### `/docs/model/sources.md` — Authoritative Sources
- ConceptSource type/status
- Multi-level source hierarchy
- Source status enum values
- UML: ConceptSource.png

### `/docs/model/term-types.md` — Term Types (34)
- ISO 12620 / TBX classification
- Categories: orthographic, symbolic, usage/provenance
- Full table with descriptions

### `/docs/model/schemas.md` — YAML Schema Reference
- V2 and V3 schema differences
- Links to generated schema docs (or embed schema viewer)
- Enum reference: statuses, types, codes

### `/docs/model/ontology.md` — Ontology Browser (interactive)
- Embeds the OntologyBrowser.vue component
- Shows OWL class hierarchy, SKOS taxonomies
- Interactive tree + detail panel

## UML images

Copy from concept-model repo:
- `concept-model/images/Concepts.png` → `public/images/model/Concepts.png`
- `concept-model/images/ConceptSource.png` → `public/images/model/ConceptSource.png`
- `concept-model/images/Designations.png` → `public/images/model/Designations.png`
- `concept-model/images/ManagedConcepts.png` → `public/images/model/ManagedConcepts.png`
- `concept-model/concept-term-cycle.png` → `public/images/model/concept-term-cycle.png`
