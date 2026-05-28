# 09 - Desktop download page with auto-detection

Port the Desktop.tsx download experience to a Vue component in VitePress.

## Current behavior

`Desktop.tsx` (React):
1. Fetches latest release from GitHub API via Octokit
2. Detects user OS (macOS/Windows) from user agent
3. Shows direct download link for the detected OS
4. Falls back to GitHub releases page
5. Shows version number, release date (relative + absolute), and first paragraph of release notes

## New: ReleaseDownloader.vue

Port as a Vue 3 component:

```vue
<template>
  <div class="release-downloader">
    <button v-if="specificDLLink" @click="download">
      Download for {{ userOS }}
    </button>
    <a v-else :href="releasesURL">View all releases</a>
    <p v-if="release">
      Version {{ release.name }} • {{ formattedDate }}
    </p>
  </div>
</template>
```

### Implementation notes

- Fetch releases at **client-side** (not build-time like current approach)
- Use `fetch()` directly against GitHub API (no Octokit dependency)
- Cache in localStorage with TTL (1 hour)
- OS detection from `navigator.userAgent`
- No server-side rendering needed — use `onMounted` lifecycle

### Asset naming convention

From current code:
- macOS: `glossarist-desktop-{version}.dmg`
- Windows: `glossarist-desktop-{version}-portable.exe`

### Page: `/docs/software/desktop.md`

```md
# Glossarist Desktop

Manage a concept system from an app that runs on your computer.

<ReleaseDownloader />

## Features
...

## Get started

Learn how to [set up the application](/docs/desktop/getting-started/).
```
