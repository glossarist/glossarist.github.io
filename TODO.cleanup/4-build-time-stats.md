# 4 — Compute stats at build time

**Problem:** `HomePage.vue` statically imports 132K of JSON just to extract 5 numbers. `docs/model/index.md` fetches 132K at runtime for the same 5 numbers.

**Action:**
- Add stats computation to `scripts/generate-ontology-data.mjs`
- Output `public/data/stats.json` (~200 bytes)
- Components import/fetch this tiny file instead

**Files touched:**
- `scripts/generate-ontology-data.mjs`
- `public/data/stats.json` (new, generated)
- `.vitepress/theme/components/HomePage.vue`
- `docs/model/index.md`

**Depends on:** #2 (composable will use stats.json)

**Done when:** No component imports ontology-schema.json just for stats.
