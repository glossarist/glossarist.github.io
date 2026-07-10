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
  // 'directory' format generates /path/index.html, which static hosts
  // (GitHub Pages) serve at BOTH /path and /path/. This matches the
  // markdown content's existing URL convention (directory links use
  // trailing slashes). 'ignore' lets us match either form at build time.
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeAdmonitions],
    }),
    // shikiConfig is deprecated but the unified() factory doesn't expose it yet
    // (only remarkPlugins/rehypePlugins/remarkRehype/gfm/smartypants). Without
    // this, every code block uses the single default 'github-dark' theme and
    // renders dark even in light mode.
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
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
