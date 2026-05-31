<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { premierProjects } from '../../data/projects'
import { standards } from '../../data/standards'
import stats from '../../../public/data/stats.json'

const st = {
  classes: stats.classes,
  properties: stats.properties,
  shapes: stats.shapes,
  relationships: stats.relationships,
  designations: stats.designations,
}

const mouseX = ref(0)
const mouseY = ref(0)
const cycleIndex = ref(0)
const activeCodeTab = ref('yaml')
let cycleTimer: ReturnType<typeof setInterval> | null = null

const langCycle = [
  { code: 'eng', term: 'entity' },
  { code: 'fra', term: 'entité' },
  { code: 'deu', term: 'Entität' },
  { code: 'spa', term: 'entidad' },
  { code: 'zho', term: '实体' },
  { code: 'ara', term: 'كيان' },
  { code: 'rus', term: 'сущность' },
  { code: 'jpn', term: 'エンティティ' },
]

const currentLang = computed(() => langCycle[cycleIndex.value].code)
const currentTerm = computed(() => langCycle[cycleIndex.value].term)
const cycleKey = computed(() => cycleIndex.value)

const netNodes = [
  { x: 120, y: 55, r: 4, fill: '#aef0e7', delay: 0 },
  { x: 300, y: 120, r: 6, fill: '#97a4b7', delay: -3 },
  { x: 470, y: 50, r: 3.5, fill: '#b8f5ec', delay: -6 },
  { x: 640, y: 95, r: 5, fill: '#a1e9e1', delay: -9 },
  { x: 810, y: 60, r: 3.5, fill: '#8fe0d8', delay: -1 },
  { x: 170, y: 270, r: 4.5, fill: '#aef0e7', delay: -4 },
  { x: 390, y: 240, r: 7, fill: '#b5f3ea', delay: -7 },
  { x: 570, y: 290, r: 4.5, fill: '#a1e9e1', delay: -10 },
  { x: 750, y: 255, r: 5, fill: '#3a5c80', delay: -2 },
  { x: 890, y: 200, r: 3.5, fill: '#97a4b7', delay: -5 },
  { x: 290, y: 410, r: 4.5, fill: '#588ac1', delay: -8 },
  { x: 510, y: 420, r: 5.5, fill: '#aef0e7', delay: -11 },
  { x: 700, y: 390, r: 3.5, fill: '#b8f5ec', delay: -3 },
]

const netEdges = [
  [0, 1], [1, 2], [1, 6], [2, 3], [3, 4],
  [5, 6], [6, 7], [6, 11], [7, 8], [8, 9],
  [10, 11], [11, 12], [0, 5], [3, 8], [7, 12],
]

function blobParallax(index: number) {
  const factors = [
    { fx: 25, fy: 15 },
    { fx: -18, fy: -12 },
    { fx: 12, fy: 8 },
    { fx: -15, fy: 10 },
    { fx: 20, fy: -8 },
  ]
  const f = factors[index] || factors[0]
  const bx = (mouseX.value - 0.5) * f.fx
  const by = (mouseY.value - 0.5) * f.fy
  return { '--bx': `${bx}px`, '--by': `${by}px` }
}

onMounted(() => {
  const hero = document.querySelector('.hero')
  if (hero) {
    hero.addEventListener('mousemove', (e: Event) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      mouseX.value = ((e as MouseEvent).clientX - rect.left) / rect.width
      mouseY.value = ((e as MouseEvent).clientY - rect.top) / rect.height
    })
  }

  cycleTimer = setInterval(() => {
    cycleIndex.value = (cycleIndex.value + 1) % langCycle.length
  }, 2200)
})

