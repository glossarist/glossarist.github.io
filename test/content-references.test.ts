import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { root } from './_helpers'

const contentDir = join(root, 'src/content')
const publicDir = join(root, 'public')
const componentsDir = join(root, 'src/components')

function listFiles(dir: string, ext: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { recursive: true })) {
    const p = entry as string
    if (p.endsWith(ext)) out.push(p)
  }
  return out
}

function readSource(rel: string): string {
  return readFileSync(join(contentDir, rel), 'utf-8')
}

describe('MDX imports resolve', () => {
  // Regression for the InlineModal.vue bug on PR #86: a stale import
  // of a non-existent component broke `npm run build`. Vitest passed
  // because it doesn't compile MDX. This spec scans source MDX so the
  // next stale import fails fast here, not in CI's build step.
  const mdxFiles = listFiles(contentDir, '.mdx')

  it('has MDX files to scan', () => {
    expect(mdxFiles.length).toBeGreaterThan(0)
  })

  for (const file of mdxFiles) {
    it(`${file}: every component import resolves to a real file`, () => {
      const src = readSource(file)
      const importRe = /^\s*import\s+\w+(?:\s+default)?\s+from\s+["'](@components\/[^"']+)["']/gm
      const failures: string[] = []
      for (const match of src.matchAll(importRe)) {
        const specifier = match[1]
        const resolved = join(root, specifier.replace(/^@components\//, 'src/components/'))
        if (!existsSync(resolved)) {
          failures.push(`import ${specifier} → ${resolved} (missing)`)
        }
      }
      expect(failures, `stale imports in ${file}:\n${failures.join('\n')}`).toEqual([])
    })
  }
})

describe('Markdown links resolve to content', () => {
  const mdxFiles = listFiles(contentDir, '.mdx')
  const builtRoutes = new Set<string>()

  // Build the set of routes the site actually serves. A link like
  // (/model/foo) resolves if there's a /model/foo/index.mdx or a
  // /model/foo.mdx somewhere in src/content.
  for (const file of mdxFiles) {
    const path = file.replace(/\.mdx$/, '')
    const withoutIndex = path.replace(/\/index$/, '')
    builtRoutes.add('/' + withoutIndex)
    if (path.endsWith('/index')) builtRoutes.add('/' + path)
  }

  // Anchor-only and external links are skipped; only same-site paths matter.
  // Negative lookbehind on `!` excludes image syntax ![alt](/path) which
  // is covered by the image test below.
  const internalLinkRe = /(?<!!)\[([^\]]+)\]\((\/[^)#]+)(?:#[^)]*)?\)/g

  for (const file of mdxFiles) {
    it(`${file}: internal links resolve to a content page`, () => {
      const src = readSource(file)
      const failures: string[] = []
      for (const match of src.matchAll(internalLinkRe)) {
        const href = match[2].replace(/\/$/, '')
        // Allow trailing-slash and non-trailing-slash variants.
        if (!builtRoutes.has(href) && !builtRoutes.has(href.replace(/\/$/, ''))) {
          failures.push(href)
        }
      }
      // De-duplicate
      const unique = [...new Set(failures)].sort()
      expect(unique, `broken internal links in ${file}:\n${unique.join('\n')}`).toEqual([])
    })
  }
})

describe('Image references resolve to public/ or co-located assets', () => {
  const mdxFiles = listFiles(contentDir, '.mdx')

  const imageRe = /!\[[^\]]*\]\(([^)]+)\)/g

  for (const file of mdxFiles) {
    it(`${file}: every image reference exists`, () => {
      const src = readSource(file)
      const failures: string[] = []
      for (const match of src.matchAll(imageRe)) {
        const href = match[1]
        // Skip remote URLs
        if (/^https?:/.test(href)) continue
        // Public-root absolute paths like /images/foo.svg
        if (href.startsWith('/')) {
          const resolved = join(publicDir, href.replace(/^\//, ''))
          if (!existsSync(resolved)) failures.push(`${href} → ${resolved}`)
        } else {
          // Co-located relative paths
          const resolved = resolve(dirname(join(contentDir, file)), href)
          if (!existsSync(resolved)) failures.push(`${href} → ${resolved}`)
        }
      }
      expect(failures, `missing images referenced in ${file}:\n${failures.join('\n')}`).toEqual([])
    })
  }
})

describe('Hyperedges content (PR #86)', () => {
  // Locks in the architectural decision that /model/hyperedges is the
  // unified page and that the partitive/generic pages are historical
  // references pointing to it. If any of these break, the docs IA
  // for the rename has drifted.
  it('builds /model/hyperedges with new Hyperedge terminology', () => {
    expect(existsSync(join(root, 'dist/model/hyperedges/index.html'))).toBe(true)
    const html = readFileSync(join(root, 'dist/model/hyperedges/index.html'), 'utf-8')
    expect(html).toContain('Hyperedges')
    expect(html).toContain('AbstractHyperedge')
    expect(html).toContain('GenericHyperedge')
    expect(html).toContain('HyperedgeMember')
  })

  it('partitive-relations.mdx frames as a specialization of Hyperedges', () => {
    const src = readSource('model/partitive-relations.mdx')
    expect(src).toMatch(/specialization of \[?`?Hyperedge/)
    expect(src).toMatch(/PartitiveHyperedge/)
    expect(src).not.toMatch(/historical reference/i)
    expect(src).not.toMatch(/Renamed to `PartitiveHyperedge`/)
  })

  it('generic-relations.mdx frames as a specialization of Hyperedges', () => {
    const src = readSource('model/generic-relations.mdx')
    expect(src).toMatch(/specialization of \[?`?Hyperedge/)
    expect(src).toMatch(/GenericHyperedge/)
    expect(src).not.toMatch(/historical reference/i)
    expect(src).not.toMatch(/Renamed to `GenericHyperedge`/)
  })

  it('sidebar lists Hyperedges (abstract) plus the two specialized leaves', () => {
    const sidebars = readFileSync(join(root, 'src/data/sidebars.ts'), 'utf-8')
    expect(sidebars).toContain("/model/hyperedges")
    expect(sidebars).toContain("/model/partitive-relations")
    expect(sidebars).toContain("/model/generic-relations")
  })

  it('every hyperedge SVG referenced from MDX exists in public/', () => {
    const expected = [
      'hyperedge-partitive.svg',
      'hyperedge-generalization.svg',
      'hyperedge-mece-multiplicity.svg',
      'hyperedge-per-file-storage.svg',
      'hyperedge-generic-computer-mouse.svg',
    ]
    for (const name of expected) {
      const path = join(publicDir, 'images', name)
      expect(existsSync(path), `missing SVG: ${path}`).toBe(true)
    }
  })

  it('every hyperedge SVG includes accessibility title + desc', () => {
    // Each SVG must carry role="img" plus <title> + <desc> for SR support.
    const expected = [
      'hyperedge-partitive.svg',
      'hyperedge-generalization.svg',
      'hyperedge-mece-multiplicity.svg',
      'hyperedge-per-file-storage.svg',
      'hyperedge-generic-computer-mouse.svg',
    ]
    for (const name of expected) {
      const svg = readFileSync(join(publicDir, 'images', name), 'utf-8')
      expect(svg, `${name} missing <title>`).toMatch(/<title[^>]*>/)
      expect(svg, `${name} missing <desc>`).toMatch(/<desc[^>]*>/)
      expect(svg, `${name} missing role="img"`).toMatch(/role="img"/)
    }
  })
})
