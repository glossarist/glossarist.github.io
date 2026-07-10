#!/usr/bin/env node
// Normalize VitePress-style `::: type` admonition blocks by adding blank lines
// around the markers so the markdown parser produces separate paragraph nodes.
// Without blank lines, the entire `::: type\ncontent\n:::` is one paragraph,
// and we can't transform it via remark/rehype plugins.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CONTENT_DIR = resolve(ROOT, 'src', 'content')

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, files)
    else if (entry.endsWith('.md') || entry.endsWith('.mdx')) files.push(full)
  }
  return files
}

const ADMON_OPEN = /^:::\s*(tip|info|warning|danger|details)(?:\s+.*)?$/
const ADMON_CLOSE = /^:::\s*$/

function normalize(content) {
  const lines = content.split('\n')
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const prevBlank = out.length === 0 || out[out.length - 1].trim() === ''
    const isOpen = ADMON_OPEN.test(line.trim())
    const isClose = ADMON_CLOSE.test(line.trim())
    // Insert blank line before opening/closing marker if missing
    if ((isOpen || isClose) && !prevBlank) {
      out.push('')
    }
    out.push(line)
    // Insert blank line after opening/closing marker if next line isn't blank
    const nextLine = lines[i + 1]
    if ((isOpen || isClose) && nextLine !== undefined && nextLine.trim() !== '') {
      out.push('')
    }
  }
  return out.join('\n')
}

const files = walk(CONTENT_DIR)
let touched = 0
for (const file of files) {
  const original = readFileSync(file, 'utf-8')
  const normalized = normalize(original)
  if (normalized !== original) {
    writeFileSync(file, normalized)
    touched++
    console.log(`Normalized: ${file.replace(ROOT + '/', '')}`)
  }
}
console.log(`Done. ${touched} of ${files.length} files modified.`)
