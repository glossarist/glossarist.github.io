# 2 — Create shared ontology data composable

**Problem:** 5 places independently fetch and parse `ontology-schema.json` (96K) and `taxonomies.json` (36K):
- `HomePage.vue` — static imports (132K bundled)
- `OntologyBrowser.vue` — runtime fetch
- `YamlSchemas.vue` — runtime fetch
- `RelationshipTypes.vue` — runtime fetch
- `docs/model/index.md` — runtime fetch

**Action:**
- Create `.vitepress/data/useOntologyData.ts` composable
- Single fetch with cache, typed reactive access
- All consumers use the composable

**Files touched:**
- `.vitepress/data/useOntologyData.ts` (new)
- `.vitepress/theme/components/HomePage.vue`
- `.vitepress/theme/components/OntologyBrowser.vue`
- `.vitepress/theme/components/YamlSchemas.vue`
- `.vitepress/theme/components/RelationshipTypes.vue`
- `docs/model/index.md`

**Done when:** One data fetching pattern. No component directly fetches ontology JSON.
