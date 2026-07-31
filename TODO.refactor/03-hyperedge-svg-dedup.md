# 03 — Hyperedge SVG DRY — consolidate duplicates

## Status
☐ Not started

## Motivation

DRY violation: two SVGs cover the same ISO 704:2022 §5.5.4.2.1 canonical computer-mouse example.

- `public/images/hyperedge-generic-computer-mouse.svg` (88 lines) — created in PR #88
- `public/images/hyperedge-computer-mouse.svg` (123 lines) — created later; more elaborate (includes wire preview, ellipsis indicating more species, two-color backlines)

Both are referenced:
- `src/content/model/generic-relations.mdx:30` references `hyperedge-generic-computer-mouse.svg`
- `src/content/model/hyperedges.mdx:51` references `hyperedge-computer-mouse.svg`

## Decision

Keep `hyperedge-computer-mouse.svg` (more complete) and delete `hyperedge-generic-computer-mouse.svg` (less complete). Update the `generic-relations.mdx` reference.

Rationale:
- The more elaborate version is closer to what an instructor would draw on a whiteboard
- Wire preview ties the diagram to the data format
- Two-color backlines reinforce multidimensionality visually
- Aligns with the user's `hyperedge-vehicle.svg` style (which also has wire preview + two-color backlines)

## Acceptance criteria

- [ ] `hyperedge-generic-computer-mouse.svg` deleted
- [ ] `generic-relations.mdx` updated to reference `hyperedge-computer-mouse.svg`
- [ ] Test `every hyperedge SVG referenced from MDX exists in public/` updated (the existing list-based test will catch this automatically)
- [ ] No remaining reference to `hyperedge-generic-computer-mouse` anywhere in repo

## Post-deletion hygiene

After deletion, the canonical computer-mouse example lives in one place. Any future enhancement (more species, delimiting-characteristic updates, theme-aware palette) lands in one file.

## Note on bug-fix interaction

`hyperedge-computer-mouse.svg` has BUG-1 from [TODO 01](01-hyperedge-svg-correctness.md): wire preview shows `characteristic:` instead of `delimitingCharacteristic:`. Fix BUG-1 in the surviving file as part of TODO 01 execution.
