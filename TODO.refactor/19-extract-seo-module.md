# 19 — Extract SEO concerns from BaseLayout into a dedicated module

## Status
☐ Not started

## Motivation

`BaseLayout.astro` currently builds:
- Page title + description
- Canonical URL
- hreflang alternates
- OG + Twitter Card meta
- JSON-LD structured data (WebSite or TechArticle)
- Theme initialization script
- Font preconnect + stylesheet
- Favicon set
- Nav + Footer slots

That's 9 concerns in one 99-line file. The frontend script section alone has 40+ lines of inline logic.

## Scope

Extract a typed SEO module:

```
src/layouts/
  BaseLayout.astro           (slot-only wrapper: html/head/body + Nav + Footer)
  seo/
    seo-head.ts              (typed function returning <head> contents)
    types.ts                 (SeoData interface)
    json-ld.ts               (WebSite / TechArticle / BreadcrumbList builders)
    index.ts                 (public API)
```

```ts
// src/layouts/seo/types.ts
export interface SeoData {
  title: string
  description: string
  path: string  // Astro.url.pathname
  siteUrl?: URL
  type?: 'website' | 'article'
  publishedAt?: string  // ISO date for articles
  breadcrumbs?: BreadcrumbItem[]
}

export interface BreadcrumbItem {
  name: string
  url: string
}
```

```ts
// src/layouts/seo/index.ts
export function buildHeadTags(data: SeoData): HeadTag[] { /* ... */ }
export function buildJsonLd(data: SeoData): object { /* ... */ }
```

`BaseLayout.astro` becomes:

```astro
---
import Nav from '@components/Nav.astro'
import Footer from '@components/Footer.astro'
import { buildHeadTags, buildJsonLd } from './seo'
import '../styles/tailwind.css'
import '../styles/base.css'
import '../styles/custom.css'

interface Props {
  title: string
  description?: string
  fullscreen?: boolean
  breadcrumbs?: BreadcrumbItem[]
  publishedAt?: string
}
const { title, description, fullscreen = false, breadcrumbs, publishedAt } = Astro.props
const seo = buildHeadTags({ title, description, path: Astro.url.pathname, breadcrumbs, publishedAt })
const jsonLd = buildJsonLd({ title, description, path: Astro.url.pathname, breadcrumbs, publishedAt })
---
<html lang="en-US">
  <head>
    {/* standard meta charset, viewport, etc. */}
    {seo.map(tag => <meta ... />)}
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body class={fullscreen ? 'fullscreen-page' : ''}>
    <Nav />
    <main><slot /></main>
    {!fullscreen && <Footer />}
  </body>
</html>
```

## Acceptance criteria

- [ ] `BaseLayout.astro` < 40 lines (html shell + slot)
- [ ] `src/layouts/seo/` directory exists with typed builders
- [ ] SEO module is unit-tested (test/seo.test.ts)
- [ ] No regression in OG/canonical/hreflang tests
- [ ] BreadcrumbList JSON-LD can be opted-in per page (passes `breadcrumbs` prop)

## Why this matters

- **OCP** — adding a new SEO feature (e.g. article author, OG video) = adding to the SEO module, not editing BaseLayout
- **Testability** — SEO logic is unit-testable without mounting a full Astro page
- **DRY** — currently every Astro layout that wants SEO would duplicate the same inline logic. With this module, layouts opt in via a function call.

## Dependencies

- TODO 11 (BreadcrumbList JSON-LD) — can be done together
