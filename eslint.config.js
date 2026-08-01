// ESLint config (TODO.refactor/25)
// Enforces: no-explicit-any, consistent-type-imports, no-unused-vars,
// no-console (warnings), no-eval, eqeqeq, Vue 3 recommended.
//
// Install: npm install --save-dev eslint @eslint/js typescript-eslint eslint-plugin-vue
// Run:     npm run lint
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'public/**',
      'src/components/HomePage.vue.bak',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,vue,astro}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-eval': 'error',
      'no-new-func': 'error',
      'eqeqeq': 'error',
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
