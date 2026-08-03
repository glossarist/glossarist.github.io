<script setup lang="ts">
import { computed } from 'vue'
import type { TaxonomyConcept } from '@data/types'
import { useOntologyData } from '@data/useOntologyData'
import {
  RELATION_CATEGORIES,
  RELATIONSHIP_TYPES,
  DESIGNATION_RELATIONSHIP_TYPES,
} from 'glossarist/models'

// Inverse pairs are not exported by glossarist-js; this map is the
// documentation source for inverse display. Keep aligned with the SDK's
// RELATIONSHIP_TYPES — any type not listed here renders with an em dash.
const inverses: Record<string, string> = {
  // Hierarchical — Generic
  broader: 'narrower',
  narrower: 'broader',
  broader_generic: 'narrower_generic',
  narrower_generic: 'broader_generic',
  // Hierarchical — Partitive
  broader_partitive: 'narrower_partitive',
  narrower_partitive: 'broader_partitive',
  has_part: 'is_part_of',
  is_part_of: 'has_part',
  // Hierarchical — Instantial
  broader_instantial: 'narrower_instantial',
  narrower_instantial: 'broader_instantial',
  instance_of: 'has_instance',
  has_instance: 'instance_of',
  // Definitional / ISO 19135
  has_concept: 'is_concept_of',
  is_concept_of: 'has_concept',
  inherits: 'inherited_by',
  inherited_by: 'inherits',
  has_definition: 'definition_of',
  definition_of: 'has_definition',
  has_version: 'version_of',
  version_of: 'has_version',
  current_version: 'current_version_of',
  current_version_of: 'current_version',
  // Lifecycle
  supersedes: 'superseded_by',
  superseded_by: 'supersedes',
  deprecates: 'deprecated_by',
  deprecated_by: 'deprecates',
  replaces: 'replaced_by',
  replaced_by: 'replaces',
  invalidates: 'invalidated_by',
  invalidated_by: 'invalidates',
  retires: 'retired_by',
  retired_by: 'retires',
  // ExternalConcept resolution
  provides: 'provided_by',
  provided_by: 'provides',
  // Mapping
  broad_match: 'narrow_match',
  narrow_match: 'broad_match',
  // Symmetric (self-inverse)
  close_match: 'close_match',
  related_match: 'related_match',
  equivalent: 'equivalent',
  compare: 'compare',
  contrast: 'contrast',
  related_concept: 'related_concept',
  // Spatiotemporal (symmetric)
  sequentially_related_concept: 'sequentially_related_concept',
  spatially_related_concept: 'spatially_related_concept',
  temporally_related_concept: 'temporally_related_concept',
}

const { taxonomies, loaded } = useOntologyData()

const concepts = computed(() => taxonomies.value?.relationshipType?.concepts ?? {} as Record<string, TaxonomyConcept>)

const totalTypes = computed(() => Object.keys(concepts.value).length)

const sdkCategorizedGroups = computed(() =>
  Object.entries(RELATION_CATEGORIES).map(([key, cat]) => ({
    key,
    label: cat.label,
    description: cat.description,
    items: cat.types
      .filter(t => concepts.value[t])
      .map(t => ({ ...concepts.value[t], inverse: inverses[t] || '—' })),
  })).filter(g => g.items.length > 0),
)

const designationGroup = computed(() => ({
  label: 'Designation-level (ISO 10241-1)',
  description: 'Term-to-term relationships carried on designations, not concepts.',
  items: DESIGNATION_RELATIONSHIP_TYPES
    .filter(t => concepts.value[t])
    .map(t => ({ ...concepts.value[t], inverse: inverses[t] || '—' })),
}))

// Transparency: taxonomies.json entries that the SDK does not yet
// recognize. These are flagged for cross-repo alignment (concept-model
// TTL → glossarist-js). Until aligned, they appear here only.
const sdkTypeSet: ReadonlySet<string> = new Set(RELATIONSHIP_TYPES)
const driftEntries = computed(() =>
  Object.values(concepts.value)
    .filter(c => !sdkTypeSet.has(c.id))
    .map(c => ({ ...c, inverse: inverses[c.id] || '—' }))
    .sort((a, b) => a.id.localeCompare(b.id)),
)

const alphabeticalList = computed(() =>
  Object.values(concepts.value)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(c => ({
      ...c,
      inverse: inverses[c.id] || '—',
      category: RELATION_CATEGORIES[Object.entries(RELATION_CATEGORIES).find(([, cat]) => cat.types.includes(c.id))?.[0] ?? '']?.label
        || (DESIGNATION_RELATIONSHIP_TYPES.includes(c.id as typeof DESIGNATION_RELATIONSHIP_TYPES[number]) ? 'Designation-level' : 'Pending SDK alignment'),
    })),
)
</script>

