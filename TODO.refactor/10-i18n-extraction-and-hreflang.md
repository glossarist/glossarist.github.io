# 10 — Extract i18n types to dedicated module + add hreflang tags

## Status
◐ Partially complete

## Motivation

PR #98 (i18n) added `src/i18n/translations.ts` and `src/i18n/index.ts`. The types are co-located with the data. For larger-scale i18n work (translating nav, footer, eventually content pages), the types should be in a dedicated `src/i18n/types.ts` so they can be imported without pulling the implementation.

Also: SEO requires `<link rel="alternate" hreflang="...">` tags when multiple locales are available. Currently missing.

## Scope

1. Extract `Locale`, `TranslationSet`, `LOCALES` types to `src/i18n/types.ts`
2. Add hreflang tags to BaseLayout for the 4 supported locales
3. Document the locale-naming convention (ISO 639-3 + ISO 15924 for `zho-Hans`/`zho-Hant`)

## Acceptance criteria

- [ ] `src/i18n/types.ts` exists with all type definitions
- [ ] `src/i18n/translations.ts` and `src/i18n/index.ts` import from `./types`
- [ ] BaseLayout emits `<link rel="alternate" hreflang="..." href="...">` for each locale
- [ ] Test verifies hreflang tags present on built pages

## Hreflang strategy

Since content pages stay English-only (per i18n PR scope), hreflang only applies to the homepage:

```html
<link rel="alternate" hreflang="en" href="https://www.glossarist.org/" />
<link rel="alternate" hreflang="fr" href="https://www.glossarist.org/?lang=fra" />
<link rel="alternate" hreflang="zh-Hans" href="https://www.glossarist.org/?lang=zho-Hans" />
<link rel="alternate" hreflang="zh-Hant" href="https://www.glossarist.org/?lang=zho-Hant" />
<link rel="alternate" hreflang="x-default" href="https://www.glossarist.org/" />
```

Note: `?lang=` query parameter is the simplest URL strategy for client-side locale selection without restructuring the routing.

## Dependencies

- None blocking
