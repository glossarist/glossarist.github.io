import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const mockSchema = {
  ontology: {
    iri: 'https://www.glossarist.org/ontologies/glossarist',
    label: 'Glossarist',
    comment: 'Test',
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
  stats: {
    classCount: 1,
    objectPropertyCount: 0,
    datatypePropertyCount: 0,
    shapeCount: 0,
    annotationPropertyCount: 0,
  },
}

const mockTaxonomies = {
  relationshipType: {
    scheme: 'http://www.glossarist.org/ontologies/taxonomy/relationship-type',
    schemeLabel: 'Relationship type',
    schemeDefinition: 'Test',
    concepts: {
      broader: { id: 'broader', prefLabel: 'broader' },
      narrower: { id: 'narrower', prefLabel: 'narrower' },
    },
  },
}

const fetchMock = vi.fn()

function withFetch(fn: () => Promise<void>) {
  return async () => {
    fetchMock.mockImplementation(async (url: string) => ({
      ok: true,
      json: async () => {
        if (url.endsWith('ontology-schema.json')) return mockSchema
        if (url.endsWith('taxonomies.json')) return mockTaxonomies
        throw new Error(`unexpected fetch ${url}`)
      },
    }))
    globalThis.fetch = fetchMock as unknown as typeof fetch
    await fn()
  }
}

describe('useOntologyData', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.resetModules()
  })

  afterEach(() => {
    delete (globalThis as { fetch?: typeof fetch }).fetch
  })

  it('exposes schema, taxonomies, and loaded ref', async () => {
    const runner = withFetch(async () => {
      const { useOntologyData } = await import('../.vitepress/data/useOntologyData')
      const Consumer = defineComponent({
        setup() {
          const state = useOntologyData()
          return () => h('div', { 'data-loaded': String(state.loaded.value) })
        },
      })
      const wrapper = await mount(Consumer)
      // Initially not loaded
      expect(wrapper.attributes('data-loaded')).toBe('false')
    })
    await runner()
  })

  it('fetches /data/ontology-schema.json and /data/taxonomies.json', async () => {
    const runner = withFetch(async () => {
      const { useOntologyData } = await import('../.vitepress/data/useOntologyData')
      const Consumer = defineComponent({
        setup() {
          const state = useOntologyData()
          return () => h('div', {
            'data-loaded': String(state.loaded.value),
            'data-class-count': String(state.schema.value?.stats.classCount ?? ''),
          })
        },
      })
      const wrapper = await mount(Consumer)
      // Wait for fetch + microtask flush
      await new Promise(r => setTimeout(r, 50))
      await wrapper.vm.$nextTick()
      expect(fetchMock).toHaveBeenCalledWith('/data/ontology-schema.json')
      expect(fetchMock).toHaveBeenCalledWith('/data/taxonomies.json')
    })
    await runner()
  })

  it('populates schema after fetch resolves', async () => {
    const runner = withFetch(async () => {
      const { useOntologyData } = await import('../.vitepress/data/useOntologyData')
      const Consumer = defineComponent({
        setup() {
          const state = useOntologyData()
          return () => h('div', {
            'data-loaded': String(state.loaded.value),
            'data-label': state.schema.value?.ontologyLabel ?? '',
          })
        },
      })
      const wrapper = await mount(Consumer)
      await new Promise(r => setTimeout(r, 50))
      await wrapper.vm.$nextTick()
      expect(wrapper.attributes('data-loaded')).toBe('true')
      expect(wrapper.attributes('data-label')).toBe('Glossarist')
    })
    await runner()
  })

  it('records error and clears pending when fetch rejects', async () => {
    fetchMock.mockImplementation(async () => {
      throw new Error('network down')
    })
    globalThis.fetch = fetchMock as unknown as typeof fetch
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { useOntologyData } = await import('../.vitepress/data/useOntologyData')
    const Consumer = defineComponent({
      setup() {
        const state = useOntologyData()
        return () => h('div', { 'data-loaded': String(state.loaded.value) })
      },
    })
    const wrapper = await mount(Consumer)
    await new Promise(r => setTimeout(r, 50))
    await wrapper.vm.$nextTick()
    expect(errSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load ontology data'), expect.any(Error))
    expect(wrapper.attributes('data-loaded')).toBe('false')
    errSpy.mockRestore()
  })
})
