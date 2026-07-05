---
title: glossarist-js
description: JavaScript SDK for Glossarist GCR packages — read, write, validate, and manage terminology concepts with bidirectional YAML serialization, RDF serializers, and SHACL validation
---

# glossarist-js

JavaScript SDK for reading and writing [Glossarist](https://github.com/glossarist) GCR packages — manages terminology concepts with rich domain models, bidirectional YAML serialization, validation, cross-reference resolution, RDF serializers, and SHACL validation.

**Current version:** v0.4.5 — full model parity with [glossarist-ruby](/docs/software/glossarist-ruby), synced to [concept-model v3.1.0](/blog/2026-07-05-concept-model-v3.1).

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

## What's new in 0.4

| Version | Highlights |
|---------|------------|
| **0.4.5** | NonVerbal entity emitters + concept-model drift test |
| **0.4.4** | Concept-model synced to v3.1.0; RDF + transforms kept out of the main entry (browser-safe) |
| **0.4.3** | **RDF serializers** (Turtle, N-Triples, JSON-LD) + **SHACL validator** (WS C) |
| **0.4.2–0.4.0** | Type cleanup, js-yaml 5.x, Node 24 CI, eslint 10.x |
| **0.3.8** | `DesignationRelationship` model, mention syntax with URN + designation forms, out-of-line citations |
| **0.3.7** | Annotations, validation and search improvements |
| **0.3.6** | ISO 19135 relationship types added to `RELATIONSHIP_TYPES` enum |
| **0.3.5** | `Register` and `Section` models with hierarchical section support |
| **0.3.4** | Scoped examples in `DetailedDefinition`, `walkTexts` text-walking |
| **0.3.3** | Non-verbal entities: `Figure`, `Table`, `Formula` + V3 bibliography |

### RDF serialization & SHACL validation

v0.4.3 adds a complete RDF pipeline. Every concept can be serialized to Turtle, N-Triples, or JSON-LD, and a SHACL validator runs the canonical `glossarist.shacl.ttl` shapes against the resulting graph.

```js
import { ConceptCollection, RdfSerializer, ShaclValidator } from 'glossarist/rdf';

const ttl = await RdfSerializer.serialize(collection, { format: 'turtle' });
const report = await ShaclValidator.validate(ttl, { format: 'turtle' });

if (!report.conforms) {
  for (const result of report.results) {
    console.warn(result.path, result.message);
  }
}
```

RDF and transforms live in dedicated subpath exports so the main entry stays browser-safe — no Node-only dependencies leaked into the bundle.

### Mention syntax

Concept text supports inline mentions for sources, figures, and designations:

```js
import { parseMention } from 'glossarist';

parseMention('{{cite:iso-704}}');       // → { kind: 'cite', id: 'iso-704' }
parseMention('{{fig:quantity-diagram}}'); // → { kind: 'fig', id: 'quantity-diagram' }
parseMention('{{urn:iso:...:1.1}}');    // → { kind: 'urn', id: 'urn:iso:...:1.1', text: undefined }
```

The ID always comes first; display text, when present, comes last.

### Dataset model (v3)

```js
import { Register, Section, Figure, Table, Formula } from 'glossarist/models';

const section = new Section({
  id: '1.2',
  names: { eng: 'Quantities', fra: 'Grandeurs' },
  children: [{ id: '1.2.1', names: { eng: 'General' } }],
});

const figure = new Figure({
  id: 'quantity-classification',
  caption: { eng: 'Classification of quantities' },
  alt: { eng: 'Diagram of quantity types' },
  images: [{ src: 'quantity-classification.svg', format: 'svg' }],
});
```

### Rich domain models

Every domain entity is a class instance with `toJSON()`, `fromJSON()`, `equals()`, and `clone()`:

```js
import { Concept, LocalizedConcept, Expression, DetailedDefinition } from 'glossarist/models';

const lc = new LocalizedConcept({
  language_code: 'eng',
  terms: [{ type: 'expression', designation: 'entity', normative_status: 'preferred' }],
  definition: [{ content: 'A concrete or abstract thing.' }],
  entry_status: 'valid',
});

const concept = new Concept({ id: '3.1.1.1', localizations: { eng: lc.toJSON() } });
console.log(concept.primaryDesignation('eng')); // 'entity'
console.log(concept.equals(Concept.fromJSON(concept.toJSON()))); // true
```

### Compiled / machine formats in GCR

GCR packages can contain pre-compiled machine formats (TBX, JSON-LD, Turtle, JSONL) inside a `compiled/` directory.

```js
const pkg = await loadGcr(fs.readFileSync('dataset.gcr'));

const formats = await pkg.compiledFormats();       // ['tbx', 'jsonld', 'turtle']
const ids = await pkg.compiledFormatIds('jsonld');
const jsonld = await pkg.compiledFile('jsonld', '3.1.1.1');
```

### Bibliography and images

GCR packages can carry a `bibliography.yaml` file and an `images/` directory — making the archive fully self-contained.

```js
const pkg = await loadGcr(fs.readFileSync('dataset.gcr'));
const bib = await pkg.bibliography();        // raw YAML string or null
await pkg.hasImages();                        // true
const names = await pkg.imageFileNames();     // ['images/fig1.png', ...]
const img = await pkg.imageFile('fig1.png');  // Uint8Array or null
```

### Validation

```js
import { validateConcept, validateRegister, createConceptValidator, ValidationRule } from 'glossarist';

const result = validateConcept(concept);
if (!result.valid) {
  for (const err of result.errors) console.error(err.path, err.message);
}

// Custom rule
class MyRule extends ValidationRule {
  validate(concept) { /* return array of errors */ }
}
const validate = createConceptValidator([new MyRule()]);
```

### Format registry

```js
import { COMPILED_FORMATS, COMPILED_EXTENSIONS, isKnownFormat } from 'glossarist';

COMPILED_FORMATS;                    // ['tbx', 'jsonld', 'turtle', 'jsonl']
COMPILED_EXTENSIONS.get('tbx');      // 'tbx.xml'
isKnownFormat('csv');                // false
```

## Subpath exports

- `glossarist` — main entry (browser-safe: readers, writers, models, validators)
- `glossarist/models` — domain model classes
- `glossarist/rdf` — RDF serializers (Turtle, N-Triples, JSON-LD) + SHACL validator
- `glossarist/validators` — `ValidationRule` framework and built-in rules
- `glossarist/gcr` — `loadGcr`, `createGcr`, `GcrReader`, `GcrWriter`

## Links

- [GitHub](https://github.com/glossarist/glossarist-js)
- [npm](https://www.npmjs.com/package/glossarist)
- [CHANGELOG](https://github.com/glossarist/glossarist-js/blob/main/CHANGELOG.md)

## See Also

- [Concept Model docs](/docs/model/) — the entity model this SDK implements
- [Datasets & sections](/docs/model/datasets) — V3 self-describing dataset model
- [Non-verbal entities](/docs/model/non-verbal) — figures, tables, formulas
- [Standards compliance](/docs/standards) — ISO standard mappings
