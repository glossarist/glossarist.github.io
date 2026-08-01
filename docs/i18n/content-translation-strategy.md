# TODO 16 — Content Translation Strategy: EXECUTION STATUS

## Status
◑ Partially executed — strategy documented, directory structure created, one proof-of-concept stub page created.

## Strategy chosen: Option A — Per-locale content collections

```
src/content/
  model/                    # English (canonical)
  fr/model/                 # French (future)
  zh-Hans/model/            # Simplified Chinese (future)
  zh-Hant/model/            # Traditional Chinese (future)
```

Astro `i18n` routing will pick the file based on URL prefix:
- `/model/hyperedges` → English
- `/fr/model/hyperedges` → French
- `/zh-CN/model/hyperedges` → Simplified Chinese
- `/zh-TW/model/hyperedges` → Traditional Chinese

## What's done in this PR

1. **Strategy documented** — this file + TODO.refactor/16 (original)
2. **i18n routing stub** — Astro's `i18n` config documented for future enablement
3. **One proof-of-concept** — a French stub for the about page demonstrates the URL pattern

## What remains (future PRs)

- Translate all content pages (multi-week community effort)
- Enable Astro i18n routing in astro.config.mjs
- Set up translation memory (optional: Crowdin / Transifex integration)
- Community call for translators

## Why this is lower priority

The site's content is highly technical and English-dominated in the
standards world. The chrome translation (PR #98) gives readers a
welcoming signal without the multi-week content effort. Defer full
content translation until chrome is stable and there's demonstrated
demand from non-English communities.
