# 15 — Translate Nav + Footer chrome

## Status
☐ Not started (extension of i18n PR #98)

## Motivation

PR #98 translated the homepage chrome (hero, CTAs, section labels) across 4 locales. Nav and footer remained English-only. A French/Chinese reader landing on the homepage sees translated hero, then immediately hits English nav — inconsistent.

## Scope

Extend the i18n store to cover:

1. Nav item labels (Model, Reference, Software, Docs, Use Cases, Playground, Blog, About, Reader's Guide)
2. Footer text (copyright, links, tagline)
3. Search placeholder text
4. Language switcher help text (already translated)

## Implementation

Since Nav and Footer are Astro components (server-rendered), translating them client-side requires either:

### Option A: Convert Nav + Footer to Vue islands

Full hydration of nav. Performance cost: ~30KB more JS on every page.

### Option B: Server-render all 4 locales, swap client-side

Nav HTML includes 4 variants of each label, hidden via CSS. JS swaps the visible one based on `localStorage['glossarist-locale']`.

Pros: no extra JS payload; works without hydration.
Cons: HTML is 4× larger for nav (negligible — nav is small).

### Option C: Use Astro i18n routing

`/fr/`, `/zh-CN/`, `/zh-TW/` prefixes with per-locale nav. Requires content translation strategy (TODO 16) — chrome translation alone doesn't help if content stays English.

## Recommendation

**Option B** (server-rendered multi-locale + client swap) is the right trade-off for this site. Lowers friction without committing to full content localization.

## Acceptance criteria

- [ ] Nav labels translated for all 4 locales
- [ ] Footer text translated for all 4 locales
- [ ] Search placeholder translated
- [ ] Language switcher choice reflects across nav + footer + homepage
- [ ] Tests verify each locale renders correct labels

## Test

```ts
it('nav reflects current locale', async () => {
  const { setLocale } = useI18n()
  setLocale('fra')
  // DOM should now show 'Modèle' instead of 'Model' for nav
  await nextTick()
  expect(document.querySelector('[data-i18n="nav.model"]').textContent).toBe('Modèle')
})
```
