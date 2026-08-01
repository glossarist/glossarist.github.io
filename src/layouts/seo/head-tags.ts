/**
 * Head-tag builder.
 *
 * Returns meta + link tags as plain objects. BaseLayout renders them
 * in the <head>. One place to add or change SEO head tags; layouts
 * just consume the array.
 */
import { HREFLANG_LOCALES, type SeoData } from './types'

const SITE_ORIGIN = 'https://www.glossarist.org'

export interface HeadTag {
  /** Tag name: 'meta' | 'link' | 'script'. */
  tag: 'meta' | 'link'
  /** Attribute bag (e.g. { name: 'description', content: '...' }). */
  attrs: Record<string, string>
}

function absoluteUrl(path: string, siteUrl?: URL): string {
  const origin = siteUrl?.origin ?? SITE_ORIGIN
  return new URL(path, origin).toString()
}

/** Query-string form for locales the chrome understands (see i18n store). */
const LOCALE_QUERY: Record<string, string> = {
  en: '',
  fr: '?lang=fra',
  'zh-Hans': '?lang=zho-Hans',
  'zh-Hant': '?lang=zho-Hant',
}

export function buildCanonical(data: SeoData): string {
  return absoluteUrl(data.path, data.siteUrl)
}

export function buildHeadTags(data: SeoData): HeadTag[] {
  const isHome = data.path === '/'
  const canonical = buildCanonical(data)
  const ogType = isHome ? 'website' : (data.type ?? 'article')
  const ogImage = data.ogImage ?? (SITE_ORIGIN + '/logo-glossarist.svg')
  const pageTitle = data.title === 'Glossarist' ? data.title : `${data.title} | Glossarist`

  const tags: HeadTag[] = [
    // Canonical
    { tag: 'link', attrs: { rel: 'canonical', href: canonical } },

    // RSS feed
    { tag: 'link', attrs: { rel: 'alternate', type: 'application/rss+xml', title: 'Glossarist Blog', href: SITE_ORIGIN + '/rss.xml' } },

    // hreflang alternates — only the homepage has locale variants
    // (content pages are English-only for now, per i18n PR scope)
    ...(isHome
      ? HREFLANG_LOCALES.map(locale => ({
          tag: 'link' as const,
          attrs: {
            rel: 'alternate',
            hreflang: locale,
            href: SITE_ORIGIN + '/' + LOCALE_QUERY[locale],
          },
        }))
      : []
    ),
    ...(isHome
      ? [{ tag: 'link' as const, attrs: { rel: 'alternate', hreflang: 'x-default', href: SITE_ORIGIN + '/' } }]
      : []
    ),

    // Open Graph
    { tag: 'meta', attrs: { property: 'og:title', content: pageTitle } },
    { tag: 'meta', attrs: { property: 'og:description', content: data.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: canonical } },
    { tag: 'meta', attrs: { property: 'og:image', content: ogImage } },
    { tag: 'meta', attrs: { property: 'og:type', content: ogType } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: 'Glossarist' } },

    // Twitter Card
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: pageTitle } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: data.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: ogImage } },
  ]

  return tags
}
