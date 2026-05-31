# TODO 1: Fix Homepage and Hero Layout

## Problem
The homepage hero section and overall layout are broken. The HomePage.vue component's CSS grid/flexbox does not properly work within VitePress's `.vp-doc` container.

## Root Causes to Investigate
1. HomePage.vue uses `layout: home` in index.md frontmatter — this gives a full-width canvas but requires specific VitePress slot usage
2. The `.home` class max-width (72rem) may conflict with VitePress's own container constraints
3. The hero section's absolute positioning and overflow hidden may clip content
4. Section padding (5rem) may be excessive or conflicting with VitePress doc padding
5. Mobile breakpoints may not align with VitePress's own responsive breakpoints

## Files to Modify
- `.vitepress/theme/components/HomePage.vue` — Template structure and inline styles
- `.vitepress/theme/custom.css` — All `.home`, `.hero`, `.section`, `.model-grid`, `.eco-grid`, `.pipeline` styles
- `index.md` — Verify frontmatter uses `layout: home` correctly

## Fixes
1. Audit the hero section — ensure hero-content is properly centered and visible at all viewport sizes
2. Fix section layout — sections should have proper vertical rhythm and horizontal padding
3. Verify the model-grid (3-col), pipeline (4-step), and eco-grid (4-col) render correctly on desktop
4. Fix mobile responsiveness — all grids should stack to single column below 640px
5. Ensure dark mode renders properly for all sections
6. Test at: 1440px, 1280px, 1024px, 768px, 375px

## Verification
- Run `npm run dev` and visually inspect the homepage
- Verify hero text is visible and centered
- Verify all grids render properly
- Test all breakpoints
- Toggle dark mode
