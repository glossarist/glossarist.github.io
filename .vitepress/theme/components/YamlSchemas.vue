<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface ShaclConstraint {
  path: string | null
  datatype: string | null
  class: string | null
  valuesFrom: string | null
  nodeKind: string | null
  minCount: number | null
  maxCount: number | null
  in: string[] | null
}

interface OwlShape {
  compact: string
  label: string
  targetClass: string | null
  constraints: ShaclConstraint[]
}

interface OwlClass {
  compact: string
  label: string
  comment: string | null
  subClassOf: string | null
  children: string[]
}

interface TaxonomyConcept {
  id: string
  prefLabel: string
  definition?: string
}

interface TaxonomyData {
  scheme: string
  schemeLabel: string
  schemeDefinition: string | null
  concepts: Record<string, TaxonomyConcept>
}

type SchemaTab = 'entities' | 'enums'

const loaded = ref(false)
const classes = ref<Record<string, OwlClass>>({})
const shapes = ref<Record<string, OwlShape>>({})
const shapesByTarget = ref<Record<string, string[]>>({})
const taxonomies = ref<Record<string, TaxonomyData>>({})
const activeTab = ref<SchemaTab>('entities')
const expandedEntity = ref<string | null>(null)

onMounted(async () => {
  const [schemaResp, taxResp] = await Promise.all([
    fetch('/data/ontology-schema.json'),
    fetch('/data/taxonomies.json'),
  ])
  const schema = await schemaResp.json()
  const tax = await taxResp.json()
  classes.value = schema.classes || {}
  shapes.value = schema.shapes || {}
  shapesByTarget.value = schema.shapesByTargetClass || {}
  taxonomies.value = tax || {}
  loaded.value = true
})

const entitySchemas = computed(() => {
  const result: { classId: string; label: string; comment: string | null; parent: string | null; children: string[]; shape: OwlShape | null }[] = []
  const shapeMap = shapesByTarget.value
  for (const [classId, cls] of Object.entries(classes.value)) {
    const shapeKeys = shapeMap[classId] || []
    const shape = shapeKeys.length ? shapes.value[shapeKeys[0]] : null
    if (shape && shape.constraints.length > 0) {
      result.push({
        classId,
        label: cls.label,
        comment: cls.comment,
        parent: cls.subClassOf,
        children: cls.children,
        shape,
      })
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label))
})

const enumSchemas = computed(() => {
  return Object.entries(taxonomies.value).map(([key, tax]) => ({
    key,
    label: tax.schemeLabel,
    definition: tax.schemeDefinition,
    concepts: Object.values(tax.concepts).sort((a, b) => a.prefLabel.localeCompare(b.prefLabel)),
  })).sort((a, b) => a.label.localeCompare(b.label))
})

function toggleEntity(classId: string) {
  expandedEntity.value = expandedEntity.value === classId ? null : classId
}
</script>

