import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

const root = resolve(import.meta.dirname, '..')

function readBuilt(rel: string): string {
  const path = join(root, rel)
  if (!existsSync(path)) {
    throw new Error(`Build output missing: ${rel}. Run \`npm run build\` first.`)
  }
  return readFileSync(path, 'utf-8')
}

function exists(rel: string): boolean {
  return existsSync(join(root, rel))
}

describe('Home page /', () => {
  it('renders index.html', () => {
    expect(exists('dist/index.html')).toBe(true)
  })

  it('loads the HomePage Vue island', () => {
    const html = readBuilt('dist/index.html')
    // Astro hydrates client:load islands with this attribute
    expect(html).toMatch(/astro-island[^>]*HomePage/)
  })

  it('contains hero content', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/Glossarist/i)
  })
})

describe('About page /about', () => {
  it('renders about.html', () => {
    expect(exists('dist/about.html')).toBe(true)
  })

  it('renders the LogoMerge SVG with cultural labels', () => {
    const html = readBuilt('dist/about.html')
    expect(html).toContain('文')
    expect(html).toContain('ΓΛ')
    expect(html).toContain('ONE MARK')
  })
})

describe('Blog index /blog', () => {
  it('renders blog.html', () => {
    expect(exists('dist/blog.html')).toBe(true)
  })

  it('lists all 6 blog posts', () => {
    const html = readBuilt('dist/blog.html')
    for (const slug of [
      '2026-05-27-concept-browser-0.4',
      '2026-05-27-concept-model-v3',
      '2026-05-27-desktop-1.6',
      '2026-05-27-glossarist-js-0.2',
      '2026-05-27-glossarist-ruby-2.8',
      '2026-07-05-concept-model-v3.1',
    ]) {
      expect(html, `blog index missing link to ${slug}`).toContain(`href="/blog/${slug}"`)
    }
  })
})

describe('Blog post URLs preserve dots', () => {
  // Astro's default glob loader slugifies dots, which would turn
  // 2026-05-27-concept-browser-0.4 into 2026-05-27-concept-browser-04.
  // Our custom generateId in content.config.ts preserves them.
  it('renders /blog/2026-05-27-concept-browser-0.4 (dot preserved)', () => {
    expect(exists('dist/blog/2026-05-27-concept-browser-0.4.html')).toBe(true)
  })

  it('renders /blog/2026-07-05-concept-model-v3.1 (dot preserved)', () => {
    expect(exists('dist/blog/2026-07-05-concept-model-v3.1.html')).toBe(true)
  })

  it('does NOT render the slugified (dot-stripped) variant', () => {
    expect(exists('dist/blog/2026-05-27-concept-browser-04.html')).toBe(false)
    expect(exists('dist/blog/2026-07-05-concept-model-v31.html')).toBe(false)
  })
})

describe('Docs catch-all /docs/[...path]', () => {
  it('renders docs index', () => {
    expect(exists('dist/docs.html')).toBe(true)
  })

  it('renders model index', () => {
    expect(exists('dist/docs/model.html')).toBe(true)
  })

  it('renders nested desktop pages', () => {
    expect(exists('dist/docs/desktop.html')).toBe(true)
    expect(exists('dist/docs/desktop/getting-started/installation.html')).toBe(true)
    expect(exists('dist/docs/desktop/ui/modules/browse.html')).toBe(true)
    expect(exists('dist/docs/desktop/ui/panels/language.html')).toBe(true)
  })

  it('renders software pages', () => {
    expect(exists('dist/docs/software.html')).toBe(true)
    expect(exists('dist/docs/software/glossarist-ruby.html')).toBe(true)
    expect(exists('dist/docs/software/glossarist-js.html')).toBe(true)
    expect(exists('dist/docs/software/concept-browser.html')).toBe(true)
    expect(exists('dist/docs/software/desktop.html')).toBe(true)
  })

  it('renders standards page', () => {
    expect(exists('dist/docs/standards.html')).toBe(true)
  })
})

describe('Reference pages', () => {
  it('renders reference index', () => {
    expect(exists('dist/reference.html')).toBe(true)
  })

  it('renders interactive viewer pages', () => {
    expect(exists('dist/reference/schema-browser.html')).toBe(true)
    expect(exists('dist/reference/ontology.html')).toBe(true)
    expect(exists('dist/reference/entity-fields.html')).toBe(true)
  })

  it('loads SchemaReference Vue island on /reference/schema-browser', () => {
    const html = readBuilt('dist/reference/schema-browser.html')
    expect(html).toMatch(/astro-island[^>]*SchemaReference/)
  })

  it('loads OntologyBrowser Vue island on /reference/ontology', () => {
    const html = readBuilt('dist/reference/ontology.html')
    expect(html).toMatch(/astro-island[^>]*OntologyBrowser/)
  })
})

describe('404 page', () => {
  it('renders 404.html', () => {
    expect(exists('dist/404.html')).toBe(true)
  })

  it('contains a return-home link', () => {
    const html = readBuilt('dist/404.html')
    expect(html).toMatch(/href="\/"/)
  })
})

describe('admonition rendering (rehype plugin)', () => {
  it('renders ::: info as <div class="custom-block info"> with title', () => {
    const html = readBuilt('dist/docs/desktop/ui/panels/language.html')
    expect(html).toContain('class="custom-block info"')
    expect(html).toContain('class="custom-block-title"')
    expect(html).toContain('INFO')
  })

  it('does not leave literal ::: markers visible', () => {
    const html = readBuilt('dist/docs/desktop/ui/panels/language.html')
    // After the plugin runs, no paragraph should contain ":::" as text
    expect(html).not.toMatch(/<p>[^<]*:::[^<]*<\/p>/)
  })
})

describe('sitemap', () => {
  it('generates sitemap-index.xml', () => {
    expect(exists('dist/sitemap-index.xml')).toBe(true)
  })

  it('uses the www.glossarist.org hostname', () => {
    const index = readBuilt('dist/sitemap-index.xml')
    expect(index).toContain('sitemap-0.xml')
    const sitemap = readBuilt('dist/sitemap-0.xml')
    expect(sitemap).toContain('https://www.glossarist.org/')
  })

  it('includes the home page', () => {
    const sitemap = readBuilt('dist/sitemap-0.xml')
    // Astro's sitemap may use <url><loc>...</loc></url> or self-closing
    expect(sitemap).toMatch(/<loc>https:\/\/www\.glossarist\.org\/?<\/loc>/)
  })
})

describe('Pagefind search index', () => {
  it('writes dist/pagefind/', () => {
    expect(exists('dist/pagefind')).toBe(true)
  })

  it('generates pagefind.js entry', () => {
    expect(exists('dist/pagefind/pagefind.js')).toBe(true)
  })

  it('generates pagefind-entry.json manifest', () => {
    expect(exists('dist/pagefind/pagefind-entry.json')).toBe(true)
  })
})

describe('static assets', () => {
  it('preserves public/CNAME for GitHub Pages', () => {
    expect(exists('dist/CNAME')).toBe(true)
    expect(readBuilt('dist/CNAME').trim()).toBe('www.glossarist.org')
  })

  it('preserves robots.txt', () => {
    expect(exists('dist/robots.txt')).toBe(true)
  })

  it('preserves favicon files', () => {
    expect(exists('dist/favicon.ico')).toBe(true)
    expect(exists('dist/favicon.svg')).toBe(true)
    expect(exists('dist/favicon-96x96.png')).toBe(true)
    expect(exists('dist/apple-touch-icon.png')).toBe(true)
  })

  it('preserves web manifest', () => {
    expect(exists('dist/site.webmanifest')).toBe(true)
  })
})
