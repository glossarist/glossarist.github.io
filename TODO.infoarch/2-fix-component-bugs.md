# 2. Fix Component Bugs and Dark Mode

## Problem

Several Vue components have bugs, dead code, and dark mode rendering issues.

## Fixes

### 2a. HomePage code tabs — DOM manipulation instead of Vue reactive state

The code example tabs in `HomePage.vue` (lines 335-339) use raw `addEventListener('click')` in `onMounted`. If Vue re-renders the section, listeners are lost and tabs break. Must use Vue reactive state (`ref` for active tab, `@click` in template).

### 2b. OntologyBrowser — keyboard listener memory leak

`onMounted` adds a `keydown` listener (lines 252-260) but never removes it in `onUnmounted`. If the component mounts/unmounts, listeners accumulate. Add `onUnmounted` cleanup.

### 2c. custom.css — dark mode nav title gradient broken

The nav title gradient in light mode uses `-webkit-text-fill-color: transparent` (line 170) but the dark mode override (line 181) omits it. WebKit browsers in dark mode show solid text instead of gradient.

### 2d. Dead CSS — remove unused rules

- `HomePage.vue`: `.model-card-stats` and `.onto-stat` classes defined but never used in template
- `OntologyBrowser.vue`: `.ob-shape-block`, `.ob-shape-head`, `.ob-empty`, `.ob-text-link` defined but never used

### 2e. ModelLanding — missing loading state

`ModelLanding.vue` uses `useOntologyData()` but never checks the `loaded` ref. Stats show 0 during loading with no visual indication.

### 2f. Loading states — add spinners

`YamlSchemas.vue`, `RelationshipTypes.vue` show only italic text during loading. Add CSS spinners matching the `SchemaReference.vue` pattern.