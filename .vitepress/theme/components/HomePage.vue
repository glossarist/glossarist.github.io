<script setup lang="ts">
import { onMounted } from 'vue'
import { premierProjects } from '../../data/projects'

onMounted(() => {
  const tabs = document.querySelectorAll('.code-tab')
  const panels = document.querySelectorAll('.code-panel')
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'))
      panels.forEach(p => p.classList.remove('active'))
      tab.classList.add('active')
      const target = (tab as HTMLElement).dataset.tab
      const panel = document.getElementById('panel-' + target)
      if (panel) panel.classList.add('active')
    })
  })
})
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-badge">Open Source · ISO-Aligned · Multilingual</div>
        <h1 class="hero-title">
          The Concept System
          <span class="hero-title-accent">Framework</span>
        </h1>
        <p class="hero-tagline">
          Model, manage, and publish terminology registries with a rich domain model
          aligned with ISO&nbsp;10241, 704, 30042, 12620, and 25964
        </p>
        <div class="hero-actions">
          <a href="/docs/model/" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Explore the Model
          </a>
          <a href="/docs/model/ontology" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/><path d="M2 12h20"/></svg>
            Ontology Browser
          </a>
          <a href="https://github.com/glossarist" class="btn btn-ghost" target="_blank" rel="noopener">
            GitHub &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- Pipeline: How Glossarist Works -->
    <section class="section">
      <div class="section-header">
        <span class="section-eyebrow">How It Works</span>
        <h2>From Concept to Publication</h2>
        <p>A structured pipeline that takes you from domain modeling to multilingual terminology publication</p>
      </div>
      <div class="pipeline">
        <div class="pipeline-step">
          <div class="pipeline-icon pi-model">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h4>1. Model</h4>
          <p>Define your concept system using the rich Glossarist domain model — 24 OWL classes, 32 relationship types, 7 designation types, SHACL validation shapes.</p>
          <a href="/docs/model/" class="pipeline-link">Concept Model &rarr;</a>
        </div>
        <div class="pipeline-connector">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-icon pi-schema">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <h4>2. Author</h4>
          <p>Write terminology concepts in human-readable YAML (V2 or V3 schema). ManagedConcept, LocalizedConcept, designations, sources — all in structured YAML.</p>
          <a href="/docs/model/schemas" class="pipeline-link">YAML Schema Ref &rarr;</a>
        </div>
        <div class="pipeline-connector">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-icon pi-code">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <h4>3. Process</h4>
          <p>Read, validate, transform, and export using the Ruby gem or JavaScript SDK. GCR packages, TBX, SKOS, Turtle, JSON-LD output.</p>
          <a href="/docs/software/glossarist-js" class="pipeline-link">JS SDK &rarr;</a>
          <span class="pipeline-or">or</span>
          <a href="/docs/software/glossarist-ruby" class="pipeline-link">Ruby Gem &rarr;</a>
        </div>
        <div class="pipeline-connector">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
        <div class="pipeline-step">
          <div class="pipeline-icon pi-publish">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>
          </div>
          <h4>4. Publish</h4>
          <p>Deploy as an interactive multilingual concept browser, SKOS thesaurus, or TBX exchange format — ready for standards bodies and domain communities.</p>
          <a href="https://isotc211.geolexica.org/" target="_blank" rel="noopener" class="pipeline-link">See Geolexica &rarr;</a>
        </div>
      </div>
    </section>

    <!-- The Model Deep Dive -->
    <section class="section section-model">
      <div class="section-header">
        <span class="section-eyebrow">The Foundation</span>
        <h2>The Glossarist Concept Model</h2>
        <p>A rich, standards-aligned domain model for structured terminology — the heart of everything Glossarist does</p>
      </div>

      <div class="model-grid">
        <!-- Concept hierarchy -->
        <div class="model-card mc-concepts">
          <div class="model-card-header">
            <span class="model-dot md-concept"></span>
            <h3>ManagedConcept</h3>
          </div>
          <p class="model-card-desc">The top-level entity. Contains a UUID, lifecycle status, domain references, and maps language codes to LocalizedConcept instances.</p>
          <div class="model-card-fields">
            <div class="field-row"><code>status</code><span>notValid · valid · superseded · retired</span></div>
            <div class="field-row"><code>localized_concepts</code><span>Hash of lang → LocalizedConcept</span></div>
            <div class="field-row"><code>related</code><span>32 typed relationship kinds</span></div>
            <div class="field-row"><code>domains</code><span>Subject area references</span></div>
          </div>
          <a href="/docs/model/concepts" class="model-card-link">Concept docs &rarr;</a>
        </div>

        <!-- Localized Concept -->
        <div class="model-card mc-local">
          <div class="model-card-header">
            <span class="model-dot md-local"></span>
            <h3>LocalizedConcept</h3>
          </div>
          <p class="model-card-desc">Per-language realization of a concept. Each language gets its own definition, terms, notes, examples, and classification.</p>
          <div class="model-card-fields">
            <div class="field-row"><code>designations</code><span>Typed term entries</span></div>
            <div class="field-row"><code>definition</code><span>DetailedDefinition array</span></div>
            <div class="field-row"><code>notes / examples</code><span>Supplementary content</span></div>
            <div class="field-row"><code>language_code</code><span>ISO 639 3-letter code</span></div>
          </div>
          <a href="/docs/model/concepts" class="model-card-link">Localization &rarr;</a>
        </div>

        <!-- Designations -->
        <div class="model-card mc-desig">
          <div class="model-card-header">
            <span class="model-dot md-desig"></span>
            <h3>Designations</h3>
          </div>
          <p class="model-card-desc">7 designation types in a MECE hierarchy — expression, abbreviation, symbol, letter_symbol, graphical_symbol, prefix, suffix.</p>
          <div class="model-card-tree">
            <span class="tree-branch"><span class="model-dot md-desig"></span> Designation</span>
            <span class="tree-branch indent-1"><span class="model-dot md-desig"></span> Expression → Abbreviation</span>
            <span class="tree-branch indent-1"><span class="model-dot md-desig"></span> Symbol → Letter · Graphical</span>
            <span class="tree-branch indent-1"><span class="model-dot md-desig"></span> Prefix · Suffix</span>
          </div>
          <a href="/docs/model/designations" class="model-card-link">Designation types &rarr;</a>
        </div>

        <!-- Relationships -->
        <div class="model-card mc-rel">
          <div class="model-card-header">
            <span class="model-dot md-rel"></span>
            <h3>Relationships</h3>
          </div>
          <p class="model-card-desc">32 typed semantic links spanning 4 ISO standards — hierarchical, partitive, associative, equivalence, mapping, spatiotemporal.</p>
          <div class="model-card-chips">
            <span class="rel-chip">broader/narrower</span>
            <span class="rel-chip">generic/partitive</span>
            <span class="rel-chip">exact_match</span>
            <span class="rel-chip">deprecates</span>
            <span class="rel-chip">compare/contrast</span>
            <span class="rel-chip">+ 27 more</span>
          </div>
          <a href="/docs/model/relationships" class="model-card-link">All 32 types &rarr;</a>
        </div>

        <!-- Sources -->
        <div class="model-card mc-source">
          <div class="model-card-header">
            <span class="model-dot md-source"></span>
            <h3>Sources</h3>
          </div>
          <p class="model-card-desc">Provenance tracking with authoritative and lineage sources, status tracking (identical, modified, restyled, generalisation).</p>
          <div class="model-card-fields">
            <div class="field-row"><code>type</code><span>authoritative · lineage</span></div>
            <div class="field-row"><code>status</code><span>identical · modified · restyled · +4</span></div>
            <div class="field-row"><code>origin</code><span>Citation reference</span></div>
          </div>
          <a href="/docs/model/sources" class="model-card-link">Source model &rarr;</a>
        </div>

        <!-- Ontology -->
        <div class="model-card mc-onto">
          <div class="model-card-header">
            <span class="model-dot md-onto"></span>
            <h3>OWL Ontology</h3>
          </div>
          <p class="model-card-desc">Formal RDF/OWL vocabulary with SHACL shapes for validation. Aligned with SKOS, SKOS-XL, ISO 25964, PROV-O, Dublin Core.</p>
          <div class="model-card-stats">
            <div class="onto-stat"><strong>24</strong><span>Classes</span></div>
            <div class="onto-stat"><strong>48</strong><span>Properties</span></div>
            <div class="onto-stat"><strong>24</strong><span>SHACL Shapes</span></div>
            <div class="onto-stat"><strong>7</strong><span>Concept Schemes</span></div>
          </div>
          <a href="/docs/model/ontology" class="model-card-link">Browse ontology &rarr;</a>
        </div>
      </div>
    </section>

    <!-- YAML + Code -->
    <section class="section section-code">
      <div class="section-header">
        <span class="section-eyebrow">Developer Experience</span>
        <h2>Structured Data, Any Language</h2>
        <p>Author in YAML, process with Ruby or JavaScript, export to TBX/SKOS/Turtle/JSON-LD</p>
      </div>

      <div class="code-showcase">
        <div class="code-tabs">
          <button class="code-tab active" data-tab="yaml">YAML Authoring</button>
          <button class="code-tab" data-tab="js">JavaScript SDK</button>
          <button class="code-tab" data-tab="ruby">Ruby Gem</button>
          <button class="code-tab" data-tab="export">Export Formats</button>
        </div>

        <div class="code-panel active" id="panel-yaml">
          <div class="code-desc">
            <h4>V3 YAML — Human-Readable Concept Data</h4>
            <p>Write terminology concepts in structured YAML. Each file contains a ManagedConcept with all its localizations, designations, and relationships.</p>
            <a href="/docs/model/schemas" class="btn btn-sm btn-secondary">Schema Reference</a>
          </div>
          <div class="code-block">
            <pre><span class="code-comment"># concepts/3.1.1.1.yaml</span>
