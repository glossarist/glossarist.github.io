import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('vitepress', () => ({
  useData: () => ({
    frontmatter: ref({}),
    page: ref({}),
    site: ref({ theme: {} }),
    theme: ref({}),
  }),
}))

import ModelLanding from '../../src/components/ModelLanding.vue'

describe('ModelLanding', () => {
  it('mounts without errors', () => {
    const wrapper = mount(ModelLanding)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders some content', () => {
    const wrapper = mount(ModelLanding)
    expect(wrapper.text().length).toBeGreaterThan(0)
  })

  it('renders at least one link to /docs/model/', () => {
    const wrapper = mount(ModelLanding, { attachTo: document.body })
    const links = wrapper.findAll('a')
    const modelLinks = links.filter(a => (a.attributes('href') || '').startsWith('/docs/model'))
    expect(modelLinks.length).toBeGreaterThan(0)
  })
})
