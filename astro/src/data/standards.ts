export interface Standard {
  id: string
  code: string
  shortTitle: string
  description: string
  url: string
  category: 'iso' | 'w3c'
}

export const standards: Standard[] = [
  {
    id: 'iso-10241-1',
    code: 'ISO 10241-1',
    shortTitle: 'Terminology Entries',
    description: 'Structured terminology entries in standardized vocabularies',
    url: 'https://www.iso.org/standard/40362.html',
    category: 'iso',
  },
  {
    id: 'iso-704',
    code: 'ISO 704',
    shortTitle: 'Principles & Methods',
    description: 'Concept systems, definitions, and term formation rules',
    url: 'https://www.iso.org/standard/79077.html',
    category: 'iso',
  },
  {
    id: 'iso-30042',
    code: 'ISO 30042',
    shortTitle: 'TBX Format',
    description: 'Terminology markup framework for data exchange',
    url: 'https://www.iso.org/standard/62510.html',
    category: 'iso',
  },
  {
    id: 'iso-12620',
    code: 'ISO 12620',
    shortTitle: 'Data Categories',
    description: 'Term type classifications and data category registry',
    url: 'https://www.iso.org/standard/69550.html',
    category: 'iso',
  },
  {
    id: 'iso-25964',
    code: 'ISO 25964',
    shortTitle: 'Thesauri',
    description: 'Hierarchical and mapping relationships for thesaurus interoperability',
    url: 'https://www.iso.org/standard/53657.html',
    category: 'iso',
  },
  {
    id: 'owl2',
    code: 'OWL 2',
    shortTitle: 'Semantic Web',
    description: 'Formal ontology vocabulary for linked data and knowledge graphs',
    url: 'https://www.w3.org/TR/owl2-overview/',
    category: 'w3c',
  },
  {
    id: 'shacl',
    code: 'SHACL',
    shortTitle: 'Validation',
    description: 'Shape Constraints for data validation and integrity',
    url: 'https://www.w3.org/TR/shacl/',
    category: 'w3c',
  },
  {
    id: 'skos-xl',
    code: 'SKOS/XL',
    shortTitle: 'Linked Data',
    description: 'Knowledge organization and reified labels for the semantic web',
    url: 'https://www.w3.org/TR/skos-reference/',
    category: 'w3c',
  },
]
