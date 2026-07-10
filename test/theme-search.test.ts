import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const root = resolve(import.meta.dirname, '..')

function readBuilt(rel: string): string {
  const path = join(root, rel)
  if (!existsSync(path)) {
    throw new Error(`Build output missing: ${rel}. Run \`npm run build\` first.`)
  }
  return readFileSync(path, 'utf-8')
}

function readHead(html: string): string {
  const m = html.match(/<head[^>]*>([\s\S]*?)<\/head>/)
  return m ? m[0] : ''
}

// Read the contents of every <script type="module" src="/_astro/..."> that
// Astro bundled for this page, plus any inline <script> blocks.
function readAllScriptSources(html: string): string {
  const parts: string[] = []
  // Inline scripts
  const inlineRe = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g
  let m
  while ((m = inlineRe.exec(html))) parts.push(m[1])
  // External module scripts (Astro bundles to /_astro/*.js)
  const srcRe = /<script[^>]*src="(\/_astro\/[^"]+\.js)"/g
  while ((m = srcRe.exec(html))) {
    const path = join(root, 'dist', m[1].replace(/^\/+/, ''))
    if (existsSync(path)) parts.push(readFileSync(path, 'utf-8'))
  }
  return parts.join('\n')
}

describe('Theme toggle — init script', () => {
  it('runs dark-mode detection before paint (in <head>)', () => {
    const head = readHead(readBuilt('dist/index.html'))
    expect(head).toMatch(/classList\.add\('dark'\)/)
  })

  it('reads "glossarist-theme" key from localStorage', () => {
    const head = readHead(readBuilt('dist/index.html'))
    expect(head).toContain("localStorage.getItem('glossarist-theme')")
  })

  it('respects explicit dark preference even when OS is light', () => {
    const head = readHead(readBuilt('dist/index.html'))
    // `stored === 'dark'` short-circuits before OS check
    expect(head).toMatch(/stored === 'dark'/)
  })

  it('falls back to OS preference when stored is absent or "auto"', () => {
    const head = readHead(readBuilt('dist/index.html'))
    expect(head).toMatch(/!stored || stored === 'auto'/)
    expect(head).toMatch(/prefers-color-scheme: dark/)
  })

  it('does NOT reference the old vitepress-theme key', () => {
    const head = readHead(readBuilt('dist/index.html'))
    expect(head).not.toMatch(/vitepress-theme/)
  })
})

describe('Theme toggle — toggle button', () => {
  it('renders a #theme-toggle button in the nav', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/<button[^>]*id="theme-toggle"/)
  })

  it('has accessible aria-label', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/aria-label="Toggle dark mode"/)
  })

  it('renders both sun and moon icons', () => {
    const html = readBuilt('dist/index.html')
    // Sun icon (light mode)
    expect(html).toMatch(/class="theme-icon-light"/)
    // Moon icon (dark mode)
    expect(html).toMatch(/class="theme-icon-dark"/)
  })

  it('ships a script that toggles the .dark class on click', () => {
    const html = readBuilt('dist/index.html')
    const scripts = readAllScriptSources(html)
    expect(scripts).toMatch(/theme-toggle/)
    expect(scripts).toMatch(/classList\.toggle\(['`]dark['`]\)/)
    expect(scripts).toMatch(/localStorage\.setItem\(['`]glossarist-theme['`]/)
  })

  it('hides the moon icon in light mode and shows it in dark mode', () => {
    // The :global() rule is compiled (with Astro's data-astro-cid attribute)
    // into the BaseLayout CSS bundle.
    const css = readBuilt('dist/_astro/BaseLayout.DuK7MYPx.css')
    expect(css).toMatch(/\.theme-icon-dark[^{]*\{display:none\}/)
    expect(css).toMatch(/\.dark \.theme-icon-light[^{]*\{display:none\}/)
    expect(css).toMatch(/\.theme-icon-dark[^{]*\{display:inline\}/)
  })
})

describe('Search UI — trigger', () => {
  it('renders #search-trigger button', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/<button[^>]*id="search-trigger"/)
  })

  it('shows the Cmd+K shortcut hint', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toContain('⌘K')
  })

  it('has accessible aria-label="Search"', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/aria-label="Search"/)
  })
})

describe('Search UI — dialog', () => {
  it('renders a native <dialog id="search-dialog">', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/<dialog[^>]*id="search-dialog"/)
  })

  it('includes the search input', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/<input[^>]*id="search-input"/)
  })

  it('includes the results container', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/<div[^>]*id="search-results"/)
  })

  it('includes an Esc close button', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/<button[^>]*id="search-close"/)
    expect(html).toContain('>Esc<')
  })
})

describe('Search UI — keyboard shortcuts', () => {
  it('binds Cmd+K / Ctrl+K to open and toggle', () => {
    const html = readBuilt('dist/index.html')
    const scripts = readAllScriptSources(html)
    expect(scripts).toMatch(/metaKey\s*\|\|\s*\w+\.ctrlKey/)
    expect(scripts).toMatch(/\.key\s*===\s*['`]k['`]/)
  })

  it('binds Escape to close', () => {
    const html = readBuilt('dist/index.html')
    const scripts = readAllScriptSources(html)
    expect(scripts).toMatch(/\.key\s*===\s*['`]Escape['`]/)
  })

  it('binds ArrowDown / ArrowUp for result navigation', () => {
    const html = readBuilt('dist/index.html')
    const scripts = readAllScriptSources(html)
    expect(scripts).toMatch(/ArrowDown/)
    expect(scripts).toMatch(/ArrowUp/)
  })
})

describe('Search UI — Pagefind integration', () => {
  it('hides the pagefind-entry dynamic import from Vite analyzer', () => {
    const html = readBuilt('dist/index.html')
    const scripts = readAllScriptSources(html)
    // The new Function('url', 'return import(url)') pattern keeps Vite from
    // trying to resolve /pagefind/pagefind.js at SSR build time.
    expect(scripts).toMatch(/Function\(['`]url['`],\s*['`]return import\(url\)['`]\)/)
  })

  it('loads /pagefind/pagefind.js (the correct entry file)', () => {
    const html = readBuilt('dist/index.html')
    const scripts = readAllScriptSources(html)
    expect(scripts).toContain('/pagefind/pagefind.js')
  })

  it('debounces input before searching', () => {
    const html = readBuilt('dist/index.html')
    const scripts = readAllScriptSources(html)
    expect(scripts).toMatch(/setTimeout/)
  })

  it('renders up to 10 results with title and excerpt', () => {
    const html = readBuilt('dist/index.html')
    // The render template is in the script
    expect(html).toMatch(/search-result-title/)
    expect(html).toMatch(/search-result-excerpt/)
    // 10 result cap
    expect(html).toMatch(/\.slice\(0, ?10\)/)
  })

  it('shows a loader state during search', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/search-loader/)
  })

  it('shows an empty state when no results', () => {
    const html = readBuilt('dist/index.html')
    expect(html).toMatch(/search-empty/)
  })
})

describe('Pagefind index in dist/', () => {
  it('writes the pagefind entry module', () => {
    expect(existsSync(join(root, 'dist/pagefind/pagefind.js'))).toBe(true)
  })

  it('writes the pagefind manifest', () => {
    expect(existsSync(join(root, 'dist/pagefind/pagefind-entry.json'))).toBe(true)
  })

  it('writes the language index', () => {
    const manifest = readBuilt('dist/pagefind/pagefind-entry.json')
    // Format is {"languages":{"en-us":{...}}}
    expect(manifest).toMatch(/"languages":\{"en-us"/)
  })
})
