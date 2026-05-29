---
title: Concept Model
description: The Glossarist concept system model — a rich, standards-aligned domain model for structured terminology management
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.querySelectorAll('.mi-accordion-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling
      const isOpen = content.style.maxHeight
      content.style.maxHeight = isOpen ? null : content.scrollHeight + 'px'
      btn.setAttribute('aria-expanded', !isOpen)
    })
  })
})
</script>

<div class="model-landing">

# The Glossarist Concept Model

A rich domain model for terminology management, aligned with ISO 10241-1, 704, 30042, 12620, and 25964 — designed to handle everything from simple glossaries to complex multilingual concept systems with formal ontological grounding.

<div class="mi-overview-grid">

<div class="mi-stat-row">
<div class="mi-stat">
<span class="mi-stat-number">24</span>
<span class="mi-stat-label">OWL Classes</span>
</div>
<div class="mi-stat">
<span class="mi-stat-number">48</span>
<span class="mi-stat-label">Properties</span>
</div>
<div class="mi-stat">
<span class="mi-stat-number">24</span>
<span class="mi-stat-label">SHACL Shapes</span>
</div>
<div class="mi-stat">
<span class="mi-stat-number">32</span>
<span class="mi-stat-label">Relationship Types</span>
</div>
<div class="mi-stat">
<span class="mi-stat-number">7</span>
<span class="mi-stat-label">Designation Types</span>
</div>
</div>

</div>

## How concepts work

Every Glossarist concept is a **ManagedConcept** — a language-independent entity that groups per-language **LocalizedConcept** instances. Each localization carries its own definitions, designations, notes, examples, and source references.

![Concept-Term interaction cycle](/images/model/concept-term-cycle.png)

The model separates *what a concept is* (its identity, lifecycle, relationships) from *how it is expressed* (terms, abbreviations, symbols in different languages). This separation lets you maintain concept-level relationships (broader, narrower, equivalent) independently of language-specific terminology.

## Core entities

<div class="mi-entity-grid">

<div class="mi-entity mi-entity-concept">
<div class="mi-entity-header">
<span class="mi-entity-dot" style="background:var(--g-class)"></span>
<h3><a href="/docs/model/concepts">ManagedConcept</a></h3>
</div>
<p>The top-level entity. Holds a UUID, lifecycle status, domain references, and maps language codes to LocalizedConcept instances.</p>
<div class="mi-entity-fields">
<code>status</code> <code>localized_concepts</code> <code>related</code> <code>domains</code> <code>dates</code>
</div>
</div>

<div class="mi-entity mi-entity-local">
<div class="mi-entity-header">
<span class="mi-entity-dot" style="background:var(--g-property)"></span>
<h3><a href="/docs/model/concepts">LocalizedConcept</a></h3>
</div>
<p>Per-language realization of a concept. Each language gets its own definition, designations, notes, examples, and classification.</p>
<div class="mi-entity-fields">
<code>designations</code> <code>definition</code> <code>notes</code> <code>examples</code> <code>language_code</code>
</div>
</div>

<div class="mi-entity mi-entity-desig">
<div class="mi-entity-header">
<span class="mi-entity-dot" style="background:var(--g-teal)"></span>
<h3><a href="/docs/model/designations">Designations</a></h3>
</div>
<p>7 designation types in a MECE hierarchy — expressions, abbreviations, symbols (letter and graphical), prefixes, and suffixes.</p>
<div class="mi-entity-fields">
<code>expression</code> <code>abbreviation</code> <code>symbol</code> <code>letter_symbol</code> <code>graphical_symbol</code> <code>prefix</code> <code>suffix</code>
</div>
</div>

<div class="mi-entity mi-entity-rel">
<div class="mi-entity-header">
<span class="mi-entity-dot" style="background:var(--g-shape)"></span>
<h3><a href="/docs/model/relationships">Relationships</a></h3>
</div>
<p>32 typed semantic links spanning 4 ISO standards — hierarchical, partitive, associative, equivalence, mapping, and spatiotemporal.</p>
<div class="mi-entity-fields">
<code>broader/narrower</code> <code>generic/partitive</code> <code>exact_match</code> <code>deprecates</code> <code>+ 28 more</code>
</div>
</div>

<div class="mi-entity mi-entity-source">
<div class="mi-entity-header">
<span class="mi-entity-dot" style="background:var(--g-taxonomy)"></span>
<h3><a href="/docs/model/sources">Sources</a></h3>
</div>
<p>Multi-level provenance tracking — authoritative and lineage sources with status tracking (identical, modified, restyled, generalisation).</p>
<div class="mi-entity-fields">
<code>authoritative</code> <code>lineage</code> <code>status</code> <code>origin</code> <code>modification</code>
</div>
</div>

