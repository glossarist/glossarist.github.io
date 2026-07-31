/**
 * i18n store — a singleton Vue reactive ref that any component can
 * import. Reads the initial locale from localStorage (falling back
 * to browser language, then English default), and writes back to
 * localStorage on every change so the choice persists.
 *
 * Scope: this store drives the homepage chrome (hero, CTAs, language
 * switcher). It does NOT translate content pages — those remain
 * English-only. See src/i18n/translations.ts for rationale.
 */
import { ref, computed } from 'vue'
import { DEFAULT_LOCALE, LOCALES, translations } from './translations'
import type { Locale } from './translations'

const STORAGE_KEY = 'glossarist-locale'

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  // 1. Stored preference wins
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && isLocale(stored)) return stored

  // 2. Browser language hint
  const nav = window.navigator.language?.toLowerCase() ?? ''
  if (nav.startsWith('zh')) {
    // zh-TW, zh-HK, zh-Hant → Traditional; zh-CN, zh-Hans, zh-* → Simplified
    if (nav.includes('tw') || nav.includes('hk') || nav.includes('hant')) {
      return 'zho-Hant'
    }
    return 'zho-Hans'
  }
  if (nav.startsWith('fr')) return 'fra'

  return DEFAULT_LOCALE
}

function isLocale(value: string): value is Locale {
  return LOCALES.some(l => l.code === value)
}

const current = ref<Locale>(detectInitialLocale())

export function useI18n() {
  function setLocale(locale: Locale) {
    current.value = locale
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, locale)
      // Reflect the choice in <html lang="..."> so screen readers + search
      // engines see the active locale on the homepage.
      document.documentElement.lang = toBcp47(locale)
    }
  }

  const t = computed(() => translations[current.value])

  return { current, setLocale, t, locales: LOCALES }
}

/** Map our internal locale codes to BCP 47 / HTML lang attribute values. */
export function toBcp47(locale: Locale): string {
  switch (locale) {
    case 'eng': return 'en'
    case 'fra': return 'fr'
    case 'zho-Hans': return 'zh-Hans'
    case 'zho-Hant': return 'zh-Hant'
  }
}
