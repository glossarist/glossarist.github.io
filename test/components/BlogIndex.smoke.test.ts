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
  withBase: (path: string) => path,
  createContentLoader: () => ref([]),
}))

import BlogIndex from '../../.vitepress/theme/components/BlogIndex.vue'

describe('BlogIndex (smoke)', () => {
  it('mounts without errors', () => {
    const wrapper = mount(BlogIndex)
    expect(wrapper.exists()).toBe(true)
  })

  it('mounts without crashing on empty content loader', () => {
    const wrapper = mount(BlogIndex)
    expect(wrapper.html()).toBeDefined()
  })
})
