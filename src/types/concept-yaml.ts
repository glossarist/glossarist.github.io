/**
 * ConceptYaml — TypeScript mirror of the Glossarist wire format.
 *
 * This is the canonical domain type for YAML data entering the
 * Glossarist pipeline (concept files, hyperedge files, etc.). It
 * matches glossarist-js's `src/models/*.js` shapes property-for-property
 * so this file can be replaced with native glossarist-js types when
 * that library ships them.
 *
 * Enumerations (relationship types, presence, count, completeness,
 * definition types, designation relationship types) are imported
 * directly from glossarist-js — the SDK is the single source of truth
 * for the wire format's vocabulary. The interface shapes below remain
 * hand-rolled because glossarist-js does not yet re-export its internal
 * `*Json` interfaces publicly (tracked in TODO.refactor/26).
 *
 * The type is permissive (every field optional except where ISO 704 /
 * ISO 10241-1 makes it mandatory) — strict validation is the job of
 * the validators in src/components/ValidatorPlayground.vue, not the
 * type. The type only describes the SHAPE that successfully-parsed
 * YAML can take.
 *
 * See:
 * - /model/concepts for the conceptual model
 * - glossarist-js/src/models/*.js for the runtime shapes
 * - ISO 12620 §A for the data-category source of truth
 */

import {
  RELATIONSHIP_TYPES,
  PARTITIVE_PRESENCE_VALUES,
  PARTITIVE_COUNT_VALUES,
  COMPLETENESS_VALUES,
  DEFINITION_TYPE,
  DESIGNATION_RELATIONSHIP_TYPES,
} from 'glossarist/models'

// ─────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────

export interface ConceptRef {
  source?: string
  id?: string
  text?: string
}

export type NormativeStatus = 'preferred' | 'admitted' | 'deprecated'

export type PartitivePresence = typeof PARTITIVE_PRESENCE_VALUES[number]

export type PartitiveCount = typeof PARTITIVE_COUNT_VALUES[number]

export type HyperedgeWireType =
  | 'partitive_relation'
  | 'generic_relation'
  | 'sequential_relation'

export type Completeness = typeof COMPLETENESS_VALUES[number]

export type DetailedDefinitionType = typeof DEFINITION_TYPE.VALUES[number]

export type DesignationRelationshipType = typeof DESIGNATION_RELATIONSHIP_TYPES[number]

// ─────────────────────────────────────────────────────────────────────
// Sources + dates
// ─────────────────────────────────────────────────────────────────────

export interface ConceptSourceOrigin {
  ref?: ConceptRef
  locality?: {
    type?: string
    reference_from?: string
    reference_to?: string
  }
}

export interface ConceptSourceYaml {
  type?: string  // authoritative | lineage | original | modification | ...
  origin?: string | ConceptSourceOrigin
  date?: string
}

export interface DateEventYaml {
  type: string  // accepted | deprecated | superseded | last-reviewed | ...
  date: string
  source?: string
}

// ─────────────────────────────────────────────────────────────────────
// Designations (term / appellation / symbol)
// ─────────────────────────────────────────────────────────────────────

export interface DesignationGrammarYaml {
  part_of_speech?: string
  gender?: string
  number?: string
}

export interface DesignationYaml {
  type?: string  // expression | abbreviation | symbol | appellation | ...
  designation?: string
  normative_status?: NormativeStatus
  term_type?: string  // ISO 12620 §A.2.1 enumeration (see Term Types page)
  grammar?: DesignationGrammarYaml
  geographical_area?: string  // ISO 3166 country code
  pronunciation?: string
  dates?: DateEventYaml[]
  notes?: string[]
}

// ─────────────────────────────────────────────────────────────────────
// Definition + supplementary information (ISO 704:2022 §6)
// ─────────────────────────────────────────────────────────────────────

export type SupplementaryInfoKind =
  | 'context'
  | 'encyclopaedic'
  | 'explanation'
  | 'note'
  | 'other'

export interface DetailedDefinitionYaml {
  type?: DetailedDefinitionType
  content: string
  sources?: ConceptSourceYaml[]
  notes?: string[]
}

export interface NoteYaml {
  kind?: SupplementaryInfoKind
  content: string
  sources?: ConceptSourceYaml[]
}

export interface ExampleYaml {
  kind?: 'context' | 'example'
  content: string
  non_verbal?: string  // path to a figure
  sources?: ConceptSourceYaml[]
}

// ─────────────────────────────────────────────────────────────────────
// Per-language localization
// ─────────────────────────────────────────────────────────────────────

export interface LocalizedConceptYaml {
  language?: string  // ISO 639-3
  script?: string    // ISO 15924
  system?: string    // ISO 24229
  terms?: DesignationYaml[]
  definition?: DetailedDefinitionYaml[]
  notes?: NoteYaml[]
  annotations?: NoteYaml[]
  examples?: ExampleYaml[]
  entry_status?: string
  classification?: string
  domain?: string
  related?: RelatedYaml[]
  sources?: ConceptSourceYaml[]
}

