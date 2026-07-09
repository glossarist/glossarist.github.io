# 07 — Build Scripts Integration

**Goal:** Keep the four `scripts/*.mjs` data generators working unchanged. They produce `public/data/*.json` consumed by Vue islands at runtime.

## The four scripts

| Script | Input | Output |
|---|---|---|
| `scripts/generate-ontology-data.mjs` | `concept-model/ontologies/taxonomies/*.ttl` | `public/data/taxonomies.json`, `public/data/stats.json` |
| `scripts/generate-ontology-schema.mjs` | `concept-model/ontologies/glossarist.ttl`, `shapes/*.ttl` | `public/data/ontology-schema.json` |
| `scripts/copy-schemas.mjs` | `concept-model/schemas/**` | `public/data/schemas/**`, `public/data/schemas/index.json` |
| `scripts/bundle-schemas.mjs` | `public/data/schemas/index.json` | `.vitepress/data/schemas-bundled.json` |

## Tasks

### 7.1 — Verify scripts are framework-agnostic

All four use only `node:fs`, `node:path`, `node:url`, and `yaml` package. No VitePress imports. They will work unchanged under Astro.

### 7.2 — Output path consistency

`bundle-schemas.mjs` writes to `.vitepress/data/schemas-bundled.json`. After cutover, this needs to move to `astro/src/data/schemas-bundled.json` (or `astro/src/data/schemas-bundled.ts` that re-exports JSON).

**During migration:** leave script writing to `.vitepress/data/schemas-bundled.json`. Astro components import it via path alias:

```ts
// astro/tsconfig.json
"paths": {
  "@/*": ["src/*"],
  "@data/*": ["../.vitepress/data/*"]
}
```

```astro
---
import bundled from '@data/schemas-bundled.json'
---
```

**At cutover:** update `bundle-schemas.mjs` to write to `astro/src/data/schemas-bundled.json` (or remove `.json` write entirely and have Astro read from `public/data/schemas/` directly via `fs.readFileSync` at build time — preferred, simpler).

### 7.3 — Build pipeline order

VitePress current:
```
build → build:data (4 scripts) → vitepress build
```

Astro new:
```
build → build:data (4 scripts, same) → astro build
```

### 7.4 — CI workflow

`.github/workflows/build.yml` currently:
```yaml
- name: Checkout
- name: Checkout concept-model  # critical — scripts read from here
- name: Setup Pages
- name: Setup Node
- name: Install dependencies
  run: npm ci
- name: Build
  run: npm run build
- name: Upload artifact
  uses: actions/upload-pages-artifact@v4
  with:
    path: .vitepress/dist   # ← change to astro/dist at cutover
```

The "Checkout concept-model" step is **unchanged** — same path, same scripts consume it.

### 7.5 — Vitest coverage

Tests in `test/scripts.test.ts` already verify the output JSON shapes. After cutover, these tests move to `astro/test/scripts.test.ts` and continue to verify against `../public/data/*.json` (path is relative to Astro root, unchanged because `public/` is shared via symlink).

## Decision: keep scripts in `scripts/` or move to `astro/scripts/`?

**Keep in `scripts/`** at repo root. Rationale:
- They're framework-agnostic — they don't belong to either VitePress or Astro specifically.
- During migration they need to write to BOTH `.vitepress/data/` (until cutover) and `astro/src/data/` (after).
- After cutover, root is Astro's home, so `scripts/` ends up at the natural root location.

## Acceptance

- `npm run build:data` produces identical `public/data/*.json` before and after Astro migration.
- `astro build` succeeds with the data in place.
- Vue islands can `fetch('/data/taxonomies.json')` and get the expected shape.
- `test/scripts.test.ts` tests pass unchanged.

## Next

→ `08-deployment-cutover.md`
