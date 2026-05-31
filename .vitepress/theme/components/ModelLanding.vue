<script setup lang="ts">
import { computed } from 'vue'
import { useOntologyData } from '../../data/useOntologyData'

const { schema, taxonomies } = useOntologyData()

const st = computed(() => {
  const s = schema.value?.stats
  const t = taxonomies.value
  if (!s || !t) return { classes: 0, properties: 0, shapes: 0, relationships: 0, designations: 0 }
  return {
    classes: s.classCount,
    properties: s.objectPropertyCount + s.datatypePropertyCount,
    shapes: s.shapeCount,
    relationships: Object.keys(t.relationshipType?.concepts ?? {}).length,
    designations: Object.keys(t.designationType?.concepts ?? {}).length,
  }
})

const entities = [
  { href: '/docs/model/concepts', dotColor: 'var(--g-class)', title: 'ManagedConcept', desc: 'The top-level entity. Holds a UUID, lifecycle status, domain references, and maps language codes to LocalizedConcept instances.', fields: ['status', 'localized_concepts', 'related', 'domains', 'dates'] },
  { href: '/docs/model/concepts', dotColor: 'var(--g-property)', title: 'LocalizedConcept', desc: 'Per-language realization of a concept. Each language gets its own definition, designations, notes, examples, and classification.', fields: ['designations', 'definition', 'notes', 'examples', 'language_code'] },
  { href: '/docs/model/designations', dotColor: 'var(--g-teal)', title: 'Designations', desc: 'Designation types in a MECE hierarchy — expressions, abbreviations, symbols (letter and graphical), prefixes, and suffixes.', fields: ['expression', 'abbreviation', 'symbol', 'letter_symbol', 'graphical_symbol', 'prefix', 'suffix'] },
  { href: '/docs/model/relationships', dotColor: 'var(--g-shape)', title: 'Relationships', desc: 'Typed semantic links spanning 4 ISO standards — hierarchical, partitive, associative, equivalence, mapping, and spatiotemporal.', fields: ['broader/narrower', 'generic/partitive', 'exact_match', 'deprecates', 'and more'] },
  { href: '/docs/model/sources', dotColor: 'var(--g-taxonomy)', title: 'Sources', desc: 'Multi-level provenance tracking — authoritative and lineage sources with status tracking (identical, modified, restyled, generalisation).', fields: ['authoritative', 'lineage', 'status', 'origin', 'modification'] },
  { href: '/ontology', dotColor: 'linear-gradient(135deg, var(--g-steel), var(--g-teal))', title: 'Semantic Web & Linked Data', desc: 'Formal ontology with SHACL shapes for validation. Aligned with SKOS, SKOS-XL, ISO 25964, PROV-O, and Dublin Core — ready for the linked data ecosystem.', fields: ['owl:Class', 'sh:Shape', 'skos:Concept', 'skosxl:Label'] },
]
</script>

<template>
  <div class="ml">
    <!-- Stats row -->
    <div class="ml-stats">
      <div class="ml-stat">
        <span class="ml-stat-num">{{ st.classes }}</span>
        <span class="ml-stat-label">Ontology Classes</span>
      </div>
      <div class="ml-stat">
        <span class="ml-stat-num">{{ st.properties }}</span>
        <span class="ml-stat-label">Properties</span>
      </div>
      <div class="ml-stat">
        <span class="ml-stat-num">{{ st.shapes }}</span>
        <span class="ml-stat-label">SHACL Shapes</span>
      </div>
      <div class="ml-stat">
        <span class="ml-stat-num">{{ st.relationships }}</span>
        <span class="ml-stat-label">Relationship Types</span>
      </div>
      <div class="ml-stat">
        <span class="ml-stat-num">{{ st.designations }}</span>
        <span class="ml-stat-label">Designation Types</span>
      </div>
    </div>

    <!-- Entity grid -->
    <h2>Core entities</h2>
    <div class="ml-entities">
      <a v-for="e in entities" :key="e.title" :href="e.href" class="ml-entity">
        <div class="ml-entity-head">
          <span class="ml-dot" :style="{ background: e.dotColor }"></span>
          <h3>{{ e.title }}</h3>
        </div>
        <p>{{ e.desc }}</p>
        <div class="ml-fields">
          <code v-for="f in e.fields" :key="f">{{ f }}</code>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.ml-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2rem 0;
}

.ml-stat {
  text-align: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  min-width: 90px;
}

.ml-stat-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--g-teal);
}

.ml-stat-label {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ml h2 {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 2.5rem 0 1rem;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 2rem;
}

.ml-entities {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.ml-entity {
  display: block;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
  transition: border-color 0.2s, transform 0.2s;
  text-decoration: none;
  color: inherit;
}

.ml-entity:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.ml-entity-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.ml-entity-head h3 {
  font-size: 0.9375rem;
  font-weight: 700;
  margin: 0;
}

.ml-entity p {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 0.75rem;
}

.ml-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ml-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.ml-fields code {
  font-size: 0.6875rem;
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

@media (max-width: 900px) {
  .ml-entities { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .ml-entities { grid-template-columns: 1fr; }
  .ml-stats { gap: 0.75rem; }
  .ml-stat { min-width: 70px; padding: 0.5rem 0.75rem; }
}
</style>
