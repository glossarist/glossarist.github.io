# 05 - Create Software pages

Create documentation pages for all 4 Glossarist software products.

## Pages to create

### `/docs/software/index.md` — Software overview
- Brief description of the Glossarist ecosystem
- Grid of 4 product cards with links

### `/docs/software/glossarist-ruby.md` — glossarist Ruby gem
Source: glossarist-ruby README.adoc + CLAUDE.md

Content:
- What it does: Ruby gem implementing the Glossarist concept model
- Install: `gem install glossarist` or Gemfile
- Key features: multi-language YAML serialization, GCR packages, bibliography via Relaton, TBX/SKOS/Turtle export, CLI
- Quick start: load a dataset, access concepts, write back
- CLI commands: generate_latex, package, export, validate, upgrade
- Code examples: loading, querying, creating concepts
- Link to RubyGems, link to API docs

### `/docs/software/glossarist-js.md` — glossarist JavaScript SDK
Source: glossarist-js README.md

Content:
- What it does: JS SDK for GCR packages
- Install: `npm install glossarist`
- Key features: read/write GCR ZIP, bidirectional YAML, validation, cross-reference resolution
- Quick start: loadGcr, readConcepts, createGcr
- Code examples
- Link to npm

### `/docs/software/concept-browser.md` — Vocabulary Browser
Source: glossarist-vocabulary-browser README.md

Content:
- What it does: Vue SPA for browsing terminology datasets
- Features: multi-dataset, multilingual, concept history, cross-reference graph, math rendering
- Live demo link (geolexica.org)
- Deployment: how to deploy your own instance
- Data pipeline: datasets.yml → fetch → generate → build
- Customization: adding datasets, theming

### `/docs/software/desktop.md` — Desktop application
Source: existing `/desktop` page + glossarist-desktop package.json

Content:
- What it does: Desktop viewer & editor for concept registries
- Download links (auto-detect OS like current Desktop.tsx)
- Screenshots
- Link to getting-started docs
- Release notes (link to GitHub releases)

## Implementation notes

- Create a reusable `SoftwareCard.vue` component for the overview grid
- Each page should have a consistent frontmatter structure:
  ```yaml
  title: glossarist-ruby
  description: Ruby gem for Glossarist concept model
  ```
- Use VitePress code blocks with syntax highlighting
- Include "Install" section with copy-to-copy code blocks
