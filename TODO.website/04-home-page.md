# 04 - Create HomePage component

Replace the static React hero with a VitePress HomePage.vue component.

## Current home page

The React home has:
- Tagline: "Open-source software for maintaining multi-language concept systems"
- 3 CTA buttons: Desktop app, Adopt (disabled), Docs (disabled)
- "Used by" section with Geolexica/ISO TC 211 link

## New HomePage.vue

Should include:
1. **Hero section** — tagline + primary CTA buttons
   - "Browse concepts" → links to concept-browser demo
   - "Download Desktop" → `/docs/desktop/getting-started`
   - "View the model" → `/docs/model/`
2. **Software grid** — 4 cards for each product
   - glossarist-ruby: Ruby gem for concept management
   - glossarist-js: JS SDK for GCR packages
   - concept-browser: Vue SPA for browsing datasets
   - glossarist-desktop: Desktop app for editing
3. **Used by** — logos of organizations using Glossarist
4. **Features strip** — key capabilities (multi-language, ISO standards, RDF, TBX, etc.)

## VitePress integration

Use frontmatter in `docs/index.md` to trigger the custom layout:

```yaml
---
layout: home
---

<HomePage />
```

Then in `.vitepress/theme/index.ts`:
```ts
enhanceApp({ app }) {
  app.component('HomePage', HomePage)
}
```
