# Contributing to Glossarist.org

Thanks for your interest in improving Glossarist.org! This guide covers everything you need to land your first PR.

## Quick start

```bash
git clone https://github.com/glossarist/glossarist.github.io.git
cd glossarist.github.io
npm install
npm run dev          # http://localhost:4321
```

Requires Node 24+.

## Common contributions

### Fix a typo

1. Edit the MDX file under `src/content/`
2. Commit with `docs: fix typo in <page>`
3. Open PR — no test changes needed

### Add a new model page

1. Create `src/content/model/<slug>.mdx` with frontmatter (`title`, `description`)
2. Add an entry to `src/data/sidebars.ts` under `/model/`
3. Add the page to `src/components/Nav.astro` Model dropdown (if surface-worthy)
4. The page automatically becomes routable at `/model/<slug>`

### Add a new use case

1. Create `src/content/use-cases/<slug>.mdx` with frontmatter (`title`, `description`, `domain`, `order`)
2. Page is automatically routable at `/use-cases/<slug>` and listed on `/use-cases/`
3. Use case must link to at least one `/model/` page (test enforces)

### Add a new blog post

1. Create `src/content/blog/YYYY-MM-DD-<slug>.mdx` with frontmatter (`title`, `date`, `authors`, `description`)
2. The blog index auto-sorts by date

### Add a hyperedge SVG diagram

1. Drop the SVG under `public/images/hyperedge-<name>.svg`
2. **Required**: SVG must include `<title>`, `<desc>`, and `role="img"` for accessibility
3. **Required**: Reference the SVG in MDX using `<figure class="g-figure-light">` (NOT plain markdown `![](...)`) — otherwise it's unreadable in dark mode
4. **Required**: Wire-preview YAML inside the SVG must use canonical field names (e.g. `delimitingCharacteristic`, not `characteristic`)
5. Test invariants in `test/content-references.test.ts` enforce all of the above

### Translate a homepage string

1. Edit `src/i18n/translations.ts`
2. Add the string to every locale's `TranslationSet` (test enforces completeness)
3. Use it in `HomePage.vue` via `t.string_name`

## Code style

### TypeScript path aliases (not relative imports)

Use the four configured aliases:

```ts
// Good
import { useI18n } from '@/i18n'
import Nav from '@components/Nav.astro'
import BaseLayout from '@layouts/BaseLayout.astro'
import { projects } from '@data/projects'

// Bad — breaks on file moves
import { useI18n } from '../../i18n'
```

The test `test/no-relative-imports.test.ts` fails on any deep relative import.

### Type everything (no `any`)

The project's quality rules forbid `respond_to?`-style duck typing in Ruby. The TS analog is using `any`. Avoid it. Use proper interfaces from `src/types/concept-yaml.ts` or define new ones.

When narrowing YAML parse results, use type guards:

```ts
function isHyperedge(data: unknown): data is HyperedgeYaml {
  return isObject(data) && typeof data.type === 'string'
}
```

### Architectural principles

Every contribution should respect:

- **OCP** — adding a feature = adding a file or function, not editing a switch
- **DRY** — one source of truth. The canonical enumerations live in `src/types/concept-yaml.ts`
- **MECE** — every concern in exactly one place; no overlap, no gaps
- **Model-driven** — code mirrors the domain model. See `/model/` for the conceptual model

### Specs required for new behavior

Every new public surface needs a test. Test files live in `test/`:

- `test/components/*.test.ts` — Vue component tests (use `@vue/test-utils`)
- `test/content-references.test.ts` — MDX content invariants
- `test/<feature>.test.ts` — feature-specific tests
- `test/__fixtures__/` — canonical YAML fixtures (typed via `src/types/concept-yaml.ts`)

## Testing

```bash
npm test              # run all tests once
npm run test:coverage # run with coverage report
```

Vitest with jsdom environment. Path aliases configured in `vitest.config.ts`.

## PR workflow

1. Branch from `main`: `git checkout -b <type>/<short-description>`
   - Types: `docs`, `feat`, `fix`, `refactor`, `test`, `chore`
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   - `docs: fix typo in hyperedges page`
   - `feat: add bicycle use case`
   - `refactor: extract SEO module`
3. Push + open PR
4. CI runs: `build`, `link_checker`, `CodeQL`, `Analyze`, `lint` (when configured)
5. Rebase-merge when approved

### Never commit on `main`

Per project policy, never commit directly to `main`. Always use a branch + PR.

### No AI attribution

Per project policy, commits and PRs must NOT include AI attribution trailers (`Co-authored-by:`, `Generated with`, etc.). The user is the sole author; AI is a tool.

## TODO.refactor/

Significant architectural improvements are captured in `TODO.refactor/`. Browse the overview at `TODO.refactor/00-overview.md` to find work that matches your interest. Status legend:

- ☐ Not started
- ◐ In progress
- ◑ Partially complete
- ☒ Complete

To claim a TODO, open an issue referencing the TODO number, or just open a PR.

## Architecture Decision Records (ADRs)

Significant architectural decisions are documented in `docs/adr/`. Read these before asking "why did you choose X?".

To add a new ADR:

1. Copy `docs/adr/0001-use-astro-not-vitepress.md` as a template
2. Number sequentially
3. Cover: Context, Decision, Consequences, Alternatives considered

## First-time contributor ideas

- Fix typos in any MDX page (search for `typo` issues)
- Translate a missing string in `src/i18n/translations.ts`
- Add a missing term type to `src/types/concept-yaml.ts` (verify against `/model/term-types`)
- Write a test for an uncovered edge case (see TODO 07 for gaps)

## Getting help

- Open an issue: https://github.com/glossarist/glossarist.github.io/issues
- Read `CLAUDE.md` for AI-agent-oriented context
- Read the relevant `TODO.refactor/<n>-*.md` for architectural intent
