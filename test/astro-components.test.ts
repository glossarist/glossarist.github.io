import { describe, it, expect } from 'vitest'
import { readBuilt, exists, existsSync, readdirSync, readFileSync, join, root } from "./_helpers"


describe('ModelLanding.astro (rendered in /model)', () => {
  it('renders the entity-types stat block', () => {
    const html = readBuilt('dist/model/index.html')
    expect(html).toContain('Entity Types')
    expect(html).toContain('Validation Shapes')
    expect(html).toContain('Relationship Types')
    expect(html).toContain('Designation Types')
  })

  it('renders links to all six core entity pages', () => {
    const html = readBuilt('dist/model/index.html')
    expect(html).toContain('href="/model/concepts"')
    expect(html).toContain('href="/model/designations"')
    expect(html).toContain('href="/model/relationships"')
    expect(html).toContain('href="/model/sources"')
    expect(html).toContain('href="/reference/ontology"')
  })

  it('renders the Formal Ontology entity', () => {
    const html = readBuilt('dist/model/index.html')
    expect(html).toContain('Formal Ontology')
    expect(html).toContain('owl:Class')
    expect(html).toContain('sh:Shape')
  })
})

describe('LogoMerge.astro (rendered in /about)', () => {
  it('renders the SVG with the three logo images and cultural labels', () => {
    const html = readBuilt('dist/about/index.html')
    expect(html).toContain('<svg')
    expect(html).toContain('文')
    expect(html).toContain('ΓΛ')
    expect(html).toContain('ONE MARK')
    expect(html).toContain('Pattern · Culture · Writing')
    expect(html).toContain('γλωσσάριον')
  })

  it('declares gradient + marker defs for the merge arrows', () => {
    const html = readBuilt('dist/about/index.html')
    expect(html).toMatch(/linearGradient id="ml"/)
    expect(html).toMatch(/linearGradient id="mr"/)
    expect(html).toMatch(/marker id="ah-l"/)
    expect(html).toMatch(/marker id="ah-r"/)
  })
})

describe('ReleaseDownloader.astro (rendered in /docs/software/desktop)', () => {
  it('renders the loading state and data hooks', () => {
    const html = readBuilt('dist/docs/software/desktop/index.html')
    expect(html).toContain('Checking for latest release')
    expect(html).toContain('data-release-downloader')
    expect(html).toContain('data-rd-loading')
    expect(html).toContain('data-rd-error')
    expect(html).toContain('data-rd-success')
  })

  it('links to the GitHub releases page as fallback', () => {
    const html = readBuilt('dist/docs/software/desktop/index.html')
    expect(html).toContain('https://github.com/glossarist/glossarist-desktop/releases')
  })
})

describe('Pagefind search (rendered in nav)', () => {
  it('renders the search trigger with Cmd+K hint', () => {
    const html = readBuilt('dist/index/index.html')
    expect(html).toContain('id="search-trigger"')
    expect(html).toContain('⌘K')
  })

  it('renders the search dialog and input', () => {
    const html = readBuilt('dist/index/index.html')
    expect(html).toContain('id="search-dialog"')
    expect(html).toContain('id="search-input"')
    expect(html).toContain('id="search-results"')
  })

  it('writes a Pagefind index in dist/pagefind/', () => {
    expect(existsSync(join(root, 'dist/pagefind'))).toBe(true)
  })
})
