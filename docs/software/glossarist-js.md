---
title: glossarist-js
description: JavaScript SDK for Glossarist GCR packages — read, write, validate, and manage terminology concepts
---

# glossarist-js

JavaScript SDK for reading and writing [Glossarist](https://github.com/glossarist) GCR packages — manages terminology concepts with rich domain models, bidirectional YAML serialization, validation, and cross-reference resolution.

## Install

```bash
npm install glossarist
```

Requires Node.js 20+.

## Usage

### Read a GCR package

```js
import { loadGcr } from 'glossarist';

const pkg = await loadGcr(fs.readFileSync('my-dataset.gcr'));
const meta = await pkg.metadata();

// Stream concepts (memory-efficient for large datasets)
await pkg.eachConcept((concept) => {
  console.log(concept.id, concept.primaryDesignation('eng'));
});
```

### Read from a directory

```js
import { readConcepts, readRegister } from 'glossarist';

const concepts = readConcepts('./geolexica-v2/');
const register = readRegister('./geolexica-v2/');
```

### Write a GCR package

```js
import { createGcr, ManagedConceptCollection, conceptParser } from 'glossarist';

const concept = conceptParser.parse(`
  termid: "3.1.1.1"
  eng:
    terms:
      - type: expression
        designation: entity
    definition:
      - content: A concrete or abstract thing.
`);

const buf = await createGcr([concept], { shortname: 'test' });
fs.writeFileSync('out.gcr', buf);
```

### Compiled / machine formats in GCR

GCR packages can contain pre-compiled machine formats (TBX, JSON-LD, Turtle, JSONL) inside a `compiled/` directory.

```js
const pkg = await loadGcr(fs.readFileSync('dataset.gcr'));

// Discover which compiled formats are present
const formats = await pkg.compiledFormats();       // ['tbx', 'jsonld', 'turtle']

// List entry IDs for a specific format
const ids = await pkg.compiledFormatIds('jsonld');

// Read a single compiled file
const jsonld = await pkg.compiledFile('jsonld', '3.1.1.1');

// Iterate all entries for a format
await pkg.eachCompiledFile('turtle', (id, content) => {
  console.log(id, content.length);
});
```

### Bibliography and images in GCR

```js
const pkg = await loadGcr(fs.readFileSync('dataset.gcr'));

// Bibliography (raw YAML string)
const bib = await pkg.bibliography();

// Images
await pkg.hasImages();                        // true
const names = await pkg.imageFileNames();     // ['images/fig1.png', ...]
const img = await pkg.imageFile('fig1.png');  // Uint8Array or null
```

### Format registry

```js
import { COMPILED_FORMATS, COMPILED_EXTENSIONS, isKnownFormat } from 'glossarist';

COMPILED_FORMATS;                    // ['tbx', 'jsonld', 'turtle', 'jsonl']
COMPILED_EXTENSIONS.get('tbx');      // 'tbx.xml'
COMPILED_EXTENSIONS.get('turtle');   // 'ttl'
isKnownFormat('csv');                 // false
```

## Links

- [GitHub](https://github.com/glossarist/glossarist-js)
- [npm](https://www.npmjs.com/package/glossarist)
