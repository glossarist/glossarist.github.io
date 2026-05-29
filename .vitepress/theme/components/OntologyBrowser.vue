<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'

type View = 'overview' | 'class' | 'shape' | 'property' | 'taxonomy'
type SidebarTab = 'classes' | 'properties' | 'shapes' | 'taxonomies'

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

interface FlatTreeNode {
  id: string
  label: string
  compact: string
  depth: number
  hasChildren: boolean
  expanded: boolean
}

interface SearchResult {
  view: View
  id: string
  label: string
  compact: string
  type: string
}

// --- State ---
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
const sidebarTab = ref<SidebarTab>('classes')
const sidebarOpen = ref(false)
const searchQuery = ref('')
const searchFocused = ref(false)
const expandedNodes = ref<Set<string>>(new Set())

// --- Data loading ---
onMounted(async () => {
  const [schemaResp, taxResp] = await Promise.all([
    fetch('/data/ontology-schema.json'),
    fetch('/data/taxonomies.json'),
  ])
  const schema = await schemaResp.json()
  const tax = await taxResp.json()

  ontologyMeta.value = schema.ontology
  classes.value = schema.classes || {}
  roots.value = schema.classHierarchyRoots || []
  properties.value = schema.properties || {}
  propsByDomain.value = schema.propertiesByDomain || {}
  shapes.value = schema.shapes || {}
  shapesByTargetClass.value = schema.shapesByTargetClass || {}
  annotationProps.value = schema.annotationProperties || []
  stats.value = schema.stats || stats.value
  taxonomies.value = tax || {}

  // Expand all tree nodes by default
  expandedNodes.value = new Set(Object.keys(classes.value))
  loaded.value = true
})

// --- Navigation ---
function navigate(view: View, id: string = '') {
  currentView.value = view
  activeId.value = id
  sidebarOpen.value = false
  nextTick(() => {
    const el = document.querySelector('.ob-main')
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function toggleNode(id: string) {
  const s = new Set(expandedNodes.value)
  if (s.has(id)) s.delete(id); else s.add(id)
  expandedNodes.value = s
}

// --- Computed data ---
const allClasses = computed(() => Object.values(classes.value))
const allProperties = computed(() => Object.values(properties.value))
const allShapes = computed(() => Object.values(shapes.value))

const flatClassTree = computed<FlatTreeNode[]>(() => {
  const result: FlatTreeNode[] = []
  function walk(ids: string[], depth: number) {
    for (const id of ids) {
      const cls = classes.value[id]
      if (!cls) continue
      const expanded = expandedNodes.value.has(id)
      result.push({ id, label: cls.label, compact: cls.compact, depth, hasChildren: cls.children.length > 0, expanded })
      if (expanded && cls.children.length > 0) walk(cls.children, depth + 1)
    }
  }
  walk(roots.value, 0)
  return result
})

const taxonomyKeys = computed(() => Object.keys(taxonomies.value))
const taxonomyLabels = computed(() => {
  const labels: Record<string, string> = {}
  for (const key of taxonomyKeys.value) labels[key] = taxonomies.value[key]?.schemeLabel || key
  return labels
})

const totalTaxonomyIndividuals = computed(() =>
  taxonomyKeys.value.reduce((sum, key) => sum + Object.keys(taxonomies.value[key]?.concepts || {}).length, 0),
)

const groupedIndividuals = computed(() =>
  taxonomyKeys.value.map(key => {
    const tax = taxonomies.value[key]
    return {
      key,
      label: tax?.schemeLabel || key,
      concepts: Object.values(tax?.concepts || {}).map(c => ({ id: c.id, prefLabel: c.prefLabel })),
    }
  }),
)

// --- Search ---
const searchResults = computed<SearchResult[]>(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  const q = searchQuery.value.toLowerCase()
  const results: SearchResult[] = []

  for (const cls of Object.values(classes.value)) {
    if (cls.label.toLowerCase().includes(q) || cls.compact.toLowerCase().includes(q))
      results.push({ view: 'class', id: cls.compact, label: cls.label, compact: cls.compact, type: 'class' })
  }
  for (const p of Object.values(properties.value)) {
    if (p.label.toLowerCase().includes(q) || p.compact.toLowerCase().includes(q))
      results.push({ view: 'property', id: p.compact, label: p.label, compact: p.compact, type: p.type === 'object' ? 'obj-prop' : 'dt-prop' })
  }
  for (const s of Object.values(shapes.value)) {
    if (s.label.toLowerCase().includes(q) || s.compact.toLowerCase().includes(q))
      results.push({ view: 'shape', id: s.compact, label: s.label, compact: s.compact, type: 'shape' })
  }
  for (const key of taxonomyKeys.value) {
    const tax = taxonomies.value[key]
    if (!tax) continue
    if ((tax.schemeLabel || key).toLowerCase().includes(q))
      results.push({ view: 'taxonomy', id: key, label: tax.schemeLabel || key, compact: key, type: 'taxonomy' })
  }
  return results.slice(0, 15)
})

function searchSelect(result: SearchResult) {
  navigate(result.view, result.id)
  searchQuery.value = ''
  searchFocused.value = false
}

// --- Adapter helpers ---
function getClass(id: string): OwlClass | null { return classes.value[id] ?? null }
function getProperty(id: string): OwlProperty | null { return properties.value[id] ?? null }

function getPropertiesForDomain(domain: string) {
  const group = propsByDomain.value[domain]
  if (!group) return { object: [], datatype: [] }
  return {
    object: group.object.map(id => properties.value[id]).filter(Boolean),
    datatype: group.datatype.map(id => properties.value[id]).filter(Boolean),
  }
}

function getAllPropertiesForClass(classId: string) {
  const cls = classes.value[classId]
  if (!cls) return { object: [], datatype: [] }
  const chain = [classId, ...cls.ancestors]
  const objectProps: OwlProperty[] = [], datatypeProps: OwlProperty[] = []
  const seen = new Set<string>()
  for (const c of chain) {
    const props = getPropertiesForDomain(c)
    for (const p of props.object) { if (!seen.has(p.compact)) { seen.add(p.compact); objectProps.push(p) } }
    for (const p of props.datatype) { if (!seen.has(p.compact)) { seen.add(p.compact); datatypeProps.push(p) } }
  }
  return { object: objectProps, datatype: datatypeProps }
}

function getShapesForClass(classId: string) {
  return (shapesByTargetClass.value[classId] ?? []).map(id => shapes.value[id]).filter(Boolean)
}

function taxonomyKeyForValuesFrom(valuesFrom: string | null): string | null {
  if (!valuesFrom) return null
  for (const [key, tax] of Object.entries(taxonomies.value)) {
    if (tax?.scheme === valuesFrom) return key
  }
  return null
}

// --- Active item computeds ---
const activeClass = computed(() => currentView.value === 'class' ? getClass(activeId.value) : null)
const activeProperties = computed(() => currentView.value === 'class' ? getAllPropertiesForClass(activeId.value) : { object: [], datatype: [] })
const activeClassShapes = computed(() => currentView.value === 'class' ? getShapesForClass(activeId.value) : [])
const activeShape = computed(() => currentView.value === 'shape' ? shapes.value[activeId.value] ?? null : null)
const activeProperty = computed(() => currentView.value === 'property' ? getProperty(activeId.value) : null)

const activeTaxonomyData = computed(() => {
  if (currentView.value !== 'taxonomy') return null
  const tax = taxonomies.value[activeId.value]
  if (!tax) return null
  const all = Object.values(tax.concepts)
  const alphaIndex: Record<string, typeof all> = {}
  for (const c of all) {
    const letter = (c.prefLabel || c.id).charAt(0).toUpperCase()
    if (!alphaIndex[letter]) alphaIndex[letter] = []
    alphaIndex[letter].push(c)
  }
  for (const letter of Object.keys(alphaIndex)) {
    alphaIndex[letter].sort((a, b) => (a.prefLabel || a.id).localeCompare(b.prefLabel || b.id))
  }
  return {
    scheme: tax.scheme,
    definition: tax.schemeDefinition,
    concepts: all,
    top: all.filter(c => !c.broader),
    alphaIndex,
    alphaLetters: Object.keys(alphaIndex).sort(),
  }
})

const taxonomyAlphaFilter = ref('')

// Keyboard shortcut for search
onMounted(() => {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      const input = document.querySelector('.ob-search-input') as HTMLInputElement
      if (input) input.focus()
    }
  })
})
</script>

