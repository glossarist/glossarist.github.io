# 3. Add Per-Entity Reference Pages Under Model

## Problem

The model section has prose documentation pages (concepts.md, designations.md, etc.) that explain each entity in paragraph form with inline tables. But there's no structured, authoritative field reference per entity type.

The `<YamlSchemas />` component (ontology entity view) shows all 24 entity types in one massive table, but it's buried at the bottom of the schemas page. Individual entity pages don't exist.

Compare to how API documentation works: you have a concept overview page AND a dedicated reference page per endpoint/entity. Glossarist's model docs have only the overview.

## Current State

- `concepts.md` — Lists ManagedConcept and LocalizedConcept fields in markdown tables (63 lines)
- `designations.md` — Lists designation types and base properties in tables (52 lines)
- `sources.md` — Lists source types and statuses (53 lines)
- `term-types.md` — Lists ISO 12620 term types (57 lines)
- `relationships.md` — Uses `<RelationshipTypes />` component (132 lines)

These pages describe entities but don't show the authoritative field list with types, constraints, cardinality, and examples. The YamlSchemas component does that — but it's all in one undifferentiated page.

## Proposed Structure

Option A: Add a "Reference" sub-section under model

```
docs/model/
├── index.md
├── concepts.md          ← Conceptual overview (keep as-is)
├── designations.md      ← Conceptual overview (keep as-is)
├── relationships.md
├── sources.md
├── term-types.md
├── schemas/             ← Schema reference section (from TODO 1)
└── reference/           ← Entity field reference section
    ├── managed-concept.md
    ├── localized-concept.md
    ├── designation.md
    ├── concept-source.md
    ├── detailed-definition.md
    └── ...
```

Option B: Enhance existing pages with a "Field Reference" section

Each conceptual page gets a second half with the authoritative field table:

```markdown
## ManagedConcept Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | yes | Management identifier |
| ... | ... | ... | ... |
```

**Recommendation: Option B**. It's lower effort, avoids duplicating pages, and keeps conceptual + reference content together. The per-entity field tables from YamlSchemas should be inlined into the relevant model page.

The `<YamlSchemas />` component can then be removed — its content is better served as static tables on the relevant pages.

## Files to Modify

- `docs/model/concepts.md` — Add field reference tables from YamlSchemas
- `docs/model/designations.md` — Add field reference for Designation and sub-types
- `docs/model/sources.md` — Add field reference for ConceptSource
- Potentially remove `YamlSchemas.vue` once content is inlined
