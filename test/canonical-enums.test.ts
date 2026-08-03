import { describe, it, expect } from 'vitest'
import {
  RELATED_TYPE_ENUM,
  RELATED_TYPE_SET,
  DESIGNATION_RELATION_ENUM,
  TERM_TYPE_ENUM,
  TERM_TYPE_SET,
  type RelatedType,
  type TermType,
} from '../src/types/concept-yaml'
import {
  RELATIONSHIP_TYPES,
  PARTITIVE_PRESENCE_VALUES,
  PARTITIVE_COUNT_VALUES,
  COMPLETENESS_VALUES,
  DEFINITION_TYPE,
  DESIGNATION_RELATIONSHIP_TYPES,
} from 'glossarist/models'

describe('Canonical enumerations (src/types/concept-yaml.ts)', () => {
  // These enums are the single source of truth for relationship types,
  // hyperedge dimensions, and term types across the site. Drift between
  // this file and the docs / playgrounds / SDK = silent bugs.
  //
  // The enums are imported directly from glossarist-js, so the assertions
  // below also guard against the SDK changing shape out from under us.

  it('RELATED_TYPE_ENUM matches glossarist-js RELATIONSHIP_TYPES exactly', () => {
    expect(RELATED_TYPE_ENUM.length).toBe(RELATIONSHIP_TYPES.length)
    expect([...RELATED_TYPE_ENUM]).toEqual([...RELATIONSHIP_TYPES])
  })

  it('RELATED_TYPE_ENUM entries are unique', () => {
    const set = new Set(RELATED_TYPE_ENUM)
    expect(set.size).toBe(RELATED_TYPE_ENUM.length)
  })

  it('RELATED_TYPE_SET matches RELATED_TYPE_ENUM', () => {
    for (const t of RELATED_TYPE_ENUM) {
      expect(RELATED_TYPE_SET.has(t)).toBe(true)
    }
  })

  it('DESIGNATION_RELATION_ENUM matches SDK DESIGNATION_RELATIONSHIP_TYPES', () => {
    expect([...DESIGNATION_RELATION_ENUM]).toEqual([...DESIGNATION_RELATIONSHIP_TYPES])
    // These are term-to-term relationships (designation level), distinct
    // from concept-to-concept relationship types.
    for (const t of DESIGNATION_RELATION_ENUM) {
      expect(RELATED_TYPE_ENUM).not.toContain(t)
    }
  })

  it('PARTITIVE_PRESENCE / COUNT / COMPLETENUM match SDK values', () => {
    // Hyperedge MECE axes — re-exported as types from the SDK const arrays.
    expect(PARTITIVE_PRESENCE_VALUES).toEqual(['required', 'optional'])
    expect(PARTITIVE_COUNT_VALUES).toEqual(['exactly_one', 'at_least_one', 'multiple'])
    expect(COMPLETENESS_VALUES).toEqual(['complete', 'partial'])
  })

  it('DEFINITION_TYPE.VALUES matches SDK definition type enum', () => {
    expect(DEFINITION_TYPE.VALUES).toEqual(['intensional', 'extensional', 'partitive', 'translated'])
    expect(DEFINITION_TYPE.INTENSIONAL).toBe('intensional')
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
    const sample: RelatedType = 'broader'
    expect(RELATED_TYPE_ENUM).toContain(sample)
  })
})
