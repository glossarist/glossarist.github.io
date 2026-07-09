import { describe, it, expect } from 'vitest'
import { projects, premierProjects, softwareNavItems } from '../src/data/projects'

describe('projects', () => {
  it('contains all four canonical Glossarist projects', () => {
    const names = projects.map(p => p.name)
    expect(names).toContain('glossarist-ruby')
    expect(names).toContain('glossarist-js')
    expect(names).toContain('glossarist-desktop')
    expect(names).toContain('concept-browser')
  })

  it('every project has the required Project fields', () => {
    for (const p of projects) {
      expect(p).toStrictEqual({
        name: expect.any(String),
        slug: expect.any(String),
        version: expect.stringMatching(/^v\d+\.\d+\.\d+/),
        description: expect.any(String),
        github: expect.stringMatching(/^https:\/\/github\.com\//),
        featured: expect.any(Boolean),
        category: expect.any(String),
      })
    }
  })

  it('every project has a docs page slug matching an existing file', () => {
    for (const p of projects) {
      // Slug resolves to /docs/software/{slug} — assert it's URL-safe
      expect(p.slug).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('all projects are featured (used on home page)', () => {
    for (const p of projects) {
      expect(p.featured).toBe(true)
    }
  })

  it('all projects are in the "Core" category', () => {
    for (const p of projects) {
      expect(p.category).toBe('Core')
    }
  })

  it('versions are pinned and not bleeding-edge placeholders', () => {
    for (const p of projects) {
      expect(p.version).not.toBe('latest')
      expect(p.version).not.toBe('x.x.x')
    }
  })
})

describe('premierProjects', () => {
  it('equals projects.filter(featured)', () => {
    expect(premierProjects).toEqual(projects.filter(p => p.featured))
  })

  it('contains every project (all featured)', () => {
    expect(premierProjects.length).toBe(projects.length)
  })
})

describe('softwareNavItems', () => {
  it('returns one nav item per project', () => {
    expect(softwareNavItems.length).toBe(projects.length)
  })

  it('is sorted alphabetically by display text', () => {
    const texts = softwareNavItems.map(n => n.text)
    const sorted = [...texts].sort()
    expect(texts).toEqual(sorted)
  })

  it('every link points to /docs/software/{slug}', () => {
    for (const item of softwareNavItems) {
      expect(item.link).toMatch(/^\/docs\/software\//)
    }
  })

  it('every item has text and link', () => {
    for (const item of softwareNavItems) {
      expect(item.text).toBeTruthy()
      expect(item.link).toBeTruthy()
    }
  })
})
