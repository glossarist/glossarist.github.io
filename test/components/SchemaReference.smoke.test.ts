import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('../../src/data/useOntologyData', () => ({
  useOntologyData: () => ({
    schema: ref({
      ontology: { iri: 'g', label: 'Glossarist' },
      classes: { 'gloss:Concept': { compact: 'gloss:Concept', label: 'Concept', comment: '', subClassOf: null, children: [] } },
      properties: {},
      shapes: {},
      stats: { classCount: 1, objectPropertyCount: 0, datatypePropertyCount: 0, shapeCount: 0, annotationPropertyCount: 0 },
    }),
    taxonomies: ref({}),
    loaded: ref(true),
  }),
}))

import SchemaReference from '../../src/components/SchemaReference.vue'

describe('SchemaReference (smoke)', () => {
  it('mounts without errors', async () => {
    const wrapper = mount(SchemaReference, { props: {} })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a root container element', async () => {
    const wrapper = mount(SchemaReference, { props: {} })
    await flushPromises()
    expect(wrapper.element.children.length).toBeGreaterThan(0)
  })
})
