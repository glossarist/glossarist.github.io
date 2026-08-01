<script setup lang="ts">
/**
 * HomeStatsSection — the compact stats bar below the hero.
 * Owns its own data dependency (stats.json).
 *
 * Extracted from HomePage.vue (TODO.refactor/18).
 */
import stats from '@data/stats.json'

const st = stats
</script>

<template>
  <section class="hp-stats">
    <div class="hp-stats-inner">
      <div class="hp-stat">
        <span class="hp-stat-num">{{ st.classes }}</span>
        <span class="hp-stat-label">Entity Types</span>
      </div>
      <div class="hp-stat">
        <span class="hp-stat-num">{{ st.relationship_types }}</span>
        <span class="hp-stat-label">Relationship Types</span>
      </div>
      <div class="hp-stat">
        <span class="hp-stat-num">{{ st.languages }}</span>
        <span class="hp-stat-label">Languages</span>
      </div>
      <div class="hp-stat">
        <span class="hp-stat-num">{{ st.datasets }}</span>
        <span class="hp-stat-label">Datasets</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hp-stats {
  background: var(--g-bg);
  border-bottom: 1px solid var(--g-divider);
  padding: 1.5rem;
}
.hp-stats-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}
.hp-stat {
  text-align: center;
}
.hp-stat-num {
  display: block;
  font-family: var(--g-font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--g-brand);
  line-height: 1;
}
.hp-stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--g-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .hp-stats-inner { gap: 0.75rem; }
  .hp-stat-num { font-size: 1.5rem; }
}
</style>
