<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { premierProjects } from '../data/projects'
import stats from '../data/stats.json'

const st = stats

const activeCodeTab = ref('yaml')

const langCycle = [
  { code: 'eng', term: 'many languages' },
  { code: 'fra', term: 'plusieurs langues' },
  { code: 'deu', term: 'viele Sprachen' },
  { code: 'spa', term: 'muchos idiomas' },
  { code: 'zho', term: '多种语言' },
  { code: 'ara', term: 'لغات كثيرة' },
  { code: 'rus', term: 'много языков' },
  { code: 'jpn', term: '多くの言語' },
]

// Duplicate the list for seamless infinite scroll
const tickerItems = computed(() => [...langCycle, ...langCycle])

// Rotating value-proposition taglines
const motdLines = [
  'Convergence of scripts',
  'Expression of ideas',
  'Lineage of concepts',
  'Relationships between terms',
  'Multilingual datasets',
  'Machine-readable glossaries',
]
const motdIndex = ref(0)
let motdTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  motdTimer = setInterval(() => {
    motdIndex.value = (motdIndex.value + 1) % motdLines.length
  }, 3500)
})

onUnmounted(() => {
  if (motdTimer) clearInterval(motdTimer)
})

const codePanels = {
  yaml: {
    title: 'YAML — Human-Readable Concept Data',
    desc: 'Write terminology concepts in structured YAML. Each file contains a ManagedConcept with all localizations, designations, and relationships.',
    link: '/model/schemas',
    linkText: 'Schema Reference',
    code: `<span class="c-comment"># concepts/3.1.1.1.yaml</span>
<span class="c-key">termid</span>: <span class="c-str">"3.1.1.1"</span>
<span class="c-key">status</span>: <span class="c-val">valid</span>

<span class="c-key">eng</span>:
  <span class="c-key">terms</span>:
    - <span class="c-key">type</span>: <span class="c-val">expression</span>
      <span class="c-key">designation</span>: <span class="c-str">"entity"</span>
      <span class="c-key">normative_status</span>: <span class="c-val">preferred</span>
  <span class="c-key">definition</span>:
    - <span class="c-key">content</span>: <span class="c-str">"A concrete or abstract thing"</span>

<span class="c-key">fra</span>:
  <span class="c-key">terms</span>:
    - <span class="c-key">designation</span>: <span class="c-str">"entité"</span>
  <span class="c-key">definition</span>:
    - <span class="c-key">content</span>: <span class="c-str">"chose concrète ou abstraite"</span>`,
  },
  js: {
    title: 'glossarist-js — Node.js SDK',
    desc: 'Read, write, validate, and manage GCR packages with bidirectional YAML serialization and streaming.',
    link: '/docs/software/glossarist-js',
    linkText: 'JS SDK Docs',
    code: `<span class="c-key">import</span> { loadGcr } <span class="c-key">from</span> <span class="c-str">'glossarist'</span>;

<span class="c-comment">// Read a GCR package (streaming)</span>
<span class="c-key">const</span> pkg = <span class="c-key">await</span> loadGcr(buf);

<span class="c-key">await</span> pkg.eachConcept((concept) =&gt; {
  console.log(concept.id, concept.primaryDesignation(<span class="c-str">'eng'</span>));
});

<span class="c-comment">// Write GCR package</span>
<span class="c-key">const</span> buf = <span class="c-key">await</span> createGcr([concept]);`,
  },
  ruby: {
    title: 'glossarist-ruby — Ruby Gem',
    desc: 'Full CRUD for concept management, multi-format serialization, TBX/SKOS/Turtle export.',
    link: '/docs/software/glossarist-ruby',
    linkText: 'Ruby Gem Docs',
    code: `<span class="c-key">require</span> <span class="c-str">'glossarist'</span>

collection = Glossarist::ManagedConceptCollection.new
collection.from_yaml(<span class="c-str">'./concepts/'</span>)

concept = collection[<span class="c-str">'3.1.1.1'</span>]
puts concept.localizations[<span class="c-str">'eng'</span>].definition

<span class="c-comment"># Export to multiple formats</span>
collection.to_tbx(<span class="c-str">'output.tbx'</span>)
collection.to_skos(<span class="c-str">'output.ttl'</span>)`,
  },
}
</script>

