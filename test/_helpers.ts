import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const root = resolve(import.meta.dirname, '..')

// Astro can emit /path.html (build.format: 'file') or /path/index.html
// (build.format: 'directory'). Resolve either form so tests survive a
// config swap.
export function readBuilt(rel: string): string {
  const direct = join(root, rel)
  const asDir = join(root, rel.replace(/\.html$/, '/index.html'))
  const asFile = join(root, rel.replace(/\/index\.html$/, '.html'))
  for (const c of [direct, asDir, asFile]) {
    if (existsSync(c)) return readFileSync(c, 'utf-8')
  }
  throw new Error(`Build output missing: ${rel}. Run \`npm run build\` first.`)
}

export function exists(rel: string): boolean {
  const direct = join(root, rel)
  const asDir = join(root, rel.replace(/\.html$/, '/index.html'))
  const asFile = join(root, rel.replace(/\/index\.html$/, '.html'))
  return [direct, asDir, asFile].some(p => existsSync(p))
}

// Read a built file as raw Buffer (for non-text checks like file existence).
export { existsSync, readdirSync, readFileSync }
export { join, root }

