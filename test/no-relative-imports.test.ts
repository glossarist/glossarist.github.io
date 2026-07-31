import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './_helpers'

// Regression for TODO.refactor/05 — keeps deep relative imports out of src/.
// Aliases (@components, @layouts, @data, @/) exist for this purpose.
// When files move, aliased imports keep working; relative imports break.
const ALIASED_PREFIXES = ['@components/', '@layouts/', '@data/', '@/']

describe('no fragile relative imports (TODO.refactor/05)', () => {
  const srcDir = join(root, 'src')

  function listSourceFiles(): string[] {
    const out: string[] = []
    for (const entry of readdirSync(srcDir, { recursive: true })) {
      const p = entry as string
      if (/\.(ts|astro|vue|mdx)$/.test(p)) out.push(p)
    }
    return out
  }

  function checkFile(relPath: string): string[] {
    const full = join(srcDir, relPath)
    const content = readFileSync(full, 'utf-8')
    const offenders: string[] = []

    // Match `from '..` or `from ".."` — any import that goes up.
    // Match `import(..)` dynamic imports too.
    const importRe = /(from\s+|import\s*\()\s*['"](\.\.[^'"]+)['"]/g
    for (const m of content.matchAll(importRe)) {
      const spec = m[2]
      // Single-level `../` may be acceptable in test files (sibling directories).
      // The bar we enforce: any import that goes up 2+ levels (../../+) should
      // use an alias.
      if (spec.startsWith('../')) {
        offenders.push(`${relPath}: ${spec}`)
      }
    }
    return offenders
  }

  it('src/ has no deep relative imports (../../+)', () => {
    const files = listSourceFiles()
    const allOffenders: string[] = []
    for (const rel of files) {
      allOffenders.push(...checkFile(rel))
    }
    expect(allOffenders, `relative imports that should use aliases (@components/@layouts/@data/@/):\n${allOffenders.join('\n')}`).toEqual([])
  })

  it('configured aliases cover the directories src/ uses', () => {
    // The four aliases are the canonical way to escape a deep relative import.
    // If any is removed, this test fails — preventing accidental removal.
    expect(ALIASED_PREFIXES).toContain('@components/')
    expect(ALIASED_PREFIXES).toContain('@layouts/')
    expect(ALIASED_PREFIXES).toContain('@data/')
    expect(ALIASED_PREFIXES).toContain('@/')
    expect(ALIASED_PREFIXES.length).toBe(4)
  })
})
