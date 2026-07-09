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

import HomePage from '../../src/components/HomePage.vue'

describe('HomePage (smoke)', () => {
  it('mounts without errors', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders a root container element', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.element.children.length).toBeGreaterThan(0)
  })

  it('renders Glossarist branding somewhere', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.text()).toMatch(/glossarist/i)
  })
})
