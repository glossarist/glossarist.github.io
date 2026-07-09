import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { ref } from 'vue'

const mockFrontmatter = ref<Record<string, unknown>>({})
const mockPage = ref<{ lastUpdated?: number }>({ lastUpdated: undefined })

vi.mock('vitepress', () => ({
  useData: () => ({ frontmatter: mockFrontmatter, page: mockPage }),
}))

import BlogByline from '../../.vitepress/theme/components/BlogByline.vue'

describe('BlogByline', () => {
  beforeEach(() => {
    mockFrontmatter.value = {}
    mockPage.value = { lastUpdated: undefined }
  })

  function mountByline(overrides: { authors?: string[]; date?: string; lastUpdated?: number } = {}): VueWrapper {
    if (overrides.authors !== undefined) mockFrontmatter.value.authors = overrides.authors
    else delete mockFrontmatter.value.authors
    if (overrides.date !== undefined) mockFrontmatter.value.date = overrides.date
    else delete mockFrontmatter.value.date
    if (overrides.lastUpdated !== undefined) mockPage.value.lastUpdated = overrides.lastUpdated
    return mount(BlogByline)
  }

  it('renders authors joined with "&"', () => {
    const wrapper = mountByline({ authors: ['Alice', 'Bob'], date: '2026-07-05' })
    expect(wrapper.text()).toContain('Alice & Bob')
  })

  it('renders the date as a <time> element with datetime attribute', () => {
    const wrapper = mountByline({ authors: ['Alice'], date: '2026-07-05' })
    const time = wrapper.find('time')
    expect(time.exists()).toBe(true)
    expect(time.attributes('datetime')).toBe('2026-07-05')
  })

  it('hides byline entirely when no authors and no date', () => {
    const wrapper = mountByline()
    expect(wrapper.find('.blog-byline').exists()).toBe(false)
  })

  it('shows last-updated line when lastUpdated is set', () => {
    const wrapper = mountByline({ authors: ['Alice'], date: '2026-07-05', lastUpdated: Date.UTC(2026, 6, 6) })
    expect(wrapper.text()).toContain('Updated')
  })

  it('omits last-updated line when lastUpdated is undefined', () => {
    const wrapper = mountByline({ authors: ['Alice'], date: '2026-07-05' })
    expect(wrapper.text()).not.toContain('Updated')
  })

  it('renders single-author bylines without "&"', () => {
    const wrapper = mountByline({ authors: ['Ribose'], date: '2026-07-05' })
    expect(wrapper.text()).toContain('Ribose')
    expect(wrapper.text()).not.toMatch(/Ribose &/)
  })

  it('renders three authors with Oxford-comma style', () => {
    const wrapper = mountByline({ authors: ['A', 'B', 'C'], date: '2026-07-05' })
    expect(wrapper.text()).toContain('A, B & C')
  })

  it('renders date without authors', () => {
    const wrapper = mountByline({ date: '2026-07-05' })
    expect(wrapper.find('time').exists()).toBe(true)
    expect(wrapper.find('.author-info').exists()).toBe(false)
  })
})
