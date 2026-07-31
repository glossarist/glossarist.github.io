# 11 — SEO completeness

## Status
◑ Partially complete

## What's done

- JSON-LD `WebSite` + `SearchAction` on homepage (PR #90)
- JSON-LD `TechArticle` on every content page (PR #90)
- Canonical URLs on every page (PR #90)
- Sitemap via `@astrojs/sitemap`

## What's missing

### Gap 1: OG / Twitter Card meta tags

No `<meta property="og:title">`, `<meta property="og:image">`, etc. Social shares show generic preview.

**Add**: OG tags to BaseLayout:

```html
<meta property="og:title" content={pageTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:type" content={isHome ? 'website' : 'article'} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={pageTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />
```

**OG image strategy**: generate per-page OG images dynamically (using `@vercel/og` or similar) OR ship one site-wide OG image (`/og.png`).

Recommendation: ship one site-wide OG image first; per-page generation is a Phase 2.

### Gap 2: hreflang tags (see TODO 10)

### Gap 3: Article published/modified times

`TechArticle` schema supports `datePublished` and `dateModified`. Blog posts have `date` in frontmatter but it's not wired into the JSON-LD.

**Add**: pass blog post `date` into the layout and include in `TechArticle.datePublished`.

### Gap 4: BreadcrumbList structured data

Model / reference / docs pages could emit `BreadcrumbList` JSON-LD:

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Model", "item": "https://www.glossarist.org/model/" },
    { "@type": "ListItem", "position": 2, "name": "Hyperedges", "item": "https://www.glossarist.org/model/hyperedges" }
  ]
}
```

Helps Google show breadcrumbs in search results.

### Gap 5: robots.txt improvements

Current `public/robots.txt` is minimal. Add sitemap reference:

```
User-agent: *
Allow: /
Sitemap: https://www.glossarist.org/sitemap-index.xml
```

## Acceptance criteria

- [ ] OG + Twitter Card meta on every page
- [ ] Site-wide OG image created (`/og.png`, 1200×630)
- [ ] hreflang tags on homepage (TODO 10)
- [ ] Blog posts include `datePublished` in TechArticle JSON-LD
- [ ] BreadcrumbList JSON-LD on hierarchical pages (model/, reference/, docs/)
- [ ] robots.txt references sitemap
- [ ] Tests verify each of the above

## Test invariants

```ts
describe('SEO completeness', () => {
  it('homepage has OG tags', () => { /* ... */ })
  it('content pages have TechArticle with datePublished (when applicable)', () => { /* ... */ })
  it('model/* pages have BreadcrumbList', () => { /* ... */ })
  it('robots.txt references sitemap', () => { /* ... */ })
})
```
