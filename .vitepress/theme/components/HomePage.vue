<script setup lang="ts">
import { premierProjects } from '../../data/projects'
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <img src="/logo-glossarist.svg" alt="Glossarist" class="hero-logo" />
      <h1 class="hero-title">Glossarist</h1>
      <p class="hero-tagline">
        The open-source framework for multi-language concept systems
      </p>
      <p class="hero-sub">
        Model, manage, and publish terminology registries aligned with
        ISO&nbsp;10241, 704, 30042, 12620, and 25964
      </p>
      <div class="hero-actions">
        <a href="/docs/adopt/" class="btn btn-primary">Get Started</a>
        <a href="https://github.com/glossarist" class="btn btn-secondary">GitHub &rarr;</a>
      </div>
    </section>

    <!-- Ecosystem -->
    <section class="section">
      <div class="section-header">
        <h2>The Ecosystem</h2>
        <p>End-to-end tools for every stage of terminology management</p>
      </div>
      <div class="eco-grid">
        <div v-for="project in premierProjects" :key="project.name" class="eco-card">
          <div class="eco-card-icon" :class="project.category === 'Core' ? 'core' : 'tool'">
            {{ project.category === 'Core' ? '{ }' : '#' }}
          </div>
          <div class="category">{{ project.category }}</div>
          <h3>
            {{ project.name }}
            <span v-if="project.version" class="version">{{ project.version }}</span>
          </h3>
          <p>{{ project.description }}</p>
          <div class="links">
            <a :href="project.docs || `/docs/software/${project.name}`" class="btn btn-sm btn-secondary">Docs</a>
            <a :href="project.github" class="btn btn-sm btn-secondary" target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Concept Model Showcase -->
    <section class="section">
      <div class="section-header">
        <h2>The Concept Model</h2>
        <p>A rich domain model for structured terminology aligned with international standards</p>
      </div>
      <div class="model-showcase">
        <div class="model-preview">
          <div class="model-tree">
            <div class="model-tree-row">
              <span class="model-dot concept"></span>
              <span class="model-tree-label">ManagedConcept</span>
              <span class="model-tree-type">24 classes</span>
            </div>
            <div class="model-connector"></div>
            <div class="model-tree-row indent-1">
              <span class="model-dot concept"></span>
              <span class="model-tree-label">LocalizedConcept</span>
              <span class="model-tree-type">per language</span>
            </div>
            <div class="model-tree-row indent-1">
              <span class="model-dot designation"></span>
              <span class="model-tree-label">Designation</span>
              <span class="model-tree-type">7 types</span>
            </div>
            <div class="model-tree-row indent-2">
              <span class="model-dot designation"></span>
              <span class="model-tree-label">Expression &middot; Abbreviation &middot; Symbol</span>
              <span class="model-tree-type"></span>
            </div>
            <div class="model-tree-row indent-1">
              <span class="model-dot relationship"></span>
              <span class="model-tree-label">Relationship</span>
              <span class="model-tree-type">32 types</span>
            </div>
            <div class="model-tree-row indent-1">
              <span class="model-dot source"></span>
              <span class="model-tree-label">ConceptSource</span>
              <span class="model-tree-type">provenance</span>
            </div>
            <div class="model-tree-row">
              <span class="model-dot concept"></span>
              <span class="model-tree-label">ConceptCollection</span>
              <span class="model-tree-type">registry</span>
            </div>
          </div>
          <a href="/docs/model/ontology" class="btn btn-primary">Explore the Ontology</a>
        </div>
      </div>
    </section>

    <!-- Standards -->
    <section class="section">
      <div class="section-header">
        <h2>Built on Standards</h2>
        <p>Every aspect of Glossarist maps to established terminology and knowledge organization standards</p>
      </div>
      <div class="standards-grid">
        <span class="standard-badge"><code>ISO 10241-1</code> Terminology entries</span>
        <span class="standard-badge"><code>ISO 704</code> Principles &amp; methods</span>
        <span class="standard-badge"><code>ISO 30042</code> TBX format</span>
        <span class="standard-badge"><code>ISO 12620</code> Data categories</span>
        <span class="standard-badge"><code>ISO 25964</code> Thesauri</span>
        <span class="standard-badge"><code>OWL 2</code> Ontology</span>
        <span class="standard-badge"><code>SHACL</code> Validation</span>
        <span class="standard-badge"><code>SKOS/XL</code> Knowledge org</span>
      </div>
    </section>

    <!-- Features -->
    <section class="section">
      <div class="section-header">
        <h2>Why Glossarist?</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon fi-multilang">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>
          </div>
          <h4>Multi-language by design</h4>
          <p>Concepts with definitions, terms, and notes in any number of languages. A single source of truth across all localizations.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon fi-standards">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h4>ISO standards alignment</h4>
          <p>Every entity maps to ISO 10241-1, 704, 30042, 12620, and 25964 — ready for standards body adoption.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon fi-formats">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <h4>Universal interchange</h4>
          <p>Export to TBX, SKOS, Turtle, JSON-LD, and YAML. Import from existing terminology datasets.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon fi-model">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </div>
          <h4>Rich concept model</h4>
          <p>Designations, relationships, sources, grammar, revision history — every aspect of a concept system, modeled precisely.</p>
        </div>
      </div>
    </section>

    <!-- Used By -->
    <section class="section">
      <div class="section-header">
        <h2>Trusted By</h2>
      </div>
      <div class="users-grid">
        <a href="https://isotc211.geolexica.org/" target="_blank" rel="noopener">
          <img src="/images/iso-symbol.svg" alt="ISO" />
          Geolexica for ISO/TC 211 MLGT
        </a>
      </div>
    </section>
  </div>
</template>