<span class="code-key">termid</span>: <span class="code-str">"3.1.1.1"</span>
<span class="code-key">termid_uuid</span>: <span class="code-str">"uuid-..."</span>
<span class="code-key">status</span>: <span class="code-val">valid</span>

<span class="code-key">eng</span>:
  <span class="code-key">terms</span>:
    - <span class="code-key">type</span>: <span class="code-val">expression</span>
      <span class="code-key">designation</span>: <span class="code-str">"entity"</span>
      <span class="code-key">normative_status</span>: <span class="code-val">preferred</span>
  <span class="code-key">definition</span>:
    - <span class="code-key">content</span>: <span class="code-str">"A concrete or abstract thing"</span>
  <span class="code-key">notes</span>:
    - <span class="code-str">"This includes objects and concepts"</span>
  <span class="code-key">sources</span>:
    - <span class="code-key">type</span>: <span class="code-val">authoritative</span>
      <span class="code-key">origin</span>: <span class="code-str">"ISO 19107:2003"</span>

<span class="code-key">fra</span>:
  <span class="code-key">terms</span>:
    - <span class="code-key">type</span>: <span class="code-val">expression</span>
      <span class="code-key">designation</span>: <span class="code-str">"entité"</span>
      <span class="code-key">normative_status</span>: <span class="code-val">preferred</span>
  <span class="code-key">definition</span>:
    - <span class="code-key">content</span>: <span class="code-str">"chose concrète ou abstraite"</span></pre>
          </div>
        </div>

        <div class="code-panel" id="panel-js">
          <div class="code-desc">
            <h4>glossarist-js — Node.js SDK</h4>
            <p>Read, write, validate, and manage GCR packages with bidirectional YAML serialization. Stream concepts for memory-efficient processing of large datasets.</p>
            <a href="/docs/software/glossarist-js" class="btn btn-sm btn-secondary">JS SDK Docs</a>
          </div>
          <div class="code-block">
            <pre><span class="code-key">import</span> { loadGcr, readConcepts } <span class="code-key">from</span> <span class="code-str">'glossarist'</span>;

