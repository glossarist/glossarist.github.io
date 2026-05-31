# 6. Restructure Nav Dropdown

## Problem

The "Model" nav dropdown mixes two different user intents:

**Conceptual understanding** (documentation pages):
- Overview, Concepts, Designations, Relationships, Sources, Schemas

**Interactive tool** (web app):
- Ontology Browser

The Ontology Browser is an interactive tool that happens to document the model — it's not a documentation page. Putting it alongside "Concepts" and "Sources" conflates reading docs with using a tool.

Additionally, the dropdown doesn't include Term Types (which is in the sidebar but not the nav).

## Current Nav

```
Model dropdown:
  Overview
  Concepts
  Designations
  Relationships
  Sources
  Schemas
  Ontology Browser
```

## Proposed Nav

```
Model dropdown:
  Overview
  Concepts
  Designations
  Relationships
  Sources
  Term Types
  YAML Schema Reference       ← renamed from "Schemas"
  Entity Field Reference       ← new (after TODO 1)
  ───────────────────────────  ← separator
  Ontology Browser             ← moved to bottom, visually separated
```

Or better: move Ontology Browser to a separate "Tools" dropdown or a standalone nav link:

```
Nav:  Model ▼  |  Software ▼  |  Tools ▼  |  Docs ▼  |  Blog  |  About
                                                     ↑
                                        Ontology Browser, Concept Browser
```

## Files to Modify

- `.vitepress/config.ts` — Nav configuration
