# 09 — Vue island hydration strategy audit

## Status
◑ Partially complete

## Motivation

Astro islands support multiple hydration directives:
- `client:load` — hydrate immediately (heaviest)
- `client:idle` — hydrate when browser is idle
- `client:visible` — hydrate when scrolled into view
- `client:media` — hydrate when media query matches
- `client:only` — skip SSR, render only on client

Choosing the wrong strategy means either wasted work (hydrating something the user never sees) or jank (something interactive but not yet hydrated).

## Current strategy

| Component | Directive | Reason |
|-----------|-----------|--------|
| `HomePage.vue` | `client:load` | Hero is above-the-fold; needs to be interactive immediately |
| `OntologyBrowser.vue` | `client:visible` | Heavy; only hydrate when user scrolls to it |
| `SchemaReference.vue` | `client:visible` | Same |
| `YamlSchemas.vue` | `client:visible` | Same |
| `RelationshipTypes.vue` | `client:visible` | Same |
| `ModelLanding.astro` | (static) | No hydration needed |
| `ReleaseDownloader.astro` | (static) | Astro component, no Vue hydration |
| `LogoMerge.astro` | (static) | Astro component |
| `HyperedgePlayground.vue` | `client:load` | Interactive tool — user came to play, hydration delay feels broken |
| `ValidatorPlayground.vue` | `client:load` | Same |
| `LanguageSwitcher.vue` | `client:idle` | Mounts in nav; doesn't need instant interaction, but should be ready before user clicks |

## Audit findings

Strategy looks correct. No changes recommended for current components.

## Future considerations

- The Hyperedge + Validator playgrounds both load the `yaml` package. If a user navigates between them, they re-download (or hit cache). Could code-split the YAML parser into a shared chunk.
- The i18n store is loaded on every page (because `LanguageSwitcher` is in the nav). It's tiny (~5 KB), so this is fine.

## Acceptance criteria

- [ ] Audit documented (this file)
- [ ] No changes needed — current strategy is correct
- [ ] Future playground additions follow the same decision tree:
  - Interactive tool user navigates to intentionally → `client:load`
  - Below-the-fold reference widget → `client:visible`
  - Always-present chrome → `client:idle`

## Follow-up

If playground traffic grows, consider extracting `yaml` into a shared chunk via Vite manualChunks config.
