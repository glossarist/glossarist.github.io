import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LogoMerge from '../../.vitepress/theme/components/LogoMerge.vue'

describe('LogoMerge', () => {
  it('mounts without errors', () => {
    const wrapper = mount(LogoMerge)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders an SVG root', () => {
    const wrapper = mount(LogoMerge)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders three <image> elements for the logos', () => {
    const wrapper = mount(LogoMerge)
    const images = wrapper.findAll('image')
    expect(images.length).toBeGreaterThanOrEqual(3)
  })

  it('labels both cultural roots', () => {
    const wrapper = mount(LogoMerge)
    const text = wrapper.text()
    expect(text).toContain('文')
    expect(text).toContain('ΓΛ')
    expect(text).toContain('Pattern · Culture · Writing')
    expect(text).toContain('γλωσσάριον')
  })

  it('declares the ONE MARK concept in the center', () => {
    const wrapper = mount(LogoMerge)
    expect(wrapper.text()).toContain('ONE MARK')
  })

  it('defines gradient and marker defs for both arrows', () => {
    const wrapper = mount(LogoMerge)
    const html = wrapper.html()
    expect(html).toMatch(/linearGradient id="ml"/)
    expect(html).toMatch(/linearGradient id="mr"/)
    expect(html).toMatch(/marker id="ah-l"/)
    expect(html).toMatch(/marker id="ah-r"/)
  })
})
