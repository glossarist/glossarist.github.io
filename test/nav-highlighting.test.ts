import { describe, it, expect } from 'vitest'
import { readBuilt } from './_helpers'

// Extract the <header>...</header> block from a built page
function readHeader(rel: string): string {
  const html = readBuilt(rel)
  const m = html.match(/<header[^>]*>[\s\S]*?<\/header>/)
  if (!m) throw new Error(`No <header> in ${rel}`)
  return m[0]
}

// Return array of class strings applied to elements containing the given text
function classesOnElementContaining(html: string, text: string): string[] {
  const out: string[] = []
  const re = /<(?:button|a|div)[^>]*class="([^"]*)"[^>]*>([^<]*)<\/(?:button|a|div)>/g
  let m
  while ((m = re.exec(html))) {
    if (m[2].trim() === text) out.push(m[1])
  }
  return out
}

function isActive(cls: string): boolean {
  return cls.includes('text-brand') && cls.includes('font-semibold')
}

describe('Nav active highlighting', () => {
  describe('Model dropdown (/docs/model/*)', () => {
    it('highlights Model parent + Concepts child on /docs/model/concepts', () => {
      const header = readHeader('dist/docs/model/concepts.html')
      const modelBtnClasses = classesOnElementContaining(header, 'Model')
      expect(modelBtnClasses.some(isActive)).toBe(true)
      const conceptsLinkClasses = classesOnElementContaining(header, 'Concepts')
      expect(conceptsLinkClasses.some(isActive)).toBe(true)
    })

    it('highlights Model parent + Sources child on /docs/model/sources', () => {
      const header = readHeader('dist/docs/model/sources.html')
      expect(classesOnElementContaining(header, 'Model').some(isActive)).toBe(true)
      expect(classesOnElementContaining(header, 'Sources').some(isActive)).toBe(true)
    })

    it('highlights Model parent + Standards child on /docs/standards', () => {
      const header = readHeader('dist/docs/standards.html')
      expect(classesOnElementContaining(header, 'Model').some(isActive)).toBe(true)
      // Standards lives in the Model dropdown
      const standardsClasses = classesOnElementContaining(header, 'Standards')
      expect(standardsClasses.some(isActive)).toBe(true)
    })

    it('highlights Overview child on /docs/model/ (directory index)', () => {
      const header = readHeader('dist/docs/model.html')
      expect(classesOnElementContaining(header, 'Model').some(isActive)).toBe(true)
    })
  })

  describe('Reference dropdown (/reference/*)', () => {
    it('highlights Reference parent + Schema Browser child on /reference/schema-browser (fullscreen)', () => {
      const header = readHeader('dist/reference/schema-browser.html')
      expect(classesOnElementContaining(header, 'Reference').some(isActive)).toBe(true)
      const schemaClasses = classesOnElementContaining(header, 'Schema Browser')
      expect(schemaClasses.some(isActive)).toBe(true)
    })

    it('highlights Reference parent + Ontology Browser child on /reference/ontology (fullscreen)', () => {
      const header = readHeader('dist/reference/ontology.html')
      expect(classesOnElementContaining(header, 'Reference').some(isActive)).toBe(true)
      const ontClasses = classesOnElementContaining(header, 'Ontology Browser')
      expect(ontClasses.some(isActive)).toBe(true)
    })

    it('highlights Reference parent + Entity Fields child on /reference/entity-fields', () => {
      const header = readHeader('dist/reference/entity-fields.html')
      expect(classesOnElementContaining(header, 'Reference').some(isActive)).toBe(true)
      expect(classesOnElementContaining(header, 'Entity Fields').some(isActive)).toBe(true)
    })
  })

  describe('Software dropdown (/docs/software/*)', () => {
    it('highlights Software parent + glossarist-ruby child on its page', () => {
      const header = readHeader('dist/docs/software/glossarist-ruby.html')
      expect(classesOnElementContaining(header, 'Software').some(isActive)).toBe(true)
      expect(classesOnElementContaining(header, 'glossarist-ruby').some(isActive)).toBe(true)
    })

    it('highlights Software parent + glossarist-js child on its page', () => {
      const header = readHeader('dist/docs/software/glossarist-js.html')
      expect(classesOnElementContaining(header, 'Software').some(isActive)).toBe(true)
      expect(classesOnElementContaining(header, 'glossarist-js').some(isActive)).toBe(true)
    })

    it('highlights Software parent + concept-browser child on its page', () => {
      const header = readHeader('dist/docs/software/concept-browser.html')
      expect(classesOnElementContaining(header, 'Software').some(isActive)).toBe(true)
      expect(classesOnElementContaining(header, 'concept-browser').some(isActive)).toBe(true)
    })

    it('does NOT highlight Model on /docs/software/* (sibling-prefix guard)', () => {
      const header = readHeader('dist/docs/software/glossarist-ruby.html')
      expect(classesOnElementContaining(header, 'Model').some(isActive)).toBe(false)
    })
  })

  describe('Docs dropdown', () => {
    it('highlights Docs parent + Desktop App child on /docs/desktop/', () => {
      const header = readHeader('dist/docs/desktop.html')
      expect(classesOnElementContaining(header, 'Docs').some(isActive)).toBe(true)
    })

    it('highlights Docs parent on /docs/core-concepts/', () => {
      const header = readHeader('dist/docs/core-concepts.html')
      expect(classesOnElementContaining(header, 'Docs').some(isActive)).toBe(true)
    })

    it('highlights Docs parent on /docs/adopt/', () => {
      const header = readHeader('dist/docs/adopt.html')
      expect(classesOnElementContaining(header, 'Docs').some(isActive)).toBe(true)
    })
  })

  describe('plain links (Blog, About)', () => {
    it('highlights Blog on /blog/', () => {
      const header = readHeader('dist/blog.html')
      expect(classesOnElementContaining(header, 'Blog').some(isActive)).toBe(true)
    })

    it('highlights Blog on a blog post page', () => {
      const header = readHeader('dist/blog/2026-07-05-concept-model-v3.1.html')
      expect(classesOnElementContaining(header, 'Blog').some(isActive)).toBe(true)
    })

    it('highlights About on /about', () => {
      const header = readHeader('dist/about.html')
      expect(classesOnElementContaining(header, 'About').some(isActive)).toBe(true)
    })
  })

  describe('home page', () => {
    it('does not highlight any dropdown parent on /', () => {
      const header = readHeader('dist/index.html')
      for (const label of ['Model', 'Reference', 'Software', 'Docs', 'Blog', 'About']) {
        expect(classesOnElementContaining(header, label).some(isActive), `${label} should not be active on home`).toBe(false)
      }
    })
  })

  describe('header always renders', () => {
    it('renders header on fullscreen /reference/schema-browser', () => {
      const html = readBuilt('dist/reference/schema-browser/index.html')
      expect(html).toMatch(/<header[^>]*>/)
      expect(html).toContain('id="search-trigger"')
      expect(html).toContain('id="theme-toggle"')
    })

    it('renders header on fullscreen /reference/ontology', () => {
      const html = readBuilt('dist/reference/ontology/index.html')
      expect(html).toMatch(/<header[^>]*>/)
    })
  })

  describe('footer gating', () => {
    it('renders footer on regular pages', () => {
      const html = readBuilt('dist/docs/model/concepts.html')
      expect(html).toMatch(/<footer[^>]*>/)
    })

    it('does NOT render footer on fullscreen pages', () => {
      const html = readBuilt('dist/reference/schema-browser/index.html')
      expect(html).not.toMatch(/<footer[^>]*>/)
    })
  })
})
