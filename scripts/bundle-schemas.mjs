import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { parse as parseYaml } from 'yaml'

const root = resolve(import.meta.dirname, '..')
const schemaDir = resolve(root, 'public', 'data', 'schemas')

if (!existsSync(schemaDir)) {
  console.error('Schema data not found — run copy-schemas.mjs first')
  process.exit(1)
}

const index = JSON.parse(readFileSync(join(schemaDir, 'index.json'), 'utf-8'))

const bundled = index.map(ver => {
  const schemas = ver.schemas.map(entry => {
    const raw = readFileSync(join(schemaDir, ver.version, entry.file), 'utf-8')
    const parsed = parseYaml(raw)
    return { ...entry, data: parsed }
  })

  const examples = ver.examples.map(file => {
    const raw = readFileSync(join(schemaDir, ver.version, 'examples', file), 'utf-8')
    return { file, content: raw }
  })

  return { version: ver.version, schemas, examples }
})

const outPath = join(root, '.vitepress', 'data', 'schemas-bundled.json')
writeFileSync(outPath, JSON.stringify(bundled))

const counts = bundled.reduce((acc, v) => ({
  schemas: acc.schemas + v.schemas.length,
  examples: acc.examples + v.examples.length,
}), { schemas: 0, examples: 0 })
console.log(`Bundled ${counts.schemas} schemas and ${counts.examples} examples → .vitepress/data/schemas-bundled.json`)
