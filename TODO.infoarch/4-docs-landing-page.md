# 4. Redesign Docs Landing Page

## Problem

`/docs/index.md` is a flat list of links with no visual hierarchy, no narrative, and no guidance:

```markdown
# Documentation

Welcome to Glossarist documentation. Choose a section below to get started.

## Desktop Application
- [Getting Started](/docs/desktop/)
- [Installation](/docs/desktop/getting-started/installation)
...

## Concept Model
- [Model Overview](/docs/model/)
...

## Core Concepts
...

## Adopting Glossarist
...

## Software
...

## Standards
...
```

This is a sitemap, not a landing page. A new visitor doesn't know which section to visit first, what the relationship between sections is, or what Glossarist even does.

## Proposed Redesign

A docs landing page should answer three questions instantly:
1. **What is this?** (one-line description)
2. **Where do I start?** (guided paths for different user types)
3. **Where is everything?** (organized navigation)

### Structure:

```markdown
# Documentation

Glossarist provides open-source tools for maintaining multi-language concept systems, aligned with ISO standards.

## Get Started

Choose your path:

| I want to... | Go to |
|-------------|-------|
| Understand the concept model | [Concept Model Overview →](/docs/model/) |
| Install the desktop app | [Installation Guide →](/docs/desktop/getting-started/installation) |
| Adopt Glossarist in my organization | [Adoption Guide →](/docs/adopt/) |
| Browse the code | [Software Ecosystem →](/docs/software/) |
| Understand the theory | [Core Concepts →](/docs/core-concepts/) |
```

### Visual treatment:
- Use a card grid or table, not a flat link list
- Each card has: title, 1-line description, link
- Guided paths at the top ("I want to..."), reference navigation below
- Maybe a `<DocsLanding />` Vue component for visual polish

## Files to Modify

- `docs/index.md` — Complete rewrite