<template>
  <div class="rt" v-if="loaded">
    <div class="rt-summary">
      <span class="rt-count">{{ totalTypes }}</span> typed semantic relationship types in the Glossarist concept model.
    </div>

    <!-- SDK-categorized sections -->
    <div v-for="group in sdkCategorizedGroups" :key="group.key" class="rt-category">
      <h3>{{ group.label }}</h3>
      <p v-if="group.description" class="rt-cat-desc">{{ group.description }}</p>
      <div class="rt-table-scroll">
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
    </div>

    <!-- Designation-level (separate SDK enum) -->
    <div v-if="designationGroup.items.length" class="rt-category">
      <h3>{{ designationGroup.label }}</h3>
      <p class="rt-cat-desc">{{ designationGroup.description }}</p>
      <div class="rt-table-scroll">
      <table>
        <thead>
          <tr><th>Type</th><th>Description</th><th>Inverse</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in designationGroup.items" :key="item.id">
            <td><code>{{ item.id }}</code></td>
            <td>{{ item.definition || item.prefLabel }}</td>
            <td><code v-if="item.inverse !== '—'">{{ item.inverse }}</code><span v-else class="rt-dash">&mdash;</span></td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Drift: recognized in concept-model TTL but not in SDK -->
    <div v-if="driftEntries.length" class="rt-category rt-drift">
      <h3>Pending SDK alignment</h3>
      <p class="rt-cat-desc">
        Defined in the concept-model ontology but not yet in the
        <code>glossarist-js</code> SDK's
        <code>RELATIONSHIP_TYPES</code>. Tracked for cross-repo alignment.
      </p>
      <div class="rt-table-scroll">
      <table>
        <thead>
          <tr><th>Type</th><th>Description</th><th>Inverse</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in driftEntries" :key="item.id">
            <td><code>{{ item.id }}</code></td>
            <td>{{ item.definition || item.prefLabel }}</td>
            <td><code v-if="item.inverse !== '—'">{{ item.inverse }}</code><span v-else class="rt-dash">&mdash;</span></td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Full alphabetical reference -->
    <details class="rt-details">
      <summary>Full alphabetical reference ({{ totalTypes }} types)</summary>
      <div class="rt-table-scroll">
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
      </div>
    </details>
  </div>
  <div v-else class="rt-loading">
    <div class="rt-spinner"></div>
    <span>Loading relationship types&hellip;</span>
  </div>
</template>

<style scoped>
.rt { margin: 1.5rem 0; }

.rt-summary {
  font-size: 0.9375rem;
  color: var(--g-text-2);
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
  margin-bottom: 0.375rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--g-divider);
}

.rt-cat-desc {
  font-size: 0.8125rem;
  color: var(--g-text-3);
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.rt-drift h3 { color: var(--g-text-3); }

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
  color: var(--g-text-3);
  padding: 0.5rem 0.75rem;
  border-bottom: 2px solid var(--g-divider);
}

.rt-category td,
.rt-ref-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--g-divider);
  vertical-align: top;
  line-height: 1.5;
}

.rt-category tr:last-child td,
.rt-ref-table tr:last-child td {
  border-bottom: none;
}

.rt-category td code,
.rt-ref-table td code {
  font-family: var(--g-font-mono);
  font-size: 0.8125rem;
  background: var(--g-muted-soft);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  white-space: nowrap;
}

.rt-dash { color: var(--g-text-3); }

.rt-num {
  color: var(--g-text-3);
  font-size: 0.8125rem;
  width: 2rem;
}

.rt-details {
  margin-top: 2rem;
  border: 1px solid var(--g-divider);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.rt-details summary {
  font-weight: 600;
  cursor: pointer;
  color: var(--g-text-2);
}

.rt-details summary:hover { color: var(--g-text-1); }

.rt-details[open] summary { margin-bottom: 1rem; }

.rt-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 0;
  color: var(--g-text-3);
  font-style: italic;
}

.rt-spinner {
  width: 18px; height: 18px;
  border: 2px solid var(--g-divider);
  border-top-color: var(--g-teal);
  border-radius: 50%;
  animation: rt-spin 0.6s linear infinite;
}

@keyframes rt-spin { to { transform: rotate(360deg); } }

.rt-table-scroll { overflow-x: auto; }

@media (max-width: 640px) {
  .rt-category table { font-size: 0.8125rem; }
  .rt-category td, .rt-ref-table td { padding: 0.375rem 0.5rem; }
}
</style>
