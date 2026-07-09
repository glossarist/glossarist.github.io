import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        '.vitepress/data/**/*.ts',
        '.vitepress/theme/components/**/*.vue',
        'scripts/**/*.mjs',
      ],
      exclude: [
        '.vitepress/data/schemas-bundled.json',
        '.vitepress/dist/**',
        '.vitepress/cache/**',
        'node_modules/**',
      ],
    },
  },
})
