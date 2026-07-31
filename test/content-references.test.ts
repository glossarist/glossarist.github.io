import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { root, readBuilt } from './_helpers'

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

describe('ISO 704 + ISO 10241-1 alignment', () => {
  // These tests lock in the docs architecture for ISO-aligned content.
  // If a page goes missing or drifts off-standard, fail loudly here.

  it('builds /model/concept-system-types with ISO 704 §5.6.3 typology', () => {
    expect(existsSync(join(root, 'dist/model/concept-system-types/index.html'))).toBe(true)
    const html = readFileSync(join(root, 'dist/model/concept-system-types/index.html'), 'utf-8')
    // All three dimensions from ISO 704 §5.6.3 must be present
    expect(html).toContain('monodimensional')
    expect(html).toContain('multidimensional')
    expect(html).toContain('monohierarchical')
    expect(html).toContain('polyhierarchical')
    expect(html).toContain('§5.6.3')
  })

  it('builds /model/definitions with all four DetailedDefinition.type values', () => {
    expect(existsSync(join(root, 'dist/model/definitions/index.html'))).toBe(true)
    const html = readFileSync(join(root, 'dist/model/definitions/index.html'), 'utf-8')
    expect(html).toContain('intensional')
    expect(html).toContain('extensional')
    expect(html).toContain('partitive')
    expect(html).toContain('translated')
    // Anti-patterns from ISO 704 §6.5 must be documented
    expect(html).toContain('circular')
    expect(html).toContain('inaccurate')
    expect(html).toContain('negative')
  })

  it('builds /reference/iso-10241-1-mapping with the data-category table', () => {
    expect(existsSync(join(root, 'dist/reference/iso-10241-1-mapping/index.html'))).toBe(true)
    const html = readFileSync(join(root, 'dist/reference/iso-10241-1-mapping/index.html'), 'utf-8')
    // Must cover the mandatory ISO 10241-1 data categories
    expect(html).toContain('entry number')
    expect(html).toContain('definition')
    expect(html).toContain('normative status')
  })

  it('sidebar surfaces the new ISO-aligned pages', () => {
    const sidebars = readFileSync(join(root, 'src/data/sidebars.ts'), 'utf-8')
    expect(sidebars).toContain("/model/concept-system-types")
    expect(sidebars).toContain("/model/definitions")
    expect(sidebars).toContain("/reference/iso-10241-1-mapping")
  })

  it('nav dropdown includes the new pages', () => {
    const nav = readFileSync(join(root, 'src/components/Nav.astro'), 'utf-8')
    expect(nav).toContain("/model/concept-system-types")
    expect(nav).toContain("/model/definitions")
    expect(nav).toContain("/reference/iso-10241-1-mapping")
    expect(nav).toContain("/use-cases/")
  })
})

