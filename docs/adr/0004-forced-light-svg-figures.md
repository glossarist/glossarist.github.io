# ADR 0004: Forced light backgrounds for hyperedge SVGs

## Status

Accepted (2026-07-30)

## Context

The hyperedge SVG diagrams (`public/images/hyperedge-*.svg`) hardcode a light-mode palette:

- `fill: #f8f9fa` for boxes (light grey)
- `fill: #212529` for text/strokes (dark)
- `fill: #6c757d` for secondary text
- `stroke: #adb5bd` for separators

In dark mode (`html.dark`), these become unreadable: dark text on dark background.

## Decision

Wrap every hyperedge SVG reference in `<figure class="g-figure-light">`. The CSS class forces a white card around the SVG regardless of page theme:

```css
figure.g-figure-light img,
.g-figure-light img {
  background: #ffffff !important;
  border-color: #dee2e6 !important;
  padding: 1.5rem !important;
}
```

This makes SVGs always render on a light card, even when the rest of the page is dark. The "card" look is acceptable in both themes.

## Consequences

**Pros**
- SVGs remain readable in both themes
- SVG authoring stays simple (no theme-aware CSS variables)
- One CSS class covers all hyperedge diagrams
- Test invariant (`test/content-references.test.ts`) prevents new SVGs from skipping the wrapper

**Cons**
- Visual: the SVG "card" looks slightly different from surrounding dark page. Acceptable trade-off.
- Adding a new SVG requires remembering the wrapper. Mitigated by the test invariant.
- The wrapper doesn't help non-hyperedge SVGs that may have the same problem.

## Why not rewrite SVGs with CSS variables?

The "proper" fix is using `var(--g-text-1)` etc. inside the SVG so it inherits theme from the host page. But:

- CSS variables don't flow through `<img src="*.svg">` references (only inline SVGs)
- Converting 9 SVGs to inline is a larger refactor (`TODO.refactor/04`)
- The forced-light wrapper is a 90% solution that ships in 10 minutes

## When to revisit

- If non-hyperedge SVGs need theme support → apply the same wrapper pattern or migrate to inline
- If a third party wants to embed our SVGs in their dark-mode docs → the forced-light card travels with the SVG, which is the right default

## References

- TODO.refactor/02 — wrapping completeness (executed)
- TODO.refactor/04 — theme-aware palette (deferred)
- PR #91 — initial SVG fixes + `.g-figure-light` class
