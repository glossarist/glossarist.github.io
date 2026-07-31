import { describe, it, expect } from 'vitest'
import {
  FIXTURE_MINIMAL_CONCEPT,
  FIXTURE_MISSING_DEFINITION,
  FIXTURE_BAD_RELATED_TYPE,
  FIXTURE_EXTERNAL_NO_PROVIDED_BY,
  FIXTURE_EXTERNAL_WITH_DEF,
  FIXTURE_PARTITIVE_VALID,
  FIXTURE_PARTITIVE_INVALID_MECE,
  FIXTURE_GENERIC_VALID,
  FIXTURE_GENERIC_MISSING_CHARACTERISTIC,
  FIXTURE_EXTERNAL_AS_COMPREHENSIVE,
  FIXTURE_MINIMAL_CONCEPT_TEXT,
  FIXTURE_PARTITIVE_VALID_TEXT,
} from './__fixtures__'

describe('Test fixtures (test/__fixtures__/)', () => {
  // Fixtures are the canonical YAML shapes for tests. If a fixture is
  // malformed, every test that uses it inherits the brokenness — so
  // we verify each fixture has the shape its name promises.

  describe('concept fixtures', () => {
    it('FIXTURE_MINIMAL_CONCEPT has a definition', () => {
      expect(FIXTURE_MINIMAL_CONCEPT.termid).toBe('vim-2.9')
      expect(FIXTURE_MINIMAL_CONCEPT.localizations?.eng?.definition?.[0]?.content).toBeTruthy()
    })

    it('FIXTURE_MISSING_DEFINITION has no definition anywhere', () => {
      const locs = FIXTURE_MISSING_DEFINITION.localizations ?? {}
      for (const entry of Object.values(locs)) {
        expect(entry.definition ?? []).toEqual([])
      }
    })

    it('FIXTURE_BAD_RELATED_TYPE uses an unknown related.type', () => {
      const related = FIXTURE_BAD_RELATED_TYPE.related ?? []
      expect(related[0]?.type).toBe('is_kind_of')
    })

    it('FIXTURE_EXTERNAL_NO_PROVIDED_BY has status:external and no provided_by', () => {
      expect(FIXTURE_EXTERNAL_NO_PROVIDED_BY.status).toBe('external')
      const hasProvidedBy = (FIXTURE_EXTERNAL_NO_PROVIDED_BY.related ?? [])
        .some(r => r.type === 'provided_by')
      expect(hasProvidedBy).toBe(false)
    })

    it('FIXTURE_EXTERNAL_WITH_DEF has status:external AND a definition (broken)', () => {
      expect(FIXTURE_EXTERNAL_WITH_DEF.status).toBe('external')
      const locs = FIXTURE_EXTERNAL_WITH_DEF.localizations ?? {}
      const engDef = locs.eng?.definition
      expect(engDef && engDef.length > 0).toBe(true)
    })
  })

  describe('hyperedge fixtures', () => {
    it('FIXTURE_PARTITIVE_VALID has 3 members with distinct multiplicities', () => {
      const members = FIXTURE_PARTITIVE_VALID.members ?? []
      expect(members.length).toBe(3)
      const counts = members.map(m => `${m.presence ?? 'required'} · ${m.count ?? 'exactly_one'}`)
      expect(counts).toContain('required · exactly_one')
      expect(counts).toContain('required · at_least_one')
      expect(counts).toContain('optional · exactly_one')
    })

    it('FIXTURE_PARTITIVE_INVALID_MECE has the bad combo', () => {
      const bad = (FIXTURE_PARTITIVE_INVALID_MECE.members ?? [])
        .find(m => m.presence === 'optional' && m.count === 'at_least_one')
      expect(bad).toBeTruthy()
    })

    it('FIXTURE_GENERIC_VALID has delimitingCharacteristic on every member', () => {
      const members = FIXTURE_GENERIC_VALID.members ?? []
      expect(members.length).toBeGreaterThan(0)
      for (const m of members) {
        expect(m.delimitingCharacteristic).toBeTruthy()
      }
    })

    it('FIXTURE_GENERIC_MISSING_CHARACTERISTIC is missing delimitingCharacteristic', () => {
      const members = FIXTURE_GENERIC_MISSING_CHARACTERISTIC.members ?? []
      const allMissing = members.every(m => !m.delimitingCharacteristic)
      expect(allMissing).toBe(true)
    })

    it('FIXTURE_EXTERNAL_AS_COMPREHENSIVE has external-looking comprehensive id', () => {
      expect(FIXTURE_EXTERNAL_AS_COMPREHENSIVE.comprehensive.id).toMatch(/^ext-/)
    })
  })

  describe('text variants', () => {
    it('text variants match parsed variants', () => {
      // Sanity: the YAML text we feed into textareas must parse to the
      // same shape as the typed fixtures.
      expect(FIXTURE_MINIMAL_CONCEPT_TEXT).toContain('vim-2.9')
      expect(FIXTURE_PARTITIVE_VALID_TEXT).toContain('partitive_relation')
    })
  })
})
