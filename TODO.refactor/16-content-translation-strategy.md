# 16 — Content translation strategy

## Status
☐ Not started (multi-week effort)

## Motivation

100+ MDX content pages. Translating them is the biggest single barrier to non-English adoption. This TODO documents the strategy options and picks one.

## Scope (clarification)

What "content translation" means:
- Translate every page under `/model/`, `/reference/`, `/docs/`, `/blog/`, `/use-cases/`
- Maintain translation currency as English pages evolve
- Detect user language and route appropriately

What it doesn't mean:
- Translating the YAML data files (those are already multi-language by design — `localizations: { eng: ..., fra: ... }`)
- Translating code samples (those stay language-neutral)

## Strategy options

### Option A: Per-locale content collections

`src/content/model/hyperedges.mdx` (English, default)
`src/content/fr/model/hyperedges.mdx` (French)
`src/content/zh-Hans/model/hyperedges.mdx` (Simplified Chinese)
`src/content/zh-Hant/model/hyperedges.mdx` (Traditional Chinese)

Astro picks the file based on URL prefix (`/model/hyperedges` vs `/fr/model/hyperedges`).

**Pros**: cleanest model; translators work in MDX files; clear ownership per locale.
**Cons**: 4× the files; translations drift; English updates require regenerating other locales.

### Option B: Translation memory + per-paragraph

Each MDX paragraph gets an ID. A single translations file maps ID + locale → translated text. Build-time picks the right translation per locale.

**Pros**: single source of truth for English; translations are clearly diffs.
**Cons**: complex tooling; MDX authoring becomes awkward.

### Option C: External translation service (Crowdin, Transifex)

Ship English content; send to a translation service; receive translated MDX; merge.

**Pros**: leverages professional translators; handles drift via workflow.
**Cons**: cost; not open-source-friendly; requires service integration.

### Option D: Community-translated forks

Each locale has its own repo (`glossarist.github.io-fr`, `glossarist.github.io-zh-Hans`). Periodically merge upstream English changes; community translates the diff.

**Pros**: zero tooling; mirrors how Linux kernel handles translations.
**Cons**: discoverability — readers need to know which domain to visit.

## Recommendation

**Option A** with these constraints:
- English is the canonical source in `src/content/`
- Other locales live in `src/content/{locale}/`
- Astro `i18n` routing picks based on URL prefix
- Translators send PRs to specific locale subdirs
- A "needs translation" bot flags when English files diverge from translated ones (by hash)

This is the same pattern Astro's own docs use.

## Effort estimate

- Initial setup: 1-2 days (routing, fallback strategy, link rewriting)
- French initial translation of all content: 5-10 days (community-driven)
- Chinese (Simplified + Traditional): 10-15 days each
- Ongoing maintenance: ~5% of English content effort, per locale

## Acceptance criteria

- [ ] Strategy decided (Option A recommended)
- [ ] i18n routing configured
- [ ] French locale structure created (even if content is empty placeholders)
- [ ] Call for translators published (blog post + GitHub issue template)
- [ ] At least one full page translated as a proof-of-concept

## Why this TODO is lower priority

The site's content is highly technical and English-dominated in the standards world. Translating the chrome (PR #98) gives readers a welcoming signal without committing to the multi-week content effort. Defer content translation until chrome is stable and there's demonstrated demand.
