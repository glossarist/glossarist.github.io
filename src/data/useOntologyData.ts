import { ref, shallowRef, onMounted } from 'vue'
import type { OntologySchema, TaxonomyData } from './types'

const schema = shallowRef<OntologySchema | null>(null)
const taxonomies = shallowRef<Record<string, TaxonomyData> | null>(null)
const loaded = ref(false)
let pending: Promise<void> | null = null

async function fetchAll() {
  if (pending) return pending
  pending = Promise.all([
    fetch('/data/ontology-schema.json').then(r => r.json()),
    fetch('/data/taxonomies.json').then(r => r.json()),
  ]).then(([s, t]) => {
    schema.value = s
    taxonomies.value = t
    loaded.value = true
  }).catch((err) => {
    console.error('Failed to load ontology data:', err)
    pending = null
  })
  return pending
}

export function useOntologyData() {
  if (!loaded.value && !pending) {
    onMounted(fetchAll)
  }
  return { schema, taxonomies, loaded }
}
