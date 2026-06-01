# TODO 8 — Fullscreen Tool Pages: Shared Layout & Styled Headers

## Status: DONE

## Problem

The three fullscreen reference pages (Ontology Browser, Schema Browser, Entity Fields) had unstyled H1 + description + cross-nav links rendered as raw markdown inside the fullscreen layout. The fullscreen CSS strips all VitePress container padding, so the content sat unstyled at the top.

Additionally, OntologyBrowser and SchemaReference had independent sidebar+main layouts with duplicated patterns (mobile toggle, overlay, sidebar nav) that should be consistent.

## Solution

Created `FullscreenToolLayout.vue` — a shared wrapper component that provides:
- Styled header with title, description, and cross-navigation links
- Consistent `max-width: 90rem` constraint
- Slot-based architecture: `#nav` slot for links, default slot for tool body

All three tool pages now:
- Remove raw markdown H1/description/nav from `.md` files
- Wrap their component content in `<FullscreenToolLayout>` with props for title/description
- Use the `#nav` slot for cross-reference links

## Files changed

- **NEW** `.vitepress/theme/components/FullscreenToolLayout.vue` — Shared header layout
- **MOD** `.vitepress/theme/index.ts` — Register FullscreenToolLayout
- **MOD** `.vitepress/theme/components/OntologyBrowser.vue` — Wrap with layout
- **MOD** `.vitepress/theme/components/SchemaReference.vue` — Wrap with layout
- **MOD** `.vitepress/theme/components/YamlSchemas.vue` — Wrap with layout
- **MOD** `reference/ontology.md` — Remove raw markdown header
- **MOD** `reference/schema-browser.md` — Remove raw markdown header
- **MOD** `reference/entity-fields.md` — Remove raw markdown header