<template>
  <div class="home">
    <!-- ════════════════════════════════════════════════════
        HERO
        ════════════════════════════════════════════════════ -->
    <section class="hp-hero">
      <div class="hp-hero-grain"></div>
      <div class="hp-hero-inner">
        <div class="hp-hero-logo-row">
          <img src="/logo-glossarist.svg" alt="Glossarist" class="hp-hero-logo" width="120" height="113" />
          <div class="hp-hero-meta">
            <span class="hp-hero-greek">γλῶσσα</span>
            <span class="hp-hero-greek-sub">glôssa · tongue, language — the root of "glossary"</span>
          </div>
        </div>

        <h1 class="hp-hero-title">
          One concept,<br />
          <span class="hp-ticker" aria-label="many languages">
            <span class="hp-ticker-track">
              <span
                v-for="(lang, i) in tickerItems"
                :key="i"
                class="hp-ticker-item"
              >{{ lang.term }}</span>
            </span>
          </span>
        </h1>

        <p class="hp-hero-lede">
          Glossarist is open-source software for maintaining multi-language
          concept systems — aligned with ISO standards for terminology
          management, from model to publication.
        </p>

        <div class="hp-hero-actions">
          <a href="/model/" class="g-cta">
            Explore the Model
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
          <a href="https://github.com/glossarist" class="g-cta g-cta-light" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>

        <div class="hp-motd">
          <span class="hp-motd-label">Why Glossarist</span>
          <span class="hp-motd-rotator">
            <Transition name="motd-fade" mode="out-in">
              <span :key="motdIndex" class="hp-motd-text">{{ motdLines[motdIndex] }}</span>
            </Transition>
          </span>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        STATS BAR
        ════════════════════════════════════════════════════ -->
    <section class="hp-stats">
      <div class="hp-stats-inner">
        <div class="hp-stat">
          <span class="hp-stat-num">{{ st.classes }}</span>
          <span class="hp-stat-label">Entity Types</span>
        </div>
        <div class="hp-stat">
          <span class="hp-stat-num">{{ st.relationships }}</span>
          <span class="hp-stat-label">Relationship Types</span>
        </div>
        <div class="hp-stat">
          <span class="hp-stat-num">{{ st.properties }}</span>
          <span class="hp-stat-label">Properties</span>
        </div>
        <div class="hp-stat">
          <span class="hp-stat-num">{{ st.designations }}</span>
          <span class="hp-stat-label">Designation Types</span>
        </div>
        <div class="hp-stat">
          <span class="hp-stat-num">{{ st.shapes }}</span>
          <span class="hp-stat-label">SHACL Shapes</span>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        PIPELINE
        ════════════════════════════════════════════════════ -->
    <section class="hp-section">
      <div class="hp-container">
        <div class="g-section-label">
          <span class="g-label-num">01</span>
          <span class="g-label-text">How It Works</span>
        </div>
        <h2 class="hp-section-title">From concept to <em>publication</em>.</h2>
        <p class="g-lede" style="margin-bottom: 3rem;">A structured pipeline that takes you from domain modeling to multilingual terminology publication.</p>

        <div class="hp-pipeline">
          <div class="hp-pipe-step">
            <span class="hp-pipe-num">01</span>
            <h4>Model</h4>
            <p>Define your concept system using the rich Glossarist domain model — entity types, typed relationships, validation shapes.</p>
            <a href="/model/" class="hp-pipe-link">Concept Model →</a>
          </div>
          <div class="hp-pipe-arrow">→</div>
          <div class="hp-pipe-step">
            <span class="hp-pipe-num">02</span>
            <h4>Author</h4>
            <p>Write terminology concepts in human-readable YAML. ManagedConcept, LocalizedConcept, designations, sources.</p>
            <a href="/model/schemas" class="hp-pipe-link">YAML Schemas →</a>
          </div>
          <div class="hp-pipe-arrow">→</div>
          <div class="hp-pipe-step">
            <span class="hp-pipe-num">03</span>
            <h4>Process</h4>
            <p>Read, validate, transform, and export using the Ruby gem or JavaScript SDK.</p>
            <a href="/docs/software/glossarist-js" class="hp-pipe-link">JS SDK →</a>
          </div>
          <div class="hp-pipe-arrow">→</div>
          <div class="hp-pipe-step">
            <span class="hp-pipe-num">04</span>
            <h4>Publish</h4>
            <p>Deploy as an interactive concept browser, SKOS thesaurus, or TBX exchange format.</p>
            <a href="https://isotc211.geolexica.org/" target="_blank" rel="noopener" class="hp-pipe-link">See Geolexica →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        SOFTWARE
        ════════════════════════════════════════════════════ -->
    <section class="hp-section hp-section-alt">
      <div class="hp-container">
        <div class="g-section-label">
          <span class="g-label-num">02</span>
          <span class="g-label-text">Software Ecosystem</span>
        </div>
        <h2 class="hp-section-title">Four tools, one <em>mission</em>.</h2>
        <p class="g-lede" style="margin-bottom: 3rem;">From Ruby gems to desktop apps — the complete toolchain for terminology management.</p>

        <div class="g-card-grid g-card-grid-2">
          <a v-for="p in premierProjects" :key="p.slug" :href="'/docs/software/' + p.slug" class="g-card hp-sw-card">
              <div class="g-card-accent"></div>
              <div class="hp-sw-header">
                <h3>{{ p.name.startsWith('glossarist-') ? 'Glossarist ' + p.name.replace('glossarist-', '') : p.name === 'concept-browser' ? 'Concept Browser' : p.name }}</h3>
                <span class="hp-sw-version">{{ p.version }}</span>
              </div>
              <p>{{ p.description }}</p>
              <div class="hp-sw-footer">
                <span class="g-tag">{{ p.category }}</span>
                <span class="hp-sw-github">View on GitHub →</span>
              </div>
            </a>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        CODE SHOWCASE
        ════════════════════════════════════════════════════ -->
    <section class="hp-section">
      <div class="hp-container">
        <div class="g-section-label">
          <span class="g-label-num">03</span>
          <span class="g-label-text">Developer Experience</span>
        </div>
        <h2 class="hp-section-title">Structured data, <em>any language</em>.</h2>
        <p class="g-lede" style="margin-bottom: 3rem;">Author in YAML, process with Ruby or JavaScript, export to TBX, SKOS, Turtle, or JSON-LD.</p>

        <div class="hp-code-showcase">
          <div class="hp-code-tabs">
            <button
              v-for="(panel, key) in codePanels"
              :key="key"
              class="hp-code-tab"
              :class="{ active: activeCodeTab === key }"
              @click="activeCodeTab = key"
            >{{ panel.title.split('—')[0].trim() }}</button>
          </div>

          <div class="hp-code-panel" v-if="activeCodeTab === 'yaml'">
            <div class="hp-code-desc">
              <h4>{{ codePanels.yaml.title }}</h4>
              <p>{{ codePanels.yaml.desc }}</p>
              <a :href="codePanels.yaml.link" class="g-cta">{{ codePanels.yaml.linkText }} →</a>
            </div>
            <pre class="hp-code-block" v-html="codePanels.yaml.code"></pre>
          </div>
          <div class="hp-code-panel" v-else-if="activeCodeTab === 'js'">
            <div class="hp-code-desc">
              <h4>{{ codePanels.js.title }}</h4>
              <p>{{ codePanels.js.desc }}</p>
              <a :href="codePanels.js.link" class="g-cta">{{ codePanels.js.linkText }} →</a>
            </div>
            <pre class="hp-code-block" v-html="codePanels.js.code"></pre>
          </div>
          <div class="hp-code-panel" v-else-if="activeCodeTab === 'ruby'">
            <div class="hp-code-desc">
              <h4>{{ codePanels.ruby.title }}</h4>
              <p>{{ codePanels.ruby.desc }}</p>
              <a :href="codePanels.ruby.link" class="g-cta">{{ codePanels.ruby.linkText }} →</a>
            </div>
            <pre class="hp-code-block" v-html="codePanels.ruby.code"></pre>
          </div>
          <div class="hp-code-panel" v-else>
            <div class="hp-code-desc">
              <h4>Universal Interchange</h4>
              <p>Export your concept system to any standard format. Full round-trip support.</p>
            </div>
            <div class="hp-format-grid">
              <div class="hp-format"><code>TBX-XML</code><span>ISO 30042</span></div>
              <div class="hp-format"><code>SKOS/RDF</code><span>W3C SKOS</span></div>
              <div class="hp-format"><code>Turtle</code><span>RDF triples</span></div>
              <div class="hp-format"><code>JSON-LD</code><span>Linked data</span></div>
              <div class="hp-format"><code>YAML</code><span>Native format</span></div>
              <div class="hp-format"><code>JSONL</code><span>Streaming</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        STANDARDS
        ════════════════════════════════════════════════════ -->
    <section class="hp-section hp-section-alt">
      <div class="hp-container">
        <div class="g-section-label">
          <span class="g-label-num">04</span>
          <span class="g-label-text">Standards Aligned</span>
        </div>
        <h2 class="hp-section-title">Built on <em>international standards</em>.</h2>
        <p class="g-lede" style="margin-bottom: 3rem;">Every entity in the Glossarist model maps to established terminology and knowledge organization standards.</p>

        <div class="g-card-grid g-card-grid-3">
          <a href="/reference/standards/iso-10241-1" class="g-card">
            <div class="g-card-accent"></div>
            <span class="hp-std-num">ISO 10241-1</span>
            <p>Terminology entries in standardized vocabularies</p>
          </a>
          <a href="/reference/standards/iso-704" class="g-card">
            <div class="g-card-accent"></div>
            <span class="hp-std-num">ISO 704</span>
            <p>Principles and methods for terminology work</p>
          </a>
          <a href="/reference/standards/iso-30042" class="g-card">
            <div class="g-card-accent"></div>
            <span class="hp-std-num">ISO 30042</span>
            <p>TBX terminology markup framework</p>
          </a>
          <a href="/reference/standards/iso-12620" class="g-card">
            <div class="g-card-accent"></div>
            <span class="hp-std-num">ISO 12620</span>
            <p>Data category registry for terminology</p>
          </a>
          <a href="/reference/standards/iso-25964" class="g-card">
            <div class="g-card-accent"></div>
            <span class="hp-std-num">ISO 25964</span>
            <p>Thesaurus interoperability with SKOS</p>
          </a>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        ADOPTERS
        ════════════════════════════════════════════════════ -->
    <section class="hp-section">
      <div class="hp-container">
        <div class="g-section-label">
          <span class="g-label-num">05</span>
          <span class="g-label-text">In Production</span>
        </div>
        <h2 class="hp-section-title">Trusted by <em>standards bodies</em>.</h2>
        <p class="g-lede" style="margin-bottom: 3rem;">Glossarist powers multilingual terminology registries for international standards organizations.</p>

        <div class="g-card-grid g-card-grid-2">
          <a href="https://isotc211.geolexica.org/" target="_blank" rel="noopener" class="g-card hp-user-card">
            <div class="g-card-accent"></div>
            <div class="hp-user-logo"><img src="/images/iso-red.svg" alt="ISO" /></div>
            <div>
              <strong>ISO/TC 211 Geolexica</strong>
              <p>1,507 concepts · 15 languages — Geographic information terminology</p>
            </div>
          </a>
          <a href="https://isotc204.geolexica.org/" target="_blank" rel="noopener" class="g-card hp-user-card">
            <div class="g-card-accent"></div>
            <div class="hp-user-logo"><img src="/images/iso-red.svg" alt="ISO" /></div>
            <div>
              <strong>ISO/TC 204 Geolexica</strong>
              <p>Intelligent transport systems terminology registry</p>
            </div>
          </a>
          <a href="https://osgeo.geolexica.org/" target="_blank" rel="noopener" class="g-card hp-user-card">
            <div class="g-card-accent"></div>
            <div class="hp-user-logo osgeo-wrap"><img src="/images/osgeo-logo.svg" alt="OSGeo" /></div>
            <div>
              <strong>OSGeo Geolexica</strong>
              <p>444 concepts — Open Source Geospatial Foundation terminology</p>
            </div>
          </a>
          <a href="https://www.oimlsmart.org/vocab/" target="_blank" rel="noopener" class="g-card hp-user-card">
            <div class="g-card-accent"></div>
            <div class="hp-user-logo">
              <img src="/images/oiml-logo-light.svg" alt="OIML" class="block dark:hidden" />
              <img src="/images/oiml-logo-dark.svg" alt="OIML" class="hidden dark:block" />
            </div>
            <div>
              <strong>OIML VIML</strong>
              <p>International Vocabulary of Legal Metrology — VIM editions 1968–2022</p>
            </div>
          </a>
          <a href="https://www.glossarist.org/iala-vocab/" target="_blank" rel="noopener" class="g-card hp-user-card">
            <div class="g-card-accent"></div>
            <div class="hp-user-logo">
              <img src="/images/iala-logo-light.svg" alt="IALA" class="block dark:hidden" />
              <img src="/images/iala-logo-dark.svg" alt="IALA" class="hidden dark:block" />
            </div>
            <div>
              <strong>IALA Vocabulary</strong>
              <p>International Association of Marine Aids to Navigation</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════
        CTA
        ════════════════════════════════════════════════════ -->
    <section class="hp-cta-section">
      <div class="hp-cta-inner">
        <h2 class="hp-cta-title">Start building your<br /><em>concept system</em>.</h2>
        <div class="hp-cta-actions">
          <a href="/docs/adopt/" class="g-cta">Adoption Guide →</a>
          <a href="/docs/software/desktop" class="g-cta g-cta-light">Download Desktop App</a>
          <a href="https://github.com/glossarist" class="g-cta g-cta-light" target="_blank" rel="noopener">Browse Source</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  font-family: var(--g-font-base);
}
.home :is(h1, h2, h3, h4) {
  font-family: var(--g-font-display);
  letter-spacing: -0.02em;
  border: none;
  margin: 0;
  padding: 0;
}
.home em {
  font-family: 'EB Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  color: var(--g-teal);
}
.home p { margin: 0; }

