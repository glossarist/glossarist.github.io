# 03 - Migrate desktop documentation from YAML to Markdown

Convert the ~30 YAML+asciidoc desktop doc pages to VitePress Markdown.

## Source files (to convert)

```
docs/
├── desktop/
│   ├── index.yaml                    → docs/desktop/index.md
│   ├── getting-started/
│   │   ├── index.yaml                → docs/desktop/getting-started/index.md
│   │   ├── initial-setup.yaml        → docs/desktop/getting-started/initial-setup.md
│   │   ├── create-change-request.yaml → docs/desktop/getting-started/create-change-request.md
│   │   └── *.png                     → public/images/desktop/
│   ├── topics/
│   │   ├── index.yaml                → docs/desktop/topics/index.md
│   │   └── synchronization.yaml      → docs/desktop/topics/synchronization.md
│   └── ui/
│       ├── index.yaml                → docs/desktop/ui/index.md
│       ├── modules/                  → docs/desktop/ui/modules/*.md
│       ├── panels/                   → docs/desktop/ui/panels/*.md
│       └── widgets/                  → docs/desktop/ui/widgets/*.md
└── core-concepts/
    ├── index.yaml                    → docs/core-concepts/index.md
    └── intro-to-concept-systems.yaml → docs/core-concepts/intro-to-concept-systems.md
```

## Conversion rules

1. YAML `title` → Markdown `# Title` (H1)
2. YAML `summary` → paragraph below H1
3. YAML `contents` (asciidoc) → convert to Markdown:
   - `== Heading` → `## Heading`
   - `image::path[alt]` → `![alt](/images/desktop/path)`
   - `NOTE:` → `::: info` VitePress container
   - `link:/path[text]` → `[text](/path)`
4. YAML `importance` → frontmatter `order` for sorting
5. YAML `media` → images copied to `public/images/desktop/`
6. Keep the hierarchical navigation structure via sidebar config

## Sidebar config

```ts
sidebar: {
  '/docs/desktop/': [
    {
      text: 'Desktop Application',
      items: [
        { text: 'Getting Started', items: [
          { text: 'Initial Setup', link: '/docs/desktop/getting-started/initial-setup' },
          { text: 'Create Change Request', link: '/docs/desktop/getting-started/create-change-request' },
        ]},
        { text: 'UI Reference', items: [
          { text: 'Modules', link: '/docs/desktop/ui/modules/' },
          { text: 'Panels', link: '/docs/desktop/ui/panels/' },
          { text: 'Widgets', link: '/docs/desktop/ui/widgets/' },
        ]},
        { text: 'Topics', items: [
          { text: 'Synchronization', link: '/docs/desktop/topics/synchronization' },
        ]},
      ]
    }
  ]
}
```