<template>
  <div class="ob">
    <div v-if="!loaded" class="ob-loading">
      <div class="ob-spinner"></div>
      <span>Loading ontology data&hellip;</span>
    </div>

    <template v-else>
      <!-- Top bar -->
      <div class="ob-topbar">
        <div class="ob-search">
          <svg class="ob-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            v-model="searchQuery"
            @focus="searchFocused = true"
            @blur="setTimeout(() => searchFocused = false, 200)"
            type="text"
            placeholder="Search classes, properties, shapes…"
            class="ob-search-input"
          />
          <kbd class="ob-search-kbd">⌘K</kbd>
          <div v-if="searchQuery.length >= 2 && searchFocused && searchResults.length" class="ob-search-dropdown">
            <button v-for="r in searchResults" :key="r.compact" class="ob-search-item" @mousedown="searchSelect(r)">
              <span class="ob-dot" :class="'ob-dot-' + r.type"></span>
              <span class="ob-search-item-label">{{ r.label }}</span>
              <code class="ob-search-item-compact">{{ r.compact }}</code>
            </button>
          </div>
        </div>
        <div class="ob-stat-pills">
          <span class="ob-pill ob-pill-class">{{ stats.classCount }} classes</span>
          <span class="ob-pill ob-pill-prop">{{ stats.objectPropertyCount + stats.datatypePropertyCount }} properties</span>
          <span class="ob-pill ob-pill-shape">{{ stats.shapeCount }} shapes</span>
          <span class="ob-pill ob-pill-tax">{{ totalTaxonomyIndividuals }} individuals</span>
        </div>
      </div>

      <!-- Body: sidebar + main -->
      <div class="ob-body">
        <!-- Mobile sidebar toggle -->
        <button class="ob-sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          Browse
        </button>

        <!-- Sidebar -->
        <aside class="ob-sidebar" :class="{ 'ob-sidebar-open': sidebarOpen }">
          <div class="ob-tabs">
            <button v-for="tab in (['classes', 'properties', 'shapes', 'taxonomies'] as SidebarTab[])" :key="tab"
              class="ob-tab" :class="{ active: sidebarTab === tab }"
              @click="sidebarTab = tab">
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </div>

          <!-- Classes tree -->
          <div v-if="sidebarTab === 'classes'" class="ob-tree">
            <button class="ob-tree-item ob-tree-overview" :class="{ active: currentView === 'overview' }"
              @click="navigate('overview')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              Overview
            </button>
            <template v-for="node in flatClassTree" :key="node.id">
              <button class="ob-tree-item"
                :class="{ active: currentView === 'class' && activeId === node.id }"
                :style="{ paddingLeft: node.depth * 20 + 12 + 'px' }"
                @click="navigate('class', node.id)">
                <span v-if="node.hasChildren" class="ob-tree-toggle" @click.stop="toggleNode(node.id)">
                  {{ node.expanded ? '▾' : '▸' }}
                </span>
                <span v-else class="ob-tree-leaf">&bull;</span>
                <span class="ob-tree-label">{{ node.label }}</span>
              </button>
            </template>
          </div>

          <!-- Properties list -->
          <div v-if="sidebarTab === 'properties'" class="ob-tree">
            <button v-for="p in allProperties" :key="p.compact" class="ob-tree-item"
              :class="{ active: currentView === 'property' && activeId === p.compact }"
              @click="navigate('property', p.compact)">
              <span class="ob-dot ob-dot-obj" v-if="p.type === 'object'"></span>
              <span class="ob-dot ob-dot-dt" v-else></span>
              <span class="ob-tree-label">{{ p.label }}</span>
            </button>
          </div>

          <!-- Shapes list -->
          <div v-if="sidebarTab === 'shapes'" class="ob-tree">
            <button v-for="s in allShapes" :key="s.compact" class="ob-tree-item"
              :class="{ active: currentView === 'shape' && activeId === s.compact }"
              @click="navigate('shape', s.compact)">
              <span class="ob-dot ob-dot-shape"></span>
              <span class="ob-tree-label">{{ s.label }}</span>
            </button>
          </div>

          <!-- Taxonomies list -->
          <div v-if="sidebarTab === 'taxonomies'" class="ob-tree">
            <button v-for="group in groupedIndividuals" :key="group.key" class="ob-tree-item"
              :class="{ active: currentView === 'taxonomy' && activeId === group.key }"
              @click="navigate('taxonomy', group.key)">
              <span class="ob-dot ob-dot-taxonomy"></span>
              <span class="ob-tree-label">{{ group.label }}</span>
              <span class="ob-tree-count">{{ group.concepts.length }}</span>
            </button>
          </div>
        </aside>

        <!-- Main panel -->
        <main class="ob-main">
          <!-- ========== Overview ========== -->
          <template v-if="currentView === 'overview'">
            <div class="ob-overview">
              <h2 class="ob-title">Glossarist Ontology</h2>
              <p class="ob-subtitle">OWL ontology for terminology management aligned with ISO 10241-1, 30042, 12620, and 25964/SKOS</p>

              <div class="ob-overview-desc">
                <p>The Glossarist ontology defines the RDF/OWL vocabulary for describing structured terminology data. It models <strong>concepts</strong> with multilingual <strong>localizations</strong> and typed <strong>designations</strong> using the SKOS-XL pattern for reified lexical labels.</p>
                <p>It aligns with <strong>SKOS</strong>, <strong>SKOS-XL</strong>, <strong>ISO 25964</strong>, <strong>PROV-O</strong>, and <strong>Dublin Core Terms</strong>.</p>
              </div>

              <div v-if="ontologyMeta" class="ob-meta-bar">
                <code class="ob-meta-iri">{{ ontologyMeta.iri }}</code>
                <span v-if="ontologyMeta.created" class="ob-meta-date">{{ ontologyMeta.created }}</span>
                <a v-if="ontologyMeta.license" :href="ontologyMeta.license" target="_blank" rel="noopener" class="ob-meta-link">CC BY 4.0</a>
              </div>

              <div v-if="ontologyMeta?.imports.length" class="ob-imports">
                <span class="ob-meta-label">Imports</span>
                <span v-for="imp in ontologyMeta.imports" :key="imp.iri" class="ob-pill ob-pill-neutral">{{ imp.label }}</span>
              </div>

              <!-- Stats cards -->
              <div class="ob-stat-cards">
                <div class="ob-stat-card" @click="sidebarTab = 'classes'">
                  <span class="ob-stat-num ob-color-class">{{ stats.classCount }}</span>
                  <span class="ob-stat-label">Classes</span>
                </div>
                <div class="ob-stat-card" @click="sidebarTab = 'properties'">
                  <span class="ob-stat-num ob-color-prop">{{ stats.objectPropertyCount + stats.datatypePropertyCount }}</span>
                  <span class="ob-stat-label">Properties</span>
                </div>
                <div class="ob-stat-card" @click="sidebarTab = 'shapes'">
                  <span class="ob-stat-num ob-color-shape">{{ stats.shapeCount }}</span>
                  <span class="ob-stat-label">SHACL Shapes</span>
                </div>
                <div class="ob-stat-card" @click="sidebarTab = 'taxonomies'">
                  <span class="ob-stat-num ob-color-tax">{{ totalTaxonomyIndividuals }}</span>
                  <span class="ob-stat-label">Named Individuals</span>
                </div>
              </div>

              <!-- Class hierarchy visual -->
              <div class="ob-section">
                <h3 class="ob-heading">Class Hierarchy</h3>
                <div class="ob-hierarchy">
                  <template v-for="rootId in roots" :key="rootId">
                    <div class="ob-hier-node ob-hier-root">
                      <span class="ob-dot ob-dot-class"></span>
                      <button class="ob-hier-link" @click="navigate('class', rootId)">{{ getClass(rootId)?.label || rootId }}</button>
                      <span class="ob-hier-count">{{ getClass(rootId)?.children.length || 0 }}</span>
                    </div>
                    <div v-for="childId in (getClass(rootId)?.children || [])" :key="childId" class="ob-hier-node ob-hier-l1">
                      <span class="ob-dot ob-dot-class"></span>
                      <button class="ob-hier-link" @click="navigate('class', childId)">{{ getClass(childId)?.label || childId }}</button>
                      <span v-if="getClass(childId)?.children.length" class="ob-hier-count">{{ getClass(childId)?.children.length }}</span>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Annotation Properties -->
              <div class="ob-section">
                <h3 class="ob-heading">Annotation Properties</h3>
                <div class="ob-chip-grid">
                  <div v-for="ap in annotationProps" :key="ap.compact" class="ob-chip">
                    <code>{{ ap.compact }}</code>
                    <span>{{ ap.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ========== Class detail ========== -->
          <template v-if="currentView === 'class' && activeClass">
            <nav class="ob-breadcrumb">
              <button class="ob-bc-link" @click="navigate('overview')">Overview</button>
              <template v-if="activeClass.ancestors.length">
                <span class="ob-bc-sep">/</span>
                <template v-for="(anc, i) in activeClass.ancestors" :key="anc">
                  <button class="ob-bc-link" @click="navigate('class', anc)">{{ getClass(anc)?.label || anc }}</button>
                  <span class="ob-bc-sep">/</span>
                </template>
              </template>
              <span class="ob-bc-current">{{ activeClass.label }}</span>
            </nav>

            <div class="ob-detail-head">
              <div class="ob-detail-type ob-color-class-badge">Class</div>
              <h2 class="ob-title">{{ activeClass.label }}</h2>
              <code class="ob-iri">{{ activeClass.iri }}</code>

              <div v-if="activeClass.subClassOf" class="ob-rel-row">
                <span class="ob-meta-label">subClassOf</span>
                <button class="ob-link-badge ob-link-class" @click="navigate('class', activeClass.subClassOf)">{{ activeClass.subClassOf }}</button>
                <template v-if="activeClass.ancestors.length > 1">
                  <span class="ob-arrow">&rarr;</span>
                  <span class="ob-text-sm">{{ activeClass.ancestors.slice(1).map(a => getClass(a)?.label || a).join(' → ') }}</span>
                </template>
              </div>

              <p v-if="activeClass.comment" class="ob-desc">{{ activeClass.comment }}</p>

              <!-- Children -->
              <div v-if="activeClass.children.length" class="ob-rel-row">
                <span class="ob-meta-label">subclasses</span>
                <button v-for="child in activeClass.children" :key="child"
                  class="ob-link-badge ob-link-class" @click="navigate('class', child)">
                  {{ getClass(child)?.label || child }}
                </button>
              </div>
            </div>

            <!-- SHACL Shapes -->
            <div v-if="activeClassShapes.length" class="ob-section">
              <h3 class="ob-heading">SHACL Shape{{ activeClassShapes.length > 1 ? 's' : '' }}</h3>
              <div v-for="shape in activeClassShapes" :key="shape.compact" class="ob-shape-block">
                <div class="ob-shape-head">
                  <span class="ob-color-shape-badge">{{ shape.label }}</span>
                  <button class="ob-text-link" @click="navigate('shape', shape.compact)">View full shape &rarr;</button>
                </div>
                <table class="ob-constraint-table">
                  <thead>
                    <tr><th>Property</th><th>Type</th><th>Cardinality</th><th>Values</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(c, ci) in shape.constraints" :key="c.path ?? ci">
                      <td><code class="ob-code ob-code-shape">{{ c.path }}</code></td>
                      <td>
                        <span v-if="c.datatype"><code class="ob-code">{{ c.datatype }}</code></span>
                        <button v-else-if="c.class" class="ob-link-badge ob-link-class" @click="navigate('class', c.class)">{{ c.class }}</button>
                        <span v-else class="ob-muted">&mdash;</span>
                      </td>
                      <td>
                        <span v-if="c.minCount !== null || c.maxCount !== null" class="ob-cardinality">{{ c.minCount ?? 0 }}..{{ c.maxCount ?? '∗' }}</span>
                        <span v-else class="ob-muted">&mdash;</span>
                      </td>
                      <td>
                        <button v-if="c.valuesFrom && taxonomyKeyForValuesFrom(c.valuesFrom)"
                          class="ob-link-badge ob-link-tax" @click="navigate('taxonomy', taxonomyKeyForValuesFrom(c.valuesFrom)!)">{{ c.valuesFrom.split('/').pop() }}</button>
                        <span v-else-if="c.in" class="ob-text-sm">{{ c.in.join(' | ') }}</span>
                        <span v-else class="ob-muted">&mdash;</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Object Properties -->
            <div v-if="activeProperties.object.length" class="ob-section">
              <h3 class="ob-heading">Object Properties ({{ activeProperties.object.length }})</h3>
              <table class="ob-prop-table">
                <thead><tr><th>Property</th><th>Range</th><th>Description</th></tr></thead>
                <tbody>
                  <tr v-for="p in activeProperties.object" :key="p.compact">
                    <td>
                      <button class="ob-link-badge ob-link-prop" @click="navigate('property', p.compact)">{{ p.compact }}</button>
                      <div v-if="p.inverseOf" class="ob-inverse">&harr; {{ p.inverseOf }}</div>
                    </td>
                    <td><code class="ob-code">{{ p.range || p.rangeUnion?.join(' | ') || '—' }}</code></td>
                    <td class="ob-text-sm">{{ p.comment || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Datatype Properties -->
            <div v-if="activeProperties.datatype.length" class="ob-section">
              <h3 class="ob-heading">Datatype Properties ({{ activeProperties.datatype.length }})</h3>
              <table class="ob-prop-table">
                <thead><tr><th>Property</th><th>Datatype</th><th>Description</th></tr></thead>
                <tbody>
                  <tr v-for="p in activeProperties.datatype" :key="p.compact">
                    <td>
                      <button class="ob-link-badge ob-link-prop" @click="navigate('property', p.compact)">{{ p.compact }}</button>
                    </td>
                    <td><code class="ob-code">{{ p.range || '—' }}</code></td>
                    <td class="ob-text-sm">{{ p.comment || '' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="!activeProperties.object.length && !activeProperties.datatype.length && !activeClassShapes.length" class="ob-empty">
              No properties or shapes defined directly on this class.
            </div>
          </template>

          <!-- ========== Shape detail ========== -->
          <template v-if="currentView === 'shape' && activeShape">
            <nav class="ob-breadcrumb">
              <button class="ob-bc-link" @click="navigate('overview')">Overview</button>
              <span class="ob-bc-sep">/</span>
              <span class="ob-bc-current">{{ activeShape.label }} Shape</span>
            </nav>

            <div class="ob-detail-head">
              <div class="ob-detail-type ob-color-shape-badge">SHACL Shape</div>
              <h2 class="ob-title">{{ activeShape.label }} Shape</h2>
              <code class="ob-iri">{{ activeShape.iri }}</code>

              <div class="ob-rel-row">
                <div v-if="activeShape.targetClass" class="ob-rel-item">
                  <span class="ob-meta-label">targetClass</span>
                  <button class="ob-link-badge ob-link-class" @click="navigate('class', activeShape.targetClass)">{{ activeShape.targetClass }}</button>
                </div>
                <div v-if="activeShape.shapeClass" class="ob-rel-item">
                  <span class="ob-meta-label">class</span>
                  <code class="ob-code">{{ activeShape.shapeClass }}</code>
                </div>
              </div>
              <p v-if="activeShape.comment" class="ob-desc">{{ activeShape.comment }}</p>
            </div>

            <div class="ob-section">
              <h3 class="ob-heading">Constraints ({{ activeShape.constraints.length }})</h3>
              <table class="ob-constraint-table">
                <thead><tr><th>Path</th><th>Type / Class</th><th>Cardinality</th><th>Values</th></tr></thead>
                <tbody>
                  <tr v-for="(c, ci) in activeShape.constraints" :key="c.path ?? ci">
                    <td><code class="ob-code ob-code-shape">{{ c.path }}</code></td>
                    <td>
                      <span v-if="c.datatype"><code class="ob-code">{{ c.datatype }}</code></span>
                      <button v-else-if="c.class" class="ob-link-badge ob-link-class" @click="navigate('class', c.class)">{{ c.class }}</button>
                      <span v-else class="ob-muted">&mdash;</span>
                    </td>
                    <td>
                      <span v-if="c.minCount !== null || c.maxCount !== null">{{ c.minCount ?? 0 }}..{{ c.maxCount ?? '∗' }}</span>
                      <span v-else class="ob-muted">&mdash;</span>
                    </td>
                    <td>
                      <button v-if="c.valuesFrom && taxonomyKeyForValuesFrom(c.valuesFrom)"
                        class="ob-link-badge ob-link-tax" @click="navigate('taxonomy', taxonomyKeyForValuesFrom(c.valuesFrom)!)">{{ c.valuesFrom.split('/').pop() }}</button>
                      <span v-else-if="c.in" class="ob-text-sm">{{ c.in.join(' | ') }}</span>
                      <span v-else class="ob-muted">&mdash;</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- ========== Property detail ========== -->
          <template v-if="currentView === 'property' && activeProperty">
            <nav class="ob-breadcrumb">
              <button class="ob-bc-link" @click="navigate('overview')">Overview</button>
              <span class="ob-bc-sep">/</span>
              <span class="ob-bc-current">{{ activeProperty.label }}</span>
            </nav>

            <div class="ob-detail-head">
              <div class="ob-detail-type" :class="activeProperty.type === 'object' ? 'ob-color-prop-badge' : 'ob-color-shape-badge'">
                {{ activeProperty.type === 'object' ? 'Object Property' : 'Datatype Property' }}
              </div>
              <h2 class="ob-title">{{ activeProperty.label }}</h2>
              <code class="ob-iri">{{ activeProperty.iri }}</code>
            </div>

            <div class="ob-section">
              <p v-if="activeProperty.comment" class="ob-desc">{{ activeProperty.comment }}</p>

              <div v-if="activeProperty.domain || activeProperty.domainUnion" class="ob-rel-row">
                <span class="ob-meta-label">Domain</span>
                <template v-if="activeProperty.domainUnion">
                  <button v-for="d in activeProperty.domainUnion" :key="d" class="ob-link-badge ob-link-class" @click="navigate('class', d)">{{ d }}</button>
                </template>
                <button v-else-if="activeProperty.domain" class="ob-link-badge ob-link-class" @click="navigate('class', activeProperty.domain)">{{ activeProperty.domain }}</button>
              </div>

              <div v-if="activeProperty.range || activeProperty.rangeUnion" class="ob-rel-row">
                <span class="ob-meta-label">Range</span>
                <code v-for="r in (activeProperty.rangeUnion || (activeProperty.range ? [activeProperty.range] : []))" :key="r" class="ob-code">{{ r }}</code>
              </div>

              <div v-if="activeProperty.inverseOf" class="ob-rel-row">
                <span class="ob-meta-label">Inverse of</span>
                <button class="ob-link-badge ob-link-prop" @click="navigate('property', activeProperty.inverseOf)">{{ activeProperty.inverseOf }}</button>
              </div>
            </div>
          </template>

          <!-- ========== Taxonomy detail ========== -->
          <template v-if="currentView === 'taxonomy' && activeTaxonomyData">
            <nav class="ob-breadcrumb">
              <button class="ob-bc-link" @click="navigate('overview')">Overview</button>
              <span class="ob-bc-sep">/</span>
              <span class="ob-bc-current">{{ taxonomyLabels[activeId] }}</span>
            </nav>

            <div class="ob-detail-head">
              <div class="ob-detail-type ob-color-tax-badge">SKOS ConceptScheme</div>
              <h2 class="ob-title">{{ taxonomyLabels[activeId] }}</h2>
              <code class="ob-iri">{{ activeTaxonomyData.scheme }}</code>
              <p v-if="activeTaxonomyData.definition" class="ob-desc">{{ activeTaxonomyData.definition }}</p>
            </div>

            <div class="ob-section">
              <div class="ob-tax-header">
                <h3 class="ob-heading">{{ activeTaxonomyData.concepts.length }} Concepts</h3>
                <div class="ob-alpha-nav">
                  <button v-for="letter in activeTaxonomyData.alphaLetters" :key="letter"
                    class="ob-alpha-letter" :class="{ active: taxonomyAlphaFilter === letter }"
                    @click="taxonomyAlphaFilter = taxonomyAlphaFilter === letter ? '' : letter">
                    {{ letter }}
                  </button>
                </div>
              </div>

              <div class="ob-concept-list">
                <template v-if="taxonomyAlphaFilter">
                  <div v-for="concept in activeTaxonomyData.alphaIndex[taxonomyAlphaFilter]" :key="concept.id" class="ob-concept-item">
                    <div class="ob-concept-head">
                      <code class="ob-code-bold">{{ concept.id }}</code>
                      <span class="ob-concept-label">{{ concept.prefLabel }}</span>
                      <span v-if="concept.altLabel" class="ob-muted ob-text-sm">({{ concept.altLabel }})</span>
                    </div>
                    <p v-if="concept.definition" class="ob-concept-def">{{ concept.definition }}</p>
                    <div v-if="concept.broader" class="ob-concept-broader">
                      broader: <code class="ob-code">{{ concept.broader }}</code>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div v-for="concept in activeTaxonomyData.concepts" :key="concept.id" class="ob-concept-item">
                    <div class="ob-concept-head">
                      <code class="ob-code-bold">{{ concept.id }}</code>
                      <span class="ob-concept-label">{{ concept.prefLabel }}</span>
                      <span v-if="concept.altLabel" class="ob-muted ob-text-sm">({{ concept.altLabel }})</span>
                    </div>
                    <p v-if="concept.definition" class="ob-concept-def">{{ concept.definition }}</p>
                    <div v-if="concept.broader" class="ob-concept-broader">
                      broader: <code class="ob-code">{{ concept.broader }}</code>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>

          <!-- Empty state (no selection on non-overview) -->
          <template v-if="currentView !== 'overview' && !activeClass && !activeShape && !activeProperty && !activeTaxonomyData">
            <div class="ob-empty-state">
              <p>Select an entity from the sidebar to explore.</p>
            </div>
          </template>
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ================================================================
   ONTOLOGY BROWSER — LAYOUT
   ================================================================ */

.ob { margin: 0 -24px; font-size: 0.875rem; }

.ob-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem 0;
  color: var(--vp-c-text-2);
}

.ob-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--g-teal);
  border-radius: 50%;
  animation: ob-spin 0.6s linear infinite;
}

@keyframes ob-spin { to { transform: rotate(360deg); } }

/* --- Top bar --- */
.ob-topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.ob-search {
  position: relative;
  flex: 1;
  max-width: 320px;
}

.ob-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.ob-search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.8125rem;
  outline: none;
  transition: border-color 0.15s;
}

.ob-search-input:focus { border-color: var(--vp-c-brand-1); }

.ob-search-kbd {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.625rem;
  font-family: var(--vp-font-family-mono);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  pointer-events: none;
}

.ob-search-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  max-height: 280px;
  overflow-y: auto;
  z-index: 20;
}

.ob-search-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--vp-c-text-1);
  font-size: 0.8125rem;
}

