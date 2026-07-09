import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('vitepress', () => ({
  useData: () => ({
    frontmatter: ref({}),
    page: ref({}),
    site: ref({ theme: {} }),
    theme: ref({}),
  }),
  withBase: (path: string) => path,
}))

vi.mock('../../src/data/useOntologyData', () => ({
  useOntologyData: () => ({
    schema: ref({
      ontology: { iri: 'g', label: 'Glossarist' },
      classes: {},
      properties: {},
      shapes: {},
      stats: { classCount: 0, objectPropertyCount: 0, datatypePropertyCount: 0, shapeCount: 0, annotationPropertyCount: 0 },
    }),
    taxonomies: ref({}),
    loaded: ref(true),
  }),
}))

import YamlSchemas from '../../src/components/YamlSchemas.vue'

describe('YamlSchemas (smoke)', () => {
  it('mounts without errors', async () => {
    const wrapper = mount(YamlSchemas, { props: {} })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a root container element', async () => {
    const wrapper = mount(YamlSchemas, { props: {} })
    await flushPromises()
    expect(wrapper.element.children.length).toBeGreaterThan(0)
  })
})
