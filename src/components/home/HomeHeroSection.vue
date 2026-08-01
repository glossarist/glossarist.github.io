<script setup lang="ts">
/**
 * HomeHeroSection — the top-of-page hero with the rotating language
 * ticker. Owns its own animation state and i18n dependency.
 *
 * Extracted from HomePage.vue (TODO.refactor/18) for Single
 * Responsibility: the hero's ticker animation shouldn't share a
 * component with 6 other homepage sections.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const tickerPhrases = [
  'many languages',
  'plusieurs langues',
  'viele Sprachen',
  'muchos idiomas',
  '多種語言',
  '多种语言',
  'لغات كثيرة',
  'много языков',
  '多くの言語',
  'many designations',
  'many definitions',
  'many scripts',
]

const tickerIndex = ref(0)
let tickerTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  tickerTimer = setInterval(() => {
    tickerIndex.value = (tickerIndex.value + 1) % tickerPhrases.length
  }, 3000)
})

onUnmounted(() => {
  if (tickerTimer) clearInterval(tickerTimer)
})
</script>

<template>
  <section class="hp-hero">
    <div class="hp-hero-grain"></div>
    <div class="hp-hero-inner">
      <div class="hp-hero-logo-row">
        <img src="/logo-glossarist.svg" alt="Glossarist" class="hp-hero-logo" width="120" height="113" />
        <div class="hp-hero-meta">
          <span class="hp-hero-greek">γλῶσσα</span>
          <span class="hp-hero-greek-sub">glôssa · tongue, language — the root of "glossary"</span>
        </div>
      </div>

      <h1 class="hp-hero-title">
        One concept,<br />
        <span class="hp-ticker" aria-label="many languages">
          <Transition name="ticker-slide" mode="out-in">
            <span :key="tickerIndex" class="hp-ticker-item">{{ tickerPhrases[tickerIndex] }}</span>
          </Transition>
        </span>
      </h1>

      <p class="hp-hero-lede" style="margin-bottom: 2.5rem;">
        {{ t.hero_lede }}
      </p>

      <div class="hp-hero-actions">
        <a href="/model/" class="g-cta">
          Explore the Model
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
        <a href="https://github.com/glossarist" class="g-cta g-cta-light" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hp-hero {
  position: relative;
  overflow: hidden;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--g-brand-1), var(--g-brand-2));
  color: #fff;
}
.hp-hero-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E");
  opacity: 0.08;
  pointer-events: none;
}
.hp-hero-inner {
  position: relative;
  z-index: 1;
  max-width: 720px;
  padding: 5rem 1.5rem;
  text-align: center;
}
.hp-hero-logo-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.hp-hero-logo {
  width: 72px;
  height: 68px;
  filter: brightness(0) invert(1);
}
.hp-hero-meta {
  text-align: left;
}
.hp-hero-greek {
  display: block;
  font-family: var(--g-font-serif, 'EB Garamond', serif);
  font-size: 1.75rem;
  font-style: italic;
  line-height: 1;
}
.hp-hero-greek-sub {
  display: block;
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}
.hp-hero-title {
  font-family: var(--g-font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0 0 1.5rem;
}
.hp-ticker {
  display: inline-block;
  min-height: 1.1em;
  color: var(--g-teal);
}
.hp-ticker-item {
  display: inline-block;
}
.ticker-slide-enter-active,
.ticker-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
}
.ticker-slide-enter-from {
  transform: translateY(0.5em);
  opacity: 0;
}
.ticker-slide-leave-to {
  transform: translateY(-0.5em);
  opacity: 0;
}
.hp-hero-lede {
  font-size: 1.125rem;
  line-height: 1.6;
  opacity: 0.9;
  max-width: 560px;
  margin: 0 auto;
}
.hp-hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .hp-hero-inner { padding: 3rem 1.25rem; }
  .hp-hero-logo-row { flex-direction: column; gap: 0.5rem; }
  .hp-hero-meta { text-align: center; }
}
</style>
