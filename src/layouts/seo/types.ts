/**
 * SEO type definitions.
 *
 * One place to describe what SEO data every page can provide. Layouts
 * pass an instance of `SeoData` to `buildHeadTags()` and `buildJsonLd()`
 * (see src/layouts/seo/index.ts) and the SEO module emits the correct
 * meta + JSON-LD for the page type.
 *
 * Scope: covers title, description, canonical, hreflang alternates,
 * Open Graph, Twitter Card, and JSON-LD structured data. Does NOT
 * cover favicons / theme / font loading (those stay in BaseLayout).
 */

export type SeoType = 'website' | 'article'

export interface BreadcrumbItem {
  /** Display name (e.g. "Model"). */
  name: string
  /** Absolute or site-relative URL (e.g. "/model/"). */
  url: string
}

export interface SeoData {
  /** Page title (will be combined with site suffix in BaseLayout). */
  title: string
  /** Page description, ~150-160 chars for SERP. */
  description: string
  /** Astro.url.pathname — used to build the canonical + OG URL. */
  path: string
  /** Site origin; defaults to https://www.glossarist.org. */
  siteUrl?: URL
  /** Page type — drives JSON-LD @type and OG type. */
  type?: SeoType
  /** Article published date (ISO 8601) — only for `type: 'article'`. */
  publishedAt?: string
  /** Article modified date (ISO 8601). */
  modifiedAt?: string
  /** Optional breadcrumbs for BreadcrumbList JSON-LD. */
  breadcrumbs?: BreadcrumbItem[]
  /** Absolute URL to the OG / Twitter Card image. */
  ogImage?: string
}

/** Locale codes that have hreflang alternates (see src/i18n/translations.ts). */
export const HREFLANG_LOCALES = ['en', 'fr', 'zh-Hans', 'zh-Hant'] as const
export type HreflangLocale = typeof HREFLANG_LOCALES[number]
