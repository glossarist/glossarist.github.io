<script setup lang="ts">
/**
 * LanguageSwitcher — small dropdown that mounts in the nav.
 *
 * Reads from the global i18n store (src/i18n/index.ts). Selecting a
 * locale writes to localStorage so the choice persists across page
 * loads and updates the homepage chrome reactively.
 */
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const { current, setLocale, locales, t } = useI18n()
const open = ref(false)

function pick(locale: typeof locales[number]['code']) {
  setLocale(locale)
  open.value = false
}
</script>

<template>
  <div class="lang-switcher" @mouseleave="open = false">
    <button
      type="button"
      class="lang-btn"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
      @mouseenter="open = true"
    >
      <span class="lang-flag" aria-hidden="true">{{ locales.find(l => l.code === current)?.flag }}</span>
      <span class="lang-current">{{ locales.find(l => l.code === current)?.nativeLabel }}</span>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'lang-chevron-open': open }">
        <path d="M3 4.5L6 7.5L9 4.5" />
      </svg>
    </button>
    <div v-if="open" class="lang-menu" role="listbox">
      <button
        v-for="l in locales"
        :key="l.code"
        type="button"
        class="lang-option"
        :class="{ 'lang-option-active': l.code === current }"
        role="option"
        :aria-selected="l.code === current"
        @click="pick(l.code)"
      >
        <span class="lang-flag" aria-hidden="true">{{ l.flag }}</span>
        <span class="lang-option-text">
          <span class="lang-native">{{ l.nativeLabel }}</span>
          <span class="lang-english">{{ l.label }}</span>
        </span>
      </button>
      <p class="lang-help">{{ t.language_switcher_help }}</p>
    </div>
  </div>
</template>

<style scoped>
.lang-switcher {
  position: relative;
  display: inline-block;
}
.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid var(--g-divider, #dee2e6);
  border-radius: 999px;
  padding: 0.3rem 0.6rem 0.3rem 0.45rem;
  font-family: var(--g-font-display, inherit);
  font-size: 0.8125rem;
  color: var(--g-text-2, #495057);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.lang-btn:hover {
  border-color: var(--g-brand, #0d9488);
  color: var(--g-brand, #0d9488);
}
.lang-flag {
  font-size: 1rem;
  line-height: 1;
}
.lang-current {
  font-weight: 500;
}
.lang-chevron-open {
  transform: rotate(180deg);
}
svg { transition: transform 0.15s; }

.lang-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.4rem;
  background: var(--g-bg, #ffffff);
  border: 1px solid var(--g-divider, #dee2e6);
  border-radius: 8px;
  padding: 0.4rem;
  min-width: 200px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
}
.lang-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  background: transparent;
  border: none;
  padding: 0.5rem 0.6rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--g-text-1, #212529);
  cursor: pointer;
  border-radius: 6px;
  text-align: left;
}
.lang-option:hover {
  background: var(--g-bg-soft, #f8f9fa);
}
.lang-option-active {
  background: var(--g-bg-soft, #f8f9fa);
  color: var(--g-brand, #0d9488);
  font-weight: 600;
}
.lang-option-text {
  display: flex;
  flex-direction: column;
}
.lang-native {
  font-size: 0.875rem;
  line-height: 1.2;
}
.lang-english {
  font-size: 0.6875rem;
  color: var(--g-text-3, #6c757d);
}
.lang-help {
  margin: 0.4rem 0.5rem 0.25rem;
  font-size: 0.6875rem;
  color: var(--g-text-3, #6c757d);
  line-height: 1.4;
  font-style: italic;
}
</style>
