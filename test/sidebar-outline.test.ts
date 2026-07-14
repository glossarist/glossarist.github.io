import { describe, it, expect } from 'vitest'
import { readBuilt, exists, existsSync, readdirSync, readFileSync, join, root } from "./_helpers"


function readSidebar(html: string): string {
  const m = html.match(/<aside[^>]*aria-label="Section navigation"[\s\S]*?<\/aside>/)
  return m ? m[0] : ''
}

function readOutline(html: string): string {
  const m = html.match(/<aside[^>]*aria-label="On this page"[\s\S]*?<\/aside>/)
  return m ? m[0] : ''
}

function isActiveSidebarLink(html: string, link: string): boolean {
  // Extract the sidebar <aside> to avoid false positives from nav dropdown
  const asideMatch = html.match(/<aside[^>]*aria-label="Section navigation"[\s\S]*?<\/aside>/)
  if (!asideMatch) return false
  const sidebarHtml = asideMatch[0]
  const escaped = link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Active sidebar links carry the `nav-active` class
  const re = new RegExp(
    `<a[^>]*href="${escaped}"[^>]*class="[^"]*\\bnav-active\\b`,
  )
  return re.test(sidebarHtml)
}

describe('Sidebar', () => {
  describe('section detection', () => {
    it('renders Software sidebar on /docs/software/desktop/', () => {
      const sidebar = readSidebar(readBuilt('dist/docs/software/desktop/index.html'))
      expect(sidebar).toContain('Software')
      expect(sidebar).toContain('Getting Started')
      expect(sidebar).toContain('Tutorials')
      expect(sidebar).toContain('Interface')
      expect(sidebar).toContain('Topics')
    })

    it('renders Concept Model sidebar on /model/concepts', () => {
      const sidebar = readSidebar(readBuilt('dist/model/concepts/index.html'))
      expect(sidebar).toContain('Concept Model')
      expect(sidebar).toContain('Concepts')
      expect(sidebar).toContain('Designations')
      expect(sidebar).toContain('Relationships')
      expect(sidebar).toContain('Schemas')
    })

    it('renders Core Concepts sidebar on /docs/core-concepts/', () => {
      const sidebar = readSidebar(readBuilt('dist/docs/core-concepts/index.html'))
      expect(sidebar).toContain('Core Concepts')
      expect(sidebar).toContain('Why Concept System?')
    })

    it('renders Adopting Glossarist sidebar on /docs/adopt/', () => {
      const sidebar = readSidebar(readBuilt('dist/docs/adopt/index.html'))
      expect(sidebar).toContain('Adopting Glossarist')
    })

    it('renders Software sidebar on /docs/software/glossarist-ruby', () => {
      const sidebar = readSidebar(readBuilt('dist/docs/software/glossarist-ruby/index.html'))
      expect(sidebar).toContain('Software')
      expect(sidebar).toContain('glossarist-ruby')
      expect(sidebar).toContain('glossarist-js')
    })
  })

  describe('active link', () => {
    it('highlights Concepts on /model/concepts', () => {
      const html = readBuilt('dist/model/concepts/index.html')
      expect(isActiveSidebarLink(html, '/model/concepts')).toBe(true)
    })

    it('highlights Overview (directory index) on /model/', () => {
      const html = readBuilt('dist/model/index.html')
      expect(isActiveSidebarLink(html, '/model/')).toBe(true)
    })

    it('highlights glossarist-ruby on its own page', () => {
      const html = readBuilt('dist/docs/software/glossarist-ruby/index.html')
      expect(isActiveSidebarLink(html, '/docs/software/glossarist-ruby')).toBe(true)
    })

    it('does highlight the section Overview when on a deeper page (conventional)', () => {
      // /docs/software/ is the parent of /docs/software/glossarist-ruby —
      // sidebar marks the section root active when you're inside it.
      const html = readBuilt('dist/docs/software/glossarist-ruby/index.html')
      expect(isActiveSidebarLink(html, '/docs/software/')).toBe(true)
    })

    it('does NOT highlight a sibling section', () => {
      const html = readBuilt('dist/docs/software/glossarist-ruby/index.html')
      expect(isActiveSidebarLink(html, '/docs/software/glossarist-js')).toBe(false)
    })
  })

  describe('hidden states', () => {
    it('does not render sidebar on fullscreen reference pages', () => {
      const html = readBuilt('dist/reference/schema-browser/index.html')
      expect(readSidebar(html)).toBe('')
    })

    it('does not render sidebar on the home page', () => {
      const html = readBuilt('dist/index/index.html')
      expect(readSidebar(html)).toBe('')
    })
  })
})

describe('Outline', () => {
  describe('rendering', () => {
    it('renders when the page has h2/h3 headings', () => {
      const html = readBuilt('dist/docs/software/glossarist-ruby/index.html')
      const outline = readOutline(html)
      expect(outline).not.toBe('')
      expect(outline).toContain('On this page')
    })

    it('omits on fullscreen pages even when there are headings', () => {
      const html = readBuilt('dist/reference/schema-browser/index.html')
      expect(readOutline(html)).toBe('')
    })
  })

  describe('heading filtering', () => {
    it('only links to h2 and h3 slugs', () => {
      const outline = readOutline(readBuilt('dist/docs/software/glossarist-ruby/index.html'))
      // All anchors in the outline should point to #fragments
      const anchors = Array.from(outline.matchAll(/href="#([^"]+)"/g)).map(m => m[1])
      expect(anchors.length).toBeGreaterThan(0)
      // The doc has Install, Usage, etc. headings — verify a known one appears
      expect(anchors).toContain('install')
      expect(anchors).toContain('usage')
    })

    it('indents h3 entries deeper than h2', () => {
      const outline = readOutline(readBuilt('dist/docs/software/glossarist-ruby/index.html'))
      // h3 entries get pl-3 class (or similar indent); h2 entries don't
      expect(outline).toMatch(/<li class="pl-3">/)
    })
  })
})
