# 01 — Project Scaffolding

**Goal:** Initialize an Astro project in `astro/` that can build a "Hello World" page while VitePress continues to run from the repo root. No cutover yet.

## Tasks

- [x] Create `astro/package.json` with dependencies:
  ```json
  {
    "name": "glossarist.org-astro",
    "private": true,
    "type": "module",
    "scripts": {
      "dev": "astro dev",
      "build": "npm run build:data && astro build",
      "build:data": "cd .. && npm run build:data",
      "preview": "astro preview"
    },
    "dependencies": {
      "astro": "^5.x",
      "@astrojs/vue": "^5.x",
      "@astrojs/sitemap": "^4.x",
      "@astrojs/mdx": "^4.x",
      "@astrojs/rss": "^4.x",
      "astro-pagefind": "^1.x",
      "vue": "^3.5.x",
      "yaml": "^2.9.x"
    },
    "devDependencies": {
      "@vue/test-utils": "^2.4.x",
      "vitest": "^4.x",
      "@vitest/coverage-v8": "^4.x",
      "jsdom": "^29.x"
    }
  }
  ```

- [x] Create `astro/astro.config.mjs`:
  ```js
  import { defineConfig } from 'astro/config'
  import vue from '@astrojs/vue'
  import sitemap from '@astrojs/sitemap'
  import mdx from '@astrojs/mdx'
  import pagefind from 'astro-pagefind'

  export default defineConfig({
    site: 'https://www.glossarist.org',
    integrations: [vue(), mdx(), sitemap(), pagefind()],
    trailingSlash: 'never',
    build: { format: 'file' },
    vite: { resolve: { alias: { '@': '/src' } } },
  })
  ```

- [x] Create `astro/tsconfig.json`:
  ```json
  {
    "extends": "astro/tsconfigs/strict",
    "compilerOptions": {
      "types": ["vitest/globals"],
      "paths": { "@/*": ["src/*"] }
    }
  }
  ```

- [x] Create directory structure:
  ```
  astro/
  ├── package.json
  ├── astro.config.mjs
  ├── tsconfig.json
  ├── vitest.config.ts
  ├── src/
  │   ├── pages/            (file-based routing)
  │   ├── layouts/          (Layout.astro, BlogLayout.astro, DocLayout.astro)
  │   ├── components/       (.astro chrome + .vue islands)
  │   ├── content/          (markdown + collections config)
  │   ├── data/             (port of .vitepress/data/*.ts)
  │   ├── styles/           (custom.css + theme)
  │   └── env.d.ts
  ├── public/               (or symlink to ../public for shared assets)
  └── scripts/              (or reference ../scripts)
  ```

- [x] Decision: **share `public/` and `scripts/` with VitePress root** via one of:
  - Symlink `astro/public` → `../public` (preferred; zero duplication during migration)
  - Or copy and keep in sync until cutover
  - Or change Astro `publicDir: '../public'` in config

  Pick symlink to start. Document the choice in `astro/README.md`.

- [x] Decision: **share Vue components** between VitePress and Astro. Add to `astro/astro.config.mjs`:
  ```js
  vite: { resolve: { alias: { '@components': '/.vitepress/theme/components' } } }
  ```
  Or copy components into `astro/src/components/` and keep in sync until cutover. **Preferred: copy**, because once we're in Astro-land we may want to convert some to `.astro` and we don't want to dual-maintain.

- [x] Smoke test: `cd astro && npm install && npm run build` produces `astro/dist/index.html`.

## Acceptance

- `astro/` exists with valid `package.json`, `astro.config.mjs`, `tsconfig.json`.
- `astro/` builds successfully.
- A placeholder `astro/src/pages/index.astro` renders.
- VitePress at repo root is **untouched and still builds**.

## Next

→ `02-theme-and-layouts.md`