.hp-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
}

/* ─── Hero ─── */
.hp-hero {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 75% 25%, rgba(63, 182, 176, 0.18), transparent 55%),
    radial-gradient(ellipse at 15% 80%, rgba(69, 99, 153, 0.22), transparent 50%),
    linear-gradient(135deg, #1a2640 0%, #2d4164 35%, #1f3a4f 70%, #1a2f3e 100%);
  color: #e8eef5;
}
.hp-hero-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.35;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.hp-hero-inner {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
  padding: 8rem 1.5rem 6rem;
}
.hp-hero-logo-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.hp-hero-logo {
  width: 96px;
  height: auto;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.35));
}
.hp-hero-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
}
.hp-hero-greek {
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 1.5rem;
  font-style: italic;
  color: #b8f5ec;
}
.hp-hero-greek-sub {
  font-size: 0.8125rem;
  color: rgba(232, 238, 245, 0.55);
  letter-spacing: 0.04em;
}
.hp-hero-title {
  font-size: clamp(2.75rem, 7vw, 5.5rem) !important;
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: -0.04em;
  margin: 0 0 2rem !important;
  color: #f0f5f8;
}
.hp-hero-lede {
  font-size: clamp(1.0625rem, 1.6vw, 1.25rem);
  line-height: 1.65;
  max-width: 560px;
  color: rgba(232, 238, 245, 0.78);
  margin: 0 0 2.5rem;
}
.hp-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0;
}

