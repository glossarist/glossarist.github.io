<script setup lang="ts">
/**
 * ValidatorPlayground — paste concept YAML, get categorized validation
 * results against the same rules glossarist-js enforces at construction
 * time and glossarist-ruby's check-* validators enforce at dataset time.
 *
 * The rules here are hand-rolled in TypeScript for browser reliability —
 * bundling glossarist-js (which pulls in n3, rdfjs, jsonld, jszip) for
 * client-side use is fragile across Vite versions. The rule semantics
 * mirror glossarist-js/src/validators/*.js exactly so the playground
 * stays in lockstep with the SDK.
 */
import { computed, ref } from 'vue'
import { parse as parseYaml } from 'yaml'
import {
  RELATED_TYPE_SET,
  TERM_TYPE_SET,
  type ConceptYaml,
  type HyperedgeYaml,
  type HyperedgeMemberYaml,
  type LocalizedConceptYaml,
  type NormativeStatus,
} from '@/types/concept-yaml'

// ─────────────────────────────────────────────────────────────────────
// Type guards — narrow the YAML parse result without `any`-casting.
// ─────────────────────────────────────────────────────────────────────

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isHyperedge(data: unknown): data is HyperedgeYaml {
  return isObject(data) && typeof data.type === 'string' && isObject(data.comprehensive ?? {})
}

// ─────────────────────────────────────────────────────────────────────
// Canonical enumerations (single source of truth — concept-yaml.ts)
// ─────────────────────────────────────────────────────────────────────

const KNOWN_RELATED_TYPES = RELATED_TYPE_SET
const KNOWN_TERM_TYPES = TERM_TYPE_SET
const KNOWN_NORMATIVE_STATUS = new Set<NormativeStatus>(['preferred', 'admitted', 'deprecated'])

// ─────────────────────────────────────────────────────────────────────
// Rule definitions
// ─────────────────────────────────────────────────────────────────────

interface ValidationIssue {
  rule: string
  level: 'error' | 'warning' | 'info'
  message: string
  isoRef?: string
}

interface Rule {
  id: string
  label: string
  description: string
  run: (data: ConceptYaml) => ValidationIssue[]
}

