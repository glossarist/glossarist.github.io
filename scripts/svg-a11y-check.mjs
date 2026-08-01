#!/usr/bin/env node
/**
 * SVG a11y check (TODO.refactor/12).
 * Verifies each SVG has <title>, <desc>, and role="img".
 */
import { readFileSync } from 'node:fs'

const files = process.argv.slice(2)
let failed = false

for (const f of files) {
  const content = readFileSync(f, 'utf-8')
  const issues = []
  if (!content.match(/<title[^>]*>/)) issues.push('missing <title>')
  if (!content.match(/<desc[^>]*>/)) issues.push('missing <desc>')
  if (!content.match(/role="img"/)) issues.push('missing role="img"')
  if (issues.length > 0) {
    console.error(`${f}: ${issues.join(', ')}`)
    failed = true
  }
}

if (failed) process.exit(1)
