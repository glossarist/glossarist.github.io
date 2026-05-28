# 11 - Standards compliance reference

Create a page documenting which ISO standards Glossarist implements and how.

## Page: `/docs/standards.md`

### Content outline

1. **ISO 10241-1** — Terminology entries in standardized terminology
   - Concept structure, designations, definitions, sources
   - How glossarist-ruby implements: ManagedConcept, LocalizedConcept, ConceptSource
   - Relationship types: deprecates, supersedes, compare, contrast, see

2. **ISO 704** — Terminology work: principles and methods
   - Concept systems, concept-term interaction cycle
   - Domain classification, hierarchical relationships

3. **ISO 30042 / TBX** — Terminology markup framework
   - TBX-XML export via glossarist-ruby (tbx gem)
   - Term types, abbreviation types, grammatical info
   - GCR package format as TBX exchange medium

4. **ISO 12620** — Data category registry
   - Term types (34 values)
   - Register values (7)
   - Part of speech
   - Source status/type

5. **ISO 25964 / SKOS** — Thesaurus interoperability
   - SKOS concept schemes (14 taxonomy TTLs in concept-model)
   - Hierarchical relationships: broader/narrower (generic, partitive, instantial)
   - Mapping relationships: exact_match, close_match, broad_match, narrow_match, related_match
   - SKOS/RDF export via glossarist-ruby

6. **IEC Electropedia compatibility**
   - Data format alignment
   - URN resolution (IEC, ISO)
   - Example datasets

7. **Code systems**
   - ISO 639 (language codes) — 3-char codes
   - ISO 15924 (script codes) — Latn, Arab, Cyrl
   - ISO 24229 (conversion system codes) — pinyin, romaji

### Cross-references

Link to:
- `/docs/model/` for detailed model docs
- `/docs/software/` for implementation tools
- concept-model repo for schemas and ontology
