# 01 — Hyperedge SVG correctness audit

## Status
☐ Not started

## Motivation

User flagged (twice): "The diagrams you have some of them are wrongly drawn (the hyperedges)". The first round of fixes addressed `hyperedge-partitive.svg` (removed incorrect "delimiting" markup on measurement uncertainty). This round audits the rest.

## Audit findings

### BUG-1: Wrong field name in YAML previews

**Files**: `public/images/hyperedge-computer-mouse.svg` line 120, `public/images/hyperedge-vehicle.svg` line 142

The wire-format preview shows:
```yaml
- ref: { source: EXAMPLE, id: "mechanical-mouse" }
  characteristic: { eng: detecting movement by rollers }
```

But the actual Glossarist field per `glossarist-js` 0.4.34 and the model docs is `delimitingCharacteristic`, not `characteristic`. The docs page at `/model/generic-relations` says `delimitingCharacteristic`. The SVG contradicts the docs.

**Fix**: rename `characteristic:` → `delimitingCharacteristic:` in both SVGs' wire previews.

### BUG-2: Wrong ISO section reference

**File**: `public/images/hyperedge-bicycle.svg` line 96

```
Bold 3x-width = is_delimiting (behaves like a delimiting characteristic per ISO 704:2022 §5.5.4.2.1).
```

`is_delimiting` is a partitive-specific flag per §5.5.4.2.2 (delimiting parts). §5.5.4.2.1 is about generic relations and uses `delimitingCharacteristic` (text data). The cite is wrong.

**Fix**: change `§5.5.4.2.1` → `§5.5.4.2.2` in the bicycle SVG footer.

### BUG-3: Questionable `count: multiple` for measurement uncertainty

**File**: `public/images/hyperedge-partitive.svg`

The fixed version uses three multiplicities:
- measured quantity value — `required · exactly_one`
- measurement uncertainty — `required · multiple`
- measurement procedure — `optional · exactly_one`

But per VIM, a measurement result has ONE measurement uncertainty (possibly expressed as a set of components, but the concept itself is singular). `count: multiple` is semantically off.

Better mapping per VIM 2.9:
- measured quantity value (VIM 2.10) — required, exactly_one
- measurement uncertainty (VIM 2.26) — required, exactly_one

Adding a third member to demonstrate MECE breadth: a measurement result MAY also reference a measurement procedure (VIM 2.6), but this is a *reference* not a *part*. Per strict VIM, the rake has 2 members.

**Fix options** (pick one):
- A. Strict VIM accuracy: 2 members only (measured quantity value + measurement uncertainty, both `required · exactly_one`). Loses MECE breadth demonstration.
- B. Keep 3 members but make measurement uncertainty `required · exactly_one` (matching VIM); add a third member with `required · at_least_one` to demonstrate the at_least_one notation. Find a member that legitimately needs `at_least_one` per VIM 2.9.
- C. Use a different comprehensive concept that legitimately demonstrates 3 distinct multiplicities. e.g. *human body* with parts head (1), limbs (multiple), appendix (optional).

**Recommendation**: Option B — keep VIM measurement result but make the multiplicities accurate. The measurement result reference is well-known; the example preserves continuity.

### BUG-4: Frog life cycle member-array order note

**File**: `public/images/hyperedge-sequential.svg` line 85

```
Member array order IS significant (earliest → latest). Reverse the array → reverse the sequence.
```

This is correct, but only meaningful if `SequentialHyperedge` actually treats the member array as ordered. The Phase 1 SequentialHyperedge implementation needs verification. If order is NOT load-bearing in the wire format, this footer note is misleading.

**Action**: verify against `glossarist-js` SequentialHyperedge (Phase 1) that array order is significant. If yes, leave note. If no, remove note.

## Acceptance criteria

- [ ] BUG-1 fixed: all SVG wire previews use `delimitingCharacteristic` not `characteristic`
- [ ] BUG-2 fixed: bicycle SVG footer cites §5.5.4.2.2 (not §5.5.4.2.1)
- [ ] BUG-3 resolved: partitive SVG multiplicities match VIM 2.9 semantics
- [ ] BUG-4 verified or corrected against glossarist-js SequentialHyperedge
- [ ] Regression test added: SVG wire previews must match the field name in glossarist-js's `toJSON()` output

## Test invariants to add

1. **SVG wire-preview field-name check** — for each hyperedge SVG containing a YAML preview, grep the field names and verify they match the canonical names in `glossarist-js/src/models/*.js`. Catches drift between SVGs and the SDK.
2. **ISO section citation check** — for each cite of `§5.5.4.x` in an SVG, verify the cited section matches the concept being illustrated (partitive → §5.5.4.2.2 or §5.5.4.3, generic → §5.5.4.2.1, sequential → §5.5.5).
