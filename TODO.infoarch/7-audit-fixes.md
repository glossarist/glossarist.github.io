# TODO 7 — Third Deep Audit Fixes

## Status: DONE

## 1. Stale concept-browser GitHub URL in projects.ts ✅

`projects.ts` linked concept-browser to `https://github.com/glossarist/glossarist-vocabulary-browser` (404 — repo was renamed). The homepage "GitHub" button pointed to a dead URL.

**Fix:** Updated `github` field to `https://github.com/glossarist/concept-browser`.

## 2. Spurious sitemap entries from public/data/schemas README files ✅

VitePress processed `public/data/schemas/v2/examples/README.md` and `public/data/schemas/v3/examples/README.md` as pages, generating 2 spurious HTML files and sitemap entries. These are reference data files, not site pages.

**Fix:** Added `'public/data/schemas/**'` to `srcExclude` in config.ts. Sitemap reduced from 76 to 74 URLs. The raw `.md` files remain available as static assets for download.

## Audit summary

Comprehensive third-pass audit checked:
- All 77 pages for broken internal links — none found (all images exist in `public/`)
- External links — all verified correct
- Frontmatter — all pages have title and description
- Heading hierarchy — all issues were in code blocks (false positives)
- Multiple H1 — all in code blocks (false positives)
- Sidebar coverage — no orphaned pages
- Blog posts — all have correct frontmatter
- Components — all working correctly
- Navigation — consistent across all sections
- Sitemap — clean (74 URLs, no spurious entries)
