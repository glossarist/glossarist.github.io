import { describe, it, expect } from 'vitest'
import {
  buildHeadTags,
  buildCanonical,
  buildJsonLd,
  buildTechArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildWebSiteJsonLd,
  HREFLANG_LOCALES,
  type SeoData,
  type BreadcrumbItem,
} from '../src/layouts/seo'

const homeData: SeoData = {
  title: 'Glossarist',
  description: 'Open-source software for maintaining multi-language concept systems',
  path: '/',
}

const articleData: SeoData = {
  title: 'Hyperedges',
  description: 'ISO 704:2022 n-ary concept relations.',
  path: '/model/hyperedges',
  type: 'article',
  breadcrumbs: [
    { name: 'Model', url: '/model/' },
    { name: 'Hyperedges', url: '/model/hyperedges' },
  ],
}

describe('SEO module: buildHeadTags', () => {
  it('includes canonical URL for every page', () => {
    const tags = buildHeadTags(articleData)
    const canonical = tags.find(t => t.tag === 'link' && t.attrs.rel === 'canonical')
    expect(canonical).toBeDefined()
    expect(canonical?.attrs.href).toBe('https://www.glossarist.org/model/hyperedges')
  })

  it('homepage emits hreflang alternates for every supported locale', () => {
    const tags = buildHeadTags(homeData)
    const hreflangs = tags.filter(t => t.tag === 'link' && t.attrs.rel === 'alternate')
    expect(hreflangs.length).toBe(HREFLANG_LOCALES.length + 1)  // +1 for x-default
    const locales = hreflangs.map(t => t.attrs.hreflang)
    for (const loc of HREFLANG_LOCALES) {
      expect(locales).toContain(loc)
    }
    expect(locales).toContain('x-default')
  })

  it('content pages do NOT emit hreflang (English-only)', () => {
    const tags = buildHeadTags(articleData)
    const hreflangs = tags.filter(t => t.attrs.rel === 'alternate')
    expect(hreflangs).toEqual([])
  })

  it('emits Open Graph tags with site origin', () => {
    const tags = buildHeadTags(articleData)
    const og = tags.filter(t => t.tag === 'meta' && t.attrs.property?.startsWith('og:'))
    expect(og.length).toBeGreaterThanOrEqual(5)
    const ogUrl = og.find(t => t.attrs.property === 'og:url')
    expect(ogUrl?.attrs.content).toMatch(/^https:\/\/www\.glossarist\.org/)
  })

  it('emits Twitter Card tags', () => {
    const tags = buildHeadTags(articleData)
    const tw = tags.find(t => t.tag === 'meta' && t.attrs.name === 'twitter:card')
    expect(tw?.attrs.content).toBe('summary_large_image')
  })

  it('og:type reflects page type (website vs article)', () => {
    expect(buildHeadTags(homeData).find(t => t.attrs.property === 'og:type')?.attrs.content).toBe('website')
    expect(buildHeadTags(articleData).find(t => t.attrs.property === 'og:type')?.attrs.content).toBe('article')
  })

  it('og:image defaults to og-default.png when not provided', () => {
    const tags = buildHeadTags(articleData)
    const img = tags.find(t => t.attrs.property === 'og:image')
    expect(img?.attrs.content).toContain('og-default.png')
  })
})

describe('SEO module: buildCanonical', () => {
  it('returns absolute URL for site-relative path', () => {
    expect(buildCanonical(articleData)).toBe('https://www.glossarist.org/model/hyperedges')
  })

  it('handles root path', () => {
    expect(buildCanonical(homeData)).toBe('https://www.glossarist.org/')
  })

  it('honors siteUrl override', () => {
    const data: SeoData = { ...articleData, siteUrl: new URL('https://staging.example.com') }
    expect(buildCanonical(data)).toBe('https://staging.example.com/model/hyperedges')
  })
})

describe('SEO module: buildJsonLd', () => {
  it('homepage returns WebSite shape', () => {
    const objs = buildJsonLd(homeData)
    expect(objs.length).toBe(1)
    expect(JSON.stringify(objs[0])).toMatch(/"@type":"WebSite"/)
  })

  it('content page returns TechArticle shape', () => {
    const objs = buildJsonLd(articleData)
    const types = objs.map(o => (o as { '@type': string })['@type'])
    expect(types).toContain('TechArticle')
  })

  it('adds BreadcrumbList when breadcrumbs provided', () => {
    const objs = buildJsonLd(articleData)
    const types = objs.map(o => (o as { '@type': string })['@type'])
    expect(types).toContain('BreadcrumbList')
  })

  it('omits BreadcrumbList when no breadcrumbs', () => {
    const data: SeoData = { ...articleData, breadcrumbs: undefined }
    const objs = buildJsonLd(data)
    const types = objs.map(o => (o as { '@type': string })['@type'])
    expect(types).not.toContain('BreadcrumbList')
  })

  it('homepage never emits BreadcrumbList', () => {
    const data: SeoData = { ...homeData, breadcrumbs: [{ name: 'X', url: '/' }] }
    const objs = buildJsonLd(data)
    const types = objs.map(o => (o as { '@type': string })['@type'])
    expect(types).not.toContain('BreadcrumbList')
  })
})

describe('SEO module: individual builders', () => {
  it('buildTechArticleJsonLd includes datePublished when provided', () => {
    const data: SeoData = { ...articleData, publishedAt: '2026-07-30' }
    const obj = buildTechArticleJsonLd(data) as { datePublished?: string }
    expect(obj.datePublished).toBe('2026-07-30')
  })

  it('buildBreadcrumbJsonLd assigns 1-indexed positions', () => {
    const items: BreadcrumbItem[] = [
      { name: 'A', url: '/a' },
      { name: 'B', url: '/b' },
      { name: 'C', url: '/c' },
    ]
    const obj = buildBreadcrumbJsonLd(items) as { itemListElement: Array<{ position: number }> }
    expect(obj.itemListElement.map(e => e.position)).toEqual([1, 2, 3])
  })

  it('buildWebSiteJsonLd includes SearchAction', () => {
    const obj = buildWebSiteJsonLd(homeData) as { potentialAction: { '@type': string } }
    expect(obj.potentialAction['@type']).toBe('SearchAction')
  })
})
