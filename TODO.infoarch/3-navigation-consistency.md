# 3. Navigation Consistency

## Problem

Reference and blog pages have inconsistent navigation patterns and missing metadata.

## Fixes

### 3a. Ontology browser — missing cross-navigation breadcrumb

`reference/ontology.md` has no cross-navigation bar. Both `reference/schema-browser.md` and `reference/entity-fields.md` have `&larr; Back to Reference | Schema Browser | Entity Fields | Ontology Browser` links. The ontology page must include the same pattern for consistency.

### 3b. Ontology browser — missing introductory prose

`reference/ontology.md` contains only frontmatter and `<OntologyBrowser />`. Should have a heading and 1-2 sentence description like the other reference pages.

### 3c. Blog index — missing frontmatter and intro

`blog/index.md` is missing `title` and `description` frontmatter. The page has no heading or introductory text — just a `<BlogIndex />` component. Add frontmatter title "Blog" and description, plus a heading.

### 3d. Software pages — inconsistent H1 headings

Four software pages use different conventions:
- `glossarist-ruby.md`: `# glossarist-ruby` (lowercase)
- `glossarist-js.md`: `# glossarist-js` (lowercase)
- `concept-browser.md`: `# Concept Browser (concept-browser)` (mixed)
- `desktop.md`: `# Glossarist Desktop` (title case)

Standardize to use the product name as H1, matching the frontmatter title.