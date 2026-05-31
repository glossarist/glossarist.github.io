# TODO 3: Fix and Redesign Ontology Browser

## Problem
The Ontology Browser at `/docs/model/ontology` is severely broken:
1. Class Hierarchy renders bare numbers "0 0 0 4 1 2 0 0..." instead of class names
2. Negative margin (`margin: 0 -24px`) breaks VitePress doc layout
3. Sidebar is too narrow (fixed 240px)
4. Only 2 levels of hierarchy visible
5. 17 root classes with mostly 0 children makes hierarchy look broken

## Root Cause of Bug #1 (Critical)
The template uses `getClass(rootId)?.label || rootId` — but the class data likely uses a different field name (e.g., `name`, `className`, or the IRI fragment). The `rootId` might be a numeric index, so when label is undefined, it shows the index as a bare number. Also, the `ob-hier-count` spans with value 0 render as visible "0" text.

## Files to Modify
- `.vitepress/theme/components/OntologyBrowser.vue` — Complete rewrite (~1550 lines)

## Implementation Plan

### Phase 1: Fix data binding bugs
1. Read generated `public/data/ontology-schema.json` to understand exact data shape
2. Fix getClass(), getProperty(), getShape() to return correct field names
3. Fix Class Hierarchy template — hide zero-count badges, use correct label field
4. Test all 4 sidebar tabs render correctly

### Phase 2: Fix layout
1. Remove `margin: 0 -24px` negative margin
2. Replace fixed sidebar with responsive layout that works within VitePress doc container
3. Desktop: collapsible sidebar (280px) + scrollable main content
4. Mobile: full-width stacked layout
5. Fix table overflow in property/shape detail views

### Phase 3: Improve UX
1. Add search/filter to entity lists
2. Collapsible class hierarchy tree (not just 2 levels)
3. Proper entity detail views with full metadata
4. Alphabet navigation for long entity lists
5. Breadcrumb navigation

### Phase 4: Visual polish
1. Apply brand design system consistently
2. Dark mode support
3. Smooth transitions for expand/collapse
4. Proper table styling

## Data Summary
- 24 OWL Classes (17 roots, only Designation has 4 children)
- 105 Properties (45 object + 60 datatype)
- 24 SHACL Shapes
- 14 Taxonomies with 129 named individuals
- 11 Annotation Properties

## Verification
- Run `npm run dev` and navigate to /docs/model/ontology
- Class Hierarchy shows actual class names (ManagedConcept, LocalizedConcept, etc.)
- All tabs work: Classes, Properties, Shapes, Taxonomies
- No horizontal overflow
- Responsive at all breakpoints
- Dark mode works
