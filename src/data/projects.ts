export interface Project {
  name: string
  slug: string
  // Offline fallback only — scripts/generate-project-versions.mjs
  // overwrites this with the latest GitHub release at build time
  // (src/data/project-versions.json). Never update by hand for release
  // display; bump here only when a release lands and you need the
  // fallback to be accurate.
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
    version: 'v2.14.16',
    description: 'Ruby gem implementing the Glossarist concept model. Read, write, validate, and manage terminology concepts with multi-language YAML serialization, GCR packages, dataset-aware sections, non-verbal entities, and TBX/SKOS/Turtle export with SHACL validation.',
    github: 'https://github.com/glossarist/glossarist-ruby',
    featured: true,
    category: 'Core'
  },
  {
    name: 'glossarist-js',
    slug: 'glossarist-js',
    version: 'v0.4.65',
    description: 'JavaScript SDK for Glossarist GCR packages. Read, write, validate, and manage terminology concepts with bidirectional YAML serialization, cross-reference resolution, RDF emitters for concepts/datasets/groups/vocabularies/bibliographies/provenance, and SHACL validation.',
    github: 'https://github.com/glossarist/glossarist-js',
    featured: true,
    category: 'Core'
  },
  {
    name: 'glossarist-desktop',
    slug: 'desktop',
    version: 'v1.6.40',
    description: 'Desktop viewer and editor for concept registries. Manage concepts, propose changes, and review change requests from a native app on Windows, macOS, and Linux.',
    github: 'https://github.com/glossarist/glossarist-desktop',
    featured: true,
    category: 'Core'
  },
  {
    name: 'concept-browser',
    slug: 'concept-browser',
    version: 'v0.7.141',
    description: 'Interactive browser for terminology datasets. Multi-dataset, multilingual concept browsing with 3D relation sphere, edition series, dataset groups, sections tree, math rendering, and per-concept RDF/SHACL outputs.',
    github: 'https://github.com/glossarist/concept-browser',
    featured: true,
    category: 'Core'
  },
]

export const premierProjects = projects.filter(p => p.featured)

const displayNames: Record<string, string> = {
  'glossarist-ruby': 'Glossarist Ruby',
  'glossarist-js': 'Glossarist JS',
  'glossarist-desktop': 'Desktop App',
  'concept-browser': 'Concept Browser',
}

export const softwareNavItems = [...projects]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(p => ({
    text: displayNames[p.name] || p.name,
    link: p.docs || `/docs/software/${p.slug}`
  }))
