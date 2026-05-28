# 08 - Create Blog/News section

Add a blog section for release announcements, changelogs, and articles.

## Architecture

Follow the lutaml.github.io blog pattern:
- Blog posts as Markdown files in `blog/` directory
- Frontmatter with title, date, author, excerpt
- Blog index page generated from file listing
- `BlogIndex.vue` component for listing posts
- RSS feed generation

## Directory structure

```
blog/
├── index.md                    # blog listing page
├── 2026-05-27-glossarist-ruby-2.8.md
├── 2026-05-27-concept-model-v3.md
├── 2026-05-27-glossarist-js-0.2.md
└── ...
```

## Post frontmatter

```yaml
---
title: Glossarist Ruby 2.8 — v3 schema support and RDF ontology
date: 2026-05-27
author: Ribose
excerpt: Glossarist-ruby 2.8 adds v3 concept model support, OWL ontology alignment, and SKOS taxonomy integration.
---
```

## BlogIndex.vue component

- Reads post data from VitePress data loading (`posts.data.ts`)
- Displays posts sorted by date
- Shows title, date, excerpt, "Read more" link
- Optional tag/category filtering

## Initial posts to write

1. **Glossarist Ruby 2.8** — v3 schema, ontology, RDF, SKOS taxonomies
2. **Concept Model v3** — OWL ontology, SHACL shapes, 14 SKOS concept schemes
3. **Concept Browser 0.4** — ontology browser, graph view, multi-dataset
4. **Glossarist JS 0.2** — GCR package read/write, validation
5. **Glossarist Desktop 1.6** — latest release features
6. **New website** — VitePress migration announcement

## Data loader

Create `.vitepress/posts.data.ts`:
```ts
import { createContentLoader } from 'vitepress'

export default createContentLoader('blog/*.md', {
  excerpt: true,
  transform(raw) {
    return raw.sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
  }
})
```

## Sidebar for blog

```ts
sidebar: {
  '/blog/': [
    {
      text: 'Blog',
      items: [] // auto-populated from posts.data.ts
    }
  ]
}
```
