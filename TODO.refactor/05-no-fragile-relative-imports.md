# 05 — Eliminate fragile relative imports (TS analog of Ruby `require_relative` rule)

## Status
◐ In progress (most imports already use `@/*` aliases; audit + cleanup remaining)

## Motivation

Project's global rule: avoid `require_relative` (Ruby) or relative paths deep enough to break on file moves. Use library autoload (Ruby) or TS path aliases (TS/Astro).

This repo already has aliases configured in `tsconfig.json` and `astro.config.mjs`:
- `@/*` → `src/*`
- `@data/*` → `src/data/*`
- `@components/*` → `src/components/*`

But many existing imports use relative paths like `../data/projects` instead of `@data/projects`. These break when files move and create cognitive load ("count the dots").

## Scope

Audit + replace every relative import in `src/` with its alias equivalent:

| Pattern | Replace with |
|---------|-------------|
| `../data/X` | `@data/X` |
| `../components/X` | `@components/X` |
| `../../i18n` | `@/i18n` |
| `../i18n/translations` | `@/i18n/translations` |

## Acceptance criteria

- [ ] No remaining `../` imports in `src/` that match an aliased path
- [ ] Test passes (or eslint rule enforces going forward)
- [ ] Build unchanged

## Risk

Low. TS path aliases are resolved at build time; swapping relative → aliased is purely cosmetic to the bundler.

## Test

```ts
// test/no-relative-imports.test.ts
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const srcDir = join(process.cwd(), 'src')
const offenders: string[] = []

for (const file of readdirSync(srcDir, { recursive: true })) {
  if (!/\.(ts|astro|vue|tsx)$/.test(file as string)) continue
  const content = readFileSync(join(srcDir, file as string), 'utf-8')
  // Flag imports that go up 2+ directories when an alias exists
  const matches = content.matchAll(/from\s+['"](\.\.\/(?:\.\.\/)+ (?:data|components|i18n)\/[^'"]+)['"]/g)
  for (const m of matches) offenders.push(`${file}: ${m[1]}`)
}
expect(offenders).toEqual([])
```
