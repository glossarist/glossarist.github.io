# 06 — Replace duck-typing patterns with proper type guards

## Status
◐ In progress (no `respond_to?`-equivalent in TS; this TODO covers `typeof`/`instanceof` discipline)

## Motivation

Project's global rules forbid:
- `send` to call private methods
- `instance_variable_set`/`get`
- `respond_to?` for type checking

TS analogs of these anti-patterns:
- `(obj as any).privateMethod()` — bypasses type system
- `obj['somePrivateField']` — bypasses encapsulation
- `if (typeof obj.method === 'function')` instead of a proper type guard
- `if ('field' in obj)` followed by unchecked access — duck typing

## Audit findings

Most of the codebase uses proper TypeScript types. Quick scan turned up:

1. `src/components/HyperedgePlayground.vue` — `parsed.value.edge?.type` accesses are properly typed. No `as any` escapes.
2. `src/components/ValidatorPlayground.vue` — rule functions take `any` parameter. Should be `unknown` with proper type narrowing, or a dedicated `ConceptYaml` type.
3. `src/i18n/index.ts` — `isLocale(value: string): value is Locale` is a proper type guard. Good.

## Fix scope

Replace `any` with proper types in:

- `ValidatorPlayground.vue` rule functions: change `run: (data: any) => ValidationIssue[]` to `run: (data: ConceptYaml) => ValidationIssue[]` where `ConceptYaml` is a typed shape (defined in `src/i18n/` or a new `src/types/`).
- YAML parse result: type as `unknown`, narrow with type guards.

## Acceptance criteria

- [ ] No `any` types in production code (only in test fixtures where intentional)
- [ ] A `ConceptYaml` type defined in a dedicated module
- [ ] All type narrowing uses proper `is`/`in` guards with explicit return types
- [ ] ESLint rule `@typescript-eslint/no-explicit-any` enabled (or audit-and-suppress pattern)

## Test

Existing tests pass + `npm run typecheck` (if exists) green.

## Dependencies

- Define a proper `ConceptYaml` type (could live in `src/types/concept-yaml.ts`).
