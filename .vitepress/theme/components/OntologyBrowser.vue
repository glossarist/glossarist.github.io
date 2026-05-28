<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'

type View = 'overview' | 'class' | 'shape' | 'property' | 'taxonomy'

interface OwlClass {
  iri: string
  compact: string
  label: string
  comment: string | null
  subClassOf: string | null
  disjointWith: string | null
  children: string[]
  ancestors: string[]
}

interface OwlProperty {
  iri: string
  compact: string
  label: string
  comment: string | null
  type: 'object' | 'datatype'
  domain: string | null
  domainUnion: string[] | null
  range: string | null
  rangeUnion: string[] | null
  inverseOf: string | null
}

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
  iri: string
  compact: string
  label: string
  comment: string | null
  targetClass: string | null
  shapeClass: string | null
  constraints: ShaclConstraint[]
}

interface OwlOntology {
  iri: string
  label: string
  comment: string | null
  prefix: string | null
  namespaceUri: string | null
  imports: { iri: string; label: string }[]
  license: string | null
  created: string | null
}

interface AnnotationProperty {
  iri: string
  compact: string
  label: string
}

interface TaxonomyData {
  scheme: string
  schemeLabel: string
  schemeDefinition: string | null
  concepts: Record<string, {
    id: string
    iri: string
    prefLabel: string
    altLabel?: string
    definition?: string
    broader?: string
  }>
}

const loaded = ref(false)
const ontologyMeta = ref<OwlOntology | null>(null)
const classes = ref<Record<string, OwlClass>>({})
const roots = ref<string[]>([])
const properties = ref<Record<string, OwlProperty>>({})
const propsByDomain = ref<Record<string, { object: string[]; datatype: string[] }>>({})
const shapes = ref<Record<string, OwlShape>>({})
const shapesByTargetClass = ref<Record<string, string[]>>({})
const annotationProps = ref<AnnotationProperty[]>([])
const stats = ref({ classCount: 0, objectPropertyCount: 0, datatypePropertyCount: 0, shapeCount: 0, annotationPropertyCount: 0 })
const taxonomies = ref<Record<string, TaxonomyData>>({})

const currentView = ref<View>('overview')
const activeId = ref('')

onMounted(async () => {
  const [schemaResp, taxResp] = await Promise.all([
    fetch('/data/ontology-schema.json'),
    fetch('/data/taxonomies.json'),
  ])
  const schema = await schemaResp.json()
  const tax = await taxResp.json()

  ontologyMeta.value = schema.ontology
  classes.value = schema.classes
  roots.value = schema.classHierarchyRoots
  properties.value = schema.properties
  propsByDomain.value = schema.propertiesByDomain
  shapes.value = schema.shapes
  shapesByTargetClass.value = schema.shapesByTargetClass
  annotationProps.value = schema.annotationProperties
  stats.value = schema.stats
  taxonomies.value = tax
  loaded.value = true
})

