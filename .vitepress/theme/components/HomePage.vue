<script setup lang="ts">
import { premierProjects } from '../../data/projects'
</script>

<template>
  <div class="home-hero">
    <img src="/logo-glossarist.svg" alt="Glossarist Logo" class="home-hero-logo" />
    <h1>Glossarist</h1>
    <p>
      Open-source software for maintaining multi-language concept systems.
      Manage terminology registries aligned with ISO standards.
    </p>
    <div class="home-hero-actions">
      <a href="/docs/software/desktop" class="vp-button medium brand">Download Desktop</a>
      <a href="/docs/adopt/" class="vp-button medium alt">Adopt Glossarist</a>
      <a href="https://github.com/glossarist" class="vp-button medium alt">View on GitHub</a>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Software</h2>
    <p class="section-description">
      The Glossarist ecosystem provides tools for every stage of terminology management.
    </p>
    <div class="projects-grid">
      <div v-for="project in premierProjects" :key="project.name" class="project-card">
        <h3>
          {{ project.name }}
          <span v-if="project.version" class="version">{{ project.version }}</span>
        </h3>
        <p>{{ project.description }}</p>
        <div class="links">
          <a :href="project.github" class="primary" target="_blank" rel="noopener">GitHub</a>
          <a v-if="project.docs" :href="project.docs" class="secondary" target="_blank" rel="noopener">Docs</a>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Used by</h2>
    <div class="users-list">
      <a href="https://isotc211.geolexica.org/" target="_blank" rel="noopener">
        <img src="/images/iso-symbol.svg" alt="ISO" />
        Geolexica for ISO/TC 211 MLGT
      </a>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Features</h2>
    <div class="features-grid">
      <div class="feature-card">
        <h4>Multi-language</h4>
        <p>Concepts with definitions, terms, and notes in any number of languages.</p>
      </div>
      <div class="feature-card">
        <h4>ISO Standards</h4>
        <p>Aligned with ISO 10241-1, 704, 30042, 12620, and 25964.</p>
      </div>
      <div class="feature-card">
        <h4>RDF &amp; SKOS</h4>
        <p>Export to TBX, SKOS, Turtle, JSON-LD, and other machine formats.</p>
      </div>
      <div class="feature-card">
        <h4>Concept Model</h4>
        <p>Rich domain model with designations, relationships, sources, and revision history.</p>
      </div>
    </div>
  </div>
</template>
