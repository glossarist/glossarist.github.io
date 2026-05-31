# 3 — Extract shared formatting utilities

**Problem:** `formatDate`, `formatLastUpdated`, `formatAuthors` duplicated between `BlogIndex.vue` and `BlogByline.vue`. `formatDate` also in `ReleaseDownloader.vue`.

**Action:**
- Create `.vitepress/data/format.ts` with shared functions
- Update all consumers

**Files touched:**
- `.vitepress/data/format.ts` (new)
- `.vitepress/theme/components/BlogIndex.vue`
- `.vitepress/theme/components/BlogByline.vue`
- `.vitepress/theme/components/ReleaseDownloader.vue`

**Done when:** Zero duplicate formatting functions across components.
