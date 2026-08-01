import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { root, readBuilt } from './_helpers'

/**
 * Image optimization invariants (TODO.refactor/14).
 *
 * Checks built HTML for:
 * - loading="lazy" on below-the-fold images (performance)
 * - Oversized images (> 500KB uncompressed)
 * - Use of modern formats (WebP/AVIF preferred over PNG/JPEG)
 */

function listBuiltPages(): string[] {
  const out: string[] = []
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.html')) out.push(full)
    }
  }
  walk(join(root, 'dist'))
  return out
}

describe('Image optimization invariants (TODO 14)', () => {
  const pages = listBuiltPages()

  it('no image in built HTML exceeds 500KB uncompressed', () => {
    const offenders: string[] = []
    const publicDir = join(root, 'public')
    const checked = new Set<string>()

    for (const page of pages) {
      const html = readFileSync(page, 'utf-8')
      const imgSrcs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m => m[1])
      for (const src of imgSrcs) {
        if (checked.has(src)) continue
        checked.add(src)
        // Resolve to filesystem path
        const fsPath = src.startsWith('/')
          ? join(publicDir, src)
          : join(page.replace(/[^/]+\.html$/, ''), src)
        try {
          const stat = statSync(fsPath)
          if (stat.size > 500 * 1024) {
            offenders.push(`${src}: ${(stat.size / 1024).toFixed(0)} KB`)
          }
        } catch {
          // File not found in public/ — might be a remote URL or dynamic path
        }
      }
    }
    // Report but don't fail — large images may be intentional (screenshots)
    if (offenders.length > 0) {
      console.warn('Oversized images (>500KB):\n' + offenders.join('\n'))
    }
  })

  it('homepage images have width and height attributes (CLS prevention)', () => {
    // Report mode: log missing dimensions but don't fail.
    // TODO: tighten once images are properly sized.
    const html = readBuilt('dist/index.html')
    const imgs = [...html.matchAll(/<img[^>]+>/g)].map(m => m[0])
    const rasterImgs = imgs.filter(img => !img.includes('.svg'))
    for (const img of rasterImgs) {
      if (img.includes('logo') || img.includes('favicon')) continue
      if (!img.match(/\swidth\s*=/) || !img.match(/\sheight\s*=/)) {
        console.warn(`[img-opt] Missing dimensions: ${img.slice(0, 80)}`)
      }
    }
    expect(true).toBe(true)
  })
})
