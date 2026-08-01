#!/usr/bin/env node
/**
 * Bundle budget checker (TODO.refactor/08).
 *
 * Walks dist/_astro/*.js and reports total size. Compares against
 * perf-budget.json. Exits non-zero on overrun.
 *
 * Usage: node scripts/check-bundle-budget.mjs [dist-dir] [budget-file]
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const distDir = process.argv[2] || resolve(process.cwd(), 'dist')
const budgetFile = process.argv[3] || resolve(process.cwd(), 'perf-budget.json')

if (!existsSync(budgetFile)) {
  console.error(`Budget file not found: ${budgetFile}`)
  process.exit(1)
}

const budget = JSON.parse(readFileSync(budgetFile, 'utf-8'))

// Collect all JS assets from dist/_astro/
const astroDir = join(distDir, '_astro')
if (!existsSync(astroDir)) {
  console.log('No _astro/ directory — skipping bundle budget check (dev mode?)')
  process.exit(0)
}

const jsFiles = readdirSync(astroDir)
  .filter(f => f.endsWith('.js'))
  .map(f => ({
    name: f,
    sizeKb: statSync(join(astroDir, f)).size / 1024,
    gzipKb: 0,
  }))

// Approximate gzipped size (JS compresses ~70%)
for (const f of jsFiles) {
  f.gzipKb = Math.round(f.sizeKb * 0.3 * 10) / 10
}

const totalGzip = jsFiles.reduce((sum, f) => sum + f.gzipKb, 0)
const maxGlobal = budget.global?.maxTotalAssetsKb ?? Infinity

console.log(`\nBundle budget report`)
console.log(`====================`)
console.log(`Total JS assets: ${jsFiles.length} files`)
console.log(`Total gzipped:   ${totalGzip.toFixed(1)} KB / ${maxGlobal} KB budget`)
console.log()

if (totalGzip > maxGlobal) {
  console.error(`❌ Global budget exceeded: ${totalGzip.toFixed(1)} KB > ${maxGlobal} KB`)
  process.exit(1)
}

console.log(`✓ Within global budget`)
process.exit(0)
