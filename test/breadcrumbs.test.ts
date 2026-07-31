import { describe, it, expect } from 'vitest'
import { deriveBreadcrumbs } from '../src/layouts/seo/breadcrumbs'

describe('SEO breadcrumbs derivation', () => {
  it('homepage has no breadcrumbs', () => {
    expect(deriveBreadcrumbs('/')).toEqual([])
    expect(deriveBreadcrumbs('')).toEqual([])
  })

  it('section root has just the section', () => {
    const crumbs = deriveBreadcrumbs('/model/')
    expect(crumbs).toEqual([{ name: 'Concept Model', url: '/model/' }])
  })

  it('leaf page has section + leaf', () => {
    const crumbs = deriveBreadcrumbs('/model/hyperedges')
    expect(crumbs.length).toBe(2)
    expect(crumbs[0]).toEqual({ name: 'Concept Model', url: '/model/' })
    expect(crumbs[1].name).toBe('Hyperedges')
    expect(crumbs[1].url).toBe('/model/hyperedges')
  })

  it('hyphenated slugs are humanized', () => {
    const crumbs = deriveBreadcrumbs('/reference/iso-10241-1-mapping')
    expect(crumbs[1].name).toBe('Iso 10241 1 Mapping')
  })

  it('all known sections are recognized', () => {
    expect(deriveBreadcrumbs('/model/').length).toBe(1)
    expect(deriveBreadcrumbs('/reference/').length).toBe(1)
    expect(deriveBreadcrumbs('/docs/').length).toBe(1)
    expect(deriveBreadcrumbs('/blog/').length).toBe(1)
    expect(deriveBreadcrumbs('/use-cases/').length).toBe(1)
    expect(deriveBreadcrumbs('/playground/hyperedges').length).toBe(2)
  })

  it('unknown paths return empty', () => {
    expect(deriveBreadcrumbs('/random')).toEqual([])
    expect(deriveBreadcrumbs('/random/page')).toEqual([])
  })

  it('trailing slash handled', () => {
    expect(deriveBreadcrumbs('/model/hyperedges/').length).toBe(2)
  })

  it('deeply nested paths show section + immediate leaf', () => {
    // e.g. /reference/standards/iso-704 — section is "Reference", leaf
    // is the last path segment, not the full nested chain.
    const crumbs = deriveBreadcrumbs('/reference/standards/iso-704')
    expect(crumbs[0].name).toBe('Reference')
    expect(crumbs[1].name).toBe('Iso 704')
  })
})
