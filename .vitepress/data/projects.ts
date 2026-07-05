export interface Project {
  name: string
  slug: string
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
    slug: 'glossarist-ruby',
    version: 'v2.9.1',
    description: 'Ruby gem implementing the Glossarist concept model. Read, write, validate, and manage terminology concepts with multi-language YAML serialization, GCR packages, dataset-aware sections, non-verbal entities, and TBX/SKOS/Turtle export with SHACL validation.',
    github: 'https://github.com/glossarist/glossarist-ruby',
    featured: true,
    category: 'Core'
  },
  {
    name: 'glossarist-js',
    slug: 'glossarist-js',
    version: 'v0.4.5',
    description: 'JavaScript SDK for Glossarist GCR packages. Read, write, validate, and manage terminology concepts with bidirectional YAML serialization, cross-reference resolution, RDF serializers (Turtle/N-Triples/JSON-LD), and SHACL validation.',
    github: 'https://github.com/glossarist/glossarist-js',
    featured: true,
    category: 'Core'
  },
  {
    name: 'glossarist-desktop',
    slug: 'desktop',
    version: 'v1.6.14',
    description: 'Desktop viewer and editor for concept registries. Manage concepts, propose changes, and review change requests from a native app on Windows, macOS, and Linux.',
    github: 'https://github.com/glossarist/glossarist-desktop',
    featured: true,
    category: 'Core'
  },
  {
    name: 'concept-browser',
    slug: 'concept-browser',
    version: 'v0.7.58',
    description: 'Interactive browser for terminology datasets. Multi-dataset, multilingual concept browsing with 3D relation sphere, edition series, dataset groups, sections tree, math rendering, and per-concept RDF/SHACL outputs.',
    github: 'https://github.com/glossarist/concept-browser',
    featured: true,
    category: 'Core'
  },
]

export const premierProjects = projects.filter(p => p.featured)

export const softwareNavItems = [...projects]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(p => ({
    text: p.name,
    link: p.docs || `/docs/software/${p.slug}`
  }))