/* ─── Rotating value-proposition taglines ─── */
.hp-motd {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
  font-family: var(--g-font-display);
}
.hp-motd-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(184, 245, 236, 0.45);
  white-space: nowrap;
}
.hp-motd-rotator {
  position: relative;
  display: inline-block;
  height: 1.4em;
  overflow: hidden;
}
.hp-motd-text {
  display: inline-block;
  font-family: 'EB Garamond', Georgia, serif;
  font-style: italic;
  font-size: 1.125rem;
  font-weight: 500;
  color: rgba(232, 238, 245, 0.85);
  white-space: nowrap;
}
.motd-fade-enter-active,
.motd-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.motd-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.motd-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ─── Language ticker ─── */
.hp-ticker {
  display: block;
  position: relative;
  overflow: hidden;
  max-width: 700px;
  margin-top: 0.25rem;
  /* Vertical padding so italic descenders (p, g, y, ы) aren't clipped */
  padding: 0.15em 0 0.35em;
  /* Fade edges */
  -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
}
.hp-ticker-track {
  display: inline-flex;
  align-items: center;
  gap: 0;
  white-space: nowrap;
  animation: hp-ticker-scroll 24s linear infinite;
  will-change: transform;
}
.hp-ticker-item {
  font-family: 'EB Garamond', Georgia, serif;
  font-style: italic;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 1.2;
  color: #7ee0d4;
  padding-right: 2.5rem;
  letter-spacing: -0.01em;
}
.hp-ticker-item::after {
  content: '·';
  margin-left: -1.25rem;
  color: rgba(126, 224, 212, 0.3);
  font-style: normal;
  font-size: 0.7em;
  vertical-align: middle;
}
.hp-ticker-item:last-child::after { content: ''; }
@keyframes hp-ticker-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.hp-ticker:hover .hp-ticker-track {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .hp-ticker-track {
    animation-play-state: paused;
  }
  /* Hover overrides reduced-motion — user explicitly wants to see the animation */
  .hp-ticker:hover .hp-ticker-track {
    animation-play-state: running;
  }
}