onUnmounted(() => {
  if (cycleTimer) clearInterval(cycleTimer)
})
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero" :style="{ '--mx': mouseX, '--my': mouseY }">
      <!-- Background: logo-reference color blobs -->
      <div class="hero-blobs">
        <div class="blob blob-navy" :style="blobParallax(0)"></div>
        <div class="blob blob-blue" :style="blobParallax(1)"></div>
        <div class="blob blob-teal" :style="blobParallax(2)"></div>
        <div class="blob blob-sea" :style="blobParallax(3)"></div>
        <div class="blob blob-mint" :style="blobParallax(4)"></div>
      </div>

      <!-- Background: concept network -->
      <svg class="hero-net" viewBox="0 0 1000 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <line v-for="(e, i) in netEdges" :key="'e'+i"
          :x1="netNodes[e[0]].x" :y1="netNodes[e[0]].y"
          :x2="netNodes[e[1]].x" :y2="netNodes[e[1]].y"
          class="hnet-edge"
          :style="{ stroke: netNodes[e[0]].fill, animationDelay: (i * 0.7) + 's' }" />
        <circle v-for="(n, i) in netNodes" :key="'n'+i"
          :cx="n.x" :cy="n.y" :r="n.r"
          :fill="n.fill"
          class="hnet-node"
          :style="{ animationDelay: n.delay + 's' }" />
      </svg>

      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="eyebrow-bar"></span>
          Open-Source Terminology Infrastructure
        </div>
        <div class="hero-title">
          One Concept,<br />
          <span class="hero-title-accent">Many Languages</span>
        </div>
        <div class="hero-tagline">
          Build multilingual concept systems with ISO-standard rigor.
          One concept, many language designations, typed relationships, and multi-format export.
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
        <div class="hero-lang-cycle">
          <span class="lang-code">{{ currentLang }}</span>
          <span class="lang-term-wrap">
            <span :key="cycleKey" class="lang-term">{{ currentTerm }}</span>
          </span>
          <span class="lang-arrow">&xrarr;</span>
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
          <p>Define your concept system using the rich Glossarist domain model — {{ st.classes }} entity types, {{ st.relationships }} relationship types, {{ st.designations }} designation types, validation shapes.</p>
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
        <div class="model-card mc-concepts">
          <div class="model-card-header">
            <span class="model-dot md-concept"></span>
            <h3>ManagedConcept</h3>
          </div>
          <p class="model-card-desc">The top-level entity. Contains a UUID, lifecycle status, domain references, and maps language codes to LocalizedConcept instances.</p>
          <div class="model-card-fields">
            <div class="field-row"><code>status</code><span>notValid · valid · superseded · retired</span></div>
            <div class="field-row"><code>localized_concepts</code><span>Hash of lang → LocalizedConcept</span></div>
            <div class="field-row"><code>related</code><span>{{ st.relationships }} typed relationship kinds</span></div>
            <div class="field-row"><code>domains</code><span>Subject area references</span></div>
          </div>
          <a href="/docs/model/concepts" class="model-card-link">Concept docs &rarr;</a>
        </div>

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

        <div class="model-card mc-desig">
          <div class="model-card-header">
            <span class="model-dot md-desig"></span>
            <h3>Designations</h3>
          </div>
          <p class="model-card-desc">{{ st.designations }} designation types in a MECE hierarchy — expression, abbreviation, symbol, letter_symbol, graphical_symbol, prefix, suffix.</p>
          <div class="model-card-tree">
            <span class="tree-branch"><span class="model-dot md-desig"></span> Designation</span>
            <span class="tree-branch indent-1"><span class="model-dot md-desig"></span> Expression → Abbreviation</span>
            <span class="tree-branch indent-1"><span class="model-dot md-desig"></span> Symbol → Letter · Graphical</span>
            <span class="tree-branch indent-1"><span class="model-dot md-desig"></span> Prefix · Suffix</span>
          </div>
          <a href="/docs/model/designations" class="model-card-link">Designation types &rarr;</a>
        </div>

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

        <div class="model-card mc-onto">
          <div class="model-card-header">
            <span class="model-dot md-onto"></span>
            <h3>Formal Ontology</h3>
          </div>
          <p class="model-card-desc">The concept model is formally expressed as an OWL ontology with SHACL validation shapes. Interoperates with SKOS, SKOS-XL, ISO 25964, PROV-O, and Dublin Core for linked data integration.</p>
          <div class="model-card-fields">
            <div class="field-row"><code>{{ st.classes }}</code><span>Entity types</span></div>
            <div class="field-row"><code>{{ st.properties }}</code><span>Object &amp; datatype properties</span></div>
            <div class="field-row"><code>{{ st.shapes }}</code><span>Validation shapes</span></div>
          </div>
          <a href="/reference/ontology" class="model-card-link">Browse ontology &rarr;</a>
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
          <button class="code-tab" :class="{ active: activeCodeTab === 'yaml' }" @click="activeCodeTab = 'yaml'">YAML Authoring</button>
          <button class="code-tab" :class="{ active: activeCodeTab === 'js' }" @click="activeCodeTab = 'js'">JavaScript SDK</button>
          <button class="code-tab" :class="{ active: activeCodeTab === 'ruby' }" @click="activeCodeTab = 'ruby'">Ruby Gem</button>
          <button class="code-tab" :class="{ active: activeCodeTab === 'export' }" @click="activeCodeTab = 'export'">Export Formats</button>
        </div>

        <div class="code-panel" :class="{ active: activeCodeTab === 'yaml' }">
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

        <div class="code-panel" :class="{ active: activeCodeTab === 'js' }">
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

        <div class="code-panel" :class="{ active: activeCodeTab === 'ruby' }">
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

        <div class="code-panel" :class="{ active: activeCodeTab === 'export' }">
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

    <!-- Ecosystem -->
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

