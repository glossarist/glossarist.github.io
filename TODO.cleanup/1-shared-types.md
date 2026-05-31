# 1 — Extract shared TypeScript types

**Problem:** `OwlClass`, `ShaclConstraint`, `OwlShape`, `TaxonomyConcept`, `TaxonomyData` are independently defined in `OntologyBrowser.vue`, `YamlSchemas.vue`, and `RelationshipTypes.vue`. Three copies of the same interfaces.

**Action:**
- Create `.vitepress/data/types.ts` with canonical type definitions
- Update all 3 components to import from there

**Files touched:**
- `.vitepress/data/types.ts` (new)
- `.vitepress/theme/components/OntologyBrowser.vue`
- `.vitepress/theme/components/YamlSchemas.vue`
- `.vitepress/theme/components/RelationshipTypes.vue`

**Done when:** No duplicate interface definitions. All components import from `types.ts`.
