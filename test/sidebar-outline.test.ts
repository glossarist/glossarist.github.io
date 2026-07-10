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
  // The active class combo is applied to <a> tags with the exact href.
  // We scan the whole HTML because the sidebar extract may not include
  // enough context to disambiguate from the nav (which uses different
  // active classes inside <ul class="...dropdown">).
  const escaped = link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Look inside an <li> (sidebar items) for the active class combo.
  const re = new RegExp(
    `<li[^>]*>\\s*<a[^>]*href="${escaped}"[^>]*class="[^"]*text-brand font-semibold`,
  )
  return re.test(html)
}

describe('Sidebar', () => {
  describe('section detection', () => {
    it('renders Desktop Application sidebar on /docs/desktop/', () => {
      const sidebar = readSidebar(readBuilt('dist/docs/desktop/index.html'))
      expect(sidebar).toContain('Desktop Application')
      expect(sidebar).toContain('Getting Started')
      expect(sidebar).toContain('Tutorials')
      expect(sidebar).toContain('Interface Reference')
      expect(sidebar).toContain('Topics')
    })

    it('renders Concept Model sidebar on /docs/model/concepts', () => {
      const sidebar = readSidebar(readBuilt('dist/docs/model/concepts/index.html'))
      expect(sidebar).toContain('Concept Model')
      expect(sidebar).toContain('Concepts')
      expect(sidebar).toContain('Designations')
      expect(sidebar).toContain('Relationships')
      // & is HTML-encoded as &amp; in the rendered output
      expect(sidebar).toContain('Schemas &amp; Standards')
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
    it('highlights Concepts on /docs/model/concepts', () => {
      const html = readBuilt('dist/docs/model/concepts/index.html')
      expect(isActiveSidebarLink(html, '/docs/model/concepts')).toBe(true)
    })

    it('highlights Overview (directory index) on /docs/model/', () => {
      const html = readBuilt('dist/docs/model/index.html')
      expect(isActiveSidebarLink(html, '/docs/model/')).toBe(true)
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