<style scoped>
/* Reset VitePress .vp-doc defaults — scoped attribute provides sufficient specificity */
.home h1, .home h2, .home h3, .home h4,
.home h5, .home h6 {
  margin: 0;
  border: none;
  padding: 0;
}

.home p { margin: 0; }

.home a {
  color: inherit;
  text-decoration: none;
  font-weight: inherit;
}

.home strong { font-weight: 600; }

.home :not(pre) > code {
  background: none;
  padding: 0;
  border-radius: 0;
  color: inherit;
  font-size: inherit;
}

.home {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* --- Animations --- */
@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes blob-breathe {
  0%, 100% { transform: scale(1) translate(var(--bx, 0), var(--by, 0)); }
  33% { transform: scale(1.06) translate(var(--bx, 0), var(--by, 0)); }
  66% { transform: scale(0.97) translate(var(--bx, 0), var(--by, 0)); }
}

@keyframes node-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes edge-pulse {
  0%, 100% { opacity: 0.06; }
  50% { opacity: 0.12; }
}

@keyframes lang-enter {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- Hero --- */
.hero {
  position: relative;
  padding: 7rem 1.5rem 5rem;
  text-align: center;
  overflow: hidden;
}

/* --- Logo-reference color blobs --- */
.hero-blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  animation: blob-breathe 16s ease-in-out infinite;
  will-change: transform;
}

.blob-navy {
  width: 420px; height: 420px;
  top: -8%; left: 8%;
  background: var(--g-navy);
  opacity: 0.07;
}

.blob-blue {
  width: 320px; height: 320px;
  top: 15%; right: 12%;
  background: var(--g-blue);
  opacity: 0.06;
  animation-delay: -4s;
}

.blob-teal {
  width: 480px; height: 480px;
  top: 25%; left: 25%;
  background: var(--g-teal);
  opacity: 0.05;
  animation-delay: -8s;
}

.blob-sea {
  width: 300px; height: 300px;
  bottom: -5%; right: 15%;
  background: var(--g-sea);
  opacity: 0.06;
  animation-delay: -12s;
}

.blob-mint {
  width: 360px; height: 360px;
  bottom: 5%; left: 5%;
  background: var(--g-mint);
  opacity: 0.07;
  animation-delay: -6s;
}

.dark .blob-navy { opacity: 0.05; }
.dark .blob-blue { opacity: 0.04; }
.dark .blob-teal { opacity: 0.03; }
.dark .blob-sea { opacity: 0.04; }
.dark .blob-mint { opacity: 0.05; }

/* --- Concept network SVG --- */
.hero-net {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hnet-node {
  opacity: 0.25;
  transform-box: fill-box;
  transform-origin: center;
  animation: node-float 18s ease-in-out infinite;
}

.dark .hnet-node { opacity: 0.15; }

.hnet-edge {
  stroke-width: 0.6;
  animation: edge-pulse 10s ease-in-out infinite;
}

.dark .hnet-edge { opacity: 0.04; }

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--vp-c-divider) 0.5px, transparent 0.5px);
  background-size: 24px 24px;
  opacity: 0.3;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%);
  pointer-events: none;
}

.dark .hero::before { opacity: 0.12; }

/* Interactive cursor glow */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(63, 182, 176, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 40% 30% at 50% 40%, rgba(69, 99, 153, 0.04) 0%, transparent 50%);
  pointer-events: none;
  transition: background 0.4s ease;
}

