import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ReleaseDownloader from '../../.vitepress/theme/components/ReleaseDownloader.vue'

type ReleasePayload = {
  name: string
  assets: Array<{ name: string; browser_download_url: string }>
  published_at: string
  body: string
}

const sampleRelease: ReleasePayload = {
  name: 'v1.6.40',
  assets: [
    { name: 'glossarist-desktop-v1.6.40.dmg', browser_download_url: 'https://example.com/dmg' },
    { name: 'glossarist-desktop-v1.6.40-portable.exe', browser_download_url: 'https://example.com/exe' },
    { name: 'glossarist-desktop-v1.6.40.snap', browser_download_url: 'https://example.com/snap' },
  ],
  published_at: '2026-07-01T00:00:00Z',
  body: 'release notes',
}

describe('ReleaseDownloader', () => {
  let originalFetch: typeof fetch
  let originalUA: string
  let storage: Record<string, string> = {}

  beforeEach(() => {
    originalFetch = globalThis.fetch
    originalUA = navigator.userAgent
    storage = {}
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => storage[k] ?? null,
      setItem: (k: string, v: string) => { storage[k] = v },
      removeItem: (k: string) => { delete storage[k] },
      clear: () => { storage = {} },
    })
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    Object.defineProperty(navigator, 'userAgent', { value: originalUA, configurable: true })
    vi.unstubAllGlobals()
  })

  function mockFetch(payload: ReleasePayload) {
    globalThis.fetch = (async () => ({
      ok: true,
      json: async () => payload,
    })) as unknown as typeof fetch
  }

  function setOS(os: 'macOS' | 'Windows' | 'Linux') {
    const ua = os === 'macOS' ? 'Mozilla/5.0 Macintosh'
      : os === 'Windows' ? 'Mozilla/5.0 Windows NT 10.0'
      : 'Mozilla/5.0 X11; Ubuntu Linux'
    Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true })
  }

  it('renders loading state initially', () => {
    globalThis.fetch = (async () => ({ ok: true, json: async () => sampleRelease })) as unknown as typeof fetch
    setOS('macOS')
    const wrapper = mount(ReleaseDownloader)
    expect(wrapper.text()).toContain('Checking for latest release')
  })

  it('shows OS-specific download link after fetch on macOS', async () => {
    mockFetch(sampleRelease)
    setOS('macOS')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    const link = wrapper.find('a.download-btn')
    expect(link.attributes('href')).toBe('https://example.com/dmg')
    expect(link.text()).toContain('macOS')
  })

  it('shows OS-specific download link for Windows', async () => {
    mockFetch(sampleRelease)
    setOS('Windows')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    const link = wrapper.find('a.download-btn')
    expect(link.attributes('href')).toBe('https://example.com/exe')
    expect(link.text()).toContain('Windows')
  })

  it('shows OS-specific download link for Ubuntu Linux', async () => {
    mockFetch(sampleRelease)
    setOS('Linux')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    const link = wrapper.find('a.download-btn')
    expect(link.attributes('href')).toBe('https://example.com/snap')
    expect(link.text()).toContain('Ubuntu Linux')
  })

  it('falls back to releases page when OS-specific asset is missing', async () => {
    mockFetch({
      ...sampleRelease,
      assets: [{ name: 'some-other-asset.zip', browser_download_url: 'https://example.com/other' }],
    })
    setOS('macOS')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    const link = wrapper.find('a.download-btn')
    expect(link.attributes('href')).toBe('https://github.com/glossarist/glossarist-desktop/releases')
    expect(link.text()).toBe('Download')
  })

  it('falls back to releases page on fetch error', async () => {
    globalThis.fetch = (async () => { throw new Error('network') }) as unknown as typeof fetch
    setOS('macOS')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    const link = wrapper.find('a.download-btn')
    expect(link.attributes('href')).toBe('https://github.com/glossarist/glossarist-desktop/releases')
    expect(link.text()).toContain('View Releases on GitHub')
  })

  it('caches release in localStorage with a TTL', async () => {
    mockFetch(sampleRelease)
    setOS('macOS')
    mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    const cached = storage['glossarist-latest-release']
    expect(cached).toBeDefined()
    const parsed = JSON.parse(cached)
    expect(parsed.data.name).toBe('v1.6.40')
    expect(parsed.timestamp).toBeTypeOf('number')
    expect(parsed.timestamp).toBeLessThanOrEqual(Date.now())
  })

  it('uses cached release when within TTL', async () => {
    const freshTimestamp = Date.now() - 1000 // 1s ago
    storage['glossarist-latest-release'] = JSON.stringify({ data: sampleRelease, timestamp: freshTimestamp })
    const fetchSpy = vi.fn()
    globalThis.fetch = fetchSpy as unknown as typeof fetch
    setOS('macOS')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    expect(fetchSpy).not.toHaveBeenCalled()
    const link = wrapper.find('a.download-btn')
    expect(link.attributes('href')).toBe('https://example.com/dmg')
  })

  it('re-fetches when cache is older than 1 hour', async () => {
    const staleTimestamp = Date.now() - 2 * 60 * 60 * 1000 // 2h ago
    storage['glossarist-latest-release'] = JSON.stringify({ data: sampleRelease, timestamp: staleTimestamp })
    mockFetch({ ...sampleRelease, name: 'v1.6.41' })
    setOS('macOS')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    expect(wrapper.text()).toContain('v1.6.41')
  })

  it('displays version name and publication date', async () => {
    mockFetch(sampleRelease)
    setOS('macOS')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    const text = wrapper.text()
    expect(text).toContain('Version v1.6.40')
    expect(text).toMatch(/July 2026/)
  })

  it('links to all releases', async () => {
    mockFetch(sampleRelease)
    setOS('macOS')
    const wrapper = mount(ReleaseDownloader)
    await flushPromises()
    await new Promise(r => setTimeout(r, 10))
    const allReleasesLinks = wrapper.findAll('a').filter(a => a.text().match(/all releases/i))
    expect(allReleasesLinks.length).toBeGreaterThan(0)
    expect(allReleasesLinks[0].attributes('href')).toBe('https://github.com/glossarist/glossarist-desktop/releases')
  })
})
