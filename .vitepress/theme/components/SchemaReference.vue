<script setup lang="ts">
import { ref, computed } from 'vue'
import bundledData from '../../data/schemas-bundled.json'

type JsonSchema = {
  type?: string
  description?: string
  properties?: Record<string, JsonSchema>
  items?: JsonSchema
  required?: string[]
  enum?: string[]
  examples?: (string | number)[]
  const?: string
  $ref?: string
  allOf?: JsonSchema[]
  anyOf?: JsonSchema[]
  additionalProperties?: boolean | JsonSchema
  propertyNames?: JsonSchema
  minLength?: number
  maxLength?: number
  format?: string
  $defs?: Record<string, JsonSchema>
  title?: string
  [key: string]: unknown
}

type BundledSchema = { file: string; title: string; description: string | null; data: JsonSchema }
type BundledExample = { file: string; content: string }
type BundledVersion = { version: string; schemas: BundledSchema[]; examples: BundledExample[] }

const versions = ref<BundledVersion[]>(bundledData as BundledVersion[])
const activeVersion = ref(versions.value[0]?.version ?? '')
const activeSchemaFile = ref(versions.value[0]?.schemas[0]?.file ?? '')
const activeExampleFile = ref('')
const viewMode = ref<'ref' | 'raw'>('ref')
const expandedDefs = ref<Set<string>>(new Set())
const sidebarOpen = ref(false)

const currentVersion = computed(() => versions.value.find(v => v.version === activeVersion.value))
const schemaEntries = computed(() => currentVersion.value?.schemas ?? [])
const activeSchema = computed(() => schemaEntries.value.find(s => s.file === activeSchemaFile.value) ?? null)
const schemaData = computed(() => activeSchema.value?.data ?? null)
const activeExample = computed(() => {
  if (!activeExampleFile.value) return null
  return currentVersion.value?.examples.find(e => e.file === activeExampleFile.value) ?? null
})

function loadSchema(file: string) {
  activeSchemaFile.value = file
  activeExampleFile.value = ''
  viewMode.value = 'ref'
  expandedDefs.value = new Set()
  sidebarOpen.value = false
}

function loadExample(file: string) {
  activeExampleFile.value = file
  sidebarOpen.value = false
}

function switchVersion(ver: string) {
  activeVersion.value = ver
  activeExampleFile.value = ''
  const vi = versions.value.find(v => v.version === ver)
  if (vi?.schemas.length) loadSchema(vi.schemas[0].file)
}

function backToSchema() {
  activeExampleFile.value = ''
}

function resolveRef(ref: string, root: JsonSchema): JsonSchema | null {
  if (!ref.startsWith('#/$defs/')) return null
  return root.$defs?.[ref.replace('#/$defs/', '')] ?? null
}

function resolveType(s: JsonSchema, root: JsonSchema): string {
  if (s.$ref) {
    const r = resolveRef(s.$ref, root)
    return r ? resolveType(r, root) : (s.$ref.split('/').pop() ?? s.$ref)
  }
  if (s.enum) return 'enum'
  if (s.allOf) return s.allOf.map(a => resolveType(a, root)).join(' & ')
  if (s.anyOf) return s.anyOf.map(a => resolveType(a, root)).join(' | ')
  if (s.type === 'array' && s.items) return `${resolveType(s.items, root)}[]`
  if (s.type === 'object') return 'object'
  return s.type ?? 'any'
}

function resolveEnum(s: JsonSchema, root: JsonSchema): string[] | null {
  if (s.enum) return s.enum
  if (s.$ref) { const r = resolveRef(s.$ref, root); if (r) return resolveEnum(r, root) }
  if (s.allOf) { for (const sub of s.allOf) { const e = resolveEnum(sub, root); if (e) return e } }
  return null
}

function topProps() {
  if (!schemaData.value) return []
  const root = schemaData.value
  return Object.entries(root.properties ?? {}).map(([name, prop]) => ({ name, prop: prop as JsonSchema, root }))
}

function allDefs() {
  if (!schemaData.value?.$defs) return []
  return Object.entries(schemaData.value.$defs).map(([name, schema]) => ({ name, schema }))
}

function defProps(defSchema: JsonSchema) {
  if (!schemaData.value || !defSchema.properties) return []
  return Object.entries(defSchema.properties).map(([name, prop]) => ({ name, prop: prop as JsonSchema, root: schemaData.value! }))
}

function toggleDef(name: string) {
  const next = new Set(expandedDefs.value)
  next.has(name) ? next.delete(name) : next.add(name)
  expandedDefs.value = next
}

