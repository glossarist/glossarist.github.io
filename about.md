---
title: About Glossarist
description: Open-source software for maintaining multi-language concept systems, aligned with ISO standards
---

# About Glossarist

## The Name & Logo

### The Name

**Glossarist** takes its name from the Greek word *γλωσσάριον* (glōssárion) — a small glossary or vocabulary. The name reflects our mission: to provide tools that manage glossaries and concept systems with the rigor that international standards demand, while remaining accessible and practical.

### The Logo

The Glossarist logo is a synthesis of two writing traditions, reflecting the multilingual nature of terminology management:

<div class="logo-showcase">
  <div class="logo-card">
    <img src="/logo-glossarist.svg" alt="Glossarist Logo" class="logo-display" />
  </div>
</div>

**文 — the Han character *wén*** appears in the blue forms at the center. In the classical tradition, 文 is one of the most foundational concepts. Its earliest form denotes *pattern* — the mark that differentiates form from emptiness (紋, the difference between 無 and 有, between nothing and something). From this root, 文 also means *writing itself* — Han characters being extensions of pictorial drawings, the very act of rendering thought into visible form. As the medium that carries cultural tradition and knowledge across generations, 文 is the representation of the scholar and the civilizing principle. In the Glossarist logo, 文 stands for structured written knowledge — the pattern that gives concepts precise, communicable form.

**ΓΛ — the Greek capital letters Gamma and Lambda** appear in the green and teal forms, referencing *γλωσσάριον*. Greek is the language of classical scholarship and the root of much modern scientific terminology. The angular geometric forms of ΓΛ represent precision and classification.

Together, these two script traditions merge into a single mark. This mirrors Glossarist's core principle: **a single concept can be expressed in many languages, yet remains one concept**. The Glossarist model serves as the single source of truth that encompasses multiple languages, each of which can be viewed separately but all of which refer back to the same underlying concept.

<LogoMerge />

### The Color Blobs

The logo is composed of overlapping colored shapes in blues, teals, and greens — not a single flat color. Each color region represents a distinct **property** of a concept:

