---
title: "Concept Browser 0.4 — Ontology browser, graph view, and multi-dataset support"
description: "Concept Browser 0.4 adds an interactive ontology browser, D3 cross-reference graph, and improved multi-dataset navigation."
authors:
  - Ribose
date: 2026-05-27
---

<BlogByline />

Concept Browser 0.4 introduces powerful new ways to explore terminology data.

## Ontology browser

A new ontology schema view provides an interactive tree of the Glossarist concept model classes, properties, and SKOS taxonomy classifications. Users can browse the class hierarchy, filter by taxonomy, and inspect property details in a side panel.

## Cross-reference graph

A D3 force-directed graph visualization shows concept relationships with interactive node dragging, zoom, and dataset filtering. Cross-references between concepts are rendered as edges with relationship type labels.

## Multi-dataset improvements

The browser now supports loading multiple terminology datasets simultaneously. Each dataset is configured via a simple `datasets.yml` entry — add a new dataset with zero code changes.

## Math rendering

KaTeX rendering for AsciiMath notation in definitions (`stem:[...]`) is now supported, enabling proper display of mathematical formulas in concept definitions.

## Deploy your own

The Concept Browser is a statically deployable SPA. Deploy to any static host:

```bash
npm run build:full
```

See the [Concept Browser documentation](/docs/software/concept-browser) for setup and configuration details.
