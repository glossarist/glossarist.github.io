# Information Architecture Audit

## Current State

The site has 5 top-level nav items, 4 sidebar sections, and ~70 content pages. The content is mostly sound, but the architecture has structural problems that make the site confusing to navigate and hard to extend.

## Critical Issues

1. **The `/docs/model/schemas` page is an incoherent dumping ground** — it crams a JSON Schema browser, an examples table, and an ontology entity view into one page with no clear hierarchy. See [1-schemas-page-split.md](1-schemas-page-split.md).

2. **The ontology browser is an orphan outside the docs tree** — `/ontology` lives at the site root with its own `layout: page`, no sidebar, and no breadcrumbs. It's linked from the nav dropdown but invisible to the docs sidebar and in-page navigation. See [2-ontology-placement.md](2-ontology-placement.md).

3. **The model section has no schema/entity reference pages** — the model docs describe concepts, designations, relationships, etc. in prose, but there's no structured reference page per entity type. The YamlSchemas component (showing all entities in one big table) is buried at the bottom of the schemas page. See [3-model-reference-structure.md](3-model-reference-structure.md).

4. **`docs/index.md` is a flat link dump** — the docs landing page is a list of links with no narrative, no visual hierarchy, and no guidance on where to start. See [4-docs-landing-page.md](4-docs-landing-page.md).

5. **About page has a duplicated "Get Started" step** — step 3 and 4 are identical ("Explore the Model"). See [5-about-page-fixes.md](5-about-page-fixes.md).

6. **Nav dropdown "Model" mixes conceptual pages with tools** — it lists Overview, Concepts, Designations, Relationships, Sources, Schemas (conceptual docs) alongside Ontology Browser (an interactive tool). Different user intents, same dropdown. See [6-nav-restructure.md](6-nav-restructure.md).

7. **The schema browser is entirely client-rendered** — `<SchemaReference />` fetches YAML at runtime, so the content is invisible to search engines, shows a loading spinner on every visit, and adds unnecessary latency for what should be static documentation. See [1-schemas-page-split.md](1-schemas-page-split.md).

8. **No cross-links between model docs and schema reference** — `concepts.md` describes ManagedConcept fields but doesn't link to the JSON Schema definition. `designations.md` explains the hierarchy but doesn't link to the schema. The model docs and schema reference are parallel universes. See [7-cross-linking.md](7-cross-linking.md).

## Architecture Diagram

```
glossarist.org/
├── index.md                          ← HomePage component (OK)
├── about.md                          ← About (needs fix: dup step)
├── ontology.md                       ← Orphaned ontology browser (needs placement)
├── blog/                             ← Blog (OK)
├── docs/
│   ├── index.md                      ← Flat link dump (needs redesign)
│   ├── standards.md                  ← Standards compliance (OK)
│   ├── model/
│   │   ├── index.md                  ← ModelLanding + overview (OK)
│   │   ├── concepts.md               ← Prose description (needs schema links)
│   │   ├── designations.md           ← Prose + table (needs schema links)
│   │   ├── relationships.md          ← RelationshipTypes component (needs content)
│   │   ├── sources.md                ← Prose + table (OK)
│   │   ├── term-types.md             ← Prose + table (OK)
│   │   ├── schemas.md                ← DUMPSTER FIRE (needs split)
│   │   └── ontology.md               ← Redirect to /ontology (dangling)
│   ├── core-concepts/                ← Background theory (OK)
│   ├── desktop/                      ← Desktop app docs (OK)
│   ├── software/                     ← Software product pages (OK)
│   └── adopt/                        ← Adoption guide (OK)
```

## Recommended Changes (Priority Order)

| # | TODO | Impact | Effort |
|---|------|--------|--------|
| 1 | Split schemas.md into dedicated pages | High | Medium |
| 2 | Move ontology into docs tree | High | Low |
| 3 | Add per-entity reference pages under model | Medium | Medium |
| 4 | Redesign docs landing page | Medium | Low |
| 5 | Fix about page duplicate | Low | Trivial |
| 6 | Restructure nav dropdown | Medium | Low |
| 7 | Add cross-links between model and schema docs | Medium | Low |
