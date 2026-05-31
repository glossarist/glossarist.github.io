# 7 — Move model index inline styles to component

**Problem:** `docs/model/index.md` has 345 lines of inline `<style>` — the largest inline style block in any markdown file. Hard to maintain, no scoping, no IDE support.

**Action:**
- Create `.vitepress/theme/components/ModelLanding.vue` component
- Move the HTML structure and styles from `index.md` into the component
- `index.md` becomes `<ModelLanding />`

**Files touched:**
- `.vitepress/theme/components/ModelLanding.vue` (new)
- `.vitepress/theme/index.ts` (register component)
- `docs/model/index.md`

**Done when:** `docs/model/index.md` has zero inline CSS. All model landing styles are scoped.