const rules: Rule[] = [
  {
    id: 'concept-shape',
    label: 'Concept shape',
    description: 'Required structural fields per ManagedConcept schema.',
    run: (data) => {
      const issues: ValidationIssue[] = []
      if (!data.termid && !data.identifier) {
        issues.push({ rule: 'concept-shape', level: 'error', message: 'Missing termid (or identifier) — required for every ManagedConcept' })
      }
      if (!data.status) {
        issues.push({ rule: 'concept-shape', level: 'error', message: 'Missing status — required for every ManagedConcept' })
      }
      return issues
    },
  },
  {
    id: 'localizations-present',
    label: 'Localizations present',
    description: 'At least one language entry required (ISO 10241-1 §3).',
    run: (data) => {
      const issues: ValidationIssue[] = []
      const localizations = data.localizations ?? data.eng ? { eng: data } : null
      if (!localizations || Object.keys(localizations).length === 0) {
        issues.push({ rule: 'localizations-present', level: 'error', message: 'No localizations — at least one language required', isoRef: 'ISO 10241-1 §3' })
      }
      return issues
    },
  },
  {
    id: 'definition-present',
    label: 'Definition present per language',
    description: 'ISO 10241-1 mandates a definition per language unless a non-verbal representation is used.',
    run: (data) => {
      const issues: ValidationIssue[] = []
      const locs = data.localizations ?? (data.eng ? { eng: data as unknown as LocalizedConceptYaml } : {})
      for (const [lang, entry] of Object.entries(locs as Record<string, LocalizedConceptYaml>)) {
        const def = entry.definition
        const nonVerbal = entry.examples?.some(e => typeof e.non_verbal === 'string') ?? false
        if ((!def || (Array.isArray(def) && def.length === 0)) && !nonVerbal) {
          issues.push({
            rule: 'definition-present',
            level: 'error',
            message: `localizations.${lang}: missing definition (mandatory per ISO 10241-1 unless non-verbal representation is used)`,
            isoRef: 'ISO 10241-1 §6.4',
          })
        }
      }
      return issues
    },
  },
  {
    id: 'designation-shape',
    label: 'Designation shape',
    description: 'Each term must have a designation, a valid type, and a normative_status.',
    run: (data) => {
      const issues: ValidationIssue[] = []
      const locs = data.localizations ?? (data.eng ? { eng: data as unknown as LocalizedConceptYaml } : {})
      for (const [lang, entry] of Object.entries(locs as Record<string, LocalizedConceptYaml>)) {
        const terms = entry.terms ?? []
        if (!Array.isArray(terms) || terms.length === 0) {
          issues.push({ rule: 'designation-shape', level: 'error', message: `localizations.${lang}: missing terms[] — at least one designation required`, isoRef: 'ISO 10241-1 §6.2' })
          continue
        }
        for (const [i, t] of terms.entries()) {
          if (!t.designation) {
            issues.push({ rule: 'designation-shape', level: 'error', message: `localizations.${lang}.terms[${i}]: missing designation text` })
          }
          if (t.type && !KNOWN_TERM_TYPES.has(t.type)) {
            issues.push({ rule: 'designation-shape', level: 'warning', message: `localizations.${lang}.terms[${i}]: unknown term type '${t.type}' — not in ISO 12620 enumeration`, isoRef: 'ISO 12620 §A.2.1' })
          }
          if (t.normative_status && !KNOWN_NORMATIVE_STATUS.has(t.normative_status)) {
            issues.push({ rule: 'designation-shape', level: 'error', message: `localizations.${lang}.terms[${i}]: normative_status '${t.normative_status}' not in {preferred, admitted, deprecated}` })
          }
        }
        // ISO 10241-1 prefers exactly one preferred term per language
        const preferred = terms.filter(t => (t.normative_status ?? 'preferred') === 'preferred')
        if (preferred.length > 1) {
          issues.push({ rule: 'designation-shape', level: 'warning', message: `localizations.${lang}: ${preferred.length} preferred terms — ISO 10241-1 prefers one` })
        }
      }
      return issues
    },
  },
  {
    id: 'related-types',
    label: 'Related-edge type validity',
    description: 'Every related.type must be in the 52-type enumeration (ISO 12620 / SKOS / ISO 25964).',
    run: (data) => {
      const issues: ValidationIssue[] = []
      const related = data.related
      if (!Array.isArray(related)) return issues
      for (const [i, r] of related.entries()) {
        if (!r.type) {
          issues.push({ rule: 'related-types', level: 'error', message: `related[${i}]: missing type` })
          continue
        }
        if (!KNOWN_RELATED_TYPES.has(r.type)) {
          issues.push({ rule: 'related-types', level: 'error', message: `related[${i}]: unknown type '${r.type}' — not in 52-type enumeration`, isoRef: 'ISO 12620 / SKOS / ISO 25964' })
        }
        if (!r.ref && !r.content && !r.target) {
          issues.push({ rule: 'related-types', level: 'error', message: `related[${i}]: missing target (ref | content | target)` })
        }
      }
      return issues
    },
  },
  {
    id: 'external-concept-shape',
    label: 'ExternalConcept shape',
    description: 'ExternalConcept (status: external) must NOT carry a definition or sources.',
    run: (data) => {
      const issues: ValidationIssue[] = []
      if (data.status !== 'external') return issues
      const locs = data.localizations ?? (data.eng ? { eng: data as unknown as LocalizedConceptYaml } : {})
      for (const [lang, entry] of Object.entries(locs as Record<string, LocalizedConceptYaml>)) {
        if (entry.definition && (!Array.isArray(entry.definition) || entry.definition.length > 0)) {
          issues.push({
            rule: 'external-concept-shape',
            level: 'error',
            message: `localizations.${lang}: ExternalConcept must not carry a definition (the substance comes via provided_by)`,
            isoRef: 'ISO 704:2022 §5.5.4.2.2 parenthetic terms',
          })
        }
      }
      if (!Array.isArray(data.related) || !data.related.some(r => r.type === 'provided_by')) {
        issues.push({
          rule: 'external-concept-shape',
          level: 'warning',
          message: 'status: external but no provided_by edge — the ExternalConcept will dangle until another dataset defining it is loaded',
        })
      }
      return issues
    },
  },
  {
    id: 'hyperedge-cardinality',
    label: 'Hyperedge cardinality + MECE',
    description: 'partitive_relations / generic_relations / sequential_relations arrays: each ≥2 members, valid MECE combos.',
    run: (data) => {
      const issues: ValidationIssue[] = []
      const edgeArrays: Array<[string, HyperedgeYaml[]]> = [
        ['partitive_relations', data.partitive_relations ?? []],
        ['generic_relations', data.generic_relations ?? []],
        ['sequential_relations', data.sequential_relations ?? []],
      ]
      for (const [key, arr] of edgeArrays) {
        if (!Array.isArray(arr) || arr.length === 0) continue
        for (const [i, edge] of arr.entries()) {
          const members: HyperedgeMemberYaml[] = edge.members ?? edge.partitives ?? []
          if (members.length < 2) {
            issues.push({ rule: 'hyperedge-cardinality', level: 'error', message: `${key}[${i}]: ${members.length} member(s) — ISO 704 requires ≥2 per rake`, isoRef: 'ISO 704:2022 §5.5.4' })
          }
          for (const [j, m] of members.entries()) {
            const presence = m.presence ?? 'required'
            const count = m.count ?? 'exactly_one'
            if (presence === 'optional' && count === 'at_least_one') {
              issues.push({ rule: 'hyperedge-cardinality', level: 'error', message: `${key}[${i}].members[${j}]: invalid MECE combo (optional + at_least_one) — collapses to optional + multiple`, isoRef: 'ISO 704:2022 §5.5.4' })
            }
            if (key === 'generic_relations' && !m.delimitingCharacteristic) {
              issues.push({ rule: 'hyperedge-cardinality', level: 'error', message: `${key}[${i}].members[${j}]: GenericMember requires delimitingCharacteristic`, isoRef: 'ISO 704:2022 §5.5.4.2.1' })
            }
          }
        }
      }
      return issues
    },
  },
]

