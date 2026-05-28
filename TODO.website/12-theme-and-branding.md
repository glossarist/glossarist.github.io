# 12 - Custom VitePress theme and branding

Configure VitePress theme with Glossarist brand identity.

## Brand elements

- Logo: existing `Symbol.svg` + "Glossarist" wordmark
- Colors: TBD (current site uses blue tones from Ribose brand)
- Footer: "An open source project of Ribose" + copyright

## Theme customization

### `.vitepress/theme/custom.css`

```css
:root {
  --vp-c-brand-1: #1e40af;      /* primary blue */
  --vp-c-brand-2: #1e3a8a;
  --vp-c-brand-3: #1e40af;
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #1e40af, #3b82f6);
  --vp-home-hero-image-background-image: linear-gradient(135deg, #eff6ff, #dbeafe);
}
```

### Footer

```ts
themeConfig: {
  footer: {
    message: 'An open source project of <a href="https://www.ribose.com">Ribose</a>',
    copyright: 'Copyright © 2026 Ribose'
  }
}
```

### Assets to prepare

1. **Logo SVG** — Glossarist logo (light + dark variants)
2. **Favicon** — favicon.svg, favicon.ico, apple-touch-icon.png
3. **OG image** — social media share image (1200x630)
4. **Fonts** — keep system fonts (VitePress default) or add custom

### Dark mode

VitePress has built-in dark mode. Ensure:
- Logo has dark variant
- Custom CSS defines dark variables
- UML diagrams work on dark background (white bg images)

### Search

VitePress local search (built-in). No Algolia needed for this scale.

## Navigation structure

```ts
nav: [
  { text: 'Home', link: '/' },
  { text: 'Software', link: '/docs/software/' },
  { text: 'Model', link: '/docs/model/' },
  { text: 'Docs', items: [
    { text: 'Desktop App', link: '/docs/desktop/' },
    { text: 'Core Concepts', link: '/docs/core-concepts/' },
    { text: 'Adopt Glossarist', link: '/docs/adopt' },
    { text: 'Standards', link: '/docs/standards' },
  ]},
  { text: 'Blog', link: '/blog/' },
]
```