// ─────────────────────────────────────────────────────────────────────
// Related (binary typed edges)
// ─────────────────────────────────────────────────────────────────────

export interface RelatedYaml {
  type: string  // validated against RELATED_TYPE_ENUM in playground
  ref?: ConceptRef
  content?: string
  target?: string  // designation-level relationships use target (text), not ref
}

// ─────────────────────────────────────────────────────────────────────
// Hyperedge members + edges
// ─────────────────────────────────────────────────────────────────────

export interface HyperedgeMemberYaml {
  ref: ConceptRef
  presence?: PartitivePresence
  count?: PartitiveCount
  is_delimiting?: boolean
  /**
   * Per ISO 704:2022 §5.5.4.2.1 — required on GenericMember.
   * Optional on SequentialMember (Phase 1).
   * NOT used on PartitiveMember (Partitive uses is_delimiting boolean).
   */
  delimitingCharacteristic?: Record<string, string>
}

export interface HyperedgeYaml {
  $id?: string
  type: HyperedgeWireType
  status?: string
  comprehensive: ConceptRef
  members?: HyperedgeMemberYaml[]
  /** Legacy alias for `members` used by partitive in early v3 drafts. */
  partitives?: HyperedgeMemberYaml[]
  completeness?: Completeness
  criterion?: Record<string, string>
  sources?: ConceptSourceYaml[]
  notes?: Record<string, string>
}

// ─────────────────────────────────────────────────────────────────────
// Top-level concept
// ─────────────────────────────────────────────────────────────────────

export interface ManagedConceptDatesYaml {
  type: string
  date: string
  source?: string
}

export interface ManagedConceptYaml {
  termid?: string
  identifier?: string
  status?: string  // valid | retired | superseded | external | ...
  uri?: string
  /**
   * Per-language data, keyed by ISO 639-3 code. The canonical form.
   * Legacy flat form (top-level `eng:` etc.) is also accepted by parsers.
   */
  localizations?: Record<string, LocalizedConceptYaml>
  related?: RelatedYaml[]
  domains?: unknown[]
  tags?: string[]
  dates?: ManagedConceptDatesYaml[]
  sources?: ConceptSourceYaml[]
  partitive_relations?: HyperedgeYaml[]
  generic_relations?: HyperedgeYaml[]
  sequential_relations?: HyperedgeYaml[]
}

/**
 * The parsed shape of any YAML file in `concepts/` or `relations/`.
 * Either a concept or a hyperedge. Discriminated by presence of
 * `comprehensive` (hyperedge) vs `localizations` / `termid` (concept).
 *
 * The legacy flat form (e.g. `termid: "x"\neng:\n  terms: [...]`) is
 * also a ConceptYaml — parsers migrate it to `localizations` shape.
 */
export type ConceptYaml = ManagedConceptYaml

// ─────────────────────────────────────────────────────────────────────
// Canonical enumerations — imported from glossarist-js (single source of truth)
// ─────────────────────────────────────────────────────────────────────

/**
 * Relationship types come directly from glossarist-js's RELATIONSHIP_TYPES
 * const. The SDK is the authoritative source for the wire format's
 * relationship vocabulary. With `sideEffects: false` on the glossarist
 * package, Vite tree-shakes the unused module graph and only includes
 * the const arrays (<2KB total).
 */
export const RELATED_TYPE_ENUM = RELATIONSHIP_TYPES as readonly string[]
export type RelatedType = typeof RELATIONSHIP_TYPES[number]
export const RELATED_TYPE_SET: ReadonlySet<string> = new Set(RELATED_TYPE_ENUM)

/**
 * Designation-level relationship types (term-to-term, not concept-to-concept).
 * A separate SDK enum — these belong to designations, not to concepts.
 */
export const DESIGNATION_RELATION_ENUM = DESIGNATION_RELATIONSHIP_TYPES as readonly string[]
export type DesignationRelationType = typeof DESIGNATION_RELATIONSHIP_TYPES[number]

/**
 * The ISO 12620 §A.2.1 term_type enumeration.
 * Source: see /model/term-types.
 */
export const TERM_TYPE_ENUM = [
  'expression', 'symbol', 'abbreviation', 'acronym', 'initialism', 'clipped_term',
  'full_form', 'short_form', 'transliterated_form', 'transcribed_form', 'truncation', 'variant',
  'formula', 'equation', 'logical_expression', 'mathematical_expression',
  'reference_symbol', 'figure_symbol', 'graphic_symbol', 'letter_symbol', 'roman_numeral',
  'code', 'common_name', 'entry_term', 'internationalism', 'international_scientific_term',
  'part_number', 'phrase', 'phraseological_unit', 'scientific_name', 'shortcut', 'sku',
  'standard_text', 'synonym', 'synonymous_phrase',
] as const

export type TermType = typeof TERM_TYPE_ENUM[number]

export const TERM_TYPE_SET: ReadonlySet<string> = new Set(TERM_TYPE_ENUM)
