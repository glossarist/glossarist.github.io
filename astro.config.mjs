import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import pagefind from 'astro-pagefind'
import tailwindcss from '@tailwindcss/vite'
import { unified } from '@astrojs/markdown-remark'
import rehypeAdmonitions from './scripts/rehype-admonitions.mjs'

export default defineConfig({
  site: 'https://www.glossarist.org',
  integrations: [vue(), mdx(), sitemap(), pagefind()],
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    processor: unified({ rehypePlugins: [rehypeAdmonitions] }),
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
        '@data': '/src/data',
        '@components': '/src/components',
      },
    },
  },
})
