import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('../../src/data/useOntologyData', () => ({
  useOntologyData: () => ({
    schema: ref({
      ontology: {
        iri: 'https://www.glossarist.org/ontologies/glossarist',
        label: 'Glossarist',
        comment: '',
        prefix: 'gloss',
        namespaceUri: 'https://www.glossarist.org/ontologies/glossarist#',
        imports: [],
        license: null,
        created: null,
      },
      ontologyIri: 'https://www.glossarist.org/ontologies/glossarist',
      ontologyLabel: 'Glossarist',
      classes: {},
      properties: {},
      shapes: {},
      stats: { classCount: 0, objectPropertyCount: 0, datatypePropertyCount: 0, shapeCount: 0, annotationPropertyCount: 0 },
    }),
    taxonomies: ref({}),
    loaded: ref(true),
  }),
}))

import OntologyBrowser from '../../src/components/OntologyBrowser.vue'

describe('OntologyBrowser (smoke)', () => {
  it('mounts without errors', async () => {
    const wrapper = mount(OntologyBrowser, { props: {} })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a root container element', async () => {
    const wrapper = mount(OntologyBrowser, { props: {} })
    await flushPromises()
    expect(wrapper.element.children.length).toBeGreaterThan(0)
  })
})
