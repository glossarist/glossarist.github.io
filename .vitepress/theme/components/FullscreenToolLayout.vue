<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="tool-page">
    <header class="tool-header">
      <div class="tool-header-inner">
        <h1 class="tool-title">{{ title }}</h1>
        <p class="tool-desc">{{ description }}</p>
        <nav class="tool-nav">
          <slot name="nav" />
        </nav>
      </div>
    </header>
    <div class="tool-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tool-page {
  min-height: calc(100vh - var(--vp-nav-height, 56px));
  display: flex;
  flex-direction: column;
}

.tool-header {
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.tool-header-inner {
  max-width: 90rem;
  margin: 0 auto;
  padding: 1rem 1.5rem 1rem;
}

.tool-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

.tool-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0.375rem 0 0;
  max-width: 48rem;
}

.tool-nav {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.tool-nav :deep(a) {
  font-size: 0.8125rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}

.tool-nav :deep(a:hover) {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.tool-nav :deep(span) {
  font-size: 0.8125rem;
  color: var(--vp-c-text-3);
}

.tool-body {
  flex: 1;
  max-width: 90rem;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .tool-header-inner { padding: 0.875rem 1rem; }
  .tool-title { font-size: 1.125rem; }
}
</style>
