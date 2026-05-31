import { cpSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const src = resolve(root, '..', 'concept-model', 'schemas')
const dest = resolve(root, 'public', 'data', 'schemas')

if (!existsSync(src)) {
  console.error('concept-model schemas not found at', src)
  console.error('Clone https://github.com/glossarist/concept-model to ../concept-model/')
  process.exit(1)
}

mkdirSync(dest, { recursive: true })
cpSync(src, dest, { recursive: true })

// Build index: discover versions and schema files dynamically
const versions = readdirSync(dest, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'examples')
  .map(d => d.name)
  .sort()
  .reverse() // newest first

const index = versions.map(ver => {
  const verDir = join(dest, ver)
  const schemas = readdirSync(verDir, { withFileTypes: true })
    .filter(f => f.isFile() && (f.name.endsWith('.yaml') || f.name.endsWith('.yml')))
    .map(f => {
      // Extract title from schema file
      const content = readFileSync(join(verDir, f.name), 'utf-8')
      const titleMatch = content.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)
      const descMatch = content.match(/^description:\s*\|?\s*(.+?)\s*$/m)
      return {
        file: f.name,
        title: titleMatch?.[1] || f.name.replace(/\.(yaml|yml)$/, ''),
        description: descMatch?.[1] || null,
      }
    })

  // Discover examples
  const exDir = join(verDir, 'examples')
  const examples = existsSync(exDir)
    ? readdirSync(exDir)
        .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
        .sort()
    : []

  return { version: ver, schemas, examples }
})

writeFileSync(join(dest, 'index.json'), JSON.stringify(index, null, 2))
console.log(`Schema index: ${versions.join(', ')} — ${index.reduce((sum, v) => sum + v.schemas.length, 0)} schemas, ${index.reduce((sum, v) => sum + v.examples.length, 0)} examples`)
