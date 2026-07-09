export interface ShaclConstraint {
  path: string | null
  datatype: string | null
  class: string | null
  valuesFrom: string | null
  nodeKind: string | null
  minCount: number | null
  maxCount: number | null
  in: string[] | null
}

export interface OwlClass {
  iri?: string
  compact: string
  label: string
  comment: string | null
  subClassOf: string | null
  disjointWith?: string | null
  children: string[]
  ancestors?: string[]
}

export interface OwlShape {
  iri?: string
  compact: string
  label: string
  comment?: string | null
  targetClass: string | null
  shapeClass?: string | null
  constraints: ShaclConstraint[]
}

export interface OwlProperty {
  iri: string
  compact: string
  label: string
  comment: string | null
  type: 'object' | 'datatype'
  domain: string | null
  domainUnion: string[] | null
  range: string | null
  rangeUnion: string[] | null
  inverseOf: string | null
}

export interface OwlOntology {
  iri: string
  label: string
  comment: string | null
  prefix: string | null
  namespaceUri: string | null
  imports: { iri: string; label: string }[]
  license: string | null
  created: string | null
}

export interface AnnotationProperty {
  iri: string
  compact: string
  label: string
}

export interface TaxonomyConcept {
  id: string
  iri?: string
  prefLabel: string
  altLabel?: string
  definition?: string
  broader?: string
}

export interface TaxonomyData {
  scheme: string
  schemeLabel: string
  schemeDefinition: string | null
  concepts: Record<string, TaxonomyConcept>
}

export interface OntologyStats {
  classCount: number
  objectPropertyCount: number
  datatypePropertyCount: number
  shapeCount: number
  annotationPropertyCount: number
}

export interface OntologySchema {
  ontology: OwlOntology
  ontologyIri: string
  ontologyLabel: string
  classes: Record<string, OwlClass>
  classHierarchyRoots?: string[]
  properties: Record<string, OwlProperty>
  propertiesByDomain?: Record<string, { object: string[]; datatype: string[] }>
  shapes: Record<string, OwlShape>
  shapesByTargetClass?: Record<string, string[]>
  annotationProperties?: AnnotationProperty[]
  stats: OntologyStats
}

export interface GitHubAsset {
  name: string
  browser_download_url: string
}

export interface GitHubRelease {
  name: string
  assets: GitHubAsset[]
  published_at: string
  body: string
}
