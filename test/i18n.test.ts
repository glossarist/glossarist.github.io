import { describe, it, expect, beforeEach } from 'vitest'
import { useI18n } from '../src/i18n/index'
import { translations, LOCALES, type Locale } from '../src/i18n/translations'

describe('i18n translations', () => {
  it('every locale defines every key', () => {
    const reference = Object.keys(translations.eng).sort()
    for (const code of LOCALES.map(l => l.code)) {
      const keys = Object.keys(translations[code]).sort()
      expect(keys, `locale ${code} is missing keys`).toEqual(reference)
    }
  })

  it('translation values are non-empty strings', () => {
    for (const code of LOCALES.map(l => l.code)) {
      for (const [key, value] of Object.entries(translations[code])) {
        expect(typeof value, `${code}.${key} must be string`).toBe('string')
        expect(value.length, `${code}.${key} must be non-empty`).toBeGreaterThan(0)
      }
    }
  })

  it('Simplified and Traditional Chinese are actually different', () => {
    // Sanity check: the two Chinese variants shouldn't be character-identical
    // (would indicate copy-paste without conversion).
    const hans = translations['zho-Hans'].hero_lede
    const hant = translations['zho-Hant'].hero_lede
    expect(hans).not.toBe(hant)
  })

  it('LOCALES has exactly 4 entries', () => {
    expect(LOCALES.length).toBe(4)
    const codes = LOCALES.map(l => l.code)
    expect(codes).toEqual(['eng', 'fra', 'zho-Hans', 'zho-Hant'])
  })

  it('every LOCALE has a unique native label', () => {
    const natives = LOCALES.map(l => l.nativeLabel)
    expect(new Set(natives).size).toBe(natives.length)
  })
})

describe('useI18n store', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns the default locale when nothing is stored', () => {
    const { current, t } = useI18n()
    expect(current.value).toBe('eng')
    expect(t.value.hero_eyebrow).toBe(translations.eng.hero_eyebrow)
  })

  it('persists locale choice to localStorage', () => {
    const { setLocale } = useI18n()
    setLocale('fra' as Locale)
    expect(window.localStorage.getItem('glossarist-locale')).toBe('fra')
  })

  it('updates the reactive current ref after setLocale', () => {
    const { current, setLocale, t } = useI18n()
    setLocale('zho-Hans' as Locale)
    expect(current.value).toBe('zho-Hans')
    expect(t.value.hero_lede).toBe(translations['zho-Hans'].hero_lede)
  })
})
