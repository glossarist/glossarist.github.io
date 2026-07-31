# 21 — Make i18n keys enum-driven (not stringly-typed)

## Status
☐ Not started

## Motivation

The i18n `TranslationSet` interface currently uses string keys:

```ts
interface TranslationSet {
  hero_eyebrow: string
  hero_title_1: string
  // ...
}
```

Adding a new key requires:
1. Add to the interface
2. Add to every locale object (4 places)
3. Update every component that reads it

The translation completeness test (`test/i18n.test.ts`) catches missing keys but doesn't prevent typos at the call site:

```vue
{{ t.hero_eybow }}  // typo: 'eybow' instead of 'eyebrow' — TypeScript catches this
{{ t['hero_eybow'] }}  // bracket access — TypeScript may not catch this
```

And iterating the keys (e.g. for a translation memory exporter) requires `Object.keys()` casting.

## Scope

Refactor to enum-driven keys:

```ts
// src/i18n/types.ts
export type TranslationKey =
  | 'hero_eyebrow'
  | 'hero_title_1'
  | 'hero_title_2_em'
  | 'hero_lede'
  // ... (one per line, easy to add)

export type TranslationSet = Record<TranslationKey, string>
export type Locale = 'eng' | 'fra' | 'zho-Hans' | 'zho-Hant'
export type Translations = Record<Locale, TranslationSet>
```

Benefit: a key can be referenced as a variable:

```ts
const KEY_HERO_EYEBROW: TranslationKey = 'hero_eyebrow'
translations[current.value][KEY_HERO_EYEBROW]  // type-safe access
```

## Acceptance criteria

- [ ] `TranslationKey` union type defined
- [ ] `TranslationSet` becomes `Record<TranslationKey, string>`
- [ ] Every locale's translation object must implement all keys (compiler-enforced)
- [ ] No `as const` escape hatches in production code
- [ ] Test verifies that the key union and the eng locale's keys are in sync

## Why this matters

- **Type safety** — call sites that use bracket access (`t[key]`) now require `key: TranslationKey`, not `string`
- **OCP** — adding a key = adding to the union type; compiler tells you every place that needs updating
- **DRY** — the key list lives in one type, not duplicated across 4 locale objects

## Risk

Low. The refactor is mechanical. The TranslationKey union is exhaustive; if a key is added to the union but not to a locale, TypeScript errors immediately.

## Dependencies

- TODO 10 (extract i18n types to dedicated module) — natural pairing
