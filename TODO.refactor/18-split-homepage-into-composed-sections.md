# 18 — Split HomePage.vue into composed sections (SRP)

## Status
☐ Not started

## Motivation

`HomePage.vue` is **890 lines** in a single file. It contains:
- Hero section with animated ticker
- "Pipeline" section (4 cards)
- Software grid
- "Used by" section (adopter cards)
- Standards compliance section (5 ISO standard cards)
- Final CTA
- 700+ lines of scoped CSS

This violates the Single Responsibility Principle. The component does too much:
- Renders 6 distinct sections
- Manages ticker animation state
- Manages code-tab interaction
- Imports projects data + i18n store

A bug in the ticker shouldn't require reading 890 lines. A new section shouldn't require editing a 890-line file.

## Scope

Split `HomePage.vue` into:

```
src/components/home/
  HomePageHero.vue           (hero + ticker + CTAs)
  HomePagePipeline.vue       (4-card pipeline section)
  HomePageSoftware.vue       (software grid)
  HomePageAdopters.vue       (adopter cards)
  HomePageStandards.vue      (ISO standard cards)
  HomePageCTA.vue            (final CTA banner)
```

The parent `HomePage.vue` becomes a thin orchestrator (~50 lines):

```vue
<template>
  <div class="home">
    <HomePageHero />
    <HomePagePipeline />
    <HomePageSoftware />
    <HomePageAdopters />
    <HomePageStandards />
    <HomePageCTA />
  </div>
</template>
```

Each child component owns its own data dependencies, scoped CSS, and any local interactive state.

## Acceptance criteria

- [ ] `HomePage.vue` < 100 lines
- [ ] 6 child components under `src/components/home/`
- [ ] Each child is independently testable (smoke mount test per child)
- [ ] No regression in rendered HTML (visual diff against current homepage)
- [ ] No regression in vitest smoke test
- [ ] Shared CSS variables moved to `src/styles/home.css` (or scoped per child as appropriate)

## Why this matters

Beyond SRP:
- **Performance** — smaller components mean Vue's reactivity tracks less per render. The ticker animation re-renders only the hero, not all 6 sections.
- **Testability** — each child can be mount-tested in isolation with its own mock data.
- **Reusability** — `HomePageStandards.vue` could be embedded on `/reference/standards/` overview page.
- **Cognitive load** — reviewing a 100-line component is fast; reviewing a 890-line component is slow.

## Risk

Medium. Visual regressions are the main risk. Mitigation:
- Take before/after screenshots
- Existing smoke test catches mounting failures
- Visual diff is small because the rendered HTML stays the same

## Dependencies

- None
