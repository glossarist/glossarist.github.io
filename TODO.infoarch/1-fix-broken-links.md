# 1. Fix Broken External Links and Content Errors

## Problem

Two external links return 404, and one page has factually incorrect field descriptions.

## Fixes

### 1a. concept-browser.md — dead GitHub link (404)

`docs/software/concept-browser.md` links to `https://github.com/glossarist/glossarist-vocabulary-browser` which returns 404. The correct repo is `https://github.com/glossarist/concept-browser`.

### 1b. glossarist-ruby.md — wrong path (404)

`docs/software/glossarist-ruby.md` links to `https://github.com/glossarist/concept-model/tree/main/yaml_schemas` which returns 404. The correct path is `/tree/main/schemas`.

### 1c. glossarist-ruby.md — incorrect field descriptions

- `ManagedConcept.status` described as "Enum for the normative status of the term" — should be "Lifecycle status" (valid, draft, submitted, superseded, retired). Normative status is a Designation-level concept.
- `domains` described as "Array of ConceptReference -- upper concepts" — should be "Subject area references". Domains are classifications, not hierarchical parents.
- `ManagedConcept` table missing `sources` field that exists in the model docs.
- `LocalizedConcept` table missing `script`, `system`, `references`, `dates`, `release`, `review_type`, `lineage_similarity` fields.

### 1d. about.md — URL as link text

Line 65 uses `[/docs/model/](/docs/model/)` which renders the URL path as visible link text. Should use descriptive text like `[concept model](/docs/model/)`.