/* ─── Stats ─── */
.hp-stats {
  background: var(--g-navy);
  color: rgba(255, 255, 255, 0.9);
}
.hp-stats-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}
.hp-stat {
  text-align: center;
}
.hp-stat-num {
  display: block;
  font-family: var(--g-font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--g-teal);
}
.hp-stat-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.25rem;
}

/* ─── Section ─── */
.hp-section { background: var(--g-bg); }
.hp-section-alt {
  background: var(--g-bg-soft);
  border-top: 1px solid var(--g-divider);
  border-bottom: 1px solid var(--g-divider);
}
.hp-section-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem) !important;
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 1.5rem !important;
  color: var(--g-text-1);
}

/* ─── Pipeline ─── */
.hp-pipeline {
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
}
.hp-pipe-step {
  flex: 1;
  padding: 1.75rem;
  border-radius: 12px;
  background: var(--g-bg-soft);
  border: 1px solid var(--g-divider);
  transition: all 0.25s ease;
}
.hp-section .hp-pipe-step {
  background: var(--g-bg);
  border-color: var(--g-divider);
}
.hp-pipe-step:hover {
  border-color: var(--g-teal);
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.06);
}
.hp-pipe-num {
  font-family: var(--g-font-display);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--g-teal);
}
.hp-pipe-step h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0.5rem 0 0.6rem !important;
  color: var(--g-text-1);
}
.hp-pipe-step p {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--g-text-2);
  margin: 0 0 0.75rem;
}
.hp-pipe-link {
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: var(--g-font-display);
  color: var(--g-brand);
  text-decoration: none;
}
.hp-pipe-link:hover { text-decoration: underline; }
.hp-pipe-arrow {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  color: var(--g-text-3);
}

