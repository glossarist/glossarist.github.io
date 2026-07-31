# 02 — SVG light-background wrapping completeness

## Status
☐ Not started

## Motivation

User flagged: "most of them need to have a light background (because they were meant for the light background only)".

PR #91 added the `.g-figure-light` CSS class and converted all hyperedge SVG references in MDX files to `<figure class="g-figure-light">` blocks. But subsequent commits added new SVGs without the wrapper:

- `hyperedge-sequential.svg` is referenced in:
  - `src/content/blog/2026-07-31-phase1-iso-704-full-coverage.mdx:35` — plain markdown `![](...)` syntax
  - `src/content/model/sequential-relations.mdx:16` — plain markdown `![](...)` syntax

These render as raw `<img>` without the light-bg wrapper, becoming unreadable in dark mode.

## Scope

- Audit every hyperedge SVG reference in MDX files
- Convert any remaining plain-markdown-image references to `<figure class="g-figure-light">` blocks
- Add a regression test that catches any new SVG reference missing the wrapper

## Acceptance criteria

- [ ] All hyperedge SVG references in MDX use `<figure class="g-figure-light">` (no plain `![](...)` left)
- [ ] Test `every hyperedge SVG reference is wrapped in g-figure-light` passes (test exists in `test/content-references.test.ts` but currently only checks known files; expand to scan all MDX)
- [ ] Manual: open pages in dark mode and confirm readability

## Long-term fix

See [TODO 04 — SVG theme-aware palette](04-svg-theme-aware-palette.md). The light-bg wrapper is a workaround; the proper fix is rewriting SVGs to use CSS variables so they adapt to host page theme automatically.

But the wrapper remains useful for SVGs that genuinely need a card-like surface (directory trees, code previews, etc.) regardless of theme.