<div class="mi-entity mi-entity-onto">
<div class="mi-entity-header">
<span class="mi-entity-dot" style="background:linear-gradient(135deg, var(--g-steel), var(--g-teal))"></span>
<h3><a href="/docs/model/ontology">OWL Ontology</a></h3>
</div>
<p>Formal RDF/OWL vocabulary with SHACL shapes for validation. Aligned with SKOS, SKOS-XL, ISO 25964, PROV-O, Dublin Core.</p>
<div class="mi-entity-fields">
<code>owl:Class</code> <code>sh:Shape</code> <code>skos:Concept</code> <code>skosxl:Label</code>
</div>
</div>

</div>

## Authoring concepts in YAML

Concepts are authored in structured YAML files. The V3 schema consolidates all localizations into a single file per concept:

```yaml
# concepts/3.1.1.1.yaml
termid: "3.1.1.1"
termid_uuid: "a1b2c3d4-..."
status: valid

eng:
  terms:
    - type: expression
      designation: "entity"
      normative_status: preferred
  definition:
    - content: "A concrete or abstract thing that exists, has existed, or can exist"
  notes:
    - "This includes objects, concepts, and relationships"
  sources:
    - type: authoritative
      origin: "ISO 19107:2003, 4.5"
      status: identical

fra:
  terms:
    - type: expression
      designation: "entité"
      normative_status: preferred
  definition:
    - content: "chose concrète ou abstraite qui existe, a existé ou peut exister"
  sources:
    - type: authoritative
      origin: "ISO 19107:2003, 4.5"
      status: identical
```

See the [YAML Schema Reference](/docs/model/schemas) for complete field documentation, enum values, and V2/V3 differences.

## Standards alignment

Every entity in the Glossarist model maps to established international standards:

| Standard | Role in Glossarist |
|----------|-------------------|
| **ISO 10241-1** | Terminology entries in standardized vocabularies — concept structure, designations, sources |
| **ISO 704** | Principles and methods — concept systems, definitions, term formation rules |
| **ISO 30042 / TBX** | Terminology markup framework — data exchange format |
| **ISO 12620** | Data category registry — 34 term type classifications |
| **ISO 25964** | Thesauri — hierarchical and mapping relationships (BTG/NTG, BTP/NTP, BTI/NTI) |
| **OWL 2 / SHACL** | Formal ontology vocabulary with shape constraints for data validation |
| **SKOS / SKOS-XL** | Knowledge organization for the semantic web — concept schemes and reified labels |

## Processing with code

### JavaScript (glossarist-js)

```js
import { loadGcr, readConcepts } from 'glossarist';

const concepts = readConcepts('./geolexica-v2/');
concepts.forEach(c => {
  console.log(c.id, c.primaryDesignation('eng'));
});
```

### Ruby (glossarist-ruby)

```ruby
require 'glossarist'

collection = Glossarist::ManagedConceptCollection.new
collection.from_yaml('./concepts/')

concept = collection['3.1.1.1']
puts concept.localizations['eng'].definition
```

## Reference sections

- [Concepts](/docs/model/concepts) — ManagedConcept, LocalizedConcept, concept lifecycle, collections
- [Designations](/docs/model/designations) — 7 designation types, pronunciation, base properties
- [Relationships](/docs/model/relationships) — 32 relationship types across 4 standards
- [Sources](/docs/model/sources) — Authoritative source hierarchy and provenance
- [Term Types](/docs/model/term-types) — 34 ISO 12620 term type classifications
- [Schemas](/docs/model/schemas) — V2 and V3 YAML schema reference and enum values
- [Ontology Browser](/docs/model/ontology) — Interactive OWL ontology and SHACL shape browser

</div>

<style>
.model-landing {
  max-width: 72rem;
}

.mi-overview-grid {
  display: flex;
  justify-content: center;
  margin: 2rem 0 0;
}

.mi-stat-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mi-stat {
  text-align: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  min-width: 90px;
}

.mi-stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--g-teal);
}

.mi-stat-label {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mi-entity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0 2.5rem;
}

.mi-entity {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem;
  transition: border-color 0.2s, transform 0.2s;
}

.mi-entity:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}

.mi-entity-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.mi-entity-header h3 {
  font-size: 0.9375rem;
  font-weight: 700;
  margin: 0;
}

.mi-entity-header h3 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.mi-entity-header h3 a:hover {
  color: var(--vp-c-brand-1);
}

.mi-entity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mi-entity p {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 0.75rem;
}

.mi-entity-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.mi-entity-fields code {
  font-size: 0.6875rem;
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

@media (max-width: 900px) {
  .mi-entity-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .mi-entity-grid { grid-template-columns: 1fr; }
  .mi-stat-row { gap: 0.75rem; }
  .mi-stat { min-width: 70px; padding: 0.5rem 0.75rem; }
}
</style>
