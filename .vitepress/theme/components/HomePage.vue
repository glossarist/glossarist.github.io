<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { premierProjects } from '../../data/projects'
import { standards } from '../../data/standards'

const mouseX = ref(0)
const mouseY = ref(0)

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

  const hero = document.querySelector('.hero')
  if (hero) {
    hero.addEventListener('mousemove', (e: Event) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const x = ((e as MouseEvent).clientX - rect.left) / rect.width
      const y = ((e as MouseEvent).clientY - rect.top) / rect.height
      mouseX.value = x
      mouseY.value = y
    })
  }
})
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero" :style="{ '--mx': mouseX, '--my': mouseY }">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-eyebrow">Open-Source Terminology Infrastructure</div>
        <div class="hero-title">
          One Concept,<br />
          <span class="hero-title-accent">Many Languages</span>
        </div>
        <div class="hero-tagline">
          Manage multilingual concept systems with structured terminology.
          Built on ISO standards and Semantic Web technology.
        </div>
        <div class="hero-actions">
          <a href="/docs/model/" class="btn btn-primary">
            Explore the Model
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="https://github.com/glossarist" class="btn btn-outline" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
        <div class="hero-formats">
          <span class="hf-tag">SKOS</span>
          <span class="hf-tag">TBX</span>
          <span class="hf-tag">JSON-LD</span>
          <span class="hf-tag">Turtle</span>
          <span class="hf-tag">YAML</span>
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
          <p>Define your concept system using the rich Glossarist domain model — 24 ontology classes, 32 relationship types, 7 designation types, SHACL validation shapes.</p>
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
            <h3>Semantic Web & Linked Data</h3>
          </div>
          <p class="model-card-desc">Formal ontology with SHACL shapes for validation. Aligned with SKOS, SKOS-XL, ISO 25964, PROV-O, and Dublin Core — ready for the linked data ecosystem.</p>
          <div class="model-card-stats">
            <div class="onto-stat"><strong>24</strong><span>Classes</span></div>
            <div class="onto-stat"><strong>48</strong><span>Properties</span></div>
            <div class="onto-stat"><strong>24</strong><span>SHACL Shapes</span></div>
            <div class="onto-stat"><strong>7</strong><span>Concept Schemes</span></div>
          </div>
          <a href="/ontology" class="model-card-link">Browse ontology &rarr;</a>
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
        <a v-for="std in standards" :key="std.id" :href="std.url" target="_blank" rel="noopener" class="standard-card">
          <code>{{ std.code }}</code>
          <strong>{{ std.shortTitle }}</strong>
          <p>{{ std.description }}</p>
        </a>
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
        <p>Glossarist powers multilingual terminology registries for international standards organizations</p>
      </div>
      <div class="users-grid">
        <a href="https://isotc211.geolexica.org/" target="_blank" rel="noopener" class="user-card">
          <div class="user-card-logo">
            <img src="/images/iso-symbol.svg" alt="ISO" />
          </div>
          <div class="user-card-body">
            <strong>ISO/TC 211 Geolexica</strong>
            <span>1,507 concepts · 15 languages</span>
            <span class="user-card-detail">Geographic information terminology</span>
          </div>
          <span class="user-card-arrow">&rarr;</span>
        </a>
        <a href="https://isotc204.geolexica.org/" target="_blank" rel="noopener" class="user-card">
          <div class="user-card-logo">
            <img src="/images/iso-symbol.svg" alt="ISO" />
          </div>
          <div class="user-card-body">
            <strong>ISO/TC 204 Geolexica</strong>
            <span>Intelligent transport systems</span>
            <span class="user-card-detail">ITS terminology registry</span>
          </div>
          <span class="user-card-arrow">&rarr;</span>
        </a>
        <a href="https://osgeo.geolexica.org/" target="_blank" rel="noopener" class="user-card">
          <div class="user-card-logo">
            <img src="/images/osgeo-logo.svg" alt="OSGeo" />
          </div>
          <div class="user-card-body">
            <strong>OSGeo Geolexica</strong>
            <span>444 concepts · Open Source Geospatial</span>
            <span class="user-card-detail">Foundation terminology</span>
          </div>
          <span class="user-card-arrow">&rarr;</span>
        </a>
      </div>
    </section>
  </div>
</template>
