---
title: Concept Browser
description: Interactive browser for terminology datasets with multi-dataset, multilingual concept browsing
---

# Concept Browser

A statically deployable single-page application for browsing ISO/IEC terminology datasets. Add new datasets with zero code changes — just edit `datasets.yml`. See the [concept model docs](/docs/model/) for the data model it renders.

**Live site:** [geolexica.org](https://www.geolexica.org)

## Features

- **Multi-dataset browsing** — Concepts from multiple terminology registers in one place
- **Full multilingual support** — Definitions, notes, and examples in all available languages
- **Concept history timeline** — Review dates, decisions, and change notes per language
- **Cross-reference graph** — D3 force-directed graph showing concept relationships with dataset filtering
- **Math rendering** — KaTeX rendering for AsciiMath notation in definitions
- **Responsive design** — Mobile-first layout with integrated navigation
- **Static deployment** — No server required. Deploy to any static host

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

The dev server serves pre-built data from `public/data/`. If no data is present yet, run the data pipeline first.

## Data Pipeline

```
datasets.yml
  └─> scripts/fetch-datasets.mjs   (clone + harmonize)
      └─> .datasets/{id}/concepts/*.yaml
          └─> scripts/generate-data.mjs  (YAML → JSON-LD)
              └─> public/data/{id}/
                  ├── manifest.json
                  ├── index.json
                  ├── edges.json
                  └── concepts/*.json
```

### Full pipeline

```bash
# 1. Fetch source repos and harmonize concepts
npm run fetch-datasets

# 2. Generate static JSON-LD data files
npm run generate-data

# 3. Pre-compute cross-reference edges
node scripts/build-edges.js

# 4. Build the SPA
npm run build
```

Or use the single-command pipeline:

```bash
npm run build:full
```

## Configuration: `datasets.yml`

All dataset configuration lives in a single file. Adding a new dataset requires **zero code changes** — just add an entry:

```yaml
datasets:
  - id: my-dataset
    sourceRepo: https://github.com/org/repo
    title: "My Glossary"
    description: "Description of dataset"
    owner: My Organization
    color: "#6366f1"
    tags: [tag1, tag2]
    languageOrder: [eng, fra, deu, spa]
```

## Links

- [GitHub](https://github.com/glossarist/concept-browser)
