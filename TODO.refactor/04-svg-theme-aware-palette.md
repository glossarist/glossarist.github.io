# 04 — SVG theme-aware palette (CSS variables, not hardcoded)

## Status
☐ Not started (larger effort; permanent fix for the light-bg class of bugs)

## Motivation

Every hyperedge SVG hardcodes a light-mode palette:
- `fill: #f8f9fa` for boxes
- `fill: #212529` for text/strokes
- `fill: #6c757d` for secondary text

This forces every consumer to wrap the SVG in `.g-figure-light` (a forced-light card) for dark-mode readability. The workaround works but is fragile:
- Adding a new SVG requires remembering the wrapper (TODO 02 regression catches this)
- The wrapper "card" look may not match every context (sometimes you want a transparent background)
- Double maintenance: SVG palette + page theme

## Proper fix

Rewrite SVGs to use CSS variables / `currentColor` so they inherit theme from the host page:

```svg
<style>
  .box { fill: var(--g-bg-soft, #f8f9fa); stroke: var(--g-text-1, #343a40); }
  .label { fill: var(--g-text-1, #212529); }
  .small { fill: var(--g-text-3, #6c757d); }
</style>
```

When the SVG is inlined into the page (or referenced via `<img>` from a same-origin page), it inherits the CSS custom properties from the document root.

**Caveat**: CSS variables only flow through inline SVGs, not `<img src="*.svg">`. For `<img>` references, the SVG is rendered in isolation and uses its declared defaults.

## Two implementation options

### Option A: Convert SVGs to Astro components

Replace `<img src="/images/hyperedge-X.svg">` with `<HyperedgeDiagramX />` Astro components that inline the SVG. The SVG then inherits page CSS variables naturally.

Pros: theme-awareness is automatic; SVGs become first-class components.
Cons: significant refactor (10 SVGs × component creation); loses the simple "edit an SVG file" workflow.

### Option B: Provide dual SVGs + media-query selection

Keep static SVG files but author them with `prefers-color-scheme` media queries inside the SVG itself:

```svg
<style>
  .box { fill: #f8f9fa; stroke: #343a40; }
  .label { fill: #212529; }
  @media (prefers-color-scheme: dark) {
    .box { fill: #212529; stroke: #dee2e6; }
    .label { fill: #f8f9fa; }
  }
</style>
```

Pros: works with `<img src="*.svg">` references; no component refactor.
Cons: each SVG carries its own theme logic (slight DRY violation); the SVG theme follows the OS preference, not the page's manual toggle.

**Note**: Glossarist's site has a manual theme toggle (`localStorage['glossarist-theme']`), so the SVG `prefers-color-scheme` media query would not track the manual toggle. Option B has a real limitation here.

### Option C: Use the `::part()` shadow parts API

Wrap SVGs in a web component that exposes theme parts. Overkill for this site.

## Recommendation

**Option A** is correct architecturally but expensive. **Option B** is cheap and gets 80% of the value (dark mode works for users who haven't manually toggled).

Given the existing manual-toggle limitation, the most pragmatic path is:
1. Keep `.g-figure-light` for now (it works, just looks like a card)
2. Migrate the highest-traffic SVGs (hyperedge-partitive, hyperedge-computer-mouse) to Option A components in a future PR
3. Document the trade-off in this TODO

## Scope (this round)

Defer the full migration. Capture as a TODO and execute opportunistically.

The forced-light wrapper from PR #91 remains the production solution.

## Acceptance criteria (when executed)

- [ ] At least the top-3 hyperedge SVGs (partitive, computer-mouse, optomechanical-mouse) migrated to theme-aware palette
- [ ] Both light and dark mode render correctly without the `.g-figure-light` wrapper
- [ ] Manual theme toggle updates the SVG reactively
- [ ] Test verifies SVGs reference `var(--g-*)` instead of hardcoded hex colors

## Dependencies

- None blocking. Can ship independently.
