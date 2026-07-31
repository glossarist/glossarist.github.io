import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HyperedgePlayground from '../../src/components/HyperedgePlayground.vue'

describe('HyperedgePlayground', () => {
  // Smoke tests: ensures the component mounts and the three presets
  // produce valid YAML that renders without crashing.
  it('mounts with the partitive preset loaded', () => {
    const wrapper = mount(HyperedgePlayground)
    expect(wrapper.find('.hp-root').exists()).toBe(true)
    expect(wrapper.find('.hp-textarea').exists()).toBe(true)
    const textarea = wrapper.find('.hp-textarea').element as HTMLTextAreaElement
    expect(textarea.value).toContain('partitive_relation')
    expect(textarea.value).toContain('112-02-09')
  })

  it('renders three preset buttons', () => {
    const wrapper = mount(HyperedgePlayground)
    const buttons = wrapper.findAll('.hp-preset-btn')
    expect(buttons.length).toBe(3)
    expect(buttons[0].text()).toMatch(/Partitive/)
    expect(buttons[1].text()).toMatch(/Generic/)
    expect(buttons[2].text()).toMatch(/External/)
  })

  it('switches preset on click', async () => {
    const wrapper = mount(HyperedgePlayground)
    await wrapper.findAll('.hp-preset-btn')[1].trigger('click')
    const textarea = wrapper.find('.hp-textarea').element as HTMLTextAreaElement
    expect(textarea.value).toContain('generic_relation')
    expect(textarea.value).toContain('computer-mouse')
  })

  it('flags invalid YAML with an error', async () => {
    const wrapper = mount(HyperedgePlayground)
    await wrapper.find('.hp-textarea').setValue('not: valid\n  broken yaml ::')
    const issues = wrapper.findAll('.hp-issue')
    expect(issues.length).toBeGreaterThan(0)
    expect(wrapper.html()).toMatch(/YAML parse error/i)
  })

  it('flags missing delimitingCharacteristic for generic_relation', async () => {
    const wrapper = mount(HyperedgePlayground)
    await wrapper.find('.hp-textarea').setValue(`
type: generic_relation
comprehensive: { source: EXAMPLE, id: computer-mouse }
members:
  - ref: { source: EXAMPLE, id: a }
  - ref: { source: EXAMPLE, id: b }
completeness: complete
criterion: { eng: test }
`)
    expect(wrapper.html()).toMatch(/GenericMember requires delimitingCharacteristic/)
  })

  it('flags invalid MECE combo (optional + at_least_one)', async () => {
    const wrapper = mount(HyperedgePlayground)
    await wrapper.find('.hp-textarea').setValue(`
type: partitive_relation
comprehensive: { source: VIM, id: "1" }
members:
  - ref: { source: VIM, id: "2" }
    presence: optional
    count: at_least_one
  - ref: { source: VIM, id: "3" }
`)
    expect(wrapper.html()).toMatch(/invalid MECE combo/i)
  })

  it('validates a correct partitive hyperedge', async () => {
    const wrapper = mount(HyperedgePlayground)
    await wrapper.find('.hp-textarea').setValue(`
type: partitive_relation
comprehensive: { source: VIM, id: "1" }
members:
  - ref: { source: VIM, id: "2" }
  - ref: { source: VIM, id: "3" }
completeness: complete
`)
    expect(wrapper.html()).toMatch(/All structural checks pass/)
  })

  it('renders the rake SVG for a valid hyperedge', async () => {
    const wrapper = mount(HyperedgePlayground)
    // Default preset is partitive — should render SVG
    expect(wrapper.find('.hp-svg').exists()).toBe(true)
    // Should have 3 member boxes
    const memberBoxes = wrapper.findAll('.hp-svg rect').filter(r => r.classes('hp-box'))
    // 1 comprehensive + 3 members = 4 boxes
    expect(memberBoxes.length).toBe(4)
  })
})
