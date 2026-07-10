# 11 — VitePress CSS Variable Purge (DONE)

**Status:** complete in commit on `feat/astro-migration` branch.

## What was done

All `--vp-c-*` and `--vp-*` CSS custom properties (imported from VitePress's
default theme during the initial CSS port) have been renamed to brand-neutral
`--g-*` names. No `vp*` strings remain in `src/`, `test/`, or `scripts/`.

### Variable mapping

| Old (VitePress) | New (Glossarist) |
|---|---|
| `--vp-c-bg` | `--g-bg` |
| `--vp-c-bg-soft` | `--g-bg-soft` |
| `--vp-c-bg-soft-up` | `--g-bg-soft-up` |
| `--vp-c-bg-mute` | `--g-bg-mute` |
| `--vp-c-bg-alt` | `--g-bg-alt` |
| `--vp-c-bg-safe` | `--g-bg-safe` |
| `--vp-c-text-1` / `2` / `3` | `--g-text-1` / `2` / `3` |
| `--vp-c-divider` | `--g-divider` |
| `--vp-c-divider-light` | `--g-divider-light` |
| `--vp-c-divider-lighter` | `--g-divider-lighter` |
| `--vp-c-brand-1` | `--g-brand` |
| `--vp-c-brand-2` / `3` | `--g-brand-2` / `3` |
| `--vp-c-brand-soft` | `--g-brand-soft` |
| `--vp-c-default-soft` | `--g-muted-soft` |
| `--vp-code-line-height` | `--g-code-line-height` |
| `--vp-code-font-size` | `--g-code-font-size` |
| `--vp-code-block-bg` | `--g-code-block-bg` |
| `--vp-code-line-highlight-color` | `--g-code-line-highlight-color` |
| `--vp-font-family-base` | `--g-font-base` |
| `--vp-font-family-mono` | `--g-font-mono` |
| `--vp-layout-max-width` | `--g-layout-max-width` |
| `--vp-content-font-size` | `--g-content-font-size` |
| `--vp-content-line-height` | `--g-content-line-height` |

### Files touched

- `src/styles/base.css` — design token definitions (light + dark)
- `src/styles/custom.css` — brand color aliases (`--g-brand` → `--g-steel` etc.)
- `src/components/Nav.astro`, `Footer.astro`, `Sidebar.astro`, `Outline.astro`
- `src/components/ReleaseDownloader.astro`, `ModelLanding.astro`
- `src/components/HomePage.vue`, `OntologyBrowser.vue`, `SchemaReference.vue`,
  `RelationshipTypes.vue`, `YamlSchemas.vue`
- `src/layouts/BaseLayout.astro`, `DocLayout.astro`, `BlogLayout.astro`
- `src/pages/404.astro`, `blog/index.astro`
- `src/content/pages/about.md` (inline `<style>` block)

## Verification

```bash
grep -rln "vp-c-\|--vp-\|VP[A-Z]\|vp-doc\|vp-" src/ test/ scripts/
# (no output)
```
