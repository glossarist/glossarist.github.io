# 08 — Deployment Cutover

**Goal:** Swap the root `package.json`, CI workflow, and live build from VitePress to Astro without downtime. Retire VitePress files.

## Pre-cutover checklist

- [ ] All pages exist at the same URLs (verified in TODO 05).
- [ ] All Vue components work as islands (TODO 04).
- [ ] Pagefind search works (TODO 06).
- [ ] Sitemaps match.
- [ ] `npm run test` passes against Astro source.
- [ ] Visual diff against VitePress build shows no regressions.
- [ ] Dark mode toggle works.
- [ ] OS-detected download works on `/docs/software/desktop`.
- [ ] Lychee link checker passes.

## Cutover steps

### 8.1 — Promote Astro to root

Move all `astro/*` to repo root. Concretely:

```bash
# On a clean branch, with astro/ complete and tested:
mv .vitepress .vitepress.old  # don't delete yet, see 8.5
mv astro/package.json package.json.new
mv astro/astro.config.mjs astro.config.mjs
mv astro/tsconfig.json tsconfig.json.new
mv astro/vitest.config.ts vitest.config.ts.new
mv astro/src src
mv astro/public public.astro  # we'll consolidate
mv astro/test test.new
rmdir astro

# Merge package.json by hand:
#   - keep our name "glossarist.org"
#   - keep our version
#   - scripts: astro dev / astro build / vitest
#   - dependencies: astro + integrations + yaml
#   - devDependencies: vitest, test utils, typescript
mv package.json.new package.json
```

### 8.2 — Consolidate `public/`

We have two `public/` directories during migration:
- `public/` (VitePress root) — has favicons, robots.txt, CNAME, images
- `astro/public/` (or symlinked)

After cutover, **merge**:
- Keep `public/CNAME` (critical for Pages)
- Keep `public/robots.txt`
- Keep `public/favicon.*`, `public/apple-touch-icon.png`, `public/site.webmanifest`, `public/web-app-manifest-*.png`
- Keep `public/images/`, `public/data/`
- Delete any duplicates from `astro/public/`

### 8.3 — Update `.github/workflows/build.yml`

```yaml
- name: Build
  run: npm run build   # now runs astro build
- name: Upload artifact
  uses: actions/upload-pages-artifact@v4
  with:
    path: dist   # was .vitepress/dist
```

### 8.4 — Update `package.json` scripts

Before (VitePress):
```json
"scripts": {
  "dev": "vitepress dev",
  "build": "npm run build:data && vitepress build",
  "build:data": "node scripts/generate-ontology-data.mjs && ...",
  "preview": "vitepress preview",
  "test": "vitest run"
}
```

After (Astro):
```json
"scripts": {
  "dev": "astro dev",
  "build": "npm run build:data && astro build",
  "build:data": "node scripts/generate-ontology-data.mjs && ...",
  "preview": "astro preview",
  "test": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

`build:data` is **unchanged**.

### 8.5 — Retire VitePress files

Files to remove (after a 1-2 week cooling-off period post-cutover, in case rollback is needed):

- `.vitepress/` (entire directory)
- `.vitepress.old/` (the renamed one from 8.1)
- `vitest.config.ts` (replaced by Astro's — actually keep this if tests still import from `.vitepress/`)
- Any `.md` files that were moved into content collections (they're now under `src/content/`)
- `index.md` (replaced by `src/pages/index.astro`)

**Do not delete** until:
- Production has run on Astro for 2 weeks with no rollback
- Git history contains all the cutover commits for forensic recovery

### 8.6 — Update `CLAUDE.md`

Replace the VitePress architecture section with Astro's:
- Astro project structure
- Content collections
- Vue islands
- Build pipeline (unchanged scripts)
- Test setup (Vitest)

### 8.7 — Update `lychee.toml`

`include` paths may need updating:
```toml
include = [
  "dist/**/*.html"  # was .vitepress/dist
]
```

## Rollback plan

If the Astro build fails in production:
1. Revert the merge commit on `main`.
2. VitePress build resumes automatically from the previous state.
3. Investigate the failure on a feature branch.

Keep `.vitepress/` for at least 2 weeks specifically to enable this rollback.

## Acceptance

- `main` branch deploys successfully via Astro build.
- Site is live at https://www.glossarist.org via the new pipeline.
- No 404s introduced (lychee confirms).
- Rollback is documented and tested at least once on a staging branch.

## Next

→ `09-regression-tests.md`
