import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

const { useOntologyDataMock } = {
  useOntologyDataMock: vi.fn(() => ({
    schema: ref(null),
    taxonomies: ref({
      relationshipType: {
        scheme: 'relationship-type',
        schemeLabel: 'Relationship type',
        schemeDefinition: null,
        concepts: Object.fromEntries(
          ['broader', 'narrower', 'related', 'exact_match', 'equivalent'].map(id => [
            id,
            { id, prefLabel: id, definition: `${id} relationship` },
          ])
        ),
      },
    }),
    loaded: ref(true),
  })),
}

vi.mock('../../src/data/useOntologyData', () => ({
  useOntologyData: () => useOntologyDataMock(),
}))

import RelationshipTypes from '../../src/components/RelationshipTypes.vue'

describe('RelationshipTypes', () => {
  beforeEach(() => {
    useOntologyDataMock.mockClear()
  })

  it('mounts without errors', async () => {
    const wrapper = mount(RelationshipTypes)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a container element', async () => {
    const wrapper = mount(RelationshipTypes)
    await flushPromises()
    expect(wrapper.element.children.length).toBeGreaterThan(0)
  })

  it('renders without crashing even when taxonomies are empty', async () => {
    useOntologyDataMock.mockReturnValueOnce({
      schema: ref(null),
      taxonomies: ref({}),
      loaded: ref(true),
    })
    const wrapper = mount(RelationshipTypes)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
