import { defineConfig } from 'vitepress'
import { softwareNavItems } from './data/projects'

export default defineConfig({
  title: 'Glossarist',
  description: 'Open-source software for maintaining multi-language concept systems',
  lang: 'en-US',
  lastUpdated: true,

  srcExclude: ['TODO.website/**', 'TODO.refactor/**', 'TODO.cleanup/**', 'TODO.infoarch/**', 'concept-model/**', 'CLAUDE.md', 'README.md', 'LICENSE', 'scripts/**'],

  sitemap: {
    hostname: 'https://www.glossarist.org'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#2d4164' }],
  ],

  themeConfig: {
    logo: '/logo-glossarist.svg',
    siteTitle: 'Glossarist',

    nav: [
      {
        text: 'Model',
        items: [
          { text: 'Overview', link: '/docs/model/' },
          { text: 'Concepts', link: '/docs/model/concepts' },
          { text: 'Designations', link: '/docs/model/designations' },
          { text: 'Relationships', link: '/docs/model/relationships' },
          { text: 'Sources', link: '/docs/model/sources' },
          { text: 'Term Types', link: '/docs/model/term-types' },
          { text: 'YAML Schema Reference', link: '/docs/model/schemas/yaml-reference' },
          { text: 'Entity Field Reference', link: '/docs/model/schemas/entity-fields' },
          { text: 'Ontology Browser', link: '/docs/model/ontology' },
        ]
      },
      { text: 'Software', items: softwareNavItems },
      {
        text: 'Docs',
        items: [
          { text: 'Desktop App', link: '/docs/desktop/' },
          { text: 'Core Concepts', link: '/docs/core-concepts/' },
          { text: 'Adopt Glossarist', link: '/docs/adopt/' },
          { text: 'Standards', link: '/docs/standards' },
        ]
      },
      { text: 'Blog', link: '/blog/' },
      { text: 'About', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/glossarist' }
    ],

    footer: {
      message: 'An open source project of <a href="https://www.ribose.com">Ribose</a>',
      copyright: 'Copyright © 2026 Ribose'
    },

    sidebar: {
      '/docs/desktop/': [
        {
          text: 'Desktop Application',
          items: [
            { text: 'Getting Started', link: '/docs/desktop/' },
            { text: 'Installation', link: '/docs/desktop/getting-started/installation' },
            { text: 'First Launch', link: '/docs/desktop/getting-started/initial-setup' },
          ]
        },
        {
          text: 'Tutorials',
          items: [
            { text: 'Making a Change', link: '/docs/desktop/tutorials/create-change-request' },
            { text: 'Reviewing a Change', link: '/docs/desktop/tutorials/review-change-request' },
            { text: 'Linking Concepts', link: '/docs/desktop/tutorials/linking-concepts' },
          ]
        },
        {
          text: 'Interface Reference',
          items: [
            { text: 'Modules', link: '/docs/desktop/ui/modules/' },
            { text: 'Panels', link: '/docs/desktop/ui/panels/' },
            { text: 'Widgets', link: '/docs/desktop/ui/widgets/' },
          ]
        },
        {
          text: 'Topics',
          items: [
            { text: 'Synchronization', link: '/docs/desktop/topics/synchronization' },
            { text: 'Concept Relationships', link: '/docs/desktop/topics/concept-relationships' },
            { text: 'Application Settings', link: '/docs/desktop/topics/settings' },
          ]
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
            { text: 'Term Types', link: '/docs/model/term-types' },
          ]
        },
        {
          text: 'Schema Reference',
          items: [
            { text: 'YAML Schemas', link: '/docs/model/schemas/' },
            { text: 'YAML Schema Browser', link: '/docs/model/schemas/yaml-reference' },
            { text: 'Entity Field Reference', link: '/docs/model/schemas/entity-fields' },
            { text: 'Ontology Browser', link: '/docs/model/ontology' },
          ]
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
          ]
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
          ]
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
          ]
        },
      ],
    },

    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3]
    }
  }
})
