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
        'src/data/**/*.ts',
        'src/components/**/*.vue',
        'src/components/**/*.astro',
        'src/layouts/**/*.astro',
        'scripts/**/*.mjs',
      ],
      exclude: [
        'src/data/schemas-bundled.json',
        'dist/**',
        'node_modules/**',
        '.astro/**',
      ],
    },
  },
})
