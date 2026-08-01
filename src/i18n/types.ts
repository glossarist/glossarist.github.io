/**
 * i18n type definitions — extracted from translations.ts for separation
 * of concerns. Allows other modules to import types without pulling the
 * full translation data (which is ~4KB of strings).
 */

export type Locale = 'eng' | 'fra' | 'zho-Hans' | 'zho-Hant'

export interface LocaleMeta {
  code: Locale
  label: string
  nativeLabel: string
  flag: string
}

export type TranslationKey =
  | 'hero_eyebrow'
  | 'hero_title_1'
  | 'hero_title_2_em'
  | 'hero_lede'
  | 'hero_cta_primary'
  | 'hero_cta_secondary'
  | 'section_01_label'
  | 'section_01_title_pre'
  | 'section_01_title_em'
  | 'section_01_title_post'
  | 'section_01_lede'
  | 'section_05_label'
  | 'section_05_title_pre'
  | 'section_05_title_em'
  | 'section_05_title_post'
  | 'section_05_lede_prefix'
  | 'section_05_lede_link'
  | 'cta_title_pre'
  | 'cta_title_em'
  | 'cta_title_post'
  | 'language_switcher_label'
  | 'language_switcher_help'

export type TranslationSet = Record<TranslationKey, string>
