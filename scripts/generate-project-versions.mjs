#!/usr/bin/env node
/**
 * Generate src/data/project-versions.json from the SSOT: each project's
 * latest GitHub release. Never hand-copy version strings into projects.ts —
 * the static `version` there is only the offline fallback for builds that
 * cannot reach the API.
 *
 * Reads:  src/data/projects.ts (slugs + github URLs + fallback versions)
 * Writes: src/data/project-versions.json
 *   { [slug]: { version, htmlUrl, fetchedAt, source: 'github'|'fallback' } }
 */
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUTPUT = resolve(ROOT, 'src', 'data', 'project-versions.json');

const { projects } = await import(pathToFileURL(resolve(ROOT, 'src', 'data', 'projects.ts')).href);

const headers = { 'User-Agent': 'glossarist.org-build', Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

function repoFromGithub(url) {
  const m = String(url || '').match(/github\.com\/([^/]+)\/([^/?#]+)/);
  return m ? `${m[1]}/${m[2].replace(/\.git$/, '')}` : null;
}

async function latestRelease(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = await res.json();
  if (!body.tag_name) throw new Error('no tag_name');
  return { version: body.tag_name, htmlUrl: body.html_url };
}

const out = {};
for (const project of projects) {
  const repo = repoFromGithub(project.github);
  if (!repo) {
    out[project.slug] = { version: project.version, htmlUrl: project.github, fetchedAt: null, source: 'fallback' };
    continue;
  }
  try {
    const release = await latestRelease(repo);
    out[project.slug] = { ...release, fetchedAt: new Date().toISOString(), source: 'github' };
  } catch (e) {
    console.warn(`  ${project.slug}: GitHub fetch failed (${e.message}); using fallback ${project.version}`);
    out[project.slug] = { version: project.version, htmlUrl: project.github, fetchedAt: null, source: 'fallback' };
  }
}

writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote ${OUTPUT} (${Object.values(out).filter(v => v.source === 'github').length}/${projects.length} from GitHub)`);