<template>
  <div class="ys" v-if="loaded">
    <!-- Tab switcher -->
    <div class="ys-tabs">
      <button class="ys-tab" :class="{ active: activeTab === 'entities' }" @click="activeTab = 'entities'">
        Entity Schemas ({{ entitySchemas.length }})
      </button>
      <button class="ys-tab" :class="{ active: activeTab === 'enums' }" @click="activeTab = 'enums'">
        Enumerations ({{ enumSchemas.length }})
      </button>
    </div>

    <!-- Entity schemas -->
    <div v-if="activeTab === 'entities'">
      <p class="ys-intro">
        The YAML schema for each Glossarist entity type, rendered from its SHACL shape definition.
        These shapes define the fields, types, and cardinality of every entity in a concept YAML file.
      </p>

      <div v-for="entity in entitySchemas" :key="entity.classId" class="ys-entity">
        <button class="ys-entity-header" @click="toggleEntity(entity.classId)">
          <span class="ys-entity-dot"></span>
          <span class="ys-entity-name">{{ entity.label }}</span>
          <span class="ys-entity-fields">{{ entity.shape?.constraints.length }} fields</span>
          <span class="ys-entity-chevron">{{ expandedEntity === entity.classId ? '▾' : '▸' }}</span>
        </button>

        <div v-if="expandedEntity === entity.classId" class="ys-entity-body">
          <p v-if="entity.comment" class="ys-entity-desc">{{ entity.comment }}</p>
          <div v-if="entity.parent" class="ys-entity-meta">
            <span class="ys-meta-label">extends</span>
            <code>{{ entity.parent }}</code>
          </div>

          <table class="ys-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>YAML key</th>
                <th>Type</th>
                <th>Card.</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, ci) in entity.shape?.constraints" :key="ci">
                <td><code class="ys-field">{{ c.path?.split(':').pop() }}</code></td>
                <td><code class="ys-key">{{ c.path }}</code></td>
                <td>
                  <code v-if="c.datatype" class="ys-type">{{ c.datatype }}</code>
                  <code v-else-if="c.class" class="ys-ref">{{ c.class }}</code>
                  <span v-else class="ys-dash">&mdash;</span>
                </td>
                <td class="ys-card">{{ c.minCount ?? 0 }}..{{ c.maxCount ?? '∗' }}</td>
                <td>
                  <span v-if="c.in" class="ys-vals">{{ c.in.join(', ') }}</span>
                  <code v-else-if="c.valuesFrom" class="ys-ref">{{ c.valuesFrom.split('/').pop() }}</code>
                  <span v-else class="ys-dash">&mdash;</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- YAML example -->
          <div class="ys-yaml-section">
            <div class="ys-yaml-label">YAML example</div>
            <pre class="ys-yaml"><code># {{ entity.label }}
{{ entity.shape?.constraints.map(c => {
  const key = c.path?.split(':').pop()
  const isRequired = c.minCount && c.minCount > 0
  const isMultiple = c.maxCount === null
  if (c.datatype) {
    const ex = c.datatype.includes('string') ? '"value"' : c.datatype.includes('anyURI') ? '"https://..."' : '"..."'
    return (isMultiple ? `${key}:\n  - ${ex}` : `${key}: ${ex}`) + (isRequired ? '  # required' : '')
  } else if (c.class) {
    const ref = c.class.split(':').pop()
    return (isMultiple ? `${key}:\n  - # ${ref}...` : `${key}: # ${ref}`) + (isRequired ? '  # required' : '')
  } else if (c.valuesFrom) {
    const tax = c.valuesFrom.split('/').pop()
    return `${key}: ${tax}_value` + (isRequired ? '  # required' : '')
  }
  return `${key}: ...`
}).join('\n') }}</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Enumerations -->
    <div v-if="activeTab === 'enums'">
      <p class="ys-intro">
        All enumerated value sets in the Glossarist model, rendered from the SKOS ConceptSchemes in the ontology.
        These define the valid values for fields like <code>status</code>, <code>type</code>, and <code>normative_status</code>.
      </p>

      <div v-for="enu in enumSchemas" :key="enu.key" class="ys-enum">
        <h3 class="ys-enum-title">{{ enu.label }}</h3>
        <p v-if="enu.definition" class="ys-enum-def">{{ enu.definition }}</p>
        <div class="ys-enum-list">
          <div v-for="concept in enu.concepts" :key="concept.id" class="ys-enum-item">
            <code class="ys-enum-id">{{ concept.id }}</code>
            <span class="ys-enum-label">{{ concept.prefLabel }}</span>
            <span v-if="concept.definition" class="ys-enum-desc">{{ concept.definition }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="ys-loading">Loading schema data&hellip;</div>
</template>

<style scoped>
.ys { margin: 1.5rem 0; }

.ys-loading {
  padding: 2rem 0;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.ys-intro {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 48rem;
}

.ys-intro code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
}

/* Tabs */
.ys-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--vp-c-divider);
  margin-bottom: 2rem;
}

.ys-tab {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.15s;
}

.ys-tab:hover { color: var(--vp-c-text-2); }

.ys-tab.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

/* Entity accordion */
.ys-entity {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.ys-entity-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--vp-c-bg-soft);
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.ys-entity-header:hover { background: var(--vp-c-default-soft); }

.ys-entity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--g-teal);
  flex-shrink: 0;
}

.ys-entity-name {
  flex: 1;
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--vp-c-text-1);
}

.ys-entity-fields {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.ys-entity-chevron {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.ys-entity-body {
  padding: 1rem 1.25rem 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
}

.ys-entity-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.ys-entity-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.ys-meta-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
}

.ys-entity-meta code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
}

/* Table */
.ys-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  margin-bottom: 1rem;
}

.ys-table th {
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  padding: 0.5rem 0.625rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ys-table td {
  padding: 0.5rem 0.625rem;
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: top;
}

.ys-table tr:last-child td { border-bottom: none; }

.ys-field {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--g-teal);
}

.ys-key {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.ys-type {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
}

.ys-ref {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  color: var(--g-class);
  background: rgba(41, 65, 91, 0.08);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
}

.dark .ys-ref { color: var(--g-class); background: rgba(91, 147, 196, 0.12); }

.ys-card {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

.ys-vals {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.ys-dash { color: var(--vp-c-text-3); }

/* YAML example */
.ys-yaml-section { margin-top: 1rem; }

.ys-yaml-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
}

.ys-yaml {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  overflow-x: auto;
  color: var(--vp-c-text-2);
}

.ys-yaml code {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

/* Enums */
.ys-enum {
  margin-bottom: 2rem;
}

.ys-enum-title {
  font-size: 1.0625rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
}

.ys-enum-def {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
}

.ys-enum-list {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.ys-enum-item {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.ys-enum-item:last-child { border-bottom: none; }

.ys-enum-id {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--g-teal);
  background: rgba(63, 182, 176, 0.08);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  white-space: nowrap;
}

.ys-enum-label {
  font-weight: 500;
  font-size: 0.875rem;
}

.ys-enum-desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  flex-basis: 100%;
  padding-left: 0;
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .ys-table { font-size: 0.75rem; }
  .ys-table td, .ys-table th { padding: 0.375rem 0.375rem; }
  .ys-entity-header { padding: 0.75rem; }
}
</style>
