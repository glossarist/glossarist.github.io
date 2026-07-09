import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import pagefind from 'astro-pagefind'

export default defineConfig({
  site: 'https://www.glossarist.org',
  integrations: [vue(), mdx(), sitemap(), pagefind()],
  trailingSlash: 'never',
  build: { format: 'file' },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@data': '/src/data',
        '@components': '/src/components',
      },
    },
  },
})
