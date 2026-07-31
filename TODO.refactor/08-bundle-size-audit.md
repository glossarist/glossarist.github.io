# 08 — Bundle size audit + budget enforcement

## Status
☐ Not started

## Motivation

The site has accumulated two large interactive islands (HyperedgePlayground, ValidatorPlayground). Each pulls in `yaml` and Vue runtime. Without a budget, bundles can silently grow until first-load performance degrades.

## Scope

1. Audit current per-route JS payload (use `astro build` stats or `vite-bundle-visualizer`)
2. Set budgets:
   - Homepage initial JS: ≤ 200 KB gzipped
   - Playground pages: ≤ 300 KB gzipped (yaml + Vue is heavy)
   - Docs / model / reference pages: ≤ 100 KB gzipped
3. Add CI check that fails if budgets exceed

## Acceptance criteria

- [ ] `npm run build` reports per-route bundle sizes
- [ ] Budget file checked in (`perf-budget.json` or similar)
- [ ] CI step compares actual vs budget and fails on overrun
- [ ] Initial budgets reflect current state (no immediate overrun)

## Implementation sketch

```yaml
# .github/workflows/build.yml addition
- name: Check bundle budgets
  run: |
    node scripts/check-bundle-budget.mjs dist/ perf-budget.json
```

```js
// scripts/check-bundle-budget.mjs
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'

const dist = process.argv[2]
const budgetFile = process.argv[3]
const budget = JSON.parse(readFileSync(budgetFile, 'utf-8'))

// Walk dist/**/_astro/*.js and sum per-route
// Compare to budget.routes[route].maxKb
// Exit non-zero on overrun
```

## Dependencies

- None
