/**
 * Test fixtures — typed YAML shapes for hyperedge + concept validation tests.
 *
 * Each fixture is a real .yaml file under test/__fixtures__/. This module
 * loads + parses + types them so tests get compile-time safety on the
 * fixture shape. Mirrors glossarist-js's src/models/*.js shapes.
 *
 * Fixtures are organized by purpose:
 * - hyperedges/*.yaml — n-ary relation shapes (valid + broken)
 * - concepts/*.yaml — concept file shapes (valid + broken)
 *
 * Add a new fixture:
 * 1. Drop the .yaml file under the right subdir
 * 2. Add the typed export below
 * 3. (Optional) Add a test that asserts the fixture's expected properties
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parse } from 'yaml'
import type {
  ConceptYaml,
  HyperedgeYaml,
} from '../../src/types/concept-yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadYaml<T>(relPath: string): T {
  const fullPath = join(__dirname, relPath)
  const text = readFileSync(fullPath, 'utf-8')
  return parse(text) as T
}

// ─────────────────────────────────────────────────────────────────────
// Concept fixtures
// ─────────────────────────────────────────────────────────────────────

export const FIXTURE_MINIMAL_CONCEPT: ConceptYaml =
  loadYaml<ConceptYaml>('concepts/minimal-valid.yaml')

export const FIXTURE_MISSING_DEFINITION: ConceptYaml =
  loadYaml<ConceptYaml>('concepts/missing-definition.yaml')

export const FIXTURE_BAD_RELATED_TYPE: ConceptYaml =
  loadYaml<ConceptYaml>('concepts/bad-related-type.yaml')

export const FIXTURE_EXTERNAL_NO_PROVIDED_BY: ConceptYaml =
  loadYaml<ConceptYaml>('concepts/external-no-provided-by.yaml')

export const FIXTURE_EXTERNAL_WITH_DEF: ConceptYaml =
  loadYaml<ConceptYaml>('concepts/external-with-def.yaml')

// ─────────────────────────────────────────────────────────────────────
// Hyperedge fixtures
// ─────────────────────────────────────────────────────────────────────

export const FIXTURE_PARTITIVE_VALID: HyperedgeYaml =
  loadYaml<HyperedgeYaml>('hyperedges/partitive-valid.yaml')

export const FIXTURE_PARTITIVE_INVALID_MECE: HyperedgeYaml =
  loadYaml<HyperedgeYaml>('hyperedges/partitive-invalid-mece.yaml')

export const FIXTURE_GENERIC_VALID: HyperedgeYaml =
  loadYaml<HyperedgeYaml>('hyperedges/generic-valid.yaml')

export const FIXTURE_GENERIC_MISSING_CHARACTERISTIC: HyperedgeYaml =
  loadYaml<HyperedgeYaml>('hyperedges/generic-missing-characteristic.yaml')

export const FIXTURE_EXTERNAL_AS_COMPREHENSIVE: HyperedgeYaml =
  loadYaml<HyperedgeYaml>('hyperedges/external-as-comprehensive.yaml')

// ─────────────────────────────────────────────────────────────────────
// Convenience: text versions (for tests that need to setValue into a textarea)
// ─────────────────────────────────────────────────────────────────────

export function loadYamlText(relPath: string): string {
  return readFileSync(join(__dirname, relPath), 'utf-8')
}

export const FIXTURE_MINIMAL_CONCEPT_TEXT = loadYamlText('concepts/minimal-valid.yaml')
export const FIXTURE_MISSING_DEFINITION_TEXT = loadYamlText('concepts/missing-definition.yaml')
export const FIXTURE_BAD_RELATED_TYPE_TEXT = loadYamlText('concepts/bad-related-type.yaml')
export const FIXTURE_EXTERNAL_NO_PROVIDED_BY_TEXT = loadYamlText('concepts/external-no-provided-by.yaml')
export const FIXTURE_EXTERNAL_WITH_DEF_TEXT = loadYamlText('concepts/external-with-def.yaml')

export const FIXTURE_PARTITIVE_VALID_TEXT = loadYamlText('hyperedges/partitive-valid.yaml')
export const FIXTURE_PARTITIVE_INVALID_MECE_TEXT = loadYamlText('hyperedges/partitive-invalid-mece.yaml')
export const FIXTURE_GENERIC_VALID_TEXT = loadYamlText('hyperedges/generic-valid.yaml')
export const FIXTURE_GENERIC_MISSING_CHARACTERISTIC_TEXT = loadYamlText('hyperedges/generic-missing-characteristic.yaml')
export const FIXTURE_EXTERNAL_AS_COMPREHENSIVE_TEXT = loadYamlText('hyperedges/external-as-comprehensive.yaml')
