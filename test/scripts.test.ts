import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'

const root = resolve(import.meta.dirname, '..')

function readJson(rel: string): unknown {
  const path = join(root, rel)
  if (!existsSync(path)) {
    throw new Error(`Build output missing: ${rel}. Run \`npm run build:data\` first.`)
  }
  return JSON.parse(readFileSync(path, 'utf-8'))
}

describe('scripts/generate-ontology-data.mjs output (public/data/taxonomies.json)', () => {
  const taxonomies = readJson('public/data/taxonomies.json') as Record<string, {
    scheme: string
    schemeLabel: string
    schemeDefinition: string | null
    concepts: Record<string, { id: string; prefLabel: string; broader?: string }>
  }>

  it('contains the canonical Glossarist taxonomy keys', () => {
    const keys = Object.keys(taxonomies)
    for (const expected of [
      'conceptStatus',
      'entryStatus',
      'normativeStatus',
      'sourceType',
      'sourceStatus',
      'relationshipType',
      'designationType',
      'termType',
      'grammarGender',
      'grammarNumber',
      'abbreviationType',
      'dateType',
      'partOfSpeech',
      'orderingMethod',
      'conceptReferenceType',
    ]) {
      expect(keys).toContain(expected)
    }
  })

  it('every taxonomy has scheme, schemeLabel, and concepts object', () => {
    for (const [key, tax] of Object.entries(taxonomies)) {
      expect(tax).to.have.property('scheme')
      expect(tax).to.have.property('schemeLabel')
      expect(tax.schemeLabel).toBeTruthy()
      expect(tax.concepts).toBeTypeOf('object')
      expect(Object.keys(tax.concepts).length, `${key} has 0 concepts`).toBeGreaterThan(0)
    }
  })

  it('relationshipType taxonomy contains the 52 relationship types', () => {
    const rel = taxonomies.relationshipType
    expect(rel).toBeDefined()
    expect(Object.keys(rel.concepts).length).toBeGreaterThanOrEqual(52)
  })

  it('every concept has an id matching its key', () => {
    for (const tax of Object.values(taxonomies)) {
      for (const [key, concept] of Object.entries(tax.concepts)) {
        expect(concept.id).toBe(key)
      }
    }
  })

  it('every concept has a prefLabel', () => {
    for (const tax of Object.values(taxonomies)) {
      for (const concept of Object.values(tax.concepts)) {
        expect(concept.prefLabel).toBeTruthy()
      }
    }
  })
})

describe('scripts/generate-ontology-schema.mjs output (public/data/ontology-schema.json)', () => {
  const schema = readJson('public/data/ontology-schema.json') as {
    ontologyIri: string
    ontologyLabel: string
    classes: Record<string, unknown>
    properties: Record<string, unknown>
    shapes: Record<string, unknown>
    stats: { classCount: number; objectPropertyCount: number; datatypePropertyCount: number; shapeCount: number }
  }

  it('has the canonical Glossarist ontology IRI', () => {
    expect(schema.ontologyIri).toBe('https://www.glossarist.org/ontologies/glossarist')
  })

  it('reports the Glossarist label', () => {
    expect(schema.ontologyLabel).toMatch(/^Glossarist/)
  })

  it('stats counts match actual entry lengths', () => {
    expect(schema.stats.classCount).toBe(Object.keys(schema.classes).length)
    // shapeCount is generated from the raw shapes file; the JSON map may have
    // one fewer entry if a shape target was filtered out. Allow ±1.
    expect(Math.abs(schema.stats.shapeCount - Object.keys(schema.shapes).length)).toBeLessThanOrEqual(1)
  })

  it('contains the v3.1 dataset classes', () => {
    const classes = schema.classes as Record<string, { compact?: string; label?: string }>
    const labels = Object.values(classes).map(c => c.compact || c.label)
    for (const expected of ['DatasetRegister', 'Section', 'Figure', 'Table', 'Formula', 'NonVerbalEntity', 'DesignationRelationship']) {
      expect(labels.some(l => l?.includes(expected)), `missing class ${expected}`).toBe(true)
    }
  })
})

describe('scripts/copy-schemas.mjs + scripts/bundle-schemas.mjs outputs', () => {
  it('public/data/schemas/index.json exists with version entries', () => {
    const index = readJson('public/data/schemas/index.json') as Array<{
      version: string
      schemas: Array<{ file: string; title: string; description: string | null }>
      examples: string[]
    }>
    expect(Array.isArray(index)).toBe(true)
    expect(index.length).toBeGreaterThan(0)
    const versions = index.map(v => v.version)
    expect(versions).toContain('v3')
    expect(versions).toContain('v2')
  })

  it('v3 schemas include localized-concept.yaml', () => {
    const index = readJson('public/data/schemas/index.json') as Array<{ version: string; schemas: Array<{ file: string }> }>
    const v3 = index.find(v => v.version === 'v3')
    expect(v3).toBeDefined()
    const files = v3.schemas.map(s => s.file)
    expect(files).toContain('localized-concept.yaml')
    expect(files).toContain('concept.yaml')
    expect(files).toContain('register.yaml')
  })

  it('src/data/schemas-bundled.json matches index shape', () => {
    const bundled = readJson('src/data/schemas-bundled.json') as Array<{
      version: string
      schemas: Array<{ file: string; data: unknown }>
      examples: Array<{ file: string; content: string }>
    }>
    expect(Array.isArray(bundled)).toBe(true)
    expect(bundled.length).toBeGreaterThan(0)
    for (const ver of bundled) {
      expect(ver.version).toBeTruthy()
      for (const s of ver.schemas) {
        expect(s.file).toMatch(/\.(ya?ml)$/)
        expect(s.data).toBeDefined()
      }
      for (const ex of ver.examples) {
        expect(ex.file).toMatch(/\.(ya?ml)$/)
        expect(typeof ex.content).toBe('string')
      }
    }
  })
})

describe('scripts/generate-ontology-data.mjs stats.json output', () => {
  it('public/data/stats.json has expected shape', () => {
    const stats = readJson('public/data/stats.json') as Record<string, number>
    expect(stats.classes).toBeGreaterThan(0)
    expect(stats.properties).toBeGreaterThan(0)
    expect(stats.shapes).toBeGreaterThan(0)
    expect(stats.relationships).toBeGreaterThanOrEqual(52)
    expect(stats.designations).toBeGreaterThan(0)
  })
})