.dark .hero::after {
  background:
    radial-gradient(ellipse 60% 50% at calc(var(--mx, 0.5) * 100%) calc(var(--my, 0.5) * 100%), rgba(63, 182, 176, 0.04) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--g-teal);
  margin-bottom: 1.5rem;
  animation: hero-fade-up 0.5s ease 0.05s both;
}

.dark .hero-eyebrow { color: var(--g-sea); }

.eyebrow-bar {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--g-teal);
  border-radius: 1px;
}

.dark .eyebrow-bar { background: var(--g-sea); }

.home .hero-title {
  font-size: 4.25rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin: 0 auto 1.25rem;
  text-align: center;
  color: var(--vp-c-text-1);
  animation: hero-fade-up 0.6s ease 0.1s both;
}

.home .hero-title-accent {
  display: inline;
  background: linear-gradient(135deg, var(--g-steel) 0%, var(--g-teal) 35%, var(--g-sea) 65%, var(--g-mint) 100%);
  background-size: 200% 200%;
  animation: shimmer 8s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dark .home .hero-title-accent {
  background: linear-gradient(135deg, var(--g-teal) 0%, var(--g-sea) 55%, var(--g-mint) 100%);
  background-size: 200% 200%;
  animation: shimmer 8s ease infinite;
  -webkit-background-clip: text;
  background-clip: text;
}

.hero-tagline {
  max-width: 500px;
  margin: 0 auto 2.25rem;
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--vp-c-text-2);
  text-align: center;
  animation: hero-fade-up 0.6s ease 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
  animation: hero-fade-up 0.6s ease 0.3s both;
}

.hero-formats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: hero-fade-up 0.6s ease 0.4s both;
}

.hf-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s;
}

.hf-tag:hover {
  border-color: var(--g-teal);
  color: var(--g-teal);
}

/* --- Language cycle demo --- */
.hero-lang-cycle {
  display: inline-flex;
  align-items: baseline;
  gap: 0.625rem;
  margin-top: 2rem;
  padding: 0.5rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  animation: hero-fade-up 0.6s ease 0.5s both;
}

.lang-code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--g-teal);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  min-width: 2.5rem;
}

.lang-term-wrap {
  position: relative;
  height: 1.75rem;
  min-width: 6rem;
  overflow: hidden;
}

.lang-term {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  animation: lang-enter 0.4s ease both;
}

.lang-arrow {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-left: 0.25rem;
}

.dark .lang-code { color: var(--g-sea); }

@media (prefers-reduced-motion: reduce) {
  .hero-title, .hero-tagline,
  .hero-actions, .hero-formats,
  .hero-eyebrow, .hero-lang-cycle { animation: none; }
  .home .hero-title-accent { animation: none; }
  .blob { animation: none; }
  .hnet-node { animation: none; }
  .hnet-edge { animation: none; }
}

/* --- Buttons --- */
.home .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 0.625rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.home .btn-primary {
  background: var(--g-teal);
  color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 4px 16px rgba(63, 182, 176, 0.25);
}

.home .btn-primary:hover {
  background: var(--g-deep);
  box-shadow: 0 2px 6px rgba(0,0,0,0.12), 0 6px 24px rgba(63, 182, 176, 0.35);
  transform: translateY(-1px);
}

.dark .home .btn-primary {
  background: var(--g-teal);
  box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(63, 182, 176, 0.2);
}

.dark .home .btn-primary:hover {
  background: var(--g-sea);
  box-shadow: 0 2px 6px rgba(0,0,0,0.35), 0 6px 24px rgba(63, 182, 176, 0.3);
}

.home .btn-secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.home .btn-secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.dark .home .btn-secondary { border-color: rgba(255,255,255,0.1); }

.home .btn-outline {
  color: var(--vp-c-text-1);
  background: none;
  border: 1px solid var(--vp-c-divider);
}

.home .btn-outline:hover {
  border-color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
}

.dark .home .btn-outline { border-color: rgba(255,255,255,0.15); }
.dark .home .btn-outline:hover { border-color: rgba(255,255,255,0.3); }

.home .btn-sm {
  font-size: 0.8125rem;
  padding: 0.375rem 1rem;
  border-radius: 5px;
}

/* --- Sections --- */
.section {
  margin: 0;
  padding: 5rem 0;
  position: relative;
}

.section + .section { border-top: 1px solid var(--vp-c-divider); }

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--g-teal);
  margin-bottom: 0.625rem;
}

