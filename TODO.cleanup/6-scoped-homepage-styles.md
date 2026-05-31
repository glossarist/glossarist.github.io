# 6 — Move HomePage styles to scoped CSS

**Problem:** `custom.css` is 1318 lines with 79 `!important` declarations. ~600 lines are HomePage-specific (`.hero`, `.blob`, `.pipeline`, `.model-card`, etc.) that fight VitePress's `.vp-doc` specificity. All other components use `<style scoped>`.

**Action:**
- Move homepage-specific CSS from `custom.css` into `<style scoped>` in `HomePage.vue`
- Keep only brand variables, VitePress overrides, and about-page styles in `custom.css`
- Use `:deep()` where needed for nested VitePress elements

**Files touched:**
- `.vitepress/theme/custom.css`
- `.vitepress/theme/components/HomePage.vue`

**Done when:** `custom.css` reduced to ~400 lines (brand vars + global overrides only). Zero homepage-specific classes in global CSS.
