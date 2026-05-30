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

**文 — the Han character for "text" or "writing"** appears in the blue forms at the center. Chinese is one of the six official languages of ISO, and the character 文 carries the meaning of structured written knowledge — exactly what a concept system embodies. Its flowing, angular strokes represent the authoritative structure that underpins formal terminology.

**ΓΛ — the Greek capital letters Gamma and Lambda** appear in the green and teal forms, referencing *γλωσσάριον*. Greek is the language of classical scholarship and the root of much modern scientific terminology. The angular geometric forms of ΓΛ represent precision and classification.

Together, these two script traditions merge into a single mark. This mirrors Glossarist's core principle: **a single concept can be expressed in many languages, yet remains one concept**. The Glossarist model serves as the single source of truth that encompasses multiple languages, each of which can be viewed separately but all of which refer back to the same underlying concept.

### The Color Blobs

The logo is composed of overlapping colored shapes in blues, teals, and greens — not a single flat color. Each color region represents a distinct **property** of a concept:

- **Dark navy** (#1c293e) — The concept identity itself, the stable core
- **Steel blue** (#385c7f) — Designations: the names and terms that identify a concept across languages
- **Teal** (#3ba79e) — Relationships: how one concept connects to and is defined by others
- **Sea green** (#63baae) — Sources and provenance: the authoritative references that ground each concept
- **Sage** (#9cd0c8) — Notes, examples, and editorial metadata

The shapes overlap and blend into one another because **a concept is colored by other concepts through its relationships**. No concept exists in isolation — its meaning is shaped by the network of broader, narrower, related, and equivalent concepts that surround it. The overlapping color regions in the logo visualize this interconnected nature: the boundaries between properties are not sharp lines but gradients, just as the boundary between "definition" and "context" in terminology work is often fluid.

### The Colors

The color palette is drawn from the natural world of water and stone:

- **Deep navy to steel blue** — The authoritative layer, evoking ink on paper and the gravitas of standards documents
- **Teal to sea green** — The relational layer, evoking the flow of information between languages and domains
- **Sage green** — The metadata layer, the supporting information that gives context

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
4. **Browse the Ontology** — Explore the [interactive ontology browser](/ontology)
5. **View on GitHub** — Browse the [source code](https://github.com/glossarist)

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
  .use-cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