.dark .section-eyebrow { color: var(--g-sea); }

.home .section-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 auto 0.5rem;
  color: var(--vp-c-text-1);
}

.home .section-header p {
  font-size: 1.0625rem;
  color: var(--vp-c-text-2);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.65;
}

/* --- Pipeline --- */
.pipeline {
  display: flex;
  align-items: flex-start;
  gap: 0;
  justify-content: center;
}

.pipeline-step {
  flex: 0 1 220px;
  text-align: center;
  padding: 0 0.5rem;
}

.pipeline-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  position: relative;
}

.pipeline-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, transparent 40%, currentColor 100%);
  opacity: 0.06;
}

.pi-model { background: rgba(42, 65, 90, 0.08); color: var(--g-class); }
.pi-schema { background: rgba(63, 182, 176, 0.08); color: var(--g-teal); }
.pi-code { background: rgba(124, 58, 237, 0.06); color: var(--g-taxonomy); }
.pi-publish { background: rgba(190, 18, 60, 0.05); color: var(--g-individual); }

.dark .pi-model { background: rgba(91, 147, 196, 0.1); }
.dark .pi-schema { background: rgba(77, 212, 198, 0.1); }
.dark .pi-code { background: rgba(167, 139, 250, 0.1); }
.dark .pi-publish { background: rgba(251, 113, 133, 0.08); }

.pipeline-step h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.375rem;
}

.pipeline-step p {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 0.625rem;
}

.pipeline-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.pipeline-link:hover { text-decoration: underline; }

.pipeline-or {
  font-size: 0.6875rem;
  color: var(--vp-c-text-3);
  margin: 0 0.25rem;
}

.pipeline-connector {
  flex: 0 0 auto;
  padding-top: 1.5rem;
  color: var(--vp-c-divider);
  margin: 0 0.25rem;
}

/* --- Model Grid --- */
.model-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.model-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.model-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity 0.2s;
}

.model-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.model-card:hover::before { opacity: 1; }

.dark .model-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.25); }

.mc-concepts::before { background: linear-gradient(90deg, var(--g-class), transparent); }
.mc-local::before { background: linear-gradient(90deg, var(--g-property), transparent); }
.mc-desig::before { background: linear-gradient(90deg, var(--g-teal), transparent); }
.mc-rel::before { background: linear-gradient(90deg, var(--g-shape), transparent); }
.mc-source::before { background: linear-gradient(90deg, var(--g-taxonomy), transparent); }
.mc-onto::before { background: linear-gradient(90deg, var(--g-steel), var(--g-teal)); }

.model-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.model-card-header h3 {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
}

