# 20 — Define ConceptYaml domain type + replace ad-hoc `any` in playgrounds

## Status
☐ Not started

## Motivation

The playgrounds (`HyperedgePlayground.vue`, `ValidatorPlayground.vue`) accept user YAML and process it. Currently the YAML is typed as `any`, which:
- Bypasses TypeScript's type system
- Allows unchecked property access (`data.related[0].type` won't error if `related` is missing)
- Makes refactoring dangerous (no compiler help)
- Hides intent (readers don't know what shape the data has)

The project's quality rules forbid `respond_to?`-style duck typing in Ruby. The TS analog of that anti-pattern is using `any` and probing fields with `?.` chains.

## Scope

Define a proper `ConceptYaml` domain type that mirrors the Glossarist ManagedConcept wire shape:

```ts
// src/types/concept-yaml.ts

export interface ConceptRef {
  source?: string
  id?: string
  text?: string
}

export interface DesignationYaml {
  type?: string  // expression | abbreviation | symbol | ...
  designation?: string
  normative_status?: 'preferred' | 'admitted' | 'deprecated'
  term_type?: string
  grammar?: {
    part_of_speech?: string
    gender?: string
    number?: string
  }
  dates?: DesignationDateYaml[]
}

export interface DetailedDefinitionYaml {
  type?: 'intensional' | 'extensional' | 'partitive' | 'translated'
  content: string
  sources?: ConceptSourceYaml[]
  notes?: string[]
}

export interface LocalizedConceptYaml {
  language?: string
  script?: string
  terms?: DesignationYaml[]
  definition?: DetailedDefinitionYaml[]
  notes?: NoteYaml[]
  examples?: ExampleYaml[]
  sources?: ConceptSourceYaml[]
}

export interface RelatedYaml {
  type: string  // validated against RELATED_TYPE_ENUM
  ref?: ConceptRef
  content?: string
  target?: string
}

export interface HyperedgeMemberYaml {
  ref: ConceptRef
  presence?: 'required' | 'optional'
  count?: 'exactly_one' | 'at_least_one' | 'multiple'
  is_delimiting?: boolean
  delimitingCharacteristic?: Record<string, string>
}

export interface HyperedgeYaml {
  type: 'partitive_relation' | 'generic_relation' | 'sequential_relation'
  comprehensive: ConceptRef
  members: HyperedgeMemberYaml[]
  partitives?: HyperedgeMemberYaml[]  // legacy alias
  completeness?: 'complete' | 'partial'
  criterion?: Record<string, string>
  status?: string
  sources?: ConceptSourceYaml[]
}

export interface ConceptSourceYaml {
  type?: string
  origin?: string | { ref: ConceptRef; locality?: unknown }
  date?: string
}

export interface NoteYaml {
  kind?: 'context' | 'encyclopaedic' | 'explanation' | 'note' | 'other'
  content: string
  sources?: ConceptSourceYaml[]
}

export interface ExampleYaml {
  kind?: 'context' | 'example'
  content: string
  non_verbal?: string
  sources?: ConceptSourceYaml[]
}

export interface DesignationDateYaml {
  type: string
  date: string
  source?: string
}

export interface ConceptYaml {
  termid?: string
  identifier?: string
  status?: string
  uri?: string
  localizations?: Record<string, LocalizedConceptYaml>
  related?: RelatedYaml[]
  domains?: unknown[]
  tags?: string[]
  dates?: unknown[]
  sources?: ConceptSourceYaml[]
  partitive_relations?: HyperedgeYaml[]
  generic_relations?: HyperedgeYaml[]
  sequential_relations?: HyperedgeYaml[]
}

// Convenience: some YAML files use flat form (no localizations key; fields at top level)
export type ParsedConceptYaml = ConceptYaml & {
  // ISO 639-3 keys at top level (legacy flat form)
  [lang: string]: unknown
}
```

## Acceptance criteria

- [ ] `src/types/concept-yaml.ts` exists with all interfaces above
- [ ] `ValidatorPlayground.vue` rule functions take `ConceptYaml` (not `any`)
- [ ] `HyperedgePlayground.vue` parse result typed as `HyperedgeYaml | null`
- [ ] All `(x: any) => ...` arrow functions in rules replaced with typed versions
- [ ] Type narrowing uses `is`-guards with explicit return types
- [ ] `npm run typecheck` (or `tsc --noEmit`) passes
- [ ] No regression in playground behavior (same presets, same validation outcomes)

## Why this matters

- **Type safety** — compiler catches typos in field names; refactoring is safer
- **Documentation** — the type file IS the schema documentation for playground authors
- **OCP** — adding a new field = adding to the interface, not editing call sites
- **Aligns with glossarist-js** — the type mirrors `src/models/*.js` shapes; if glossarist-js ever ships native TS types, we can swap our local type for theirs

## Dependencies

- TODO 22 (test fixtures) — fixtures should be typed as `ConceptYaml`