function navigate(view: View, id: string = '') {
  currentView.value = view
  activeId.value = id
  nextTick(() => {
    const el = document.querySelector('.ontology-browser')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// Adapter helpers
function getClass(id: string): OwlClass | null {
  return classes.value[id] ?? null
}

function getProperty(id: string): OwlProperty | null {
  return properties.value[id] ?? null
}

function getShape(id: string): OwlShape | null {
  return shapes.value[id] ?? null
}

function getPropertiesForDomain(domain: string): { object: OwlProperty[]; datatype: OwlProperty[] } {
  const group = propsByDomain.value[domain]
  if (!group) return { object: [], datatype: [] }
  return {
    object: group.object.map(id => properties.value[id]).filter(Boolean),
    datatype: group.datatype.map(id => properties.value[id]).filter(Boolean),
  }
}

function getAllPropertiesForClass(classId: string): { object: OwlProperty[]; datatype: OwlProperty[] } {
  const cls = classes.value[classId]
  if (!cls) return { object: [], datatype: [] }
  const classChain = [classId, ...cls.ancestors]
  const objectProps: OwlProperty[] = []
  const datatypeProps: OwlProperty[] = []
  const seen = new Set<string>()
  for (const c of classChain) {
    const props = getPropertiesForDomain(c)
    for (const p of props.object) {
      if (!seen.has(p.compact)) { seen.add(p.compact); objectProps.push(p) }
    }
    for (const p of props.datatype) {
      if (!seen.has(p.compact)) { seen.add(p.compact); datatypeProps.push(p) }
    }
  }
  return { object: objectProps, datatype: datatypeProps }
}

function getShapesForClass(classId: string): OwlShape[] {
  const shapeIds = shapesByTargetClass.value[classId] ?? []
  return shapeIds.map(id => shapes.value[id]).filter(Boolean)
}

// Taxonomy helpers
const taxonomyKeys = computed(() => Object.keys(taxonomies.value))
const taxonomyLabels = computed(() => {
  const labels: Record<string, string> = {}
  for (const key of taxonomyKeys.value) {
    labels[key] = taxonomies.value[key]?.schemeLabel || key
  }
  return labels
})

const valuesToTaxonomy = computed(() => {
  const map: Record<string, string> = {}
  for (const key of taxonomyKeys.value) {
    const scheme = taxonomies.value[key]?.scheme
    if (scheme) map[scheme] = key
  }
  return map
})

function taxonomyKeyForValuesFrom(valuesFrom: string | null): string | null {
  if (!valuesFrom) return null
  return valuesToTaxonomy.value[valuesFrom] ?? null
}

function getShapesForTaxonomy(taxonomyKey: string): OwlShape[] {
  const targetScheme = Object.entries(valuesToTaxonomy.value).find(([, v]) => v === taxonomyKey)?.[0]
  if (!targetScheme) return []
  return Object.values(shapes.value).filter(s =>
    s.constraints.some(c => c.valuesFrom === targetScheme),
  )
}

interface IndividualGroup {
  key: string
  label: string
  concepts: { id: string; prefLabel: string }[]
}

const groupedIndividuals = computed<IndividualGroup[]>(() => {
  return taxonomyKeys.value.map(key => {
    const tax = taxonomies.value[key]
    if (!tax) return { key, label: taxonomyLabels.value[key] || key, concepts: [] }
    const concepts = Object.values(tax.concepts).map(c => ({
      id: c.id,
      prefLabel: c.prefLabel,
    }))
    return { key, label: tax.schemeLabel || taxonomyLabels.value[key] || key, concepts }
  })
})

const totalTaxonomyIndividuals = computed(() =>
  groupedIndividuals.value.reduce((sum, g) => sum + g.concepts.length, 0),
)

const allClasses = computed(() => Object.values(classes.value))
const allShapes = computed(() => Object.values(shapes.value))

// Active item computeds
const activeClass = computed(() => {
  if (currentView.value !== 'class') return null
  return getClass(activeId.value)
})

const activeProperties = computed(() => {
  if (currentView.value !== 'class') return { object: [], datatype: [] }
  return getAllPropertiesForClass(activeId.value)
})

const activeClassShapes = computed(() => {
  if (currentView.value !== 'class') return []
  return getShapesForClass(activeId.value)
})

const activeShape = computed(() => {
  if (currentView.value !== 'shape') return null
  return getShape(activeId.value)
})

const activeProperty = computed(() => {
  if (currentView.value !== 'property') return null
  return getProperty(activeId.value)
})

const activeTaxonomy = computed(() => {
  if (currentView.value !== 'taxonomy') return null
  return activeId.value
})

const activeTaxonomyData = computed(() => {
  if (!activeTaxonomy.value) return null
  const key = activeTaxonomy.value
  const tax = taxonomies.value[key]
  if (!tax) return null
  const all = Object.values(tax.concepts)
  const top = all.filter(c => !c.broader)
  return { scheme: tax.scheme, concepts: all, top }
})

function compactToSlug(compact: string): string {
  return compact.replace(/:/g, '-')
}
</script>

<template>
  <div class="ontology-browser">
    <div v-if="!loaded" class="ob-loading">Loading ontology data...</div>

    <template v-else>
      <!-- Overview -->
      <template v-if="currentView === 'overview'">
        <div class="ob-section">
          <h2 class="ob-title">Glossarist Ontology</h2>
          <p class="ob-subtitle">OWL ontology for terminology management (ISO 10241-1, 30042, 12620, 25964/SKOS)</p>
          <div class="ob-description">
            <p>The Glossarist ontology defines the RDF/OWL vocabulary for describing structured terminology data. It models <strong>concepts</strong> with multilingual <strong>localizations</strong> (definitions, notes, examples) and typed <strong>designations</strong> (expressions, abbreviations, symbols) using the SKOS-XL pattern for reified lexical labels.</p>
            <p>It aligns with <strong>SKOS</strong> (concepts and relationships), <strong>SKOS-XL</strong> (designations as labels), <strong>ISO 25964</strong> (hierarchical relationship subtypes), <strong>PROV-O</strong> (source provenance), and <strong>Dublin Core Terms</strong> (language, citation).</p>
          </div>

          <div v-if="ontologyMeta" class="ob-meta">
            <div class="ob-meta-row">
              <code class="ob-code-sm">{{ ontologyMeta.iri }}</code>
              <span v-if="ontologyMeta.created" class="ob-meta-date">Created {{ ontologyMeta.created }}</span>
              <a v-if="ontologyMeta.license" :href="ontologyMeta.license" target="_blank" rel="noopener" class="ob-link-sm">CC BY 4.0</a>
            </div>
            <div v-if="ontologyMeta.imports.length" class="ob-meta-row">
              <span class="ob-meta-label">Imports:</span>
              <span v-for="imp in ontologyMeta.imports" :key="imp.iri" class="ob-badge ob-badge-neutral">{{ imp.label }}</span>
            </div>
          </div>

          <div class="ob-badges">
            <span class="ob-badge ob-badge-blue">{{ stats.classCount }} classes</span>
            <span class="ob-badge ob-badge-green">{{ stats.objectPropertyCount }} object properties</span>
            <span class="ob-badge ob-badge-amber">{{ stats.datatypePropertyCount }} datatype properties</span>
            <span class="ob-badge ob-badge-purple">{{ stats.shapeCount }} SHACL shapes</span>
            <span class="ob-badge ob-badge-rose">{{ totalTaxonomyIndividuals }} named individuals</span>
            <span class="ob-badge ob-badge-pink">{{ annotationProps.length }} annotation properties</span>
          </div>
        </div>

        <!-- Class Overview -->
        <div class="ob-section">
          <h3 class="ob-heading">Class Overview</h3>
          <div class="ob-grid-2">
            <button v-for="cls in allClasses" :key="cls.compact"
              class="ob-card ob-card-clickable"
              @click="navigate('class', cls.compact)">
              <div class="ob-card-header">
                <span class="ob-card-label">{{ cls.label }}</span>
                <code class="ob-code-sm">{{ cls.compact }}</code>
              </div>
              <p v-if="cls.comment" class="ob-card-desc">{{ cls.comment }}</p>
              <div v-if="cls.subClassOf" class="ob-card-meta">
                subClassOf <code>{{ cls.subClassOf }}</code>
              </div>
            </button>
          </div>
        </div>

        <!-- SHACL Shapes -->
        <div class="ob-section">
          <h3 class="ob-heading">SHACL Shapes</h3>
          <div class="ob-grid-2">
            <button v-for="shape in allShapes" :key="shape.compact"
              class="ob-card ob-card-clickable"
              @click="navigate('shape', shape.compact)">
              <div class="ob-card-header">
                <span class="ob-card-label">{{ shape.label }}</span>
                <code class="ob-code-sm">{{ shape.compact }}</code>
              </div>
              <div class="ob-card-meta">
                targetClass <code>{{ shape.targetClass }}</code>
                &middot; {{ shape.constraints.length }} constraints
              </div>
            </button>
          </div>
        </div>

        <!-- Named Individuals -->
        <div class="ob-section">
          <h3 class="ob-heading">Named Individuals</h3>
          <p class="ob-text-sm">
            {{ totalTaxonomyIndividuals }} SKOS Concepts across {{ groupedIndividuals.length }} ConceptSchemes serve as controlled vocabulary instances.
          </p>
          <div class="ob-groups">
            <div v-for="group in groupedIndividuals" :key="group.key" class="ob-card">
              <div class="ob-group-header">
                <button class="ob-link-button" @click="navigate('taxonomy', group.key)">
                  {{ group.label }}
                </button>
                <span class="ob-badge ob-badge-rose">{{ group.concepts.length }}</span>
              </div>
              <div class="ob-tag-list">
                <button v-for="c in group.concepts" :key="c.id"
                  class="ob-tag"
                  @click="navigate('taxonomy', group.key)">
                  {{ c.prefLabel }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Annotation Properties -->
        <div class="ob-section">
          <h3 class="ob-heading">Annotation Properties</h3>
          <p class="ob-text-sm">
            Standard annotation properties from RDFS, Dublin Core Terms, and VANN used for ontology metadata.
          </p>
          <div class="ob-grid-2">
            <div v-for="ap in annotationProps" :key="ap.compact" class="ob-prop-chip">
              <code class="ob-code-pink">{{ ap.compact }}</code>
              <span class="ob-text-sm">{{ ap.label }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Class detail -->
      <template v-if="currentView === 'class' && activeClass">
        <nav class="ob-breadcrumb">
          <button class="ob-link-button" @click="navigate('overview')">Overview</button>
          <template v-if="activeClass.ancestors.length">
            <span class="ob-sep">/</span>
            <template v-for="anc in activeClass.ancestors" :key="anc">
              <button class="ob-link-button" @click="navigate('class', anc)">
                {{ getClass(anc)?.label || anc }}
              </button>
              <span class="ob-sep">/</span>
            </template>
          </template>
          <span class="ob-breadcrumb-current">{{ activeClass.label }}</span>
        </nav>

        <div class="ob-detail-header">
          <h2 class="ob-title">{{ activeClass.label }}</h2>
          <code class="ob-code-block">{{ activeClass.iri }}</code>
          <div v-if="activeClass.subClassOf" class="ob-subclass">
            <span class="ob-meta-label">subClassOf</span>
            <button class="ob-link-badge ob-link-badge-blue" @click="navigate('class', activeClass.subClassOf)">
              {{ activeClass.subClassOf }}
            </button>
            <template v-if="activeClass.ancestors.length > 1">
              <span class="ob-arrow">&rarr;</span>
              <span class="ob-text-sm">{{ activeClass.ancestors.slice(1).map(a => getClass(a)?.label || a).join(' → ') }}</span>
            </template>
          </div>
          <p v-if="activeClass.comment" class="ob-text-md">{{ activeClass.comment }}</p>
        </div>

        <!-- SHACL Shape constraints for this class -->
        <div v-if="activeClassShapes.length" class="ob-section">
          <h3 class="ob-heading">SHACL Shape{{ activeClassShapes.length > 1 ? 's' : '' }}</h3>
          <div v-for="shape in activeClassShapes" :key="shape.compact" class="ob-shape-box">
            <div class="ob-shape-header">
              <span class="ob-text-bold-purple">{{ shape.label }}</span>
              <button class="ob-link-sm" @click="navigate('shape', shape.compact)">View full shape &rarr;</button>
            </div>
            <div class="ob-constraint-list">
              <div v-for="(c, ci) in shape.constraints" :key="c.path ?? ci" class="ob-constraint-row">
                <code class="ob-code-purple">{{ c.path }}</code>
                <span class="ob-text-sm ob-text-muted">
                  <span v-if="c.datatype">{{ c.datatype }}</span>
                  <span v-if="c.class" class="ob-text-blue">{{ c.class }}</span>
                  <span v-if="c.minCount !== null || c.maxCount !== null" class="ob-cardinality">
                    [{{ c.minCount ?? 0 }}..{{ c.maxCount ?? '*' }}]
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Object Properties -->
        <div v-if="activeProperties.object.length" class="ob-section">
          <h3 class="ob-heading">Object Properties ({{ activeProperties.object.length }})</h3>
          <table class="ob-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Range</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in activeProperties.object" :key="p.compact">
                <td>
                  <button class="ob-link-badge ob-link-badge-blue" @click="navigate('property', p.compact)">{{ p.compact }}</button>
                  <div v-if="p.inverseOf" class="ob-inverse">&harr; {{ p.inverseOf }}</div>
                </td>
                <td><code class="ob-code-sm">{{ p.range || p.rangeUnion?.join(' | ') || '—' }}</code></td>
                <td class="ob-text-sm ob-text-muted">{{ p.comment || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Datatype Properties -->
        <div v-if="activeProperties.datatype.length" class="ob-section">
          <h3 class="ob-heading">Datatype Properties ({{ activeProperties.datatype.length }})</h3>
          <table class="ob-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Datatype</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in activeProperties.datatype" :key="p.compact">
                <td>
                  <button class="ob-link-badge ob-link-badge-blue" @click="navigate('property', p.compact)">{{ p.compact }}</button>
                </td>
                <td><code class="ob-code-sm">{{ p.range || '—' }}</code></td>
                <td class="ob-text-sm ob-text-muted">{{ p.comment || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!activeProperties.object.length && !activeProperties.datatype.length && !activeClassShapes.length" class="ob-empty">
          No properties or shapes defined directly on this class.
        </div>
      </template>

      <!-- Shape detail -->
      <template v-if="currentView === 'shape' && activeShape">
        <nav class="ob-breadcrumb">
          <button class="ob-link-button" @click="navigate('overview')">Overview</button>
          <span class="ob-sep">/</span>
          <span class="ob-breadcrumb-current">{{ activeShape.label }} Shape</span>
        </nav>

        <div class="ob-detail-header">
          <h2 class="ob-title">{{ activeShape.label }} Shape</h2>
          <code class="ob-code-block">{{ activeShape.iri }}</code>
          <div class="ob-target-row">
            <div v-if="activeShape.targetClass" class="ob-target-item">
              <span class="ob-meta-label">targetClass</span>
              <button class="ob-link-badge ob-link-badge-blue" @click="navigate('class', activeShape.targetClass)">
                {{ activeShape.targetClass }}
              </button>
            </div>
            <div v-if="activeShape.shapeClass" class="ob-target-item">
              <span class="ob-meta-label">class</span>
              <code class="ob-code-sm">{{ activeShape.shapeClass }}</code>
            </div>
          </div>
          <p v-if="activeShape.comment" class="ob-text-md">{{ activeShape.comment }}</p>
        </div>

        <div class="ob-section">
          <h3 class="ob-heading">Constraints ({{ activeShape.constraints.length }})</h3>
          <table class="ob-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Type / Class</th>
                <th>Cardinality</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, ci) in activeShape.constraints" :key="c.path ?? ci">
                <td><code class="ob-code-purple">{{ c.path }}</code></td>
                <td>
                  <span v-if="c.datatype"><code class="ob-code-sm">{{ c.datatype }}</code></span>
                  <span v-if="c.class"><code class="ob-text-blue">{{ c.class }}</code></span>
                  <span v-if="!c.datatype && !c.class" class="ob-text-muted">—</span>
                </td>
                <td>
                  <span v-if="c.minCount !== null || c.maxCount !== null">
                    {{ c.minCount ?? 0 }}..{{ c.maxCount ?? '*' }}
                  </span>
                  <span v-else class="ob-text-muted">*</span>
                </td>
                <td>
                  <span v-if="c.valuesFrom">
                    <button v-if="taxonomyKeyForValuesFrom(c.valuesFrom)"
                      class="ob-link-badge ob-link-badge-rose"
                      @click="navigate('taxonomy', taxonomyKeyForValuesFrom(c.valuesFrom)!)">
                      {{ c.valuesFrom }}
                    </button>
                    <span v-else class="ob-badge ob-badge-neutral">{{ c.valuesFrom }}</span>
                  </span>
                  <span v-if="c.in" class="ob-text-sm">{{ c.in.join(' | ') }}</span>
                  <span v-if="!c.valuesFrom && !c.in" class="ob-text-muted">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Property detail -->
      <template v-if="currentView === 'property' && activeProperty">
        <nav class="ob-breadcrumb">
          <button class="ob-link-button" @click="navigate('overview')">Overview</button>
          <span class="ob-sep">/</span>
          <span class="ob-breadcrumb-current">{{ activeProperty.label }}</span>
        </nav>

        <div class="ob-detail-header">
          <div class="ob-title-row">
            <h2 class="ob-title">{{ activeProperty.label }}</h2>
            <span class="ob-badge" :class="activeProperty.type === 'object' ? 'ob-badge-green' : 'ob-badge-amber'">
              {{ activeProperty.type === 'object' ? 'Object Property' : 'Datatype Property' }}
            </span>
          </div>
          <code class="ob-code-block">{{ activeProperty.iri }}</code>
        </div>

        <div class="ob-section">
          <div v-if="activeProperty.comment" class="ob-text-md">{{ activeProperty.comment }}</div>

          <div v-if="activeProperty.domain || activeProperty.domainUnion" class="ob-prop-detail-row">
            <span class="ob-meta-label">Domain:</span>
            <template v-if="activeProperty.domainUnion">
              <button v-for="d in activeProperty.domainUnion" :key="d"
                class="ob-link-badge ob-link-badge-blue"
                @click="navigate('class', d)">{{ d }}</button>
            </template>
            <button v-else-if="activeProperty.domain"
              class="ob-link-badge ob-link-badge-blue"
              @click="navigate('class', activeProperty.domain)">{{ activeProperty.domain }}</button>
          </div>

          <div v-if="activeProperty.range || activeProperty.rangeUnion" class="ob-prop-detail-row">
            <span class="ob-meta-label">Range:</span>
            <template v-if="activeProperty.rangeUnion">
              <code v-for="r in activeProperty.rangeUnion" :key="r" class="ob-code-sm">{{ r }}</code>
            </template>
            <code v-else-if="activeProperty.range" class="ob-code-sm">{{ activeProperty.range }}</code>
          </div>

          <div v-if="activeProperty.inverseOf" class="ob-prop-detail-row">
            <span class="ob-meta-label">Inverse of:</span>
            <button class="ob-link-badge ob-link-badge-blue"
              @click="navigate('property', activeProperty.inverseOf)">{{ activeProperty.inverseOf }}</button>
          </div>
        </div>
      </template>

      <!-- Taxonomy detail -->
      <template v-if="currentView === 'taxonomy' && activeTaxonomyData">
        <nav class="ob-breadcrumb">
          <button class="ob-link-button" @click="navigate('overview')">Overview</button>
          <span class="ob-sep">/</span>
          <span class="ob-breadcrumb-current">{{ taxonomyLabels[activeTaxonomy!] }}</span>
        </nav>

        <div class="ob-detail-header">
          <h2 class="ob-title">{{ taxonomyLabels[activeTaxonomy!] }}</h2>
          <code class="ob-code-block">{{ activeTaxonomyData.scheme }}</code>
        </div>

        <!-- Referencing shapes -->
        <div v-if="activeTaxonomy && getShapesForTaxonomy(activeTaxonomy).length" class="ob-section">
          <h3 class="ob-heading">Referencing SHACL Shapes</h3>
          <div class="ob-tag-list">
            <button v-for="shape in getShapesForTaxonomy(activeTaxonomy!)" :key="shape.compact"
              class="ob-link-badge ob-link-badge-purple"
              @click="navigate('shape', shape.compact)">
              {{ shape.label }}
            </button>
          </div>
        </div>

        <div class="ob-section">
          <div v-for="concept in activeTaxonomyData.concepts" :key="concept.id" class="ob-card">
            <div class="ob-concept-header">
              <code class="ob-code-bold">{{ concept.id }}</code>
              <span class="ob-text-sm">{{ concept.prefLabel }}</span>
              <span v-if="concept.altLabel" class="ob-text-muted ob-text-sm">({{ concept.altLabel }})</span>
            </div>
            <p v-if="concept.definition" class="ob-text-sm ob-text-muted ob-concept-def">{{ concept.definition }}</p>
            <div v-if="concept.broader" class="ob-card-meta">
              broader: <code>{{ concept.broader }}</code>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.ontology-browser {
  max-width: 64rem;
  margin: 0 auto;
}

.ob-loading {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
}

.ob-section { margin-bottom: 2rem; }
.ob-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.25rem; }
.ob-heading { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.75rem; border-top: 1px solid var(--vp-c-divider); padding-top: 1.5rem; }
.ob-subtitle { font-size: 0.875rem; color: var(--vp-c-text-2); margin-bottom: 0.75rem; }
.ob-description { font-size: 0.875rem; color: var(--vp-c-text-2); line-height: 1.6; max-width: 42rem; }
.ob-description p { margin-bottom: 0.5rem; }
.ob-text-sm { font-size: 0.8rem; color: var(--vp-c-text-2); }
.ob-text-md { font-size: 0.875rem; color: var(--vp-c-text-2); line-height: 1.6; margin-top: 0.75rem; }
.ob-text-muted { color: var(--vp-c-text-3); }
.ob-text-blue { color: var(--vp-c-brand-1); }
.ob-text-bold-purple { font-size: 0.8rem; font-weight: 500; color: #7c3aed; }

.ob-meta { margin-top: 0.75rem; }
.ob-meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem; }
.ob-meta-label { font-size: 0.7rem; color: var(--vp-c-text-3); }
.ob-meta-date { font-size: 0.65rem; color: var(--vp-c-text-3); }
.ob-link-sm { font-size: 0.65rem; color: var(--vp-c-brand-1); text-decoration: none; }
.ob-link-sm:hover { text-decoration: underline; }

.ob-code-sm { font-size: 0.7rem; background: var(--vp-c-default-soft); padding: 0.125rem 0.375rem; border-radius: 3px; font-family: var(--vp-font-family-mono); }
.ob-code-block { display: block; font-size: 0.75rem; color: var(--vp-c-text-3); margin-top: 0.25rem; font-family: var(--vp-font-family-mono); }
.ob-code-purple { font-size: 0.7rem; color: #7c3aed; background: rgba(124,58,237,0.08); padding: 0.125rem 0.375rem; border-radius: 3px; font-family: var(--vp-font-family-mono); }
.ob-code-pink { font-size: 0.7rem; color: #be185d; background: rgba(190,24,93,0.08); padding: 0.125rem 0.375rem; border-radius: 3px; font-family: var(--vp-font-family-mono); }
.ob-code-bold { font-size: 0.8rem; font-weight: 600; font-family: var(--vp-font-family-mono); }

.ob-badges { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-top: 0.75rem; }
.ob-badge { font-size: 0.65rem; padding: 0.125rem 0.5rem; border-radius: 9999px; }
.ob-badge-blue { background: rgba(59,130,246,0.1); color: #2563eb; }
.ob-badge-green { background: rgba(16,185,129,0.1); color: #059669; }
.ob-badge-amber { background: rgba(245,158,11,0.1); color: #b45309; }
.ob-badge-purple { background: rgba(124,58,237,0.1); color: #7c3aed; }
.ob-badge-rose { background: rgba(225,29,72,0.1); color: #be123c; }
.ob-badge-pink { background: rgba(190,24,93,0.1); color: #be185d; }
.ob-badge-neutral { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }

.ob-grid-2 { display: grid; gap: 0.75rem; grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); }

.ob-card { border: 1px solid var(--vp-c-divider); border-radius: 0.5rem; padding: 0.75rem; }
.ob-card-clickable { cursor: pointer; transition: border-color 0.15s, background-color 0.15s; text-align: left; width: 100%; }
.ob-card-clickable:hover { border-color: var(--vp-c-brand-1); background: var(--vp-c-default-soft); }
.ob-card-header { display: flex; align-items: center; gap: 0.5rem; }
.ob-card-label { font-size: 0.875rem; font-weight: 500; }
.ob-card-desc { font-size: 0.75rem; color: var(--vp-c-text-2); margin-top: 0.25rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ob-card-meta { font-size: 0.65rem; color: var(--vp-c-text-3); margin-top: 0.25rem; }
.ob-card-meta code { font-size: inherit; }

.ob-groups { display: flex; flex-direction: column; gap: 0.75rem; }
.ob-group-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem; }

.ob-tag-list { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.ob-tag { font-size: 0.65rem; background: var(--vp-c-default-soft); color: var(--vp-c-text-2); padding: 0.125rem 0.5rem; border-radius: 3px; cursor: pointer; border: none; }
.ob-tag:hover { background: var(--vp-c-default-2); }

.ob-prop-chip { border: 1px solid var(--vp-c-divider); border-radius: 0.375rem; padding: 0.375rem 0.75rem; display: flex; align-items: center; gap: 0.5rem; }

.ob-breadcrumb { display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; color: var(--vp-c-text-2); margin-bottom: 1rem; flex-wrap: wrap; }
.ob-sep { color: var(--vp-c-text-3); }
.ob-breadcrumb-current { color: var(--vp-c-text-1); font-weight: 500; }

.ob-link-button { background: none; border: none; cursor: pointer; font-size: inherit; color: var(--vp-c-brand-1); padding: 0; font-weight: 500; }
.ob-link-button:hover { text-decoration: underline; }

.ob-detail-header { padding-bottom: 1rem; border-bottom: 1px solid var(--vp-c-divider); margin-bottom: 1rem; }
.ob-title-row { display: flex; align-items: center; gap: 0.75rem; }

.ob-subclass { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; font-size: 0.875rem; flex-wrap: wrap; }
.ob-arrow { color: var(--vp-c-text-3); }

.ob-target-row { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap; }
.ob-target-item { display: flex; align-items: center; gap: 0.5rem; }

.ob-link-badge { font-size: 0.75rem; border-radius: 3px; padding: 0.125rem 0.5rem; cursor: pointer; border: none; font-family: var(--vp-font-family-mono); }
.ob-link-badge-blue { color: var(--vp-c-brand-1); background: rgba(59,130,246,0.08); }
.ob-link-badge-blue:hover { background: rgba(59,130,246,0.16); }
.ob-link-badge-rose { color: #be123c; background: rgba(225,29,72,0.08); }
.ob-link-badge-rose:hover { background: rgba(225,29,72,0.16); }
.ob-link-badge-purple { color: #7c3aed; background: rgba(124,58,237,0.08); }
.ob-link-badge-purple:hover { background: rgba(124,58,237,0.16); }

.ob-shape-box { border: 1px solid rgba(124,58,237,0.2); background: rgba(124,58,237,0.04); border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 0.75rem; }
.ob-shape-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.ob-constraint-list { display: grid; gap: 0.25rem; }
.ob-constraint-row { display: flex; align-items: flex-start; gap: 0.5rem; }
.ob-cardinality { margin-left: 0.25rem; color: var(--vp-c-text-3); }
.ob-inverse { font-size: 0.65rem; color: var(--vp-c-text-3); margin-top: 0.125rem; }

.ob-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.ob-table th { text-align: left; font-size: 0.7rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--vp-c-text-3); padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--vp-c-divider); }
.ob-table td { padding: 0.5rem 0.75rem; vertical-align: top; border-bottom: 1px solid var(--vp-c-divider); }
.ob-table tr:last-child td { border-bottom: none; }

.ob-empty { font-size: 0.875rem; color: var(--vp-c-text-3); font-style: italic; }

.ob-prop-detail-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap; font-size: 0.875rem; }

.ob-concept-header { display: flex; align-items: center; gap: 0.5rem; }
.ob-concept-def { margin-top: 0.25rem; line-height: 1.5; }

.dark .ob-code-purple { color: #a78bfa; background: rgba(167,139,250,0.1); }
.dark .ob-code-pink { color: #f472b6; background: rgba(244,114,182,0.1); }
.dark .ob-badge-blue { background: rgba(96,165,250,0.15); color: #60a5fa; }
.dark .ob-badge-green { background: rgba(52,211,153,0.15); color: #34d399; }
.dark .ob-badge-amber { background: rgba(251,191,36,0.15); color: #fbbf24; }
.dark .ob-badge-purple { background: rgba(167,139,250,0.15); color: #a78bfa; }
.dark .ob-badge-rose { background: rgba(251,113,133,0.15); color: #fb7185; }
.dark .ob-badge-pink { background: rgba(244,114,182,0.15); color: #f472b6; }
.dark .ob-text-bold-purple { color: #a78bfa; }
.dark .ob-text-blue { color: #60a5fa; }
.dark .ob-shape-box { border-color: rgba(167,139,250,0.2); background: rgba(167,139,250,0.04); }
.dark .ob-link-badge-blue { color: #60a5fa; background: rgba(96,165,250,0.1); }
.dark .ob-link-badge-blue:hover { background: rgba(96,165,250,0.2); }
.dark .ob-link-badge-rose { color: #fb7185; background: rgba(251,113,133,0.1); }
.dark .ob-link-badge-rose:hover { background: rgba(251,113,133,0.2); }
.dark .ob-link-badge-purple { color: #a78bfa; background: rgba(167,139,250,0.1); }
.dark .ob-link-badge-purple:hover { background: rgba(167,139,250,0.2); }
</style>
