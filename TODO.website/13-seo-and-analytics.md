# 13 - SEO, social, and analytics

Configure SEO metadata, social sharing, and analytics.

## SEO

### Per-page metadata
Every page should have frontmatter:
```yaml
title: Page Title
description: One-line description for search engines
head:
  - meta: { property: og:title, content: Page Title }
  - meta: { property: og:description, content: Description }
```

### Sitemap
VitePress generates `sitemap.xml` automatically. Configure:
```ts
export default defineConfig({
  sitemap: {
    hostname: 'https://www.glossarist.org'
  }
})
```

### robots.txt
Create `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://www.glossarist.org/sitemap.xml
```

## Social sharing

### Open Graph image
Create a default OG image at `public/og-image.png` (1200x630).
Override per-page in frontmatter if needed.

### Twitter card
VitePress handles this via meta tags if configured in `head`.

## Analytics

### Options
1. **Plausible** — privacy-friendly, lightweight (recommended)
2. **Google Analytics** — if already used in the org
3. **None** — acceptable for a docs site

### Configuration
```ts
// .vitepress/config.ts
head: [
  ['script', { defer: '', 'data-domain': 'www.glossarist.org', src: 'https://plausible.io/js/script.js' }]
]
```
