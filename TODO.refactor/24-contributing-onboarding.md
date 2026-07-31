# 24 — CONTRIBUTING.md + developer onboarding

## Status
☐ Not started

## Motivation

The repo has no `CONTRIBUTING.md`. New contributors must reverse-engineer:
- Build commands (in `package.json` scripts)
- Test commands
- Code style (implicit — no ESLint config, no Prettier config)
- Where to add new pages
- How to add a new model page
- How to add a new use case
- How to add a new blog post
- How translations work
- The TODO.refactor/ workflow

`CLAUDE.md` exists but is AI-agent-oriented. Humans need a different doc.

## Scope

Write `CONTRIBUTING.md` covering:

1. **Quick start** — clone, install, dev server, build
2. **Project structure** — high-level directory map (point to CLAUDE.md for depth)
3. **Common contribution types**:
   - Fix a typo → edit MDX, PR
   - Add a new model page → MDX + sidebar + nav + test
   - Add a new use case → MDX + collection + test
   - Add a new blog post → MDX + frontmatter
   - Add a new SVG → SVG + light-bg wrapper + a11y invariants
   - Translate a string → i18n translations file
4. **Code style**:
   - TypeScript path aliases (not relative imports) — TODO 05
   - Type everything (no `any`) — TODO 06 / 20
   - MECE / DRY / OCP principles
   - Specs required for new behavior
5. **Testing** — `npm test`, where tests live, what each test file covers
6. **PR workflow** — branch naming, commit message conventions, CI checks
7. **TODO.refactor/** — how to add new TODOs, how to claim one
8. **ADRs** — when to write one, where they live (TODO 23)
9. **Pre-commit hooks** — what they check, how to bypass in emergencies (TODO 12)

## Acceptance criteria

- [ ] `CONTRIBUTING.md` exists at repo root
- [ ] Covers all 9 sections above
- [ ] Tested by a new contributor (mental walkthrough: can a new contributor land a typo-fix PR within 10 minutes?)
- [ ] Linked from `README.md`
- [ ] Includes "First-time contributor" section with simple first-PR ideas (typo fixes, missing translations)

## Why this matters

- **Lowers contribution friction** — every barrier removed = more community contributions
- **Reduces review burden** — contributors self-check before PR
- **Documents conventions** — implicit knowledge becomes explicit

## Dependencies

- TODO 23 (ADRs) — CONTRIBUTING references them
- TODO 12 (pre-commit hooks) — CONTRIBUTING documents them
