<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { GitHubRelease } from '../../data/types'
import { formatMonthYear } from '../../data/format'

type OS = 'macOS' | 'Windows' | 'Ubuntu Linux'

const release = ref<GitHubRelease | null>(null)
const userOS = ref<OS | undefined>(undefined)
const loading = ref(true)
const error = ref(false)

function getSpecificDLLink(assets: GitHubRelease['assets'], releaseName: string, os: OS): string | undefined {
  let expected: string
  if (os === 'Windows') expected = `glossarist-desktop-${releaseName}-portable.exe`
  else if (os === 'macOS') expected = `glossarist-desktop-${releaseName}.dmg`
  else expected = `glossarist-desktop-${releaseName}.snap`

  const asset = assets.find(a => a.name === expected)
  return asset?.browser_download_url
}

const specificDLLink = ref<string | undefined>(undefined)
const releasesURL = 'https://github.com/glossarist/glossarist-desktop/releases'

onMounted(async () => {
  // OS detection
  const ua = navigator.userAgent
  if (ua.indexOf('Mac') >= 0) userOS.value = 'macOS'
  else if (ua.indexOf('Windows') >= 0) userOS.value = 'Windows'
  else if (ua.indexOf('Ubuntu') >= 0 || ua.indexOf('Linux') >= 0) userOS.value = 'Ubuntu Linux'

  // Fetch release — try localStorage cache first
  const cacheKey = 'glossarist-latest-release'
  const cacheTTL = 60 * 60 * 1000 // 1 hour

  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < cacheTTL) {
        release.value = data
      }
    }

    if (!release.value) {
      const res = await fetch('https://api.github.com/repos/glossarist/glossarist-desktop/releases/latest')
      if (!res.ok) throw new Error('GitHub API error')
      const data = await res.json()
      release.value = {
        name: data.name,
        assets: data.assets.map((a: GitHubRelease['assets'][0]) => ({ name: a.name, browser_download_url: a.browser_download_url })),
        published_at: data.published_at,
        body: data.body,
      }
      localStorage.setItem(cacheKey, JSON.stringify({ data: release.value, timestamp: Date.now() }))
    }

    if (release.value && userOS.value) {
      specificDLLink.value = getSpecificDLLink(release.value.assets, release.value.name, userOS.value)
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="release-downloader">
    <div v-if="loading">Checking for latest release…</div>

    <div v-else-if="error">
      <a :href="releasesURL" class="download-btn">View Releases on GitHub</a>
    </div>

    <div v-else>
      <a v-if="userOS && specificDLLink" :href="specificDLLink" class="download-btn">
        Download for {{ userOS }}
      </a>
      <a v-else :href="releasesURL" class="download-btn">Download</a>

      <div class="release-info" v-if="release">
        <strong v-if="release.name">Version {{ release.name }}</strong>
        <span v-if="release.published_at"> &middot; {{ formatMonthYear(release.published_at) }}</span>
        <br />
        <a :href="releasesURL" style="font-size: 0.85rem;">View all releases</a>
      </div>
    </div>
  </div>
</template>
