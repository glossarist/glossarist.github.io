/**
 * JSON-LD structured-data builders.
 *
 * Emits schema.org JSON-LD objects for the page. BaseLayout
 * stringifies and drops into a <script type="application/ld+json">.
 *
 * Supported shapes:
 * - WebSite (homepage only — includes SearchAction)
 * - TechArticle (every content page — model/, reference/, docs/, etc.)
 * - BreadcrumbList (when `breadcrumbs` is provided — for hierarchical pages)
 *
 * The Organization publisher is shared across all shapes — single
 * source of truth.
 */
import type { BreadcrumbItem, SeoData } from './types'

const SITE_ORIGIN = 'https://www.glossarist.org'

const organization = {
  '@type': 'Organization' as const,
  name: 'Glossarist',
  url: SITE_ORIGIN + '/',
  logo: SITE_ORIGIN + '/logo-glossarist.svg',
  sameAs: ['https://github.com/glossarist'],
}

function absoluteUrl(path: string, siteUrl?: URL): string {
  const origin = siteUrl?.origin ?? SITE_ORIGIN
  return new URL(path, origin).toString()
}

export function buildWebSiteJsonLd(data: SeoData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Glossarist',
    url: SITE_ORIGIN + '/',
    description: data.description,
    publisher: organization,
    potentialAction: {
      '@type': 'SearchAction',
      target: SITE_ORIGIN + '/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildTechArticleJsonLd(data: SeoData): object {
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: data.title,
    description: data.description,
    url: absoluteUrl(data.path, data.siteUrl),
    inLanguage: 'en-US',
    publisher: organization,
    about: ['Terminology management', 'ISO 704', 'ISO 10241-1', 'Concept systems'],
  }
  if (data.publishedAt) article.datePublished = data.publishedAt
  if (data.modifiedAt) article.dateModified = data.modifiedAt
  if (data.ogImage) article.image = data.ogImage
  return article
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], siteUrl?: URL): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url, siteUrl),
    })),
  }
}

/**
 * Build the full JSON-LD array for a page. Returns one or more
 * structured-data objects; BaseLayout emits each as its own
 * <script type="application/ld+json"> tag.
 *
 * - Homepage → WebSite + SearchAction
 * - Content pages → TechArticle (+ BreadcrumbList if breadcrumbs provided)
 */
export function buildJsonLd(data: SeoData): object[] {
  const isHome = data.path === '/'
  const out: object[] = []
  if (isHome) {
    out.push(buildWebSiteJsonLd(data))
  } else {
    out.push(buildTechArticleJsonLd(data))
  }
  if (!isHome && data.breadcrumbs && data.breadcrumbs.length > 0) {
    out.push(buildBreadcrumbJsonLd(data.breadcrumbs, data.siteUrl))
  }
  return out
}
