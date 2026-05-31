<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TaxonomyConcept } from '../../data/types'
import { useOntologyData } from '../../data/useOntologyData'

const categories: { key: string; label: string; types: string[] }[] = [
  { key: 'generic', label: 'Hierarchical — Generic (BTG/NTG)', types: ['broader', 'narrower', 'broader_generic', 'narrower_generic'] },
  { key: 'partitive', label: 'Hierarchical — Partitive (BTP/NTP)', types: ['broader_partitive', 'narrower_partitive'] },
  { key: 'instantial', label: 'Hierarchical — Instantial (BTI/NTI)', types: ['broader_instantial', 'narrower_instantial'] },
  { key: 'associative', label: 'Associative', types: ['see', 'related_concept', 'related_concept_broader', 'related_concept_narrower', 'compare', 'contrast'] },
  { key: 'equivalence', label: 'Equivalence and Mapping', types: ['equivalent', 'exact_match', 'close_match', 'broad_match', 'narrow_match', 'related_match'] },
  { key: 'spatiotemporal', label: 'Spatiotemporal', types: ['sequentially_related_concept', 'spatially_related_concept', 'temporally_related_concept'] },
  { key: 'lifecycle', label: 'Lifecycle', types: ['deprecates', 'supersedes', 'superseded_by'] },
  { key: 'lexical', label: 'Lexical and Designation-level', types: ['homograph', 'false_friend', 'abbreviated_form_for', 'short_form_for'] },
]

const inverses: Record<string, string> = {
  broader: 'narrower',
  narrower: 'broader',
  broader_generic: 'narrower_generic',
  narrower_generic: 'broader_generic',
  broader_partitive: 'narrower_partitive',
  narrower_partitive: 'broader_partitive',
  broader_instantial: 'narrower_instantial',
  narrower_instantial: 'broader_instantial',
  supersedes: 'superseded_by',
  superseded_by: 'supersedes',
  broad_match: 'narrow_match',
  narrow_match: 'broad_match',
  exact_match: 'exact_match',
  close_match: 'close_match',
  related_match: 'related_match',
  equivalent: 'equivalent',
}

const { taxonomies, loaded } = useOntologyData()

const concepts = computed(() => taxonomies.value?.relationshipType?.concepts ?? {} as Record<string, TaxonomyConcept>)

const totalTypes = computed(() => Object.keys(concepts.value).length)

const categorizedGroups = computed(() =>
  categories.map(cat => ({
    ...cat,
    items: cat.types
      .filter(t => concepts.value[t])
      .map(t => ({ ...concepts.value[t], inverse: inverses[t] || '—' })),
  })).filter(g => g.items.length > 0),
)

const alphabeticalList = computed(() =>
  Object.values(concepts.value)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(c => ({ ...c, inverse: inverses[c.id] || '—', category: categories.find(cat => cat.types.includes(c.id))?.label || 'Other' })),
)
</script>

<template>
  <div class="rt" v-if="loaded">
    <div class="rt-summary">
      <span class="rt-count">{{ totalTypes }}</span> typed semantic relationship types in the Glossarist concept model.
    </div>

    <!-- Category sections -->
    <div v-for="group in categorizedGroups" :key="group.key" class="rt-category">
      <h3>{{ group.label }}</h3>
      <table>
        <thead>
          <tr><th>Type</th><th>Description</th><th>Inverse</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in group.items" :key="item.id">
            <td><code>{{ item.id }}</code></td>
            <td>{{ item.definition || item.prefLabel }}</td>
            <td><code v-if="item.inverse !== '—'">{{ item.inverse }}</code><span v-else class="rt-dash">&mdash;</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Full alphabetical reference -->
    <details class="rt-details">
      <summary>Full alphabetical reference ({{ totalTypes }} types)</summary>
      <table class="rt-ref-table">
        <thead>
          <tr><th>#</th><th>Type</th><th>Category</th></tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in alphabeticalList" :key="item.id">
            <td class="rt-num">{{ i + 1 }}</td>
            <td><code>{{ item.id }}</code></td>
            <td>{{ item.category }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
  <div v-else class="rt-loading">Loading relationship types&hellip;</div>
</template>

<style scoped>
.rt { margin: 1.5rem 0; }

.rt-summary {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.rt-count {
  font-weight: 700;
  color: var(--g-shape);
}

.rt-category {
  margin-bottom: 2rem;
}

.rt-category h3 {
  font-size: 1.0625rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.rt-category table,
.rt-ref-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.rt-category th,
.rt-ref-table th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  padding: 0.5rem 0.75rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.rt-category td,
.rt-ref-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: top;
  line-height: 1.5;
}

.rt-category tr:last-child td,
.rt-ref-table tr:last-child td {
  border-bottom: none;
}

.rt-category td code,
.rt-ref-table td code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  white-space: nowrap;
}

.rt-dash { color: var(--vp-c-text-3); }

.rt-num {
  color: var(--vp-c-text-3);
  font-size: 0.8125rem;
  width: 2rem;
}

.rt-details {
  margin-top: 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.rt-details summary {
  font-weight: 600;
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.rt-details summary:hover { color: var(--vp-c-text-1); }

.rt-details[open] summary { margin-bottom: 1rem; }

.rt-loading {
  padding: 2rem 0;
  color: var(--vp-c-text-3);
  font-style: italic;
}

@media (max-width: 640px) {
  .rt-category table { font-size: 0.8125rem; }
  .rt-category td, .rt-ref-table td { padding: 0.375rem 0.5rem; }
}
</style>
