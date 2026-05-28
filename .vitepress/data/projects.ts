export interface Project {
  name: string
  version: string
  description: string
  github: string
  docs?: string
  featured: boolean
  category: string
}

export const projects: Project[] = [
  {
    name: 'glossarist-ruby',
    version: 'v2.8.1',
    description: 'Ruby gem implementing the Glossarist concept model. Read, write, validate, and manage terminology concepts with multi-language YAML serialization, GCR packages, and TBX/SKOS/Turtle export.',
    github: 'https://github.com/glossarist/glossarist-ruby',
    featured: true,
    category: 'Core'
  },
  {
    name: 'glossarist-js',
    version: 'v0.2.1',
    description: 'JavaScript SDK for Glossarist GCR packages. Read, write, validate, and manage terminology concepts with bidirectional YAML serialization and cross-reference resolution.',
    github: 'https://github.com/glossarist/glossarist-js',
    featured: true,
    category: 'Core'
  },
  {
    name: 'glossarist-desktop',
    version: 'v1.6.14',
    description: 'Desktop viewer and editor for concept registries. Manage concepts, propose changes, and review change requests from a native app on Windows, macOS, and Linux.',
    github: 'https://github.com/glossarist/glossarist-desktop',
    featured: true,
    category: 'Core'
  },
  {
    name: 'concept-browser',
    version: '',
    description: 'Interactive browser for terminology datasets. Multi-dataset, multilingual concept browsing with history timeline, cross-reference graph, and math rendering.',
    github: 'https://github.com/glossarist/glossarist-vocabulary-browser',
    featured: true,
    category: 'Core'
  },
]

export const premierProjects = projects.filter(p => p.featured)

export const softwareNavItems = [...projects]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(p => ({
    text: p.name,
    link: p.docs || `/docs/software/${p.name === 'concept-browser' ? 'concept-browser' : p.name === 'glossarist-desktop' ? 'desktop' : p.name}`
  }))