function exampleGroups() {
  const files = currentVersion.value?.examples ?? []
  const groups: Record<string, string[]> = {}
  for (const f of files) {
    const prefix = f.file.split('-')[0]
    ;(groups[prefix] ??= []).push(f.file)
  }
  return Object.entries(groups).map(([prefix, files]) => ({ prefix, files }))
}
</script>

<template>
  <FullscreenToolLayout
    title="YAML Schema Reference"
    description="Browse the JSON Schema definitions for Glossarist concept data. Select a version and schema to see properties, types, enum values, and expandable definitions."
  >
    <template #nav>
      <a href="/reference/">&larr; Reference</a>
      <span>·</span>
      <a href="/reference/entity-fields">Entity Fields</a>
      <span>·</span>
      <a href="/reference/ontology">Ontology Browser</a>
    </template>

  <div class="sb">
    <!-- Top bar: version switcher + view toggle -->
    <div class="sb-bar">
      <div class="sb-bar-left">
        <button class="sb-sidebar-toggle" @click="sidebarOpen = !sidebarOpen" :aria-label="sidebarOpen ? 'Close navigation' : 'Open navigation'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
        <div class="sb-version-pills">
          <button v-for="ver in versions" :key="ver.version" class="sb-pill" :class="{ active: activeVersion === ver.version }" @click="switchVersion(ver.version)">
            {{ ver.version.toUpperCase() }}
          </button>
        </div>
      </div>
      <div v-if="!activeExampleFile" class="sb-view-toggle">
        <button class="sb-toggle-btn" :class="{ active: viewMode === 'ref' }" @click="viewMode = 'ref'">Reference</button>
        <button class="sb-toggle-btn" :class="{ active: viewMode === 'raw' }" @click="viewMode = 'raw'">YAML</button>
      </div>
    </div>

    <div class="sb-body">
      <!-- Sidebar overlay for mobile -->
      <div v-if="sidebarOpen" class="sb-overlay" @click="sidebarOpen = false"></div>

      <!-- Sidebar -->
      <aside class="sb-nav" :class="{ open: sidebarOpen }">
        <div class="sb-nav-group">
          <h4 class="sb-nav-heading">Schemas</h4>
          <button v-for="s in schemaEntries" :key="s.file" class="sb-nav-link" :class="{ active: activeSchemaFile === s.file && !activeExampleFile }" @click="loadSchema(s.file)">
            <span class="sb-nav-dot"></span>
            {{ s.file.replace(/\.(yaml|yml)$/, '') }}
          </button>
        </div>
        <div class="sb-nav-group">
          <h4 class="sb-nav-heading">Examples</h4>
          <div v-for="group in exampleGroups()" :key="group.prefix" class="sb-ex-group">
            <span class="sb-ex-label">{{ group.prefix }}</span>
            <button v-for="f in group.files" :key="f" class="sb-nav-link sb-nav-sub" :class="{ active: activeExampleFile === f }" @click="loadExample(f)">
              {{ f.replace(/^.+?-(.+)\.yaml$/, '$1') }}
            </button>
          </div>
        </div>
      </aside>

      <!-- Content -->
      <main class="sb-content">
        <!-- Example viewer -->
        <div v-if="activeExample" class="sb-panel">
          <div class="sb-panel-bar">
            <button class="sb-back" @click="backToSchema">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Schema
            </button>
            <span class="sb-panel-title">{{ activeExample.file }}</span>
          </div>
          <div class="sb-code-wrap">
            <pre class="sb-code"><code>{{ activeExample.content }}</code></pre>
          </div>
        </div>

        <!-- Schema viewer -->
        <template v-else-if="schemaData">
          <!-- Raw YAML view -->
          <div v-if="viewMode === 'raw'" class="sb-panel">
            <div class="sb-panel-bar">
              <span class="sb-panel-title">{{ schemaData.title || activeSchemaFile }}</span>
              <span class="sb-panel-badge">YAML</span>
            </div>
            <div class="sb-code-wrap">
              <pre class="sb-code"><code>{{ JSON.stringify(schemaData, null, 2) }}</code></pre>
            </div>
          </div>

          <!-- Reference view -->
          <div v-else class="sb-panel">
            <div class="sb-panel-header">
              <div>
                <h2 class="sb-title">{{ schemaData.title || activeSchemaFile }}</h2>
                <p v-if="schemaData.description" class="sb-subtitle">{{ schemaData.description }}</p>
              </div>
              <span class="sb-panel-badge">{{ activeVersion.toUpperCase() }}</span>
            </div>

            <!-- Top-level properties -->
            <section class="sb-section">
              <h3 class="sb-section-heading">Properties</h3>
              <div class="sb-prop-list">
                <div v-for="info in topProps()" :key="info.name" class="sb-prop">
                  <div class="sb-prop-head">
                    <code class="sb-prop-name">{{ info.name }}</code>
                    <span class="sb-prop-type">{{ resolveType(info.prop, info.root) }}</span>
                  </div>
                  <p v-if="info.prop.description" class="sb-prop-desc">{{ info.prop.description }}</p>
                  <div v-if="resolveEnum(info.prop, info.root)" class="sb-enum-row">
                    <code v-for="v in resolveEnum(info.prop, info.root)" :key="v" class="sb-enum">{{ v }}</code>
                  </div>
                  <div v-else-if="info.prop.examples?.length" class="sb-enum-row">
                    <span class="sb-example-label">e.g.</span>
                    <code v-for="e in info.prop.examples" :key="String(e)" class="sb-example-val">{{ e }}</code>
                  </div>
                </div>
              </div>
            </section>

            <!-- Definitions -->
            <section v-if="allDefs().length" class="sb-section">
              <h3 class="sb-section-heading">Definitions <span class="sb-section-count">{{ allDefs().length }}</span></h3>
              <div class="sb-def-list">
                <div v-for="d in allDefs()" :key="d.name" class="sb-def">
                  <button class="sb-def-head" :aria-expanded="expandedDefs.has(d.name)" @click="toggleDef(d.name)">
                    <code class="sb-def-name">{{ d.name }}</code>
                    <div class="sb-def-meta">
                      <span v-if="d.schema.type" class="sb-def-type-tag">{{ d.schema.type }}</span>
                      <span v-if="resolveEnum(d.schema, schemaData!)" class="sb-def-enum-tag">{{ resolveEnum(d.schema, schemaData!)!.length }} values</span>
                    </div>
                    <svg class="sb-def-chev" :class="{ open: expandedDefs.has(d.name) }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                  <Transition name="sb-slide">
                    <div v-if="expandedDefs.has(d.name)" class="sb-def-body">
                      <p v-if="d.schema.description" class="sb-def-desc">{{ d.schema.description }}</p>
                      <div v-if="resolveEnum(d.schema, schemaData!)" class="sb-enum-grid">
                        <code v-for="v in resolveEnum(d.schema, schemaData!)" :key="v" class="sb-enum">{{ v }}</code>
                      </div>
                      <div v-else-if="d.schema.properties" class="sb-prop-list sb-prop-list-inner">
                        <div v-for="p in defProps(d.schema)" :key="p.name" class="sb-prop">
                          <div class="sb-prop-head">
                            <code class="sb-prop-name">{{ p.name }}</code>
                            <span class="sb-prop-type">{{ resolveType(p.prop, p.root) }}</span>
                          </div>
                          <p v-if="p.prop.description" class="sb-prop-desc">{{ p.prop.description }}</p>
                          <div v-if="resolveEnum(p.prop, p.root)" class="sb-enum-row">
                            <code v-for="v in resolveEnum(p.prop, p.root)" :key="v" class="sb-enum">{{ v }}</code>
                          </div>
                          <div v-else-if="p.prop.examples?.length" class="sb-enum-row">
                            <span class="sb-example-label">e.g.</span>
                            <code v-for="e in p.prop.examples" :key="String(e)" class="sb-example-val">{{ e }}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </section>
          </div>
        </template>
      </main>
    </div>
  </div>
  </FullscreenToolLayout>
