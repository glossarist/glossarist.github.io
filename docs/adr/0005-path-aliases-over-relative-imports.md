# ADR 0005: Path aliases over relative imports

## Status

Accepted (2026-07-31)

## Context

TypeScript / Astro / Vite all support path aliases via `tsconfig.json` `paths` and `vite.config.ts` `resolve.alias`. This repo has four configured:

- `@/*` → `src/*`
- `@data/*` → `src/data/*`
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`

Without enforced aliases, contributors drift toward relative imports (`../../components/Foo`). These break when files move and create cognitive load ("count the dots").

This is the TypeScript / Astro analog of the project's global Ruby rule forbidding `require_relative` for internal library code (use autoload instead).

## Decision

- Migrate every `from '../...'` import in `src/` to its alias equivalent
- Add a regression test (`test/no-relative-imports.test.ts`) that fails if any deep relative import appears in `src/`
- Document the four aliases in `CONTRIBUTING.md` and `CLAUDE.md`

## Consequences

**Pros**
- File moves don't break imports
- Less cognitive load when reading imports
- Consistent style across the codebase
- Aligns with the project's broader principle against fragile path dependencies

**Cons**
- Slightly more setup overhead for new contributors (must learn the four aliases)
- Test imports in `test/` still use relative paths to `../src/...` — acceptable because tests don't move independently of `src/`

## Alternatives considered

- **tsconfig `paths` only (no Vite alias)** — TS type-checking works but Vite build fails to resolve. Need both.
- **ESLint rule** — would enforce at lint time, but adds ESLint as a dependency (TODO 25)
- **Husky pre-commit hook** — TODO 12; would catch earlier but not necessary given the test invariant

## References

- TODO.refactor/05 — executed in PR #100
- Test: `test/no-relative-imports.test.ts`
- Ruby autoload rule: project global CLAUDE.md
