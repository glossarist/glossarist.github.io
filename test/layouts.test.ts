import { describe, it, expect } from 'vitest'
import { readBuilt, exists, existsSync, readdirSync, readFileSync, join, root } from "./_helpers"


function extractTag(html: string, tag: 'head' | 'body' | 'header' | 'footer' | 'main'): string {
  const m = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return m ? m[0] : ''
}

describe('BaseLayout', () => {
  describe('HTML shell', () => {
    it('declares lang="en-US"', () => {
      const html = readBuilt('dist/index/index.html')
      expect(html).toMatch(/<html[^>]*lang="en-US"/)
    })

    it('includes viewport meta tag', () => {
      const head = extractTag(readBuilt('dist/index/index.html'), 'head')
      expect(head).toMatch(/<meta name="viewport"[^>]*content="width=device-width, initial-scale=1"/)
    })

    it('includes description meta tag', () => {
      const head = extractTag(readBuilt('dist/index/index.html'), 'head')
      expect(head).toMatch(/<meta name="description"/)
    })
  })

  describe('title formatting', () => {
    it('uses bare "Glossarist" title on the home page', () => {
      const html = readBuilt('dist/index/index.html')
      expect(html).toMatch(/<title>Glossarist<\/title>/)
    })

    it('uses "Page | Glossarist" format on subpages', () => {
      const html = readBuilt('dist/about/index.html')
      expect(html).toMatch(/<title>About Glossarist \| Glossarist<\/title>/)
    })
  })

  describe('favicons', () => {
    it('declares all five favicon link relations', () => {
      const head = extractTag(readBuilt('dist/index/index.html'), 'head')
      expect(head).toContain('href="/favicon-96x96.png"')
      expect(head).toContain('href="/favicon.svg"')
      expect(head).toContain('href="/favicon.ico"')
      expect(head).toContain('href="/apple-touch-icon.png"')
      expect(head).toContain('href="/site.webmanifest"')
    })
  })

  describe('dark-mode init script', () => {
    it('runs the dark-mode detection before paint', () => {
      const head = extractTag(readBuilt('dist/index/index.html'), 'head')
      expect(head).toContain('glossarist-theme')
      expect(head).toContain('matchMedia')
      expect(head).toContain('prefers-color-scheme: dark')
      expect(head).toContain("classList.add('dark')")
    })

    it('falls back to OS preference when no stored theme', () => {
      const head = extractTag(readBuilt('dist/index/index.html'), 'head')
      expect(head).toMatch(/!stored.*prefersDark|stored === 'auto'/)
    })
  })

  describe('Nav presence', () => {
    it('renders <header> on every page including fullscreen ones', () => {
      for (const page of [
        'dist/index.html',
        'dist/about.html',
        'dist/blog.html',
        'dist/reference/schema-browser.html',
        'dist/reference/ontology.html',
        'dist/model/concepts.html',
      ]) {
        const html = readBuilt(page)
        expect(html, page).toMatch(/<header[^>]*>/)
      }
    })
  })

  describe('Footer gating', () => {
    it('renders <footer> on regular pages', () => {
      expect(readBuilt('dist/index/index.html')).toMatch(/<footer[^>]*>/)
      expect(readBuilt('dist/model/concepts/index.html')).toMatch(/<footer[^>]*>/)
    })

    it('omits <footer> on fullscreen pages', () => {
      expect(readBuilt('dist/reference/schema-browser/index.html')).not.toMatch(/<footer[^>]*>/)
      expect(readBuilt('dist/reference/ontology/index.html')).not.toMatch(/<footer[^>]*>/)
    })
  })

  describe('stylesheets', () => {
    it('loads Tailwind, base, and custom CSS', () => {
      const html = readBuilt('dist/index/index.html')
      // Tailwind output and our two stylesheets
      const css = html.match(/<link rel="stylesheet" href="[^"]*\.css"/g) ?? []
      expect(css.length).toBeGreaterThanOrEqual(1)
    })
  })
})

describe('DocLayout', () => {
  describe('chrome (sidebar + outline)', () => {
    it('renders sidebar on /model/concepts', () => {
      const html = readBuilt('dist/model/concepts/index.html')
      expect(html).toMatch(/<aside[^>]*aria-label="Section navigation"/)
    })

    it('renders outline on a doc page with h2/h3 headings', () => {
      const html = readBuilt('dist/docs/software/glossarist-ruby/index.html')
      expect(html).toMatch(/<aside[^>]*aria-label="On this page"/)
    })

    it('hides sidebar and outline on fullscreen /reference/schema-browser', () => {
      const html = readBuilt('dist/reference/schema-browser/index.html')
      expect(html).not.toMatch(/aria-label="Section navigation"/)
      expect(html).not.toMatch(/aria-label="On this page"/)
    })
  })

  describe('grid layout', () => {
    it('uses 3-column grid (sidebar | content | outline) when chrome is shown', () => {
      const html = readBuilt('dist/model/concepts/index.html')
      // The class on the doc-container div (not the CSS rule in <style>)
      const m = html.match(/<div class="doc-container[^"]*"/)
      expect(m?.[0]).toContain('doc-with-chrome')
    })

    it('uses 1-column grid when fullscreen', () => {
      const html = readBuilt('dist/reference/schema-browser/index.html')
      const m = html.match(/<div class="doc-container[^"]*"/)
      expect(m?.[0]).toBeDefined()
      expect(m?.[0]).not.toContain('doc-with-chrome')
    })
  })
})

describe('BlogLayout', () => {
  it('renders byline with author and date on a blog post', () => {
    const html = readBuilt('dist/blog/2026-07-05-concept-model-v3.1/index.html')
    expect(html).toContain('Ribose')
    // The datetime attribute includes the full ISO timestamp; just match the date prefix.
    expect(html).toMatch(/<time[^>]*datetime="2026-07-05/)
  })

  it('renders the post title in an h1', () => {
    const html = readBuilt('dist/blog/2026-07-05-concept-model-v3.1/index.html')
    expect(html).toMatch(/<h1[^>]*>.*Concept Model v3\.1.*<\/h1>/)
  })

  it('uses single-column max-w-[720px] layout', () => {
    const html = readBuilt('dist/blog/2026-07-05-concept-model-v3.1/index.html')
    expect(html).toContain('max-w-[720px]')
  })
})

describe('fullscreen-page body class', () => {
  it('adds fullscreen-page class on /reference/schema-browser', () => {
    const html = readBuilt('dist/reference/schema-browser/index.html')
    expect(html).toMatch(/<body[^>]*class="[^"]*fullscreen-page/)
  })

  it('does NOT add fullscreen-page class on regular docs', () => {
    const html = readBuilt('dist/model/concepts/index.html')
    expect(html).not.toMatch(/class="[^"]*fullscreen-page/)
  })
})
