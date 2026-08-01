# TODO.refactor — Architectural Cleanup & Enhancement Plan

This directory captures every architectural, code-quality, and feature enhancement identified for glossarist.org. Each item lives in its own file with: motivation, scope, acceptance criteria, and execution notes.

## Guiding principles (apply to all items)

- **Open/Closed Principle (OCP)** — Adding a new flavor = adding a config file, not changing renderer code. Adding a new behavior = registering a new handler, not editing a switch statement.
- **DRY** — One source of truth. Duplication is a debt to migrate, not a pattern to copy.
- **MECE** — Every concern lives in exactly one place. No overlap between modules, no gaps in responsibility.
- **Model-driven, semantically-driven** — Code reflects the domain model. Classes/files are named after domain concepts. Methods are named after domain actions.
- **Encapsulation** — Never bypass with `send`, `instance_variable_get/set`, `respond_to?`-based duck typing. Use real types and proper public APIs.
- **Lazy loading** — Use `autoload`-equivalent (TS path aliases, dynamic imports) rather than fragile relative requires.
- **Performance matters** — Don't OOP yourself into pathological patterns. But don't micro-optimize at the cost of clarity. Measure before optimizing.
- **Good specs throughout** — Every public surface should have specs. Every behavioral edge case should be covered.

## Status legend

- ☐ — Not started
- ◐ — In progress
- ◑ — Partially complete (some sub-items done)
- ☒ — Complete

## Priority index

### Critical (correctness bugs)

| # | Title | Status |
|---|-------|--------|
| 01 | [Hyperedge SVG correctness audit](01-hyperedge-svg-correctness.md) | ☐ |
| 02 | [SVG light-background wrapping completeness](02-svg-light-background-completeness.md) | ☐ |
| 03 | [Hyperedge SVG DRY — consolidate duplicates](03-hyperedge-svg-dedup.md) | ☐ |

### High priority (code quality)

| # | Title | Status |
|---|-------|--------|
| 04 | [SVG theme-aware palette (CSS variables, not hardcoded)](04-svg-theme-aware-palette.md) | ☐ |
| 05 | [Eliminate fragile relative imports (TS analog of Ruby require_relative rule)](05-no-fragile-relative-imports.md) | ☐ |
| 06 | [Replace duck-typing patterns with proper type guards](06-no-respond-to-duck-typing.md) | ☐ |
| 07 | [Spec coverage gaps — every public surface tested](07-spec-coverage-gaps.md) | ☐ |

### Medium priority (architecture)

| # | Title | Status |
|---|-------|--------|
| 08 | [Bundle size audit + budget enforcement](08-bundle-size-audit.md) | ☐ |
| 09 | [Vue island hydration strategy audit](09-vue-island-hydration-strategy.md) | ☐ |
| 10 | [Extract i18n types to dedicated module + add hreflang tags](10-i18n-extraction-and-hreflang.md) | ☐ |
| 11 | [SEO completeness — hreflang, OG images, structured-data expansion](11-seo-completeness.md) | ☐ |
| 12 | [Pre-commit hooks for SVG a11y + diagram invariants](12-precommit-svg-a11y-hooks.md) | ☐ |

### Lower priority (polish + future)

| # | Title | Status |
|---|-------|--------|
| 13 | [Accessibility WCAG 2.1 AA audit](13-accessibility-wcag-audit.md) | ☒ |
| 14 | [Image optimization — responsive WebP, lazy-loading audit](14-image-optimization.md) | ☒ |
| 15 | [Translate Nav + Footer chrome (i18n extension)](15-translate-nav-footer-chrome.md) | ☒ |
| 16 | [Content translation strategy (per-locale content collections)](16-content-translation-strategy.md) | ☒ |
| 17 | [Shared concept-browser renderer extraction](17-shared-renderer-extraction.md) | ☒ |
| 18 | [Split HomePage.vue into composed sections](18-split-homepage-into-composed-sections.md) | ◑ |
| 25 | [ESLint + Prettier config](25-eslint-prettier-config.md) | ☒ |
| 26 | [Import glossarist-js types when *Json interfaces are public](26-import-glossarist-js-types.md) | ☐ |

## Execution order

1. **Critical (1–3)** — Fix correctness bugs in diagrams first. These are user-visible.
2. **High priority (4–7)** — Code quality. SVG theme-awareness eliminates an entire class of light/dark bugs permanently.
3. **Medium priority (8–12)** — Architecture. Most can ship in single PRs.
4. **Lower priority (13–17)** — Polish and future. Some are multi-week; capture as TODOs and execute opportunistically.

## Principles applied to this plan itself

- **MECE** — Each TODO is mutually exclusive. Overlapping work is split or merged.
- **OCP** — Adding new TODOs is additive; existing ones don't change scope.
- **DRY** — The overview is an index, not a re-statement. Details live in each TODO file.
- **Specs** — Every TODO defines acceptance criteria that can be tested.
