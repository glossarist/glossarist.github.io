/**
 * Breadcrumb derivation.
 *
 * Maps a site-relative pathname to a BreadcrumbItem[] for the
 * BreadcrumbList JSON-LD. The hierarchy is derived from known
 * section prefixes — single source of truth for "what's a section".
 *
 * Adding a new top-level section = adding to SECTION_LABELS.
 */
import type { BreadcrumbItem } from './types'

/** Display labels for top-level sections, keyed by URL prefix. */
const SECTION_LABELS: Record<string, string> = {
  '/model/': 'Concept Model',
  '/reference/': 'Reference',
  '/docs/': 'Docs',
  '/blog/': 'Blog',
  '/use-cases/': 'Use Cases',
  '/playground/': 'Playground',
}

const SECTION_ORDER = Object.keys(SECTION_LABELS).sort((a, b) => b.length - a.length)

/**
 * Derive breadcrumbs for a pathname.
 *
 * Examples:
 *   '/'                                    → []
 *   '/model/'                              → [{ Concept Model, /model/ }]
 *   '/model/hyperedges'                    → [{ Concept Model, /model/ }, { hyperedges, /model/hyperedges }]
 *   '/reference/standards/iso-704'         → [{ Reference, /reference/ }, { iso-704, /reference/standards/iso-704 }]
 *
 * Returns empty array for the homepage (no parent breadcrumb) and
 * for paths that don't match a known section.
 */
export function deriveBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === '/' || pathname === '') return []

  const prefix = SECTION_ORDER.find(p => pathname.startsWith(p))
  if (!prefix) return []

  const items: BreadcrumbItem[] = [
    { name: SECTION_LABELS[prefix], url: prefix },
  ]

  // Add the leaf (current page) if it's not the section root
  const leaf = pathname.slice(prefix.length).replace(/\/$/, '').replace(/\/index$/, '')
  if (leaf && leaf !== 'index') {
    // Capitalize first letter, replace hyphens with spaces for readability
    const leafLabel = leaf
      .split('/')
      .pop()!
      .split('-')
      .map(seg => seg.charAt(0).toUpperCase() + seg.slice(1))
      .join(' ')
    items.push({ name: leafLabel, url: pathname })
  }

  return items
}
