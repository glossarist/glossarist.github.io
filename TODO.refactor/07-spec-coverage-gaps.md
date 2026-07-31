# 07 — Spec coverage gaps

## Status
◑ Partially complete (current: 563 tests; gap analysis below)

## Motivation

Project rule: "Good specs throughout. Every public method should have specs."

## Current coverage

| Surface | Test file | Coverage |
|---------|-----------|----------|
| Build output structure | `test/pages.test.ts`, `test/layouts.test.ts` | Good |
| Component mounting | `test/components/*.test.ts` | Smoke + behavior |
| MDX content invariants | `test/content-references.test.ts` | Good (525+ tests) |
| i18n | `test/i18n.test.ts`, `test/components/LanguageSwitcher.test.ts` | Good |
| Playgrounds | `test/components/HyperedgePlayground.test.ts`, `test/components/ValidatorPlayground.test.ts` | Good |
| Admonition rehype plugin | `test/rehype-admonitions.test.ts` | Good |
| Sidebar / outline | `test/sidebar-outline.test.ts` | Good |
| Nav highlighting | `test/nav-highlighting.test.ts` | Good |
| Scripts (build pipeline) | `test/scripts.test.ts` | Good |

## Identified gaps

### Gap 1: SVG wire-preview field-name check

The hand-rolled SVGs include YAML previews. These can drift from the actual model field names (BUG-1 in TODO 01). No test catches this.

**Add**: `test/svg-wire-preview.test.ts` — for every SVG containing a YAML preview, parse the preview and verify field names match `glossarist-js`'s canonical field names.

### Gap 2: ISO section citation sanity

SVGs cite ISO 704 / 10241-1 / 12620 sections. BUG-2 in TODO 01 shows cites can be wrong (partitive cite used in a generic context, etc.). No test catches this.

**Add**: `test/svg-iso-citations.test.ts` — for every `§X.Y.Z` cite in an SVG, classify the context (partitive / generic / sequential) and verify the cite matches.

### Gap 3: Performance regression detection

No baseline for build size, test duration, or page count. Adding a heavy dep would silently inflate bundles.

**Add**: `test/perf-budget.test.ts` — assert page count under N (currently 103), test duration under N seconds.

### Gap 4: OG / canonical URL presence on every page

PR #90 added JSON-LD + canonical URLs. The test covers 3 sample pages. Doesn't catch regressions on new pages.

**Improve**: expand the existing SEO test to iterate over ALL built pages.

### Gap 5: ISO standard page coverage

The /reference/standards/ pages (iso-704, iso-10241-1, etc.) don't have content tests verifying they cover their standard's mandatory concepts.

**Add**: for each ISO standard page, verify the built HTML contains the standard's mandatory section numbers.

## Acceptance criteria

- [ ] Gap 1 test added and passing
- [ ] Gap 2 test added and passing
- [ ] Gap 3 test added (initial baseline, no assertion failure)
- [ ] Gap 4 SEO test iterates all built pages
- [ ] Gap 5 standards-page coverage tests added

## After this TODO

Test count should grow from 563 to ~600+. Each new test catches a real class of regression.
