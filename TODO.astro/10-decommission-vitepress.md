# 10 — Decommission VitePress (Revised: In-Place Cutover)

**Decision (revised 2026-07-09):** The migration is **single-track**. There is no coexistence period. VitePress is removed in the same PR that lands Astro. This overrides the "gradual cutover" plan in `08-deployment-cutover.md`.

## Why the change

The original plan kept VitePress running at repo root while Astro was built in `astro/`, with a 2-week cooling-off period for rollback. On reflection:

- Two build systems in one repo is confusing. CI has to know which to run.
- Shared `public/` and `scripts/` introduce subtle bugs (e.g., the VitePress dead-link failure on `astro/README.md`).
- The Vitest suite covers the regression risk that the cooling-off period was meant to protect against.
- Rollback via git revert is always available — we don't need a parallel live system.

## What "decommission" means concretely

In the migration PR, the following are deleted in a single commit:

- `.vitepress/` — entire directory (config, theme, components, data, posts.data.ts)
- `vitest.config.ts` at repo root — replaced by Astro's
- `index.md`, `about.md` — replaced by `src/pages/*.astro`
- All markdown under `docs/`, `blog/`, `reference/` — moved into `src/content/`
- `package.json` `vitepress` and `@vitejs/plugin-vue` devDependencies (Vue stays — needed for interactive Astro islands)
- `lychee.toml` `.vitepress/dist/**/*.html` include → `dist/**/*.html`

## What stays

- `public/` (CNAME, robots.txt, favicons, images, data/) — now served by Astro directly
- `scripts/*.mjs` — framework-agnostic, write to `public/data/` as before
- `concept-model/` checkout step in CI — scripts still read from here
- All Vitest tests in `test/` — paths updated from `.vitepress/*` to `src/*`

## CI workflow after cutover

```yaml
- name: Build
  run: npm run build   # astro build
- name: Upload artifact
  uses: actions/upload-pages-artifact@v4
  with:
    path: dist   # was .vitepress/dist
```

## Acceptance

- `npm run build` succeeds (Astro only, no VitePress in dependency tree)
- `npm test` — all Vitest tests pass against the new `src/` paths
- `npm run preview` serves a working site at `localhost:4321`
- No file in the repo imports from `vitepress`
- `grep -r vitepress .` returns zero hits (excluding `node_modules/`, `dist/`)
- CI workflow runs Astro build, not VitePress
