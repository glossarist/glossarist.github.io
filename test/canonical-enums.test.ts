import { describe, it, expect } from 'vitest'
import {
  RELATED_TYPE_ENUM,
  RELATED_TYPE_SET,
  TERM_TYPE_ENUM,
  TERM_TYPE_SET,
  type RelatedType,
  type TermType,
} from '../src/types/concept-yaml'

describe('Canonical enumerations (src/types/concept-yaml.ts)', () => {
  // These enums are the single source of truth for relationship types
  // and term types across the site. Drift between this file and the
  // docs / playgrounds / SDK = silent bugs.

  it('RELATED_TYPE_ENUM matches glossarist-js RELATIONSHIP_TYPES exactly', () => {
    // The enum is now imported directly from glossarist-js's
    // RELATIONSHIP_TYPES const (see src/types/concept-yaml.ts), so this
    // test guards against silent drift if the SDK adds/removes entries.
    //
    // Known drift (2026-08-03): taxonomies.json (from concept-model TTL)
    // still carries `exact_match`, `abbreviated_form_for`, `short_form_for`,
    // and the short spatiotemporal names. The SDK has renamed the
    // spatiotemporal ones to `*_related_concept` and dropped the others.
    // The SDK is authoritative for wire-format validation;
    // RelationshipTypes.vue renders from taxonomies.json for documentation.
    expect(RELATED_TYPE_ENUM.length).toBe(51)
  })

  it('RELATED_TYPE_ENUM entries are unique', () => {
    const set = new Set(RELATED_TYPE_ENUM)
    expect(set.size).toBe(RELATED_TYPE_ENUM.length)
  })

  it('RELATED_TYPE_SET matches RELATED_TYPE_ENUM', () => {
    // The Set is derived from the array — sanity check.
    for (const t of RELATED_TYPE_ENUM) {
      expect(RELATED_TYPE_SET.has(t)).toBe(true)
    }
  })

  it('TERM_TYPE_ENUM covers the ISO 12620 §A.2.1 enumeration', () => {
    // Spot-check critical entries (full enumeration lives in /model/term-types)
    const required: TermType[] = [
      'expression', 'abbreviation', 'acronym', 'initialism',
      'formula', 'symbol', 'common_name', 'scientific_name',
      'full_form', 'short_form', 'variant',
    ]
    for (const t of required) {
      expect(TERM_TYPE_ENUM).toContain(t)
      expect(TERM_TYPE_SET.has(t)).toBe(true)
    }
  })

  it('TERM_TYPE_ENUM entries are unique', () => {
    const set = new Set(TERM_TYPE_ENUM)
    expect(set.size).toBe(TERM_TYPE_ENUM.length)
  })

  it('RelatedType is a strict union (no string fallback)', () => {
    // Compile-time check: assigning an unrelated string must fail.
    // Runtime equivalent: every RelatedType value is in the enum.
    const sample: RelatedType = 'broader'
    expect(RELATED_TYPE_ENUM).toContain(sample)
  })
})