<span class="code-comment">// Read a GCR package (streaming)</span>
<span class="code-key">const</span> pkg = <span class="code-key">await</span> loadGcr(
  fs.readFileSync(<span class="code-str">'geolexica.gcr'</span>)
);
<span class="code-key">await</span> pkg.eachConcept((concept) => {
  console.log(concept.id, concept.primaryDesignation(<span class="code-str">'eng'</span>));
});

<span class="code-comment">// Read from directory</span>
<span class="code-key">const</span> concepts = readConcepts(<span class="code-str">'./geolexica-v2/'</span>);

<span class="code-comment">// Write GCR package</span>
<span class="code-key">const</span> buf = <span class="code-key">await</span> createGcr([concept], {
  shortname: <span class="code-str">'my-dataset'</span>
});</pre>
          </div>
        </div>

        <div class="code-panel" id="panel-ruby">
          <div class="code-desc">
            <h4>glossarist-ruby — Ruby Gem</h4>
            <p>The original Glossarist library. Full CRUD for concept management, multi-format serialization, TBX/SKOS/Turtle export, and GCR package support.</p>
            <a href="/docs/software/glossarist-ruby" class="btn btn-sm btn-secondary">Ruby Gem Docs</a>
          </div>
          <div class="code-block">
            <pre><span class="code-key">require</span> <span class="code-str">'glossarist'</span>

<span class="code-comment"># Load a concept collection</span>
collection = Glossarist::ManagedConceptCollection.new
collection.from_yaml(<span class="code-str">'./concepts/'</span>)

<span class="code-comment"># Access concepts</span>
concept = collection[<span class="code-str">'3.1.1.1'</span>]
puts concept.localizations[<span class="code-str">'eng'</span>].definition
puts concept.localizations[<span class="code-str">'fra'</span>].designations