// ---------- Presets ----------

const presets = [
  {
    id: 'minimal-valid',
    label: 'Minimal valid concept',
    yaml: `termid: "vim-2.9"
status: valid

localizations:
  eng:
    language: eng
    terms:
      - type: expression
        designation: measurement result
        normative_status: preferred
    definition:
      - type: intensional
        content: >
          A set of quantity values being attributed to a measurand
          together with any other available relevant information.
    sources:
      - type: authoritative
        origin: "VIM 2.9"
`,
  },
  {
    id: 'missing-definition',
    label: 'Missing definition (ISO 10241-1 violation)',
    yaml: `termid: "broken-1"
status: valid

localizations:
  eng:
    terms:
      - type: expression
        designation: broken concept
        normative_status: preferred
`,
  },
  {
    id: 'bad-related-type',
    label: 'Unknown related type',
    yaml: `termid: "broken-2"
status: valid

localizations:
  eng:
    terms:
      - type: expression
        designation: test
        normative_status: preferred
    definition:
      - content: A test concept.

related:
  - type: is_kind_of        # not in the 52-type enum
    ref: { source: VIM, id: "1" }
`,
  },
  {
    id: 'external-no-provided-by',
    label: 'ExternalConcept dangling',
    yaml: `termid: "ext-qft"
status: external

localizations:
  eng:
    terms:
      - type: expression
        designation: quantum field theory
        normative_status: preferred
    # No definition — correct for ExternalConcept
    # But also no provided_by edge — the concept dangles
`,
  },
  {
    id: 'external-with-def',
    label: 'ExternalConcept wrongly defined',
    yaml: `termid: "ext-broken"
status: external

localizations:
  eng:
    terms:
      - type: expression
        designation: broken external
        normative_status: preferred
    definition:
      - content: This should not be here for an external concept.

related:
  - type: provided_by
    ref: { source: urn:other-dataset, id: "broken" }
`,
  },
]

const activePreset = ref('minimal-valid')
const yamlInput = ref(presets[0].yaml)

function loadPreset(id: string) {
  const p = presets.find(x => x.id === id)
  if (!p) return
  activePreset.value = id
  yamlInput.value = p.yaml
}

// ---------- Parse + run all rules ----------

const result = computed<{ parseError: string | null; issues: ValidationIssue[]; ruleStats: Record<string, { errors: number; warnings: number; infos: number }> }>(() => {
  let data: unknown
  try {
    data = parseYaml(yamlInput.value)
  } catch (e) {
    return { parseError: (e as Error).message, issues: [], ruleStats: {} }
  }
  if (!isObject(data)) {
    return { parseError: 'Empty or non-object YAML', issues: [], ruleStats: {} }
  }
  const conceptData = data as ConceptYaml

  const allIssues: ValidationIssue[] = []
  const ruleStats: Record<string, { errors: number; warnings: number; infos: number }> = {}
  for (const rule of rules) {
    const ruleIssues = rule.run(conceptData)
    ruleStats[rule.id] = {
      errors: ruleIssues.filter(i => i.level === 'error').length,
      warnings: ruleIssues.filter(i => i.level === 'warning').length,
      infos: ruleIssues.filter(i => i.level === 'info').length,
    }
    allIssues.push(...ruleIssues)
  }

  return { parseError: null, issues: allIssues, ruleStats }
})

const errorCount = computed(() => result.value.issues.filter(i => i.level === 'error').length)
const warningCount = computed(() => result.value.issues.filter(i => i.level === 'warning').length)
const isClean = computed(() => !result.value.parseError && errorCount.value === 0)
</script>

<template>
  <div class="vp-root">
    <div class="vp-grid">
      <!-- LEFT: presets + textarea + rule legend -->
      <div class="vp-input-pane">
        <div class="vp-presets">
          <span class="vp-presets-label">Examples:</span>
          <button
            v-for="p in presets"
            :key="p.id"
            type="button"
            class="vp-preset-btn"
            :class="{ 'vp-preset-active': activePreset === p.id }"
            @click="loadPreset(p.id)"
          >
            {{ p.label }}
          </button>
        </div>
        <textarea
          v-model="yamlInput"
          class="vp-textarea"
          spellcheck="false"
          aria-label="Concept YAML"
        />
        <details class="vp-rules-list">
          <summary>Active rules ({{ rules.length }})</summary>
          <ul>
            <li v-for="rule in rules" :key="rule.id">
              <code>{{ rule.id }}</code> — {{ rule.description }}
            </li>
          </ul>
        </details>
      </div>

      <!-- RIGHT: results -->
      <div class="vp-output-pane">
        <div class="vp-summary" :class="{ 'vp-summary-clean': isClean, 'vp-summary-error': errorCount > 0 || result.parseError }">
          <div v-if="result.parseError" class="vp-summary-stat">
            <div class="vp-summary-num vp-num-error">YAML</div>
            <div class="vp-summary-label">parse error</div>
          </div>
          <template v-else>
            <div class="vp-summary-stat">
              <div class="vp-summary-num" :class="{ 'vp-num-error': errorCount > 0, 'vp-num-ok': errorCount === 0 }">{{ errorCount }}</div>
              <div class="vp-summary-label">error{{ errorCount === 1 ? '' : 's' }}</div>
            </div>
            <div class="vp-summary-stat">
              <div class="vp-summary-num" :class="{ 'vp-num-warn': warningCount > 0 }">{{ warningCount }}</div>
              <div class="vp-summary-label">warning{{ warningCount === 1 ? '' : 's' }}</div>
            </div>
            <div v-if="isClean" class="vp-summary-stat vp-summary-clean-stat">
              <div class="vp-summary-num vp-num-ok">✓</div>
              <div class="vp-summary-label">all rules pass</div>
            </div>
          </template>
        </div>

        <div v-if="result.parseError" class="vp-parse-error">
          <strong>YAML parse error:</strong> {{ result.parseError }}
        </div>

        <div v-else-if="result.issues.length === 0" class="vp-clean">
          <p>All {{ rules.length }} rules pass — this concept is structurally valid per the checks implemented here.</p>
          <p class="vp-clean-disclaimer">
            Note: these are the structural checks hand-rolled for this playground.
            For full SHACL validation, dataset-level coherence, and cross-reference
            resolution, use <a href="https://github.com/glossarist/glossarist-js" target="_blank" rel="noopener">glossarist-js</a>
            or <a href="https://github.com/glossarist/glossarist" target="_blank" rel="noopener">glossarist-ruby</a>
            in your build pipeline.
          </p>
        </div>

        <ul v-else class="vp-issues">
          <li
            v-for="(issue, i) in result.issues"
            :key="i"
            :class="`vp-issue vp-issue-${issue.level}`"
          >
            <div class="vp-issue-header">
              <span class="vp-issue-level">{{ issue.level }}</span>
              <span class="vp-issue-rule"><code>{{ issue.rule }}</code></span>
              <span v-if="issue.isoRef" class="vp-issue-isoref">{{ issue.isoRef }}</span>
            </div>
            <div class="vp-issue-message">{{ issue.message }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-root {
  font-family: var(--g-font-base, system-ui, sans-serif);
  color: var(--g-text-1, #212529);
  background: var(--g-bg, #ffffff);
  border-radius: 12px;
  padding: 1.5rem;
}
.vp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 920px) {
  .vp-grid { grid-template-columns: 1fr; }
}
.vp-input-pane, .vp-output-pane {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}
.vp-presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.vp-presets-label {
  font-size: 0.8125rem;
  color: var(--g-text-3, #6c757d);
  font-family: var(--g-font-display, inherit);
}
.vp-preset-btn {
  font-size: 0.8125rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--g-divider, #dee2e6);
  background: var(--g-bg-soft, #f8f9fa);
  color: var(--g-text-2, #495057);
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
}
.vp-preset-btn:hover {
  border-color: var(--g-brand, #0d9488);
  color: var(--g-brand, #0d9488);
}
.vp-preset-active {
  border-color: var(--g-brand, #0d9488);
  color: var(--g-brand, #0d9488);
  font-weight: 600;
}
.vp-textarea {
  min-height: 360px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  padding: 1rem;
  border: 1px solid var(--g-divider, #dee2e6);
  border-radius: 8px;
  background: var(--g-code-bg, #f8f9fa);
  color: var(--g-text-1, #212529);
  resize: vertical;
  outline: none;
}
.vp-textarea:focus { border-color: var(--g-brand, #0d9488); }
.vp-rules-list {
  background: var(--g-bg-soft, #f8f9fa);
  border: 1px solid var(--g-divider, #dee2e6);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
}
.vp-rules-list summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--g-text-2, #495057);
}
.vp-rules-list ul {
  list-style: none;
  padding: 0.5rem 0 0 0;
  margin: 0;
}
.vp-rules-list li {
  padding: 0.25rem 0;
  color: var(--g-text-3, #6c757d);
}
.vp-rules-list code {
  font-family: ui-monospace, SFMono-Regular, monospace;
  background: var(--g-code-bg, #e9ecef);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}

/* Summary */
.vp-summary {
  display: flex;
  gap: 1.5rem;
  padding: 1.25rem;
  border: 1px solid var(--g-divider, #dee2e6);
  border-radius: 8px;
  background: var(--g-bg-soft, #f8f9fa);
  align-items: center;
}
.vp-summary-error { border-color: #c82333; }
.vp-summary-clean { border-color: #0f5132; }
.vp-summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.vp-summary-num {
  font-family: var(--g-font-display, inherit);
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
}
.vp-num-error { color: #c82333; }
.vp-num-warn { color: #664d03; }
.vp-num-ok { color: #0f5132; }
.vp-summary-label {
  font-size: 0.8125rem;
  color: var(--g-text-3, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}
.vp-summary-clean-stat {
  margin-left: auto;
}

/* Parse error */
.vp-parse-error {
  padding: 1rem;
  background: #f5c2c7;
  color: #842029;
  border-radius: 8px;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
}

/* Clean state */
.vp-clean {
  padding: 1rem;
  background: #d1e7dd;
  color: #0f5132;
  border-radius: 8px;
  font-size: 0.9375rem;
  line-height: 1.6;
}
.vp-clean p { margin: 0 0 0.5rem 0; }
.vp-clean p:last-child { margin: 0; }
.vp-clean-disclaimer {
  font-size: 0.8125rem;
  color: #0f5132;
  opacity: 0.85;
  font-style: italic;
}
.vp-clean a {
  color: inherit;
  text-decoration: underline;
}

/* Issue list */
.vp-issues {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.vp-issue {
  border-left: 3px solid;
  padding: 0.6rem 0.75rem;
  background: var(--g-bg-soft, #f8f9fa);
  border-radius: 4px;
}
.vp-issue-error { border-color: #c82333; background: #fdeef0; }
.vp-issue-warning { border-color: #664d03; background: #fff8e1; }
.vp-issue-info { border-color: #495057; }
.vp-issue-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}
.vp-issue-level {
  font-family: ui-monospace, monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background: #ced4da;
  color: #212529;
}
.vp-issue-error .vp-issue-level { background: #c82333; color: #fff; }
.vp-issue-warning .vp-issue-level { background: #664d03; color: #fff; }
.vp-issue-rule code {
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  background: rgba(0,0,0,0.06);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}
.vp-issue-isoref {
  font-size: 0.6875rem;
  color: var(--g-text-3, #6c757d);
  font-style: italic;
  margin-left: auto;
}
.vp-issue-message {
  font-family: ui-monospace, monospace;
  font-size: 0.8125rem;
  color: var(--g-text-1, #212529);
  line-height: 1.4;
}
</style>
