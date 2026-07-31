/**
 * i18n string registry for the Glossarist chrome.
 *
 * Scope: this covers the homepage hero, the major CTAs, and the
 * language switcher itself. Other pages (model/, reference/, docs/,
 * blog/) stay English-only — full content localization is a
 * separate effort.
 *
 * Locale codes follow BCP 47 + ISO 639-1 + ISO 15924 conventions:
 *   eng   — English (default; also "en" web code)
 *   fra   — French ("fr")
 *   zho-Hans — Simplified Chinese ("zh-Hans", mainland China + Singapore)
 *   zho-Hant — Traditional Chinese ("zh-Hant", Taiwan + HK + Macao)
 *
 * Glossarist itself uses ISO 639-3 (eng/fra/zho) for localizations
 * on ManagedConcept; the chrome uses BCP 47 for the language switcher
 * because that's what browsers and hreflang tags expect.
 *
 * Keys are union-typed so call sites get compile-time safety:
 *   translations[current.value][KEY_HERO_LEDE]  ← key must be TranslationKey
 */

export type Locale = 'eng' | 'fra' | 'zho-Hans' | 'zho-Hant'

export const LOCALES: { code: Locale; label: string; nativeLabel: string; flag: string }[] = [
  { code: 'eng',      label: 'English',            nativeLabel: 'English',  flag: '🇬🇧' },
  { code: 'fra',      label: 'French',             nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'zho-Hans', label: 'Chinese (Simplified)', nativeLabel: '简体中文', flag: '🇨🇳' },
  { code: 'zho-Hant', label: 'Chinese (Traditional)', nativeLabel: '繁體中文', flag: '🇹🇼' },
]

export const DEFAULT_LOCALE: Locale = 'eng'

/**
 * Exhaustive key union for chrome strings.
 *
 * Adding a key = adding to this union. TypeScript then forces every
 * locale's TranslationSet to implement it. Catches drift at compile
 * time, not at runtime test.
 */
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