<span class="code-comment"># Export to multiple formats</span>
collection.to_tbx(<span class="code-str">'output.tbx'</span>)
collection.to_skos(<span class="code-str">'output.ttl'</span>)
collection.to_jsonld(<span class="code-str">'output.jsonld'</span>)</pre>
          </div>
        </div>

        <div class="code-panel" id="panel-export">
          <div class="code-desc">
            <h4>Universal Interchange</h4>
            <p>Export your concept system to any standard format. Import from existing terminology datasets. Full round-trip support.</p>
          </div>
          <div class="format-grid">
            <div class="format-card">
              <code>TBX-XML</code>
              <span>ISO 30042 terminology markup</span>
            </div>
            <div class="format-card">
              <code>SKOS/RDF</code>
              <span>W3C knowledge organization</span>
            </div>
            <div class="format-card">
              <code>Turtle</code>
              <span>RDF triples, human-readable</span>
            </div>
            <div class="format-card">
              <code>JSON-LD</code>
              <span>Linked data in JSON</span>
            </div>
            <div class="format-card">
              <code>YAML</code>
              <span>Native Glossarist format</span>
            </div>
            <div class="format-card">
              <code>JSONL</code>
              <span>Streaming line-delimited</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Standards -->
    <section class="section section-standards">
      <div class="section-header">
        <span class="section-eyebrow">Compliance</span>
        <h2>Built on International Standards</h2>
        <p>Every entity in the Glossarist model maps to established terminology and knowledge organization standards</p>
      </div>
      <div class="standards-grid">
        <div class="standard-card">
          <code>ISO 10241-1</code>
          <strong>Terminology Entries</strong>
          <p>Structured terminology entries in standardized vocabularies</p>
        </div>
        <div class="standard-card">
          <code>ISO 704</code>
          <strong>Principles &amp; Methods</strong>
          <p>Concept systems, definitions, and term formation rules</p>
        </div>
        <div class="standard-card">
          <code>ISO 30042</code>
          <strong>TBX Format</strong>
          <p>Terminology markup framework for data exchange</p>
        </div>
        <div class="standard-card">
          <code>ISO 12620</code>
          <strong>Data Categories</strong>
          <p>34 term type classifications and data category registry</p>
        </div>
        <div class="standard-card">
          <code>ISO 25964</code>
          <strong>Thesauri</strong>
          <p>Hierarchical and mapping relationships for thesaurus interoperability</p>
        </div>
        <div class="standard-card">
          <code>OWL 2</code>
          <strong>Ontology</strong>
          <p>Formal RDF/OWL vocabulary with class hierarchies</p>
        </div>
        <div class="standard-card">
          <code>SHACL</code>
          <strong>Validation</strong>
          <p>Shape Constraints for data validation and integrity</p>
        </div>
        <div class="standard-card">
          <code>SKOS/XL</code>
          <strong>Knowledge Org</strong>
          <p>Reified labels and concept schemes for the semantic web</p>
        </div>
      </div>
    </section>

    <!-- Ecosystem (now supporting role) -->
    <section class="section section-eco">
      <div class="section-header">
        <span class="section-eyebrow">Ecosystem</span>
        <h2>End-to-End Tooling</h2>
        <p>Libraries and applications for every stage of terminology management</p>
      </div>
      <div class="eco-grid">
        <div v-for="project in premierProjects" :key="project.name" class="eco-card">
          <div class="eco-card-header">
            <div class="eco-card-icon" :class="project.category === 'Core' ? 'core' : 'tool'">
              {{ project.category === 'Core' ? '{ }' : '#' }}
            </div>
            <div>
              <div class="category">{{ project.category }}</div>
              <h3>
                {{ project.name }}
                <span v-if="project.version" class="version">{{ project.version }}</span>
              </h3>
            </div>
          </div>
          <p>{{ project.description }}</p>
          <div class="links">
            <a :href="project.docs || `/docs/software/${project.name}`" class="btn btn-sm btn-secondary">Docs</a>
            <a :href="project.github" class="btn btn-sm btn-secondary" target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Used By -->
    <section class="section">
      <div class="section-header">
        <span class="section-eyebrow">In Production</span>
        <h2>Trusted by Standards Bodies</h2>
      </div>
      <div class="users-grid">
        <a href="https://isotc211.geolexica.org/" target="_blank" rel="noopener" class="user-card">
          <img src="/images/iso-symbol.svg" alt="ISO" />
          <div>
            <strong>ISO/TC 211 Geolexica</strong>
            <span>1,507 concepts · 15 languages · Geographic information terminology</span>
          </div>
        </a>
        <a href="https://isotc204.geolexica.org/" target="_blank" rel="noopener" class="user-card">
          <img src="/images/iso-symbol.svg" alt="ISO" />
          <div>
            <strong>ISO/TC 204 Geolexica</strong>
            <span>Intelligent transport systems terminology</span>
          </div>
        </a>
        <a href="https://osgeo.geolexica.org/" target="_blank" rel="noopener" class="user-card">
          <img src="/images/iso-symbol.svg" alt="OSGeo" />
          <div>
            <strong>OSGeo Geolexica</strong>
            <span>Open Source Geospatial Foundation terminology</span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>
