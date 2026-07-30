export interface SidebarItem {
  text: string
  link: string
  collapsed?: boolean
  items?: SidebarItem[]
}

export interface SidebarGroup {
  text: string
  items: SidebarItem[]
  collapsible?: boolean
}

export const sidebars: Record<string, SidebarGroup[]> = {
  '/model/': [
    {
      text: 'Concept Model',
      items: [
        { text: 'Overview', link: '/model/' },
        { text: 'Concepts', link: '/model/concepts' },
        { text: 'Designations', link: '/model/designations' },
        { text: 'Relationships', link: '/model/relationships' },
        { text: 'Hyperedges', link: '/model/hyperedges' },
        { text: 'Sources', link: '/model/sources' },
        { text: 'Datasets & Sections', link: '/model/datasets' },
        { text: 'Non-verbal Entities', link: '/model/non-verbal' },
        { text: 'Term Types', link: '/model/term-types' },
      ],
    },
    {
      text: 'Schemas',
      items: [
        { text: 'YAML Schemas', link: '/model/schemas/' },
      ],
    },
  ],
  '/reference/': [
    {
      text: 'Reference',
      items: [
        { text: 'Overview', link: '/reference/' },
        { text: 'Schema Browser', link: '/reference/schema-browser' },
        { text: 'Entity Fields', link: '/reference/entity-fields' },
        { text: 'Ontology Browser', link: '/reference/ontology' },
        { text: 'Standards', link: '/reference/standards' },
      ],
    },
    {
      text: 'ISO Standards',
      items: [
        { text: 'ISO 10241-1 — Terminology Entries', link: '/reference/standards/iso-10241-1' },
        { text: 'ISO 704 — Principles & Methods', link: '/reference/standards/iso-704' },
        { text: 'ISO 30042 — TBX Format', link: '/reference/standards/iso-30042' },
        { text: 'ISO 12620 — Data Categories', link: '/reference/standards/iso-12620' },
        { text: 'ISO 25964 — Thesauri', link: '/reference/standards/iso-25964' },
      ],
    },
  ],
  '/docs/software/': [
    {
      text: 'Software',
      items: [
        { text: 'Overview', link: '/docs/software/' },
        { text: 'Glossarist Ruby', link: '/docs/software/glossarist-ruby' },
        { text: 'Glossarist JS', link: '/docs/software/glossarist-js' },
        { text: 'Concept Browser', link: '/docs/software/concept-browser' },
        { text: 'Desktop App', link: '/docs/software/desktop' },
      ],
    },
    {
      text: 'Desktop — Getting Started',
      items: [
        { text: 'Installation', link: '/docs/software/desktop/getting-started/installation' },
        { text: 'First Launch', link: '/docs/software/desktop/getting-started/initial-setup' },
      ],
    },
    {
      text: 'Desktop — Tutorials',
      items: [
        { text: 'Making a Change', link: '/docs/software/desktop/tutorials/create-change-request' },
        { text: 'Reviewing a Change', link: '/docs/software/desktop/tutorials/review-change-request' },
        { text: 'Linking Concepts', link: '/docs/software/desktop/tutorials/linking-concepts' },
      ],
    },
    {
      text: 'Desktop — Interface',
      items: [
        { text: 'Modules', link: '/docs/software/desktop/ui/modules/' },
        { text: 'Panels', link: '/docs/software/desktop/ui/panels/' },
        { text: 'Widgets', link: '/docs/software/desktop/ui/widgets/' },
      ],
    },
    {
      text: 'Desktop — Topics',
      items: [
        { text: 'Synchronization', link: '/docs/software/desktop/topics/synchronization' },
        { text: 'Concept Relationships', link: '/docs/software/desktop/topics/concept-relationships' },
        { text: 'Application Settings', link: '/docs/software/desktop/topics/settings' },
      ],
    },
  ],
  '/docs/core-concepts/': [
    {
      text: 'Core Concepts',
      items: [
        { text: 'Overview', link: '/docs/core-concepts/' },
        { text: 'Why Concept System?', link: '/docs/core-concepts/intro-to-concept-systems' },
        { text: 'Concepts & Terms', link: '/docs/core-concepts/concepts-and-terms' },
        { text: 'Concept System as a Register', link: '/docs/core-concepts/registers' },
      ],
    },
  ],
  '/docs/adopt/': [
    {
      text: 'Adopting Glossarist',
      items: [
        { text: 'Overview', link: '/docs/adopt/' },
        { text: '1. Concept Management Principles', link: '/docs/adopt/1-workflows/' },
        { text: '2. Infrastructure Setup', link: '/docs/adopt/2-infrastructure/' },
        { text: '3. Migrating Existing Data', link: '/docs/adopt/3-migration/' },
      ],
    },
  ],
}

export function sidebarFor(pathname: string): SidebarGroup[] {
  const match = Object.keys(sidebars)
    .filter(prefix => pathname.startsWith(prefix))
    .sort((a, b) => b.length - a.length)[0]
  return match ? sidebars[match] : []
}