export const translations: Record<Locale, TranslationSet> = {
  eng: {
    hero_eyebrow: 'Open-source terminology infrastructure',
    hero_title_1: 'Concept systems for the',
    hero_title_2_em: 'multi-language world',
    hero_lede:
      'Glossarist is open-source software for maintaining concept systems across many languages. Built on ISO 704, ISO 10241-1, and ISO 12620 — and proven at ISO, OIML, and IUPAC scale.',
    hero_cta_primary: 'Concept Model',
    hero_cta_secondary: 'Read Use Cases',
    section_01_label: '01',
    section_01_title_pre: 'A unified model for',
    section_01_title_em: 'terminology work',
    section_01_title_post: '.',
    section_01_lede:
      'Glossarist implements ISO 704:2022 concept systems, ISO 10241-1 terminological entries, and ISO 12620 data categories — one model across every standards body.',
    section_05_label: '05',
    section_05_title_pre: 'Trusted by',
    section_05_title_em: 'standards bodies',
    section_05_title_post: '.',
    section_05_lede_prefix: 'Glossarist powers multilingual terminology registries for international standards organizations. ',
    section_05_lede_link: 'Read the use cases',
    cta_title_pre: 'Start building your',
    cta_title_em: 'concept system',
    cta_title_post: '.',
    language_switcher_label: 'Language',
    language_switcher_help: 'Switch the homepage chrome — content pages stay in English for now.',
  },

  fra: {
    hero_eyebrow: 'Infrastructure terminologique open source',
    hero_title_1: 'Des systèmes de concepts pour le',
    hero_title_2_em: 'monde multilingue',
    hero_lede:
      'Glossarist est un logiciel open source pour maintenir des systèmes de concepts dans de nombreuses langues. Construit sur ISO 704, ISO 10241-1 et ISO 12620 — éprouvé à l\'échelle de l\'ISO, de l\'OIML et de l\'IUPAC.',
    hero_cta_primary: 'Modèle de concepts',
    hero_cta_secondary: 'Cas d\'usage',
    section_01_label: '01',
    section_01_title_pre: 'Un modèle unifié pour le',
    section_01_title_em: 'travail terminologique',
    section_01_title_post: '.',
    section_01_lede:
      'Glossarist implémente les systèmes de concepts ISO 704:2022, les entrées terminologiques ISO 10241-1 et les catégories de données ISO 12620 — un seul modèle pour tous les organismes de normalisation.',
    section_05_label: '05',
    section_05_title_pre: 'Approuvé par les',
    section_05_title_em: 'organismes de normalisation',
    section_05_title_post: '.',
    section_05_lede_prefix: 'Glossarist alimente les registres terminologiques multilingues des organismes internationaux de normalisation. ',
    section_05_lede_link: 'Lire les cas d\'usage',
    cta_title_pre: 'Commencez à construire votre',
    cta_title_em: 'système de concepts',
    cta_title_post: '.',
    language_switcher_label: 'Langue',
    language_switcher_help: 'Changez la langue de l\'interface d\'accueil — les pages de contenu restent en anglais pour l\'instant.',
  },

  'zho-Hans': {
    hero_eyebrow: '开源术语基础设施',
    hero_title_1: '为',
    hero_title_2_em: '多语言世界',
    hero_lede:
      'Glossarist 是一款开源软件，用于跨多种语言维护概念系统。基于 ISO 704、ISO 10241-1 和 ISO 12620 构建 —— 已在 ISO、OIML 和 IUPAC 规模上验证。',
    hero_cta_primary: '概念模型',
    hero_cta_secondary: '查看用例',
    section_01_label: '01',
    section_01_title_pre: '统一的',
    section_01_title_em: '术语工作',
    section_01_title_post: '模型。',
    section_01_lede:
      'Glossarist 实现 ISO 704:2022 概念系统、ISO 10241-1 术语条目和 ISO 12620 数据类别 —— 一个模型适用于所有标准化机构。',
    section_05_label: '05',
    section_05_title_pre: '受',
    section_05_title_em: '标准化机构',
    section_05_title_post: '信赖。',
    section_05_lede_prefix: 'Glossarist 为国际标准化组织维护多语言术语注册表。 ',
    section_05_lede_link: '查看用例',
    cta_title_pre: '开始构建您的',
    cta_title_em: '概念系统',
    cta_title_post: '。',
    language_switcher_label: '语言',
    language_switcher_help: '切换首页界面语言 —— 内容页面暂时保持英文。',
  },

  'zho-Hant': {
    hero_eyebrow: '開源術語基礎設施',
    hero_title_1: '為',
    hero_title_2_em: '多語言世界',
    hero_lede:
      'Glossarist 是一款開源軟體，用於跨多種語言維護概念系統。基於 ISO 704、ISO 10241-1 和 ISO 12620 建置 —— 已在 ISO、OIML 和 IUPAC 規模上驗證。',
    hero_cta_primary: '概念模型',
    hero_cta_secondary: '檢視使用案例',
    section_01_label: '01',
    section_01_title_pre: '統一的',
    section_01_title_em: '術語工作',
    section_01_title_post: '模型。',
    section_01_lede:
      'Glossarist 實作 ISO 704:2022 概念系統、ISO 10241-1 術語條目和 ISO 12620 資料類別 —— 一個模型適用於所有標準化機構。',
    section_05_label: '05',
    section_05_title_pre: '受',
    section_05_title_em: '標準化機構',
    section_05_title_post: '信賴。',
    section_05_lede_prefix: 'Glossarist 為國際標準化組織維護多語言術語註冊表。 ',
    section_05_lede_link: '檢視使用案例',
    cta_title_pre: '開始建置您的',
    cta_title_em: '概念系統',
    cta_title_post: '。',
    language_switcher_label: '語言',
    language_switcher_help: '切換首頁介面語言 —— 內容頁面暫時保持英文。',
  },
}
