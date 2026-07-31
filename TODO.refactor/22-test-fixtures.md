# 22 — Test fixtures for hyperedge + concept YAML

## Status
☐ Not started

## Motivation

Current tests inline their test data:

```ts
await wrapper.find('.hp-textarea').setValue(`
type: partitive_relation
comprehensive: { source: VIM, id: "1" }
members:
  - ref: { source: VIM, id: "2" }
    presence: optional
    count: at_least_one
  - ref: { source: VIM, id: "3" }
`)
```

This is duplicated across `HyperedgePlayground.test.ts`, `ValidatorPlayground.test.ts`, and inline in test logic. If the YAML shape changes (e.g. we rename `comprehensive` to `whole`), every test must be updated individually.

DRY violation.

## Scope

Create canonical fixtures:

```
test/__fixtures__/
  hyperedges/
    partitive-valid.yaml
    partitive-missing-member.yaml
    partitive-invalid-mece.yaml
    generic-valid.yaml
    generic-missing-characteristic.yaml
    external-as-comprehensive.yaml
    sequential-valid.yaml
  concepts/
    minimal-valid.yaml
    missing-definition.yaml
    external-no-provided-by.yaml
    external-with-def.yaml
    bad-related-type.yaml
  index.ts                  // typed exports
```

Each fixture file is a real `.yaml` file that loads via `yaml` package. The `index.ts` exports typed constants:

```ts
// test/__fixtures__/index.ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import type { ConceptYaml, HyperedgeYaml } from '../../src/types/concept-yaml'

function loadYaml<T>(relPath: string): T {
  const text = readFileSync(join(__dirname, relPath), 'utf-8')
  return parse(text) as T
}

export const FIXTURE_PARTITIVE_VALID = loadYaml<HyperedgeYaml>('hyperedges/partitive-valid.yaml')
export const FIXTURE_GENERIC_VALID = loadYaml<HyperedgeYaml>('hyperedges/generic-valid.yaml')
export const FIXTURE_MINIMAL_CONCEPT = loadYaml<ConceptYaml>('concepts/minimal-valid.yaml')
// ... etc
```

Tests become:

```ts
import { FIXTURE_PARTITIVE_INVALID_MECE } from '../__fixtures__'

it('flags invalid MECE combo', () => {
  const issues = hyperedgeCardinalityRule.run(FIXTURE_PARTITIVE_INVALID_MECE)
  expect(issues).toContainEqual(expect.objectContaining({ level: 'error' }))
})
```

## Acceptance criteria

- [ ] `test/__fixtures__/` directory exists
- [ ] At least 8 hyperedge fixtures + 5 concept fixtures
- [ ] `test/__fixtures__/index.ts` exports typed constants
- [ ] Existing playground tests refactored to use fixtures
- [ ] New tests use fixtures (no inline YAML strings in test logic)

## Why this matters

- **DRY** — one fixture, many tests
- **Realism** — fixtures are real `.yaml` files, not TS template strings (catches YAML formatting bugs)
- **Documentation** — `__fixtures__/` becomes a gallery of valid + invalid shapes
- **Reusability** — fixtures can be shared with the playground's preset selector

## Dependencies

- TODO 20 (ConceptYaml type) — fixtures should be typed