.ob-search-item:hover { background: var(--vp-c-bg-soft); }

.ob-search-item-label { flex: 1; font-weight: 500; }

.ob-search-item-compact {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.ob-stat-pills {
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.ob-pill {
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  white-space: nowrap;
}

.ob-pill-class { background: rgba(41, 65, 91, 0.1); color: var(--g-class); }
.ob-pill-prop { background: rgba(45, 143, 133, 0.1); color: var(--g-property); }
.ob-pill-shape { background: rgba(161, 98, 7, 0.1); color: var(--g-shape); }
.ob-pill-tax { background: rgba(124, 58, 237, 0.1); color: var(--g-taxonomy); }
.ob-pill-neutral { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }

.dark .ob-pill-class { background: rgba(91, 147, 196, 0.15); color: var(--g-class); }
.dark .ob-pill-prop { background: rgba(77, 212, 198, 0.15); color: var(--g-property); }
.dark .ob-pill-shape { background: rgba(251, 191, 36, 0.15); color: var(--g-shape); }
.dark .ob-pill-tax { background: rgba(167, 139, 250, 0.15); color: var(--g-taxonomy); }

/* --- Body --- */
.ob-body {
  display: flex;
  min-height: 70vh;
}

.ob-sidebar-toggle {
  display: none;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  margin: 0.75rem 1.5rem 0;
}

/* --- Sidebar --- */
.ob-sidebar {
  width: 240px;
  min-width: 240px;
  border-right: 1px solid var(--vp-c-divider);
  overflow-y: auto;
  max-height: calc(100vh - 120px);
  position: sticky;
  top: 56px;
}

.ob-tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.5rem;
}

.ob-tab {
  flex: 1;
  padding: 0.625rem 0.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  transition: all 0.15s;
}

.ob-tab:hover { color: var(--vp-c-text-2); }

.ob-tab.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.ob-tree { padding: 0.5rem 0; }

.ob-tree-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.375rem 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  transition: all 0.1s;
}