/* ─── Software cards ─── */
.hp-sw-card { padding: 1.75rem; }
.hp-sw-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.6rem;
}
.hp-sw-header h3 {
  font-size: 1.125rem !important;
  font-weight: 600;
  color: var(--g-text-1);
}
.hp-sw-version {
  font-family: var(--g-font-mono);
  font-size: 0.75rem;
  color: var(--g-text-3);
}
.hp-sw-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--g-divider);
}
.hp-sw-github {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--g-text-3);
  font-family: var(--g-font-display);
}

/* ─── Code showcase ─── */
.hp-code-showcase {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--g-divider);
  background: var(--g-bg-soft);
}
.hp-code-tabs {
  display: flex;
  border-bottom: 1px solid var(--g-divider);
  background: var(--g-bg);
}
.hp-code-tab {
  padding: 0.875rem 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-family: var(--g-font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--g-text-3);
  transition: all 0.15s;
}
.hp-code-tab:hover { color: var(--g-text-1); }
.hp-code-tab.active {
  color: var(--g-brand);
  border-bottom-color: var(--g-brand);
}
.hp-code-panel {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 0;
}
.hp-code-desc {
  padding: 1.75rem;
  border-right: 1px solid var(--g-divider);
}
.hp-code-desc h4 {
  font-size: 1rem !important;
  font-weight: 600;
  margin: 0 0 0.5rem !important;
  color: var(--g-text-1);
}
.hp-code-desc p {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--g-text-2);
  margin: 0 0 1rem;
}
.hp-code-block {
  margin: 0;
  padding: 1.75rem;
  font-family: var(--g-font-mono);
  font-size: 0.8125rem;
  line-height: 1.7;
  overflow-x: auto;
  background: var(--g-bg);
}
.hp-code-block :deep(.c-key) { color: var(--g-blue); font-weight: 600; }
.hp-code-block :deep(.c-str) { color: var(--g-teal); }
.hp-code-block :deep(.c-val) { color: var(--g-steel-mid); }
.hp-code-block :deep(.c-comment) { color: var(--g-text-3); font-style: italic; }

