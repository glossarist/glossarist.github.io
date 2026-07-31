# ADR 0003: Client-side i18n for chrome only (not content)

## Status

Accepted (2026-07-31)

## Context

The site needs to welcome non-English readers. Two scopes of translation:

1. **Chrome** — nav labels, hero text, CTAs, footer. Small surface (~50 strings).
2. **Content** — every MDX page under `/model/`, `/reference/`, `/docs/`, `/blog/`, `/use-cases/`. ~100 pages × ~2000 words each.

Options for translation strategy:

- **Per-locale content collections** (`src/content/fr/`, `src/content/zh-Hans/`, etc.) with routing prefix. Full site translation.
- **Server-rendered multi-locale** via edge function. Requires non-static deployment.
- **Client-side chrome-only translation** — homepage hero + CTAs + nav + footer switch via `localStorage`; content pages stay English.

## Decision

Implement client-side chrome-only translation (option C). Defer content translation as documented in `TODO.refactor/16`.

Rationale:

- Chrome translation is achievable in one PR; content translation is multi-week
- The chrome change signals welcoming to non-English readers without committing to ongoing content translation burden
- Static deployment model (GitHub Pages) preserved
- The i18n store (`src/i18n/index.ts`) is structured so content translation can be added later without rewriting chrome logic

## Consequences

**Pros**
- Fast to ship — one PR, 4 locales
- Honest — language switcher help text says "content pages stay in English for now"
- No routing changes (URLs stay the same regardless of locale)
- Reversible — content translation can be added later without removing this

**Cons**
- Inconsistent UX — visitors see translated hero, then English content. Documented in the language switcher help text.
- No per-locale SEO (no `/fr/` URLs to index in French search engines). hreflang tags point at `?lang=` query strings on the homepage only.
- Browser locale detection via `navigator.language` is imperfect (doesn't track the manual toggle)

## Implementation

- `src/i18n/translations.ts` — typed string registry (4 locales × 17 keys)
- `src/i18n/index.ts` — Vue reactive store; localStorage persistence; `navigator.language` fallback
- `src/components/LanguageSwitcher.vue` — dropdown in nav
- `BaseLayout.astro` emits hreflang alternates pointing at `?lang=` URLs

## Alternatives considered

- **Per-locale content collections** (Astro's `i18n` routing) — rejected for scope; documented as TODO 16
- **Translation memory service** (Crowdin, Transifex) — rejected for cost + integration burden
- **Community forks per locale** — rejected for discoverability

## References

- TODO.refactor/15 — translate Nav + Footer chrome (extension)
- TODO.refactor/16 — content translation strategy (deferred)
- PR #98 — initial i18n implementation