describe('Use cases collection', () => {
  // Locks in the use-cases IA. Real-world stories are a key community-facing
  // surface; if a file goes missing or the collection regresses, fail here.

  it('builds /use-cases/ index', () => {
    expect(existsSync(join(root, 'dist/use-cases/index.html'))).toBe(true)
  })

  it('builds every use-case detail page', () => {
    const cases = readdirSync(join(root, 'src/content/use-cases'))
      .map(f => f.replace(/\.mdx?$/, ''))
      .filter(id => id !== 'index')
    expect(cases.length).toBeGreaterThanOrEqual(3)
    for (const id of cases) {
      expect(existsSync(join(root, `dist/use-cases/${id}/index.html`)), `missing ${id}`).toBe(true)
    }
  })

  it('every use case has a domain + ISO 704/10241 cross-link', () => {
    const cases = readdirSync(join(root, 'src/content/use-cases'))
      .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
    for (const file of cases) {
      const src = readFileSync(join(root, 'src/content/use-cases', file), 'utf-8')
      // All use cases must declare a domain (metrology, geospatial, etc.)
      expect(src, `${file} missing domain`).toMatch(/^domain:/m)
      // All use cases must cross-link back to model pages
      expect(src, `${file} must link to a /model/ page`).toMatch(/\]\(\/model\//)
    }
  })

  it('use case order is stable (no alphabetical flapping)', () => {
    const cases = readdirSync(join(root, 'src/content/use-cases'))
      .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
      .map(f => {
        const src = readFileSync(join(root, 'src/content/use-cases', f), 'utf-8')
        const m = src.match(/^order:\s*(\d+)/m)
        return { f, order: m ? Number(m[1]) : 99 }
      })
      .sort((a, b) => a.order - b.order)
    // Metrology should be order=1 (the canonical example)
    expect(cases[0].f).toBe('metrology.mdx')
  })
})

describe('SEO invariants (JSON-LD + canonical)', () => {
  // Locks in structured-data emission. JSON-LD helps search engines
  // understand this is a TechArticle / WebSite; canonical prevents
  // duplicate-content penalties from trailing-slash variants.

  it('homepage emits WebSite JSON-LD with SearchAction', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/<script[^>]*application\/ld\+json[^>]*>/)
    expect(html).toMatch(/"@type":"WebSite"/)
    expect(html).toMatch(/SearchAction/)
  })

  it('docs/reference pages emit TechArticle JSON-LD', () => {
    const cases = [
      'dist/model/hyperedges/index.html',
      'dist/model/concept-system-types/index.html',
      'dist/model/definitions/index.html',
      'dist/reference/iso-10241-1-mapping/index.html',
      'dist/use-cases/metrology/index.html',
    ]
    for (const path of cases) {
      const html = readBuilt(path)
      expect(html, `${path} missing JSON-LD`).toMatch(/<script[^>]*application\/ld\+json[^>]*>/)
      expect(html, `${path} not TechArticle`).toMatch(/"@type":"TechArticle"/)
    }
  })

  it('every page has a canonical URL', () => {
    const samples = [
      'dist/index.html',
      'dist/model/hyperedges/index.html',
      'dist/use-cases/index.html',
    ]
    for (const path of samples) {
      const html = readBuilt(path)
      expect(html, `${path} missing canonical`).toMatch(/<link rel="canonical" href="https:\/\/www\.glossarist\.org[^"]*"/)
    }
  })
})

describe('Hyperedge SVG rendering invariants', () => {
  // SVGs authored with a light-mode palette (dark text/strokes on light
  // box fills) must be wrapped in <figure class="g-figure-light"> so
  // they render on a forced-light card in dark mode. Otherwise they're
  // unreadable. Also: the partitive SVG must not mark "measurement
  // uncertainty" as a delimiting part (it isn't — every measurement
  // result has measurement uncertainty; nothing is distinguished).

  it('every hyperedge SVG reference is wrapped in g-figure-light', () => {
    const files = [
      'src/content/model/hyperedges.mdx',
      'src/content/model/generic-relations.mdx',
      'src/content/model/partitive-relations.mdx',
      'src/content/blog/2026-07-30-hyperedges-per-file-storage.mdx',
    ]
    for (const rel of files) {
      const src = readFileSync(join(root, rel), 'utf-8')
      // Any line referencing a hyperedge SVG must be inside a figure.g-figure-light block.
      // Find each SVG reference and check the surrounding block.
      const lines = src.split('\n')
      let inLightFigure = false
      const offenders: string[] = []
      for (const line of lines) {
        if (/^<figure class="g-figure-light">/.test(line.trim())) inLightFigure = true
        if (/^<\/figure>/.test(line.trim())) inLightFigure = false
        if (/\/images\/hyperedge-[a-z-]+\.svg/.test(line) && !inLightFigure) {
          offenders.push(line.trim())
        }
      }
      expect(offenders, `${rel}: hyperedge SVGs outside g-figure-light wrapper:\n${offenders.join('\n')}`).toEqual([])
    }
  })

  it('hyperedge-partitive.svg does NOT mark measurement uncertainty as delimiting', () => {
    // Earlier version of this SVG incorrectly labeled "measurement
    // uncertainty" as a delimiting part. Per VIM, measurement uncertainty
    // is part of EVERY measurement result — it doesn't distinguish
    // coordinate concepts, so it isn't delimiting.
    const svg = readFileSync(join(root, 'public/images/hyperedge-partitive.svg'), 'utf-8')
    expect(svg).not.toMatch(/delimiting/i)
    expect(svg).not.toMatch(/tooth-delimit/)
    // The corrected SVG must show three distinct MECE multiplicities
    expect(svg).toMatch(/required · exactly_one/)
    expect(svg).toMatch(/required · multiple/)
    expect(svg).toMatch(/optional · exactly_one/)
  })
})

