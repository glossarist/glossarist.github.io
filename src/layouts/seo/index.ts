/**
 * SEO module public API.
 *
 * Layouts import { buildHeadTags, buildJsonLd } from '@/layouts/seo'
 * and pass a SeoData object. The module handles canonical URLs,
 * hreflang alternates, Open Graph, Twitter Card, and JSON-LD
 * structured data uniformly.
 *
 * Adding a new SEO feature (e.g. article author, OG video) = adding
 * to this module, not editing every layout. (Open/Closed Principle.)
 */
export { buildHeadTags, buildCanonical } from './head-tags'
export { buildJsonLd, buildTechArticleJsonLd, buildBreadcrumbJsonLd, buildWebSiteJsonLd } from './json-ld'
export { HREFLANG_LOCALES } from './types'
export type { SeoData, SeoType, BreadcrumbItem, HreflangLocale } from './types'