.hp-format-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.75rem;
}
.hp-format {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--g-bg);
  border: 1px solid var(--g-divider);
}
.hp-format code {
  font-family: var(--g-font-mono);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--g-teal);
}
.hp-format span {
  font-size: 0.75rem;
  color: var(--g-text-3);
}

/* ─── Standards ─── */
.hp-std-num {
  font-family: var(--g-font-display);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--g-teal);
  margin-bottom: 0.4rem;
  display: block;
}

/* ─── User cards ─── */
.hp-user-card {
  display: grid !important;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  align-items: center;
}
.hp-user-logo {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #fff;
  border: 1px solid var(--g-divider);
  flex-shrink: 0;
}
.hp-user-logo img { max-width: 80%; max-height: 80%; }
.hp-user-card strong {
  display: block;
  font-family: var(--g-font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--g-text-1);
  margin-bottom: 0.25rem;
}
.hp-user-card p {
  font-size: 0.875rem;
  color: var(--g-text-2);
}
.osgeo-wrap { background: #1a1a2e; }

/* ─── CTA ─── */
.hp-cta-section {
  background:
    radial-gradient(ellipse at 80% 20%, rgba(63, 182, 176, 0.08), transparent 50%),
    radial-gradient(ellipse at 10% 80%, rgba(69, 99, 153, 0.1), transparent 50%),
    linear-gradient(180deg, #1a2640 0%, #231a2f 100%);
  color: #e8eef5;
}
.hp-cta-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 6rem 1.5rem;
  text-align: center;
}
.hp-cta-title {
  font-size: clamp(2rem, 4vw, 3rem) !important;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #f0f5f8;
  margin: 0 0 2.5rem !important;
}
.hp-cta-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

/* ─── Responsive ─── */
@media (max-width: 900px) {
  .hp-pipeline { flex-direction: column; }
  .hp-pipe-arrow {
    transform: rotate(90deg);
    justify-content: center;
    padding: 0.25rem 0;
  }
  .hp-code-panel { grid-template-columns: 1fr; }
  .hp-code-desc { border-right: none; border-bottom: 1px solid var(--g-divider); }
  .hp-stats-inner { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
}
@media (max-width: 640px) {
  .hp-container { padding: 3.5rem 1.25rem; }
  .hp-hero-inner { padding: 5rem 1.25rem 4rem; }
  .hp-hero-logo-row { flex-wrap: wrap; }
  .hp-stats-inner { grid-template-columns: repeat(2, 1fr); }
  .hp-format-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