- **Dark navy** (#2d4164) — The concept identity itself, the stable core
- **Bridge blue** (#456399) — The depth of the model: structured hierarchy and cross-language bridges
- **Steel blue** (#3a5c80) — Designations: the names and terms that identify a concept across languages
- **Grey-blue** (#97a4b7) — The translational layer: the soft transitions between one language's expression and another's
- **Teal** (#3fb6b0) — Relationships: how one concept connects to and is defined by others
- **Sea green** (#7ee0d4) — Sources and provenance: the authoritative references that ground each concept
- **Mint** (#b8f5ec) — Notes, examples, and editorial metadata

The shapes overlap and blend into one another because **a concept is colored by other concepts through its relationships**. No concept exists in isolation — its meaning is shaped by the network of broader, narrower, related, and equivalent concepts that surround it. The overlapping color regions in the logo visualize this interconnected nature: the boundaries between properties are not sharp lines but gradients, just as the boundary between "definition" and "context" in terminology work is often fluid.

### The Colors

The color palette is drawn from the natural world of water and stone:

- **Deep navy to bridge blue to steel blue** — The authoritative layer, evoking ink on paper and the gravitas of standards documents
- **Grey-blue** — The translational layer, the subtle blending between linguistic forms
- **Teal to sea green** — The relational layer, evoking the flow of information between languages and domains
- **Mint** — The metadata layer, the supporting information that gives context

This palette was chosen to feel both authoritative (dark blues) and approachable (teals and greens), reflecting Glossarist's balance of standards rigor with practical usability.

## What is Glossarist?

Glossarist is open-source software for maintaining multi-language concept systems. It provides a complete ecosystem of tools for managing terminology registries — from concept modeling to desktop editing, web browsing, and machine-format export.

Glossarist is designed around the principle that terminology management should follow established ISO standards, making it suitable for standards bodies, terminology committees, and organizations that need rigorous concept management.

## The Glossarist Model

At the core of Glossarist is a rich [concept model](/docs/model/) aligned with multiple ISO standards:

- [**ISO 10241-1**](https://www.iso.org/standard/40362.html) — Terminology entries in standardized terminology
- [**ISO 704**](https://www.iso.org/standard/79077.html) — Terminology work: principles and methods
- [**ISO 30042 / TBX**](https://www.iso.org/standard/62510.html) — Terminology markup framework
- [**ISO 12620**](https://www.iso.org/standard/69550.html) — Data category registry
- [**ISO 25964 / SKOS**](https://www.iso.org/standard/53657.html) — Thesaurus interoperability

The model supports multi-language concepts with designations, definitions, notes, examples, relationships, authoritative sources, and revision history.

See the [full standards compliance reference](/docs/standards) for details on how each standard maps to Glossarist entities.

## Use Cases

<div class="use-cases-grid">
  <div class="use-case-card">
    <h4>Terminology Management</h4>
    <p>Manage multi-language concept systems with ISO-aligned workflows</p>
  </div>
  <div class="use-case-card">
    <h4>Standards Compliance</h4>
    <p>Export to TBX, SKOS, Turtle, and other ISO-standard formats</p>
  </div>
  <div class="use-case-card">
    <h4>Collaborative Editing</h4>
    <p>Change request workflows with review, acceptance, and revision history</p>
  </div>
  <div class="use-case-card">
    <h4>Web Publishing</h4>
    <p>Deploy interactive terminology browsers as static sites</p>
  </div>
</div>

## Open Source

Glossarist is an open source project. All repositories are available on GitHub under permissive licenses.

- **GitHub Organization**: [github.com/glossarist](https://github.com/glossarist)
- **Contributing**: We welcome contributions! Check individual repositories for guidelines.
- **Issues**: Report bugs or request features on the respective GitHub issue trackers.

Glossarist is used in production by standards bodies including [ISO/TC 211 Geolexica](https://isotc211.geolexica.org/) (1,507 concepts, 15 languages). See the [homepage](/) for the full list of adopters and the [software page](/docs/software/) for the complete tooling ecosystem.

## Get Started

1. **Adopt Glossarist** — Read the [Adoption Guide](/docs/adopt/)
2. **Try the Desktop App** — [Download](/docs/software/desktop) and get started
3. **Explore the Model** — Read the [Concept Model docs](/docs/model/)
4. **Explore the Model** — Read the [Concept Model docs](/docs/model/)
5. **Browse the Ontology** — Explore the [interactive OWL ontology browser](/ontology)
6. **View on GitHub** — Browse the [source code](https://github.com/glossarist)

---

*Open source project maintained by [Ribose](https://www.ribose.com)*

<style>
.logo-showcase {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.logo-card {
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.logo-display {
  max-width: 240px;
  height: auto;
}

/* --- Logo merge diagram --- */
.logo-merge {
  max-width: 720px;
  margin: 2.5rem auto 3rem;
  position: relative;
}

.logo-merge svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.merge-arrow {
  stroke-dasharray: 7 5;
  animation: merge-flow 1.4s linear infinite;
}

@keyframes merge-flow {
  from { stroke-dashoffset: 12; }
  to { stroke-dashoffset: 0; }
}

.dark .merge-img-han { filter: brightness(1.5) saturate(0.9); }
.dark .merge-img-greek { filter: brightness(1.1); }
.dark .merge-lbl-wen { fill: #7b9cc4 !important; }
.dark .merge-sub-wen { fill: #8badc4 !important; }
.dark .merge-lbl-logo { fill: #7b9cc4 !important; }
.dark .merge-lbl-gl { fill: #5cc5be !important; }
.dark .merge-sub-gl { fill: #78d3cc !important; }
.dark #ah-l path { fill: #3fb6b0; }
.dark #ah-r path { fill: #588ac1; }

@media (prefers-reduced-motion: reduce) {
  .merge-arrow { animation: none; }
}

/* --- Use cases --- */
.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.use-case-card {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  text-align: center;
}

.use-case-card h4 {
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.use-case-card p {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .logo-display {
    max-width: 180px;
  }
  .logo-merge {
    max-width: 100%;
  }
  .use-cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
