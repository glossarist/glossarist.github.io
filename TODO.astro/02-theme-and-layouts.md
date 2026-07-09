# 02 — Theme and Layouts

**Goal:** Port `custom.css` brand colors + dark mode and create the three Astro layouts that mirror VitePress's default theme + custom overrides.

## Source files to port

- `.vitepress/theme/custom.css` (209 LOC) — CSS custom properties for brand colors, dark mode overrides
- `.vitepress/theme/index.ts` (49 LOC) — registers Vue components, watches `frontmatter.fullscreen`
- VitePress default theme (Layout, Nav, Sidebar, Search, Footer) — re-implement in Astro

## Tasks

### 2.1 — Port `custom.css` to `astro/src/styles/custom.css`

Copy verbatim. Brand colors (`--glossarist-primary`, `--vp-c-brand-*`) must be byte-identical. Dark mode overrides stay under `.dark {}`.

### 2.2 — Create global stylesheet

`astro/src/styles/global.css` imports `custom.css` plus VitePress default-theme-equivalent base styles (typography, layout shell, code blocks, table styling). Audit VitePress source for the exact base styles we need to reproduce.

### 2.3 — Layout: `BaseLayout.astro`

```astro
---
import '../styles/global.css'
import Nav from '../components/Nav.astro'
import Footer from '../components/Footer.astro'
const { title, description } = Astro.props
---
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <!-- favicons from public/ -->
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <!-- dark mode init script — must run before paint -->
    <script is:inline>
      const stored = localStorage.getItem('vitepress-theme-appearance')
      const dark = stored === 'dark' || (!stored && matchMedia('(prefers-color-scheme: dark)').matches)
      if (dark) document.documentElement.classList.add('dark')
    </script>
  </head>
  <body>
    <Nav />
    <main><slot /></main>
    <Footer />
  </body>
</html>
```

### 2.4 — Layout: `DocLayout.astro` (sidebar + outline)

For `/docs/**` and `/reference/**` pages. Includes:
- Sidebar (per-section, see 06-search-and-navigation.md)
- Right-side outline (h2/h3 in-page anchors)
- Breadcrumb
- Previous/next pagination
- Last-updated timestamp

VitePress auto-generates these from the sidebar config. In Astro we drive them from per-section frontmatter + a content manifest.

### 2.5 — Layout: `BlogLayout.astro`

For `/blog/**` pages. Simpler than DocLayout — no sidebar, no outline. Renders `<BlogByline />` island for post pages.

### 2.6 — Component: `ThemeToggle.astro` + island

The dark/light toggle in the nav. VitePress ships this; we need our own. Replicates:
- Reads `localStorage.getItem('vitepress-theme-appearance')`
- Toggles `document.documentElement.classList` between dark/light
- Updates the persisted preference

### 2.7 — Component: `Nav.astro`

Top-level navigation. Hard-coded items (Model, Reference, Software, Docs, Blog, About) with dropdowns. Software dropdown items come from `data/projects.ts`.

### 2.8 — Component: `Footer.astro`

Static footer: "An open source project of Ribose" + "Copyright © 2026 Ribose".

### 2.9 — `frontmatter.fullscreen` equivalent

VitePress uses `frontmatter.fullscreen` to hide chrome on certain pages (e.g., interactive viewers). In Astro, this becomes a layout prop:

```astro
---
const { fullscreen = false } = Astro.props.frontmatter || {}
---
<body class={fullscreen ? 'fullscreen-page' : ''}>
  {!fullscreen && <Nav />}
  <slot />
  {!fullscreen && <Footer />}
</body>
---
```

## Acceptance

- `astro/src/styles/custom.css` matches `.vitepress/theme/custom.css` byte-for-byte on brand colors.
- Dark mode toggle works (manual click + OS preference detection).
- All three layouts render with placeholder content.
- A page marked `fullscreen: true` in frontmatter hides Nav/Footer.

## Next

→ `03-data-and-content-collections.md`
