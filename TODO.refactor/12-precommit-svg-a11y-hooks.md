# 12 — Pre-commit hooks for SVG a11y + diagram invariants

## Status
☐ Not started

## Motivation

The vitest suite catches SVG issues at CI time, but contributors can push broken SVGs and only find out minutes later when CI fails. Pre-commit hooks catch issues in <1 second at commit time.

## Scope

Add pre-commit hooks (via Husky or similar) that run:

1. **SVG a11y check** — every staged SVG has `<title>`, `<desc>`, `role="img"`
2. **SVG wire-preview field-name check** — every staged SVG with a YAML preview uses canonical field names
3. **MDX figure-wrapper check** — every staged MDX with a hyperedge SVG uses `<figure class="g-figure-light">`
4. **Type-check** — `tsc --noEmit` on staged TS/Vue files
5. **Prettier** — format check on staged files

## Implementation sketch

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "public/images/*.svg": "node scripts/svg-a11y-check.mjs",
    "src/content/**/*.mdx": "node scripts/mdx-figure-wrapper-check.mjs",
    "src/**/*.{ts,vue,astro}": "tsc --noEmit"
  }
}
```

## Trade-off

Pre-commit hooks add ~2-5 seconds to every commit. Contributors may bypass with `--no-verify` (which we can't prevent, but can discourage via policy).

## Acceptance criteria

- [ ] Husky installed
- [ ] Pre-commit hook runs lint-staged
- [ ] SVG a11y check script exists
- [ ] MDX figure-wrapper check script exists (or use vitest subset)
- [ ] CLAUDE.md or CONTRIBUTING.md documents the hook + how to bypass in emergencies

## Dependencies

- Husky + lint-staged as dev deps
