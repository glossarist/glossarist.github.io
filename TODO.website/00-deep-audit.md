# 00 - Deep Audit: glossarist.org Website

## Current State

The site is a **React Static** (react-static v7) app using:
- React 16, TypeScript 3.9, styled-components 5, @reach/router
- asciidoctor for rendering `.yaml` doc pages (title/summary/contents fields)
- react-static-plugin-source-filesystem for auto-routing from `docs/` YAML tree
- Octokit to fetch glossarist-desktop releases at build time
- Deployed to AWS S3 + CloudFront via GHA (Node 10/12, actions@v1)
- No blog, no software pages, no model docs, no ontology browser

### Critical issues

| # | Severity | Issue |
|---|----------|-------|
| 1 | BLOCKER | React Static is abandoned (last release 2020), Node 10/12 in CI EOL |
| 2 | BLOCKER | Build system broken — react-static v7 deps are years stale, won't work on modern Node |
| 3 | HIGH | No software pages — glossarist-ruby, glossarist-js, concept-browser are invisible |
| 4 | HIGH | No model documentation — concept-model OWL/taxonomies/schemas not represented |
| 5 | HIGH | No ontology browser — concept-browser has one but it's not linked/embedded |
| 6 | HIGH | Desktop page fetches releases at build time — fragile, no fallback |
| 7 | HIGH | No blog/news section |
| 8 | MED | Docs content in YAML+asciidoc — hard to author, no preview tooling |
| 9 | MED | No search functionality |
| 10 | MED | No dark mode, no responsive redesign |
| 11 | LOW | GHA uses actions@v1, setup-node@v1 — severely outdated |
| 12 | LOW | Uses yarn.lock (yarn classic), not yarn berry or npm |

### Current content inventory

| Section | Pages | Content type |
|---------|-------|-------------|
| `/` (home) | 1 | React component — hero + 3 CTA buttons |
| `/desktop` | 1 | React component — auto-download detection, release notes |
| `/docs/` | ~30 | YAML+asciidoc via DocPage container |
| `/docs/desktop/` | ~20 | Desktop app docs (getting-started, UI modules/panels/widgets) |
| `/docs/core-concepts/` | 2 | "Intro to concept systems" article |

### What's missing (content that should exist)

| Section | Description |
|---------|------------|
| `/software/glossarist-ruby` | Ruby gem — install, usage, CLI, config, extensions |
| `/software/glossarist-js` | JS SDK — install, read/write GCR, validation |
| `/software/concept-browser` | Vue SPA — features, deployment, customization |
| `/software/glossarist-desktop` | Desktop app — migration from `/desktop` to `/software/desktop` |
| `/model/` | Concept model — UML diagrams, class hierarchy, relationship types |
| `/model/ontology` | Interactive ontology browser (embedded from concept-browser) |
| `/model/schemas` | V2/V3 YAML schema reference |
| `/adopt/` | Adoption guide — how to start using Glossarist in an org |
| `/blog/` | News, releases, changelogs |
| `/standards/` | ISO standards alignment (10241-1, 704, 30042, 12620, 25964) |

## Target architecture

Replace entirely with **VitePress** (Vue 3 + Vite), matching the lutaml.github.io pattern:

```
glossarist.org/
├── package.json                    # vitepress + vue
├── .vitepress/
│   ├── config.ts                   # nav, sidebar, search
│   └── theme/
│       ├── index.ts                # custom theme
│       ├── custom.css
│       └── components/
│           ├── HomePage.vue        # new landing page
│           ├── OntologyBrowser.vue # embedded ontology viewer
│           ├── ReleaseDownloader.vue # desktop download widget
│           └── SoftwareCard.vue    # reusable software page card
├── docs/
│   ├── index.md                    # landing
│   ├── software/
│   │   ├── glossarist-ruby.md
│   │   ├── glossarist-js.md
│   │   ├── concept-browser.md
│   │   └── desktop.md
│   ├── model/
│   │   ├── index.md
│   │   ├── concepts.md
│   │   ├── designations.md
│   │   ├── relationships.md
│   │   ├── sources.md
│   │   ├── ontology.md             # embeds OntologyBrowser.vue
│   │   └── schemas.md
│   ├── adopt.md
│   ├── standards.md
│   ├── desktop/                    # migrated from docs/desktop/
│   │   ├── getting-started.md
│   │   ├── ui/
│   │   └── topics/
│   └── core-concepts/
│       └── intro-to-concept-systems.md
├── blog/
│   ├── index.md                    # blog listing
│   └── *.md                        # individual posts
├── public/
│   ├── favicon.svg
│   └── images/
└── .github/workflows/
    └── deploy.yml                  # VitePress → GitHub Pages
```
