# 5. Fix About Page

## Problem 1: Duplicate "Get Started" Step

The about page has two identical steps:

```markdown
## Get Started

1. **Adopt Glossarist** — Read the [Adoption Guide](/docs/adopt/)
2. **Try the Desktop App** — [Download](/docs/software/desktop) and get started
3. **Explore the Model** — Read the [Concept Model docs](/docs/model/)
4. **Explore the Model** — Read the [Concept Model docs](/docs/model/)    ← DUPLICATE
5. **Browse the Ontology** — Explore the [interactive OWL ontology browser](/ontology)
6. **View on GitHub** — Browse the [source code](https://github.com/glossarist)
```

Step 3 and 4 are identical.

## Fix

Remove the duplicate. The correct sequence should be:

```markdown
## Get Started

1. **Explore the Concept Model** — Read the [Concept Model docs](/docs/model/)
2. **Try the Desktop App** — [Download](/docs/software/desktop) and get started
3. **Adopt Glossarist** — Read the [Adoption Guide](/docs/adopt/)
4. **Browse the Ontology** — Explore the [OWL ontology browser](/docs/model/ontology)
5. **View on GitHub** — Browse the [source code](https://github.com/glossarist)
```

Note: re-ordered to put "explore the model" first (lowest commitment), and updated ontology link to reflect proposed move from TODO 2.

## Problem 2: No link to schema reference

The about page doesn't mention the YAML Schema Reference at all. Given that the schema browser is a key documentation asset, it should be in the Get Started list.

## Files to Modify

- `about.md` — Remove duplicate step, reorder, update links
