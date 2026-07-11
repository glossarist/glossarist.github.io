import { describe, it, expect } from 'vitest'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { root } from './_helpers'

const contentDir = join(root, 'src/content')

function listMarkdown(dir: string, ext: 'md' | 'mdx'): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { recursive: true })) {
    const p = entry as string
    if (p.endsWith(`.${ext}`)) out.push(p)
  }
  return out
}

describe('MDX migration (no .md files remain)', () => {
  it('has zero .md files in src/content/', () => {
    const md = listMarkdown(contentDir, 'md')
    expect(md, `found stale .md files: ${md.join(', ')}`).toEqual([])
  })

  it('has all content as .mdx', () => {
    const mdx = listMarkdown(contentDir, 'mdx')
    expect(mdx.length).toBeGreaterThan(70)
    // Sanity-check a few known files
    expect(mdx).toContain('blog/2026-07-05-concept-model-v3.1.mdx')
    expect(mdx).toContain('docs/model/concepts.mdx')
    expect(mdx).toContain('pages/about.mdx')
    expect(mdx).toContain('reference/ontology.mdx')
  })
})
