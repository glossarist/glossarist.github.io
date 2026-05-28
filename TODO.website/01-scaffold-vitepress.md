# 01 - Scaffold VitePress site

Replace the entire React Static app with a minimal VitePress scaffold.

## Steps

1. Delete `src/`, `artifacts/`, `types/`, `static.config.js`, `node.api.js`,
   `styles.d.ts`, `fonts.d.ts`, `images.d.ts`, `tsconfig.json`
2. Keep `public/` assets (favicon, logos) — migrate to VitePress `public/`
3. Create `package.json` with vitepress + vue deps (copy pattern from lutaml.github.io)
4. Create `.vitepress/config.ts` with:
   - Title: "Glossarist", description, lang: en-US
   - Nav: Home, Software, Model, Docs, Blog
   - Sidebar per section
   - Local search
5. Create `.vitepress/theme/index.ts` extending DefaultTheme
6. Create `.vitepress/theme/custom.css` with Glossarist brand colors
7. Create `docs/index.md` as temporary landing page
8. Verify `npm run dev` works

## Key config

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Glossarist',
  description: 'Open-source software for maintaining multi-language concept systems',
  lang: 'en-US',
  lastUpdated: true,
  themeConfig: {
    logo: '/glossarist-logo.svg',
    nav: [
      { text: 'Software', link: '/docs/software/' },
      { text: 'Model', link: '/docs/model/' },
      { text: 'Docs', link: '/docs/desktop/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Adopt', link: '/docs/adopt' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/glossarist' }
    ],
    search: { provider: 'local' },
    outline: { level: [2, 3] },
  }
})
```
