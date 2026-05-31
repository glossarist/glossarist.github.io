# 8 — Eliminate `any` type in ReleaseDownloader

**Problem:** Line 62 of `ReleaseDownloader.vue` uses `(a: any)` for GitHub API response mapping. TypeScript should infer or be given proper types.

**Action:**
- Define a `GitHubAsset` interface
- Type the API response mapping properly

**Files touched:**
- `.vitepress/theme/components/ReleaseDownloader.vue`

**Done when:** Zero `any` usage in the codebase.
