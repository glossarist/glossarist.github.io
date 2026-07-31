import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ValidatorPlayground from '../../src/components/ValidatorPlayground.vue'

describe('ValidatorPlayground', () => {
  it('mounts with the minimal-valid preset loaded and reports clean', () => {
    const wrapper = mount(ValidatorPlayground)
    expect(wrapper.find('.vp-root').exists()).toBe(true)
    // Default preset should be valid → clean state
    expect(wrapper.find('.vp-clean').exists()).toBe(true)
  })

  it('renders five preset buttons', () => {
    const wrapper = mount(ValidatorPlayground)
    const buttons = wrapper.findAll('.vp-preset-btn')
    expect(buttons.length).toBe(5)
  })

  it('flags missing-definition preset with an ISO 10241-1 error', async () => {
    const wrapper = mount(ValidatorPlayground)
    await wrapper.findAll('.vp-preset-btn')[1].trigger('click')
    const html = wrapper.html()
    expect(html).toMatch(/missing definition/i)
    expect(html).toMatch(/ISO 10241-1 §6\.4/)
  })

  it('flags unknown related.type as error', async () => {
    const wrapper = mount(ValidatorPlayground)
    await wrapper.findAll('.vp-preset-btn')[2].trigger('click')
    const html = wrapper.html()
    expect(html).toMatch(/unknown type 'is_kind_of'/)
    expect(html).toMatch(/52-type enumeration/)
  })

  it('flags dangling ExternalConcept with a warning', async () => {
    const wrapper = mount(ValidatorPlayground)
    await wrapper.findAll('.vp-preset-btn')[3].trigger('click')
    const html = wrapper.html()
    expect(html).toMatch(/no provided_by edge/)
    expect(html).toMatch(/dangle/)
  })

  it('flags ExternalConcept carrying a definition as error', async () => {
    const wrapper = mount(ValidatorPlayground)
    await wrapper.findAll('.vp-preset-btn')[4].trigger('click')
    const html = wrapper.html()
    expect(html).toMatch(/ExternalConcept must not carry a definition/)
  })

  it('reports a YAML parse error for malformed input', async () => {
    const wrapper = mount(ValidatorPlayground)
    await wrapper.find('.vp-textarea').setValue('not: valid\n  broken: yaml: :')
    expect(wrapper.find('.vp-parse-error').exists()).toBe(true)
  })

  it('summary reflects error count correctly', async () => {
    const wrapper = mount(ValidatorPlayground)
    // missing-definition preset (1) should have at least 1 error
    await wrapper.findAll('.vp-preset-btn')[1].trigger('click')
    const errorNum = wrapper.find('.vp-num-error').text()
    expect(Number(errorNum)).toBeGreaterThanOrEqual(1)
  })

  it('all 7 rules appear in the rules list', () => {
    const wrapper = mount(ValidatorPlayground)
    const summary = wrapper.find('.vp-rules-list summary')
    expect(summary.text()).toMatch(/Active rules \(7\)/)
  })
})
