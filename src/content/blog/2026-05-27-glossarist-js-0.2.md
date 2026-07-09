---
title: "Glossarist JS 0.2 — GCR package read/write and validation"
description: "Glossarist-js 0.2 adds full GCR package support with read, write, validation, bibliography, and image handling."
authors:
  - Ribose
date: 2026-05-27
---

<BlogByline />

Glossarist-js 0.2 introduces comprehensive GCR package support to the JavaScript SDK.

## GCR package read/write

The SDK now supports full read and write operations on GCR (Glossarist Concept Registry) packages — ZIP archives containing concept YAML files, compiled machine formats, bibliography data, and images.

```js
import { loadGcr, createGcr } from 'glossarist';

// Read
const pkg = await loadGcr(fs.readFileSync('dataset.gcr'));
await pkg.eachConcept((concept) => {
  console.log(concept.id, concept.primaryDesignation('eng'));
});

// Write
const buf = await createGcr([concept], { shortname: 'my-dataset' });
```

## Compiled formats

GCR packages can contain pre-compiled machine formats (TBX, JSON-LD, Turtle, JSONL). The SDK provides methods to discover, read, and write these formats.

## Install

```bash
npm install glossarist
```

See the [glossarist-js documentation](/docs/software/glossarist-js) for full usage details.
