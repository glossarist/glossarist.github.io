# 23 — Architecture Decision Records (ADRs)

## Status
☐ Not started

## Motivation

Significant architectural decisions have been made in this codebase without written rationale:

- Why Astro (not VitePress, Next.js, etc.)?
- Why Vue islands (not React Server Components)?
- Why hand-rolled validators in playgrounds (not bundled glossarist-js)?
- Why per-file hyperedge storage (not inline on concepts)?
- Why client-side i18n (not server-rendered multi-locale)?
- Why forced light backgrounds for SVGs (not theme-aware palettes)?

Future maintainers will re-litigate these without context. PR descriptions get lost. Commit messages help but are scattered. ADRs are the canonical pattern for capturing "why" decisions.

## Scope

Establish `docs/adr/` directory with a template + initial ADRs:

```
docs/adr/
  0000-template.md                       (template for new ADRs)
  0001-use-astro-not-vitepress.md
  0002-vue-islands-not-rsc.md
  0003-handrolled-playground-validators.md
  0004-per-file-hyperedge-storage.md
  0005-client-side-i18n-chrome-only.md
  0006-forced-light-svg-figures.md
  0007-path-aliases-over-relative-imports.md
  0008-typed-concept-yaml-domain-model.md
```

Each ADR follows the [MADR template](https://adr.github.io/madr/) (lightweight, structured):

```markdown
# ADR 0001: Use Astro, not VitePress

## Status
Accepted (2026-07-15)

## Context
The site was originally VitePress. Migration drivers:
- Vue 3 island hydration (VitePress doesn't support)
- Content collections with typed schemas
- Per-page layout flexibility

## Decision
Migrate to Astro 7.

## Consequences
- Pros: ...
- Cons: ...
- Risks: ...
```

## Acceptance criteria

- [ ] `docs/adr/` directory exists
- [ ] MADR template committed
- [ ] At least 5 initial ADRs documenting the decisions listed above
- [ ] `CONTRIBUTING.md` (or README) references ADRs as the "why" source
- [ ] PR template includes "Does this PR introduce a new ADR-worthy decision?"

## Why this matters

- **MECE with PRs** — PRs say "what changed"; ADRs say "why we chose this". They don't overlap.
- **Onboarding** — new contributors can read ADRs to understand the architecture
- **Audit trail** — when revisiting a decision, ADRs provide the original context

## Effort

Half-day to write 5-8 initial ADRs. Then ~10 minutes per new decision.

## Dependencies

- TODO 24 (CONTRIBUTING.md) — natural pairing
