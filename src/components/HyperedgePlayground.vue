<script setup lang="ts">
/**
 * HyperedgePlayground — live YAML → rake renderer.
 *
 * Users edit hyperedge YAML on the left; the right pane renders the
 * rake diagram live plus inline validation. Three preset examples
 * cover the common shapes (partitive with MECE dimensions, generic
 * with multidimensionality, ExternalConcept comprehensive).
 *
 * The rake renderer is a minimal inline SVG generator — it does NOT
 * match the concept-browser's sphere visual exactly, but it does
 * follow ISO 704:2022 §5.5.4 line notation (solid/dashed/bold,
 * single/double) so the diagram is correct as a teaching tool.
 */
import { computed, ref, computed as vueComputed } from 'vue'
import { parse as parseYaml } from 'yaml'

// ---------- Presets ----------

interface Preset {
  id: string
  label: string
  yaml: string
}

const presets: Preset[] = [
  {
    id: 'partitive-mece',
    label: 'Partitive — VIM measurement result',
    yaml: `# Partitive hyperedge: VIM measurement result (2.9)
# Demonstrates all three MECE multiplicities on one rake.
$id: viml-112-02-09/measurement-result-composition
type: partitive_relation
status: valid
comprehensive:
  source: VIM
  id: "112-02-09"
members:
  - ref: { source: VIM, id: "112-02-10" }
    presence: required
    count: exactly_one
  - ref: { source: VIM, id: "112-03-26" }
    presence: required
    count: multiple
  - ref: { source: VIM, id: "112-02-06" }
    presence: optional
    count: exactly_one
completeness: complete
criterion: { eng: measurement result composition }
`,
  },
  {
    id: 'generic-multidim',
    label: 'Generic — computer mouse (2 criteria)',
    yaml: `# Generic hyperedge: ISO 704 §5.5.4.2.1 canonical example.
# Each species carries its delimitingCharacteristic as data.
$id: example-computer-mouse/by-movement-detection
type: generic_relation
status: valid
comprehensive: { source: EXAMPLE, id: computer-mouse }
members:
  - ref: { source: EXAMPLE, id: mechanical-mouse }
    delimitingCharacteristic: { eng: detecting movement by rollers }
  - ref: { source: EXAMPLE, id: optomechanical-mouse }
    delimitingCharacteristic: { eng: detecting movement by rollers and light sensors }
  - ref: { source: EXAMPLE, id: optical-mouse }
    delimitingCharacteristic: { eng: detecting movement by light sensors }
completeness: complete
criterion: { eng: by movement detection }
`,
  },
  {
    id: 'external-comp',
    label: 'ExternalConcept as comprehensive',
    yaml: `# Hyperedge with ExternalConcept as the comprehensive.
# The check-external-as-comprehensive validator warns if no provided_by edge.
$id: ext-precision-condition/by-condition-type
type: generic_relation
status: valid
comprehensive: { source: EXAMPLE, id: ext-precision-condition }
members:
  - ref: { source: VIML, id: "2.20" }
  - ref: { source: VIML, id: "2.22" }
completeness: complete
criterion: { eng: by condition type }
`,
  },
]

const activePreset = ref<string>('partitive-mece')
const yamlInput = ref<string>(presets[0].yaml)

function loadPreset(id: string) {
  const p = presets.find(x => x.id === id)
  if (!p) return
  activePreset.value = id
  yamlInput.value = p.yaml
}

// ---------- Parse + validate ----------

interface ParsedMember {
  ref: { source?: string; id?: string; text?: string }
  presence: 'required' | 'optional'
  count: 'exactly_one' | 'at_least_one' | 'multiple'
  is_delimiting?: boolean
  delimitingCharacteristic?: Record<string, string>
}

interface ParsedHyperedge {
  type?: string
  comprehensive?: { source?: string; id?: string; text?: string }
  members: ParsedMember[]
  completeness?: 'complete' | 'partial'
  criterion?: Record<string, string>
}

interface ValidationIssue {
  level: 'error' | 'warning'
  message: string
}

