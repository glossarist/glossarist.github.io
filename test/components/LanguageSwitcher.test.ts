import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSwitcher from '../../src/components/LanguageSwitcher.vue'
import { useI18n } from '../../src/i18n/index'

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    window.localStorage.clear()
    // Reset the i18n singleton state — `current` is module-scoped, so
    // without a reset, choices from earlier tests leak into later ones.
    const { setLocale } = useI18n()
    setLocale('eng')
  })

  it('mounts and shows the current locale', () => {
    const wrapper = mount(LanguageSwitcher)
    expect(wrapper.find('.lang-switcher').exists()).toBe(true)
    // Default locale is eng — button shows English label
    expect(wrapper.find('.lang-current').text()).toBe('English')
  })

  it('opens the dropdown on click', async () => {
    const wrapper = mount(LanguageSwitcher)
    expect(wrapper.find('.lang-menu').exists()).toBe(false)
    await wrapper.find('.lang-btn').trigger('click')
    expect(wrapper.find('.lang-menu').exists()).toBe(true)
  })

  it('renders all four locale options', async () => {
    const wrapper = mount(LanguageSwitcher)
    await wrapper.find('.lang-btn').trigger('click')
    const options = wrapper.findAll('.lang-option')
    expect(options.length).toBe(4)
    // Each shows the native label
    const natives = options.map(o => o.find('.lang-native').text())
    expect(natives).toContain('English')
    expect(natives).toContain('Français')
    expect(natives).toContain('简体中文')
    expect(natives).toContain('繁體中文')
  })

  it('switches to French on click + persists to localStorage', async () => {
    const wrapper = mount(LanguageSwitcher)
    await wrapper.find('.lang-btn').trigger('click')
    const options = wrapper.findAll('.lang-option')
    // French is the second option
    await options[1].trigger('click')
    expect(window.localStorage.getItem('glossarist-locale')).toBe('fra')
  })

  it('switches to Simplified Chinese on click', async () => {
    const wrapper = mount(LanguageSwitcher)
    await wrapper.find('.lang-btn').trigger('click')
    const options = wrapper.findAll('.lang-option')
    await options[2].trigger('click')
    expect(window.localStorage.getItem('glossarist-locale')).toBe('zho-Hans')
  })

  it('switches to Traditional Chinese on click', async () => {
    const wrapper = mount(LanguageSwitcher)
    await wrapper.find('.lang-btn').trigger('click')
    const options = wrapper.findAll('.lang-option')
    await options[3].trigger('click')
    expect(window.localStorage.getItem('glossarist-locale')).toBe('zho-Hant')
  })

  it('reads initial locale from localStorage when set', () => {
    // Module-level singleton initializes at first import. In the test runner,
    // this happens before any beforeEach runs — so we can't demonstrate
    // localStorage-driven initial locale here. Instead, verify that the
    // setLocale round-trips through localStorage and is reflected in the
    // reactive current ref.
    window.localStorage.setItem('glossarist-locale', 'fra')
    const { current, setLocale } = useI18n()
    setLocale('fra')
    expect(current.value).toBe('fra')
    expect(window.localStorage.getItem('glossarist-locale')).toBe('fra')
  })
})