.ob-tree-item:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.ob-tree-item.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.ob-tree-overview { font-weight: 500; color: var(--vp-c-text-1); margin-bottom: 0.25rem; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 0.5rem; }

.ob-tree-toggle {
  font-size: 0.625rem;
  width: 14px;
  text-align: center;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}

.ob-tree-leaf { font-size: 0.375rem; color: var(--vp-c-text-3); width: 14px; text-align: center; flex-shrink: 0; }

.ob-tree-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.ob-tree-count {
  font-size: 0.625rem;
  background: var(--vp-c-default-soft);
  padding: 0.0625rem 0.375rem;
  border-radius: 9999px;
  color: var(--vp-c-text-3);
}

/* --- Dots --- */
.ob-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ob-dot-class, .ob-dot-obj { background: var(--g-class); }
.ob-dot-dt { background: var(--g-shape); }
.ob-dot-prop { background: var(--g-property); }
.ob-dot-shape { background: var(--g-shape); }
.ob-dot-taxonomy { background: var(--g-taxonomy); }

/* --- Main panel --- */
.ob-main {
  flex: 1;
  padding: 1.5rem;
  min-width: 0;
  overflow-x: auto;
}

/* ================================================================
   ONTOLOGY BROWSER — CONTENT
   ================================================================ */

