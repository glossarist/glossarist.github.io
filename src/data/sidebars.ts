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
  '/docs/desktop/': [
    {
      text: 'Desktop Application',
      items: [
        { text: 'Getting Started', link: '/docs/desktop/' },
        { text: 'Installation', link: '/docs/desktop/getting-started/installation' },
        { text: 'First Launch', link: '/docs/desktop/getting-started/initial-setup' },
      ],
    },
    {
      text: 'Tutorials',
      items: [
        { text: 'Making a Change', link: '/docs/desktop/tutorials/create-change-request' },
        { text: 'Reviewing a Change', link: '/docs/desktop/tutorials/review-change-request' },
        { text: 'Linking Concepts', link: '/docs/desktop/tutorials/linking-concepts' },
      ],
    },
    {
      text: 'Interface Reference',
      items: [
        { text: 'Modules', link: '/docs/desktop/ui/modules/' },
        { text: 'Panels', link: '/docs/desktop/ui/panels/' },
        { text: 'Widgets', link: '/docs/desktop/ui/widgets/' },
      ],
    },
    {
      text: 'Topics',
      items: [
        { text: 'Synchronization', link: '/docs/desktop/topics/synchronization' },
        { text: 'Concept Relationships', link: '/docs/desktop/topics/concept-relationships' },
        { text: 'Application Settings', link: '/docs/desktop/topics/settings' },
      ],
    },
  ],
  '/docs/model/': [
    {
      text: 'Concept Model',
      items: [
        { text: 'Overview', link: '/docs/model/' },
        { text: 'Concepts', link: '/docs/model/concepts' },
        { text: 'Designations', link: '/docs/model/designations' },
        { text: 'Relationships', link: '/docs/model/relationships' },
        { text: 'Sources', link: '/docs/model/sources' },
        { text: 'Datasets & Sections', link: '/docs/model/datasets' },
        { text: 'Non-verbal Entities', link: '/docs/model/non-verbal' },
        { text: 'Term Types', link: '/docs/model/term-types' },
      ],
    },
    {
      text: 'Schemas & Standards',
      items: [
        { text: 'YAML Schemas', link: '/docs/model/schemas/' },
        { text: 'Standards', link: '/docs/standards' },
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
  '/docs/software/': [
    {
      text: 'Software',
      items: [
        { text: 'Overview', link: '/docs/software/' },
        { text: 'glossarist-ruby', link: '/docs/software/glossarist-ruby' },
        { text: 'glossarist-js', link: '/docs/software/glossarist-js' },
        { text: 'Concept Browser', link: '/docs/software/concept-browser' },
        { text: 'Desktop App', link: '/docs/software/desktop' },
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