.model-card-desc {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.model-card-fields {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.field-row code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  background: var(--vp-c-default-soft);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.field-row span {
  color: var(--vp-c-text-3);
  font-size: 0.6875rem;
}

.model-card-tree {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.tree-branch {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.tree-branch.indent-1 { padding-left: 1.25rem; }

.model-card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.rel-chip {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 3px;
  background: rgba(161, 98, 7, 0.06);
  color: var(--g-shape);
}

.dark .rel-chip { background: rgba(251, 191, 36, 0.08); color: var(--g-shape); }

.model-card-link {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  margin-top: auto;
}

.model-card-link:hover { text-decoration: underline; }

.model-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.md-concept { background: var(--g-class); }
.md-local { background: var(--g-property); }
.md-desig { background: var(--g-teal); }
.md-rel { background: var(--g-shape); }
.md-source { background: var(--g-taxonomy); }
.md-onto { background: linear-gradient(135deg, var(--g-steel), var(--g-teal)); }

/* --- Code Showcase --- */
.code-showcase {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.dark .code-showcase { border-color: rgba(255,255,255,0.06); }

.code-tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.5rem;
  overflow-x: auto;
}

.code-tab {
  padding: 0.75rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.code-tab:hover { color: var(--vp-c-text-2); }

.code-tab.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.code-panel {
  display: none;
  padding: 2rem;
  gap: 2rem;
}

.code-panel.active { display: flex; }

.code-desc {
  flex: 0 0 240px;
}

.code-desc h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.375rem;
}

.code-desc p {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.code-block {
  flex: 1;
  min-width: 0;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 1.25rem;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 0.8125rem;
  line-height: 1.7;
}

.code-block pre {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.code-comment { color: var(--vp-c-text-3); }
.code-key { color: var(--vp-c-brand-1); }
.code-str { color: #16a34a; }
.code-val { color: var(--g-shape); }

.dark .code-str { color: #4ade80; }

/* Format grid */
.format-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  flex: 1;
}

.format-card {
  padding: 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  text-align: center;
}

.format-card code {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.25rem;
}

.format-card span {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

/* --- Standards --- */
.standards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.875rem;
}

.standard-card {
  display: block;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-align: center;
  transition: all 0.2s;
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.standard-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.dark .standard-card { border-color: rgba(255,255,255,0.06); }
.dark .standard-card:hover { border-color: var(--g-teal); }

.standard-card code {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  background: var(--vp-c-default-soft);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand-1);
}

.standard-card strong {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.standard-card p {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* --- Ecosystem Grid --- */
.eco-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.eco-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.eco-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.dark .eco-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.25); }

.eco-card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.eco-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  flex-shrink: 0;
}

.eco-card-icon.core {
  background: rgba(63, 182, 176, 0.08);
  color: var(--g-teal);
}

.eco-card-icon.tool {
  background: rgba(124, 58, 237, 0.06);
  color: var(--g-taxonomy);
}

.dark .eco-card-icon.core { background: rgba(63, 182, 176, 0.15); color: var(--g-sea); }
.dark .eco-card-icon.tool { background: rgba(167, 139, 250, 0.1); color: #a78bfa; }

.eco-card h3 {
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.eco-card .version {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: var(--vp-c-default-soft);
  padding: 0.0625rem 0.375rem;
  border-radius: 3px;
  font-family: var(--vp-font-family-mono);
}

.eco-card .category {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
}

.eco-card p {
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  flex: 1;
  margin-bottom: 1rem;
}

.eco-card .links {
  display: flex;
  gap: 0.5rem;
}

/* --- Used By --- */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem 1.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: all 0.2s ease;
}

.user-card:hover {
  border-color: var(--g-teal);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}

.dark .user-card { border-color: rgba(255,255,255,0.06); }
.dark .user-card:hover { border-color: var(--g-teal); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }

.user-card-logo {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
  padding: 0.5rem;
}

.user-card-logo img {
  max-width: 34px;
  max-height: 34px;
  object-fit: contain;
}

.user-card-body {
  flex: 1;
  min-width: 0;
}

.user-card-body strong {
  display: block;
  font-size: 0.9375rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.125rem;
}

.user-card-body span {
  display: block;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.user-card-detail {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 0.125rem;
}

.user-card-arrow {
  font-size: 1.125rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: color 0.2s, transform 0.2s;
}

.user-card:hover .user-card-arrow {
  color: var(--g-teal);
  transform: translateX(3px);
}

/* ================================================================
   RESPONSIVE
   ================================================================ */

@media (max-width: 1152px) {
  .pipeline-step { flex: 0 1 200px; }
  .pipeline-step p { font-size: 0.75rem; }
}

@media (max-width: 900px) {
  .eco-grid { grid-template-columns: repeat(2, 1fr); }
  .standards-grid { grid-template-columns: repeat(2, 1fr); }
  .model-grid { grid-template-columns: repeat(2, 1fr); }
  .pipeline { flex-wrap: wrap; justify-content: center; gap: 1rem; }
  .pipeline-connector { display: none; }
  .pipeline-step { flex: 0 1 280px; }
  .pipeline-step p { font-size: 0.8125rem; }
  .code-panel.active { flex-direction: column; }
  .code-desc { flex: none; }
  .format-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-slashes, .hero-net { display: none; }
}

@media (max-width: 640px) {
  .home .hero { padding: 5rem 1rem 4rem; }
  .home .hero-title { font-size: 2.5rem; line-height: 1.2; }
  .hero-tagline { font-size: 1rem; }
  .eco-grid, .model-grid, .standards-grid, .format-grid { grid-template-columns: 1fr; }
  .section { padding: 3.5rem 0; }
  .home .section-header h2 { font-size: 1.5rem; }
  .code-showcase { border-radius: 6px; }
  .code-panel.active { padding: 1.25rem; }
  .code-block { padding: 1rem; }
  .users-grid { grid-template-columns: 1fr; }
  .user-card { padding: 1.25rem; }
  .hero-blobs { display: none; }
  .hero-net { display: none; }
}
</style>
