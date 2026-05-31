# 4. Cross-Link Enrichment

## Problem

The model docs, software docs, and standards page are isolated silos with almost no cross-links between sections.

## Fixes

### 4a. Model pages → Standards page

Every model page (concepts, designations, relationships, sources, term-types) references ISO standards in prose but none link to `/docs/standards` which provides the full mapping.

### 4b. Software pages → Model pages

No software page links to any model documentation, despite all tools implementing the concept model:
- `glossarist-ruby.md` — implements the model, should link to concept model docs
- `glossarist-js.md` — same
- `concept-browser.md` — renders concept/relationship data, should link to those model pages
- `desktop.md` — edits concept data, should link to model overview

### 4c. Software pages → Standards page

No software page links to the standards compliance reference, despite glossarist-ruby implementing TBX/SKOS/Turtle export.

### 4d. term-types.md — enrichment

The term-types page is a bare table with no YAML examples, no explanatory prose, and no cross-references to the designation types that use each term type. Add:
- Introductory paragraph explaining how term_type relates to designations
- YAML example showing term_type in a designation context
- Link to designations.md from the heading