.ob-title { font-size: 1.375rem; font-weight: 700; margin-bottom: 0.25rem; }
.ob-subtitle { font-size: 0.8125rem; color: var(--vp-c-text-2); margin-bottom: 1rem; }

.ob-overview-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  max-width: 40rem;
  margin-bottom: 1.5rem;
}

.ob-overview-desc p { margin-bottom: 0.5rem; }
.ob-overview-desc strong { color: var(--vp-c-text-1); }

/* Meta bar */
.ob-meta-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.ob-meta-iri {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.ob-meta-date { font-size: 0.6875rem; color: var(--vp-c-text-3); }
.ob-meta-link { font-size: 0.6875rem; color: var(--vp-c-brand-1); text-decoration: none; }
.ob-meta-link:hover { text-decoration: underline; }

.ob-meta-label { font-size: 0.6875rem; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }

.ob-imports {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

/* Stats cards */
.ob-stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.ob-stat-card {
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.ob-stat-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.ob-stat-num { display: block; font-size: 1.75rem; font-weight: 700; line-height: 1.2; }
.ob-stat-label { display: block; font-size: 0.6875rem; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 0.25rem; }

.ob-color-class { color: var(--g-class); }
.ob-color-prop { color: var(--g-property); }
.ob-color-shape { color: var(--g-shape); }
.ob-color-tax { color: var(--g-taxonomy); }

/* Type badges */
.ob-detail-type {
  display: inline-block;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.1875rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.ob-color-class-badge { background: rgba(41, 65, 91, 0.1); color: var(--g-class); }
.ob-color-prop-badge { background: rgba(45, 143, 133, 0.1); color: var(--g-property); }
.ob-color-shape-badge { background: rgba(161, 98, 7, 0.1); color: var(--g-shape); }
.ob-color-tax-badge { background: rgba(124, 58, 237, 0.1); color: var(--g-taxonomy); }

.dark .ob-color-class-badge { background: rgba(91, 147, 196, 0.15); }
.dark .ob-color-prop-badge { background: rgba(77, 212, 198, 0.15); }
.dark .ob-color-shape-badge { background: rgba(251, 191, 36, 0.15); }
.dark .ob-color-tax-badge { background: rgba(167, 139, 250, 0.15); }

/* Detail header */
.ob-detail-head {
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 1.25rem;
}

.ob-iri {
  display: block;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  margin-top: 0.125rem;
}

.ob-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-top: 0.75rem;
}

/* Relation rows */
.ob-rel-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.ob-rel-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Link badges (clickable) */
.ob-link-badge {
  font-size: 0.75rem;
  padding: 0.0625rem 0.375rem;
  border-radius: 3px;
  cursor: pointer;
  border: none;
  font-family: var(--vp-font-family-mono);
  transition: background 0.15s;
}

.ob-link-class { color: var(--g-class); background: rgba(41, 65, 91, 0.08); }
.ob-link-class:hover { background: rgba(41, 65, 91, 0.16); }
.ob-link-prop { color: var(--g-property); background: rgba(45, 143, 133, 0.08); }
.ob-link-prop:hover { background: rgba(45, 143, 133, 0.16); }
.ob-link-tax { color: var(--g-taxonomy); background: rgba(124, 58, 237, 0.08); }
.ob-link-tax:hover { background: rgba(124, 58, 237, 0.16); }

.dark .ob-link-class { color: var(--g-class); background: rgba(91, 147, 196, 0.12); }
.dark .ob-link-class:hover { background: rgba(91, 147, 196, 0.2); }
.dark .ob-link-prop { color: var(--g-property); background: rgba(77, 212, 198, 0.12); }
.dark .ob-link-prop:hover { background: rgba(77, 212, 198, 0.2); }
.dark .ob-link-tax { color: var(--g-taxonomy); background: rgba(167, 139, 250, 0.12); }
.dark .ob-link-tax:hover { background: rgba(167, 139, 250, 0.2); }

.ob-text-link {
  font-size: 0.6875rem;
  color: var(--vp-c-brand-1);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
}

.ob-text-link:hover { text-decoration: underline; }

.ob-arrow { color: var(--vp-c-text-3); font-size: 0.75rem; }

/* Code */
.ob-code {
  font-size: 0.75rem;
  background: var(--vp-c-default-soft);
  padding: 0.0625rem 0.25rem;
  border-radius: 3px;
  font-family: var(--vp-font-family-mono);
}

.ob-code-shape { color: var(--g-shape); background: rgba(161, 98, 7, 0.08); }
.dark .ob-code-shape { color: var(--g-shape); background: rgba(251, 191, 36, 0.1); }

.ob-code-bold {
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
}

.ob-muted { color: var(--vp-c-text-3); }
.ob-text-sm { font-size: 0.75rem; color: var(--vp-c-text-2); }
.ob-inverse { font-size: 0.625rem; color: var(--vp-c-text-3); margin-top: 0.125rem; }

/* Section & Heading */
.ob-section { margin-bottom: 1.5rem; }

.ob-heading {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* Breadcrumbs */
.ob-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.ob-bc-link {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-brand-1);
  padding: 0;
  font-weight: 500;
}

.ob-bc-link:hover { text-decoration: underline; }
.ob-bc-sep { color: var(--vp-c-text-3); }
.ob-bc-current { color: var(--vp-c-text-1); font-weight: 500; }

/* Chip grid (annotation properties) */
.ob-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ob-chip {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
}

.ob-chip code { font-family: var(--vp-font-family-mono); font-size: 0.6875rem; }

/* Tables */
.ob-constraint-table,
.ob-prop-table {
  width: 100%;
  border-collapse: collapse;
}

.ob-constraint-table th,
.ob-prop-table th {
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  padding: 0.5rem 0.625rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ob-constraint-table td,
.ob-prop-table td {
  padding: 0.5rem 0.625rem;
  vertical-align: top;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.8125rem;
}

.ob-constraint-table tr:last-child td,
.ob-prop-table tr:last-child td { border-bottom: none; }

.ob-cardinality {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
}

/* Shape block */
.ob-shape-block {
  border: 1px solid rgba(161, 98, 7, 0.2);
  background: rgba(161, 98, 7, 0.03);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  overflow-x: auto;
}

.dark .ob-shape-block { border-color: rgba(251, 191, 36, 0.15); background: rgba(251, 191, 36, 0.04); }

.ob-shape-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

/* Concept items */
.ob-concept-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ob-concept-item:last-child { border-bottom: none; }

.ob-concept-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ob-concept-label { font-weight: 500; }

.ob-concept-def {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
  line-height: 1.6;
}

.ob-concept-broader {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  margin-top: 0.25rem;
}

/* Empty states */
.ob-empty {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  font-style: italic;
  padding: 1rem 0;
}

.ob-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--vp-c-text-3);
}

/* Class hierarchy visual */
.ob-hierarchy {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.ob-hier-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  transition: background 0.15s;
}

.ob-hier-node:hover { background: var(--vp-c-bg-soft); }

.ob-hier-root {
  font-weight: 600;
}

.ob-hier-l1 {
  padding-left: 2rem;
  border-left: 2px solid var(--vp-c-divider);
  margin-left: 0.75rem;
}

.ob-hier-link {
  font-size: 0.8125rem;
  font-weight: inherit;
  color: var(--g-class);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
}

.ob-hier-link:hover { text-decoration: underline; }

.ob-hier-count {
  font-size: 0.625rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-default-soft);
  padding: 0.0625rem 0.375rem;
  border-radius: 9999px;
  margin-left: auto;
}

/* Taxonomy alphabetical index */
.ob-tax-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.ob-tax-header .ob-heading { margin-bottom: 0; }

.ob-alpha-nav {
  display: flex;
  gap: 0.125rem;
  flex-wrap: wrap;
}

.ob-alpha-letter {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.15s;
}

.ob-alpha-letter:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.ob-alpha-letter.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.ob-concept-list {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.ob-concept-list .ob-concept-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ob-concept-list .ob-concept-item:last-child { border-bottom: none; }

/* ================================================================
   RESPONSIVE
   ================================================================ */

@media (max-width: 768px) {
  .ob-sidebar-toggle { display: flex; }
  .ob-sidebar {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    z-index: 50;
    background: var(--vp-c-bg);
    box-shadow: 4px 0 16px rgba(0,0,0,0.1);
    max-height: 100vh;
  }
  .ob-sidebar-open { display: block; }
  .ob-stat-cards { grid-template-columns: repeat(2, 1fr); }
  .ob-stat-pills { display: none; }
  .ob { margin: 0 -16px; }
  .ob-main { padding: 1rem; }
  .ob-topbar { padding: 0.5rem 1rem; }
}
</style>
