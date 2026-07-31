# 14 — Image optimization

## Status
☐ Not started

## Motivation

The site ships many PNG screenshots (the desktop docs, the OG image if added) at full resolution. Mobile users download extra bytes; LCP suffers.

## Scope

1. Audit all images in `public/images/` and `src/content/` — list sizes, resolutions, formats
2. Convert raster images to WebP (or AVIF) where lossless quality allows
3. Add responsive `srcset` for images that appear at multiple sizes
4. Verify `loading="lazy"` on all below-the-fold images

## Implementation options

### Option A: Astro's built-in image optimization

Use `astro:assets` `<Image />` component for content images. Requires moving images from `public/` to `src/`.

Pros: framework-native; handles WebP/AVIF conversion + responsive sizes automatically.
Cons: refactor required (existing images are in `public/`).

### Option B: Pre-build script

A pre-build script that walks `public/images/`, generates WebP variants, and updates MDX references.

Pros: works with existing `public/` layout.
Cons: reinvents what Astro already does.

### Option C: Use `public/` for logos/SVGs (small, theme-aware), `src/assets/` for screenshots

Hybrid: move only large screenshots to `src/assets/` for optimization.

**Recommendation**: Option C. SVGs and logos stay in `public/` (they're already optimized). PNG screenshots move to `src/assets/` and use `<Image />`.

## Acceptance criteria

- [ ] Audit complete: list of images by size, format, placement
- [ ] All screenshots > 100KB converted to WebP
- [ ] Responsive `srcset` on screenshots that render at multiple sizes
- [ ] `loading="lazy"` on all below-the-fold images
- [ ] Lighthouse performance score ≥ 90 on homepage

## Effort

Half-day for the audit + half-day to migrate large images. Low complexity, high value.