</template>

<style scoped>
/* ─── Layout shell ─── */
.sb { }

/* ─── Top bar ─── */
.sb-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 1.25rem;
}

.sb-bar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sb-sidebar-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: none;
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.sb-version-pills {
  display: flex;
  gap: 0.375rem;
}

.sb-pill {
  padding: 0.3125rem 0.875rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 100px;
  background: none;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--vp-c-text-3);
  transition: all 0.15s;
}

.sb-pill:hover { color: var(--vp-c-text-1); border-color: var(--g-steel-mid); }
.sb-pill.active { background: var(--g-navy); color: #fff; border-color: var(--g-navy); }

/* View toggle */
.sb-view-toggle {
  display: flex;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.sb-toggle-btn {
  padding: 0.3125rem 0.875rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  transition: all 0.15s;
}

.sb-toggle-btn + .sb-toggle-btn { border-left: 1px solid var(--vp-c-divider); }
.sb-toggle-btn:hover { color: var(--vp-c-text-1); }
.sb-toggle-btn.active { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); }

/* ─── Body: sidebar + content ─── */
.sb-body {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
}

/* ─── Sidebar nav ─── */
.sb-nav {
  position: sticky;
  top: 5.5rem;
  max-height: calc(100vh - 7rem);
  overflow-y: auto;
  padding-right: 1rem;
  scrollbar-width: thin;
}

.sb-nav-group { margin-bottom: 1.75rem; }

.sb-nav-heading {
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
  margin: 0 0 0.5rem;
}

.sb-nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
  padding: 0.3125rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  border-radius: 4px;
  transition: all 0.12s;
  font-family: var(--vp-font-family-mono);
}

