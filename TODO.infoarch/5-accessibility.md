# 5. Accessibility

## Problem

Interactive components lack proper ARIA attributes and mobile table handling.

## Fixes

### 5a. Tab components — ARIA roles

`YamlSchemas.vue` tab buttons lack `role="tablist"` / `role="tab"` / `aria-selected`. Screen readers cannot determine which tab is active.

### 5b. Accordion buttons — aria-expanded

Entity accordion buttons in `YamlSchemas.vue`, definition buttons in `SchemaReference.vue`, and tree nodes in `OntologyBrowser.vue` lack `aria-expanded` attributes.

### 5c. Mobile table overflow

- `RelationshipTypes.vue` — tables overflow on small screens, no `overflow-x` wrapper
- `YamlSchemas.vue` entity tables — same issue
- `OntologyBrowser.vue` constraint tables — same

Add `overflow-x: auto` wrappers or table container styles.

### 5d. OntologyBrowser sidebar toggle — aria-label

Mobile sidebar toggle button lacks `aria-label` and `aria-expanded`. Overlay `<div>` has no `role` or `aria-hidden`.

### 5e. Search keyboard shortcut hint — platform awareness

The search bar shows `Cmd K` but should show `Ctrl K` on non-Mac platforms. The actual listener uses `(e.metaKey || e.ctrlKey) && e.key === 'k'` which is correct, but the visual hint is Mac-only.