const parsed = vueComputed<{ edge: ParsedHyperedge | null; issues: ValidationIssue[] }>(() => {
  let data: unknown
  try {
    data = parseYaml(yamlInput.value)
  } catch (e) {
    return { edge: null, issues: [{ level: 'error', message: `YAML parse error: ${(e as Error).message}` }] }
  }
  if (!data || typeof data !== 'object') {
    return { edge: null, issues: [{ level: 'error', message: 'Empty or non-object YAML' }] }
  }
  const obj = data as Record<string, unknown>
  const issues: ValidationIssue[] = []

  const type = obj.type as string | undefined
  if (type !== 'partitive_relation' && type !== 'generic_relation') {
    issues.push({
      level: 'error',
      message: `type must be 'partitive_relation' or 'generic_relation' (got '${type ?? 'missing'}')`,
    })
  }

  const comprehensive = obj.comprehensive as ParsedHyperedge['comprehensive'] | undefined
  if (!comprehensive || (!comprehensive.source && !comprehensive.id && !comprehensive.text)) {
    issues.push({ level: 'error', message: 'comprehensive must be a non-empty ConceptRef' })
  }

  const members = (obj.members as ParsedMember[] | undefined) ?? []
  if (!Array.isArray(members)) {
    issues.push({ level: 'error', message: 'members must be an array' })
  } else {
    if (members.length < 2) {
      issues.push({ level: 'error', message: `ISO 704 requires ≥2 members per rake (got ${members.length})` })
    }
    for (const [i, m] of members.entries()) {
      if (!m.ref || (!m.ref.source && !m.ref.id && !m.ref.text)) {
        issues.push({ level: 'error', message: `members[${i}].ref must be a non-empty ConceptRef` })
      }
      const presence = m.presence ?? 'required'
      const count = m.count ?? 'exactly_one'
      if (presence === 'optional' && count === 'at_least_one') {
        issues.push({
          level: 'error',
          message: `members[${i}]: invalid MECE combo (optional + at_least_one) — collapses to optional + multiple`,
        })
      }
      if (type === 'generic_relation' && !m.delimitingCharacteristic) {
        issues.push({
          level: 'error',
          message: `members[${i}]: GenericMember requires delimitingCharacteristic per ISO 704 §5.5.4.2.1`,
        })
      }
      if (m.is_delimiting && presence === 'optional') {
        issues.push({
          level: 'warning',
          message: `members[${i}]: delimiting + optional is semantically incoherent`,
        })
      }
    }
  }

  return {
    edge: { type, comprehensive, members, completeness: obj.completeness as 'complete' | 'partial', criterion: obj.criterion as Record<string, string> },
    issues,
  }
})

const hasErrors = vueComputed(() => parsed.value.issues.some(i => i.level === 'error'))

// ---------- Render rake SVG ----------

const STROKE_NORMAL = 1.5
const STROKE_DELIMITING = 5
const BOX_W = 150
const BOX_H = 42
const TOOTH_LABEL_Y = 165
const BOX_TOP_Y = 200

function memberLabel(m: ParsedMember): string {
  if (m.ref.text) return m.ref.text
  if (m.ref.id) return m.ref.id
  return '?'
}

function strokeStyle(m: ParsedMember): { width: number; dash: string; label: string } {
  const presence = m.presence ?? 'required'
  const count = m.count ?? 'exactly_one'
  const delimit = m.is_delimiting === true
  const width = delimit ? STROKE_DELIMITING : STROKE_NORMAL
  const dash = presence === 'optional' ? '4 3' : 'none'

  const parts: string[] = [presence, count]
  if (delimit) parts.push('delimiting')
  return { width, dash, label: parts.join(' · ') }
}

interface RenderedTooth {
  x: number
  width: number
  dash: string
  label: string
  memberLabel: string
  characteristic?: string
  isInvalidCombo: boolean
}

const rendered = vueComputed<{ width: number; height: number; teeth: RenderedTooth[]; comprehensiveLabel: string; criterionLabel: string } | null>(() => {
  const edge = parsed.value.edge
  if (!edge || !edge.comprehensive || edge.members.length < 1) return null

  const teeth: RenderedTooth[] = []
  const startX = 80
  const spacing = 200
  edge.members.forEach((m, i) => {
    const presence = m.presence ?? 'required'
    const count = m.count ?? 'exactly_one'
    const style = strokeStyle(m)
    teeth.push({
      x: startX + i * spacing,
      width: style.width,
      dash: style.dash,
      label: style.label,
      memberLabel: memberLabel(m),
      characteristic: m.delimitingCharacteristic ? (m.delimitingCharacteristic.eng ?? Object.values(m.delimitingCharacteristic)[0]) : undefined,
      isInvalidCombo: presence === 'optional' && count === 'at_least_one',
    })
  })

  const compLabel = edge.comprehensive?.text ?? edge.comprehensive?.id ?? '?'
  const critLabel = edge.criterion ? (edge.criterion.eng ?? Object.values(edge.criterion)[0] ?? '') : ''

  const lastX = startX + (edge.members.length - 1) * spacing
  const width = Math.max(720, lastX + 160)
  const height = teeth.some(t => t.characteristic) ? 340 : 300

  return { width, height, teeth, comprehensiveLabel: compLabel, criterionLabel: critLabel }
})
</script>

<template>
  <div class="hp-root">
    <div class="hp-grid">
      <!-- LEFT: YAML input + presets -->
      <div class="hp-input-pane">
        <div class="hp-presets">
          <span class="hp-presets-label">Examples:</span>
          <button
            v-for="p in presets"
            :key="p.id"
            type="button"
            class="hp-preset-btn"
            :class="{ 'hp-preset-active': activePreset === p.id }"
            @click="loadPreset(p.id)"
          >
            {{ p.label }}
          </button>
        </div>
        <textarea
          v-model="yamlInput"
          class="hp-textarea"
          spellcheck="false"
          aria-label="Hyperedge YAML"
        />
      </div>

      <!-- RIGHT: live render + validation -->
      <div class="hp-output-pane">
        <div class="hp-render-area">
          <template v-if="rendered">
            <svg
              :viewBox="`0 0 ${rendered.width} ${rendered.height}`"
              xmlns="http://www.w3.org/2000/svg"
              class="hp-svg"
              role="img"
              aria-label="Hyperedge rake diagram"
            >
              <!-- Comprehensive concept -->
              <rect
                :x="rendered.width / 2 - 90"
                y="20"
                width="180"
                height="42"
                rx="6"
                class="hp-box"
              />
              <text
                :x="rendered.width / 2"
                y="40"
                text-anchor="middle"
                class="hp-label"
                font-weight="600"
              >{{ rendered.comprehensiveLabel }}</text>
              <text
                :x="rendered.width / 2"
                y="55"
                text-anchor="middle"
                class="hp-small"
              >{{ parsed.edge?.type }}</text>

              <!-- Backline (joined = complete, broken = partial) -->
              <line
                v-if="rendered.teeth.length > 0"
                :x1="rendered.teeth[0].x"
                y1="100"
                :x2="rendered.teeth[rendered.teeth.length - 1].x"
                y2="100"
                class="hp-backline"
              />
              <text
                v-if="rendered.teeth.length > 0"
                :x="rendered.teeth[0].x - 40"
                y="104"
                class="hp-small"
              >{{ parsed.edge?.completeness ?? 'complete' }}</text>

              <!-- Teeth -->
              <g v-for="(t, i) in rendered.teeth" :key="i">
                <!-- For double lines (count: multiple), draw two parallel lines -->
                <line
                  v-if="t.label.includes('multiple')"
                  :x1="t.x - 4"
                  y1="100"
                  :x2="t.x - 4"
                  :y2="BOX_TOP_Y"
                  :stroke-width="t.width"
                  :stroke-dasharray="t.dash"
                  class="hp-tooth"
                />
                <line
                  :x1="t.x + (t.label.includes('multiple') ? 4 : 0)"
                  y1="100"
                  :x2="t.x + (t.label.includes('multiple') ? 4 : 0)"
                  :y2="BOX_TOP_Y"
                  :stroke-width="t.width"
                  :stroke-dasharray="t.dash"
                  class="hp-tooth"
                  :class="{ 'hp-invalid': t.isInvalidCombo }"
                />

                <!-- For at_least_one, draw solid + dashed pair -->
                <template v-if="t.label.includes('at_least_one')">
                  <line
                    :x1="t.x - 4"
                    y1="100"
                    :x2="t.x - 4"
                    :y2="BOX_TOP_Y"
                    :stroke-width="t.width"
                    class="hp-tooth"
                  />
                </template>

                <!-- Multiplicity label -->
                <text
                  :x="t.x"
                  :y="TOOTH_LABEL_Y"
                  text-anchor="middle"
                  class="hp-small"
                  :class="{ 'hp-invalid-text': t.isInvalidCombo }"
                >{{ t.label }}</text>

                <!-- Member box -->
                <rect
                  :x="t.x - BOX_W / 2"
                  :y="BOX_TOP_Y + 20"
                  :width="BOX_W"
                  :height="BOX_H"
                  rx="6"
                  class="hp-box"
                />
                <text
                  :x="t.x"
                  :y="BOX_TOP_Y + 38"
                  text-anchor="middle"
                  class="hp-label"
                >{{ t.memberLabel }}</text>

                <!-- Delimiting characteristic (generic only) -->
                <template v-if="t.characteristic">
                  <text
                    :x="t.x"
                    :y="BOX_TOP_Y + BOX_H + 30"
                    text-anchor="middle"
                    class="hp-char"
                  >{{ t.characteristic.length > 28 ? t.characteristic.slice(0, 25) + '…' : t.characteristic }}</text>
                </template>
              </g>

              <!-- Criterion label -->
              <text
                v-if="rendered.criterionLabel"
                :x="rendered.width / 2"
                :y="rendered.height - 20"
                text-anchor="middle"
                class="hp-crit"
              >criterion: {{ rendered.criterionLabel }}</text>
            </svg>
          </template>
          <div v-else class="hp-render-placeholder">
            <p>Render will appear here once the YAML parses and has the minimum shape (comprehensive + ≥1 member).</p>
          </div>
        </div>

        <!-- Validation panel -->
        <div class="hp-validation" :class="{ 'hp-has-errors': hasErrors }">
          <div class="hp-validation-header">
            <span>Validation</span>
            <span class="hp-validation-count">
              {{ parsed.issues.filter(i => i.level === 'error').length }} error{{ parsed.issues.filter(i => i.level === 'error').length === 1 ? '' : 's' }}
              ·
              {{ parsed.issues.filter(i => i.level === 'warning').length }} warning{{ parsed.issues.filter(i => i.level === 'warning').length === 1 ? '' : 's' }}
            </span>
          </div>
          <ul class="hp-issues">
            <li v-for="(issue, i) in parsed.issues" :key="i" :class="`hp-issue hp-issue-${issue.level}`">
              <span class="hp-issue-level">{{ issue.level }}</span>
              <span class="hp-issue-message">{{ issue.message }}</span>
            </li>
            <li v-if="parsed.issues.length === 0" class="hp-issue hp-issue-ok">
              <span class="hp-issue-level">ok</span>
              <span class="hp-issue-message">All structural checks pass — comprehensive + ≥2 members + valid MECE combos{{ parsed.edge?.type === 'generic_relation' ? ' + delimitingCharacteristic on every member' : '' }}.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hp-root {
  font-family: var(--g-font-base, system-ui, sans-serif);
  color: var(--g-text-1, #212529);
  background: var(--g-bg, #ffffff);
  border-radius: 12px;
  padding: 1.5rem;
}
.hp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
}
@media (max-width: 920px) {
  .hp-grid { grid-template-columns: 1fr; }
}
.hp-input-pane, .hp-output-pane {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}
.hp-presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.hp-presets-label {
  font-size: 0.8125rem;
  color: var(--g-text-3, #6c757d);
  font-family: var(--g-font-display, inherit);
  letter-spacing: 0.02em;
}
.hp-preset-btn {
  font-size: 0.8125rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--g-divider, #dee2e6);
  background: var(--g-bg-soft, #f8f9fa);
  color: var(--g-text-2, #495057);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  font-family: inherit;
}
.hp-preset-btn:hover {
  border-color: var(--g-brand, #0d9488);
  color: var(--g-brand, #0d9488);
}
.hp-preset-active {
  border-color: var(--g-brand, #0d9488);
  color: var(--g-brand, #0d9488);
  font-weight: 600;
}
.hp-textarea {
  flex: 1;
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
.hp-textarea:focus {
  border-color: var(--g-brand, #0d9488);
}
.hp-render-area {
  background: #ffffff;
  border: 1px solid var(--g-divider, #dee2e6);
  border-radius: 8px;
  padding: 1rem;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
}
.hp-svg {
  width: 100%;
  height: auto;
  max-height: 360px;
}
.hp-render-placeholder {
  color: var(--g-text-3, #6c757d);
  text-align: center;
  font-size: 0.9rem;
  font-style: italic;
  max-width: 320px;
}
.hp-validation {
  border: 1px solid var(--g-divider, #dee2e6);
  border-radius: 8px;
  background: var(--g-bg-soft, #f8f9fa);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}
.hp-has-errors {
  border-color: #c82333;
}
.hp-validation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-family: var(--g-font-display, inherit);
  font-weight: 600;
}
.hp-validation-count {
  font-weight: 400;
  color: var(--g-text-3, #6c757d);
  font-size: 0.8125rem;
}
.hp-issues {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.hp-issue {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}
.hp-issue-level {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  background: #ced4da;
  color: #212529;
  flex-shrink: 0;
}
.hp-issue-error .hp-issue-level { background: #f5c2c7; color: #842029; }
.hp-issue-warning .hp-issue-level { background: #fff3cd; color: #664d03; }
.hp-issue-ok .hp-issue-level { background: #d1e7dd; color: #0f5132; }
.hp-issue-message {
  color: var(--g-text-2, #495057);
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8125rem;
  line-height: 1.4;
}

/* SVG styling */
.hp-svg :deep(.hp-box) {
  fill: #f8f9fa;
  stroke: #343a40;
  stroke-width: 1.5;
}
.hp-svg :deep(.hp-label) {
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 13px;
  fill: #212529;
}
.hp-svg :deep(.hp-small) {
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  fill: #6c757d;
}
.hp-svg :deep(.hp-char) {
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 10px;
  fill: #495057;
  font-style: italic;
}
.hp-svg :deep(.hp-backline) {
  stroke: #212529;
  stroke-width: 2;
  fill: none;
}
.hp-svg :deep(.hp-tooth) {
  stroke: #212529;
  fill: none;
}
.hp-svg :deep(.hp-invalid) {
  stroke: #c82333;
}
.hp-svg :deep(.hp-invalid-text) {
  fill: #c82333;
  font-weight: 600;
}
.hp-svg :deep(.hp-crit) {
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  fill: #0c5460;
  font-style: italic;
  font-weight: 600;
}
</style>