.sb-nav-link:hover { background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); }
.sb-nav-link.active { background: rgba(63, 182, 176, 0.08); color: var(--g-teal); font-weight: 600; }

.sb-nav-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  flex-shrink: 0;
}

.sb-nav-link.active .sb-nav-dot { background: var(--g-teal); }

.sb-nav-sub {
  font-size: 0.75rem;
  font-family: var(--vp-font-family);
  padding-left: 0.875rem;
}

.sb-ex-group { margin-bottom: 0.625rem; }

.sb-ex-label {
  display: block;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
  padding: 0.25rem 0 0.125rem 0.5rem;
  letter-spacing: 0.03em;
}

/* ─── Main content ─── */
.sb-content { min-width: 0; }

.sb-panel {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
}

.sb-panel-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.sb-panel-title {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  font-weight: 500;
}

.sb-panel-badge {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.5rem;
  border-radius: 3px;
  color: var(--vp-c-text-3);
}

.sb-back {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--g-teal);
  font-weight: 500;
}

.sb-back:hover { color: var(--g-sea); }

.sb-panel-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sb-title {
  font-size: 1.0625rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
}

.sb-subtitle {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  margin: 0.25rem 0 0;
  line-height: 1.5;
}

/* ─── Code blocks ─── */
.sb-code-wrap {
  overflow: auto;
  max-height: 70vh;
}

.sb-code {
  margin: 0;
  padding: 1.25rem;
  font-size: 0.75rem;
  line-height: 1.6;
  white-space: pre;
  tab-size: 2;
}

/* ─── Sections ─── */
.sb-section {
  padding: 1.25rem 1.5rem;
}

.sb-section + .sb-section {
  border-top: 1px solid var(--vp-c-divider);
}

.sb-section-heading {
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sb-section-count {
  font-size: 0.625rem;
  background: var(--vp-c-default-soft);
  padding: 0.0625rem 0.375rem;
  border-radius: 3px;
  font-weight: 700;
}

/* ─── Property rows ─── */
.sb-prop-list { display: flex; flex-direction: column; gap: 0.625rem; }
.sb-prop-list-inner { padding-left: 0; }

.sb-prop {
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.sb-prop-head {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.sb-prop-name {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sb-prop-type {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  color: var(--g-teal);
  background: rgba(63, 182, 176, 0.06);
  padding: 0.0625rem 0.375rem;
  border-radius: 3px;
  letter-spacing: 0.01em;
}

.sb-prop-desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0.375rem 0 0;
}

/* ─── Enums ─── */
.sb-enum-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.375rem;
}

.sb-enum {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  padding: 0.0625rem 0.375rem;
  border-radius: 3px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.sb-example-label {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.sb-example-val {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
}

.sb-enum-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0.5rem 0;
}

/* ─── Definitions ─── */
.sb-def-list { display: flex; flex-direction: column; gap: 0.25rem; }

.sb-def {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.sb-def-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}

.sb-def-head:hover { background: var(--vp-c-bg-soft); }

.sb-def-name {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sb-def-meta {
  display: flex;
  gap: 0.375rem;
}

.sb-def-type-tag {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--vp-c-text-3);
}

.sb-def-enum-tag {
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--g-teal);
  background: rgba(63, 182, 176, 0.08);
  padding: 0.0625rem 0.375rem;
  border-radius: 3px;
}

.sb-def-chev {
  margin-left: auto;
  color: var(--vp-c-text-3);
  transition: transform 0.15s;
}

.sb-def-chev.open { transform: rotate(90deg); }

.sb-def-body {
  padding: 0.75rem 1rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.sb-def-desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

/* Slide transition */
.sb-slide-enter-active,
.sb-slide-leave-active {
  transition: all 0.15s ease;
  overflow: hidden;
}

.sb-slide-enter-from,
.sb-slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .sb-body { grid-template-columns: 1fr; }

  .sb-sidebar-toggle { display: flex; }

  .sb-nav {
    display: none;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 280px;
    z-index: 50;
    background: var(--vp-c-bg);
    border-right: 1px solid var(--vp-c-divider);
    padding: 1.5rem 1rem;
    max-height: 100vh;
  }

  .sb-nav.open { display: block; }

  .sb-overlay {
    position: fixed;
    inset: 0;
    z-index: 49;
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
