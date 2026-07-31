# 25 — ESLint + Prettier config

## Status
☐ Not started

## Motivation

No ESLint config exists. TypeScript compiler catches type errors but not:
- `any` usage (allowed by default)
- Unused variables
- `console.log` left in production code
- Inconsistent import ordering
- Missing return types on public functions
- `eval` / `new Function` usage
- And dozens of other code-quality rules

No Prettier config exists either — formatting is inconsistent across files (some 2-space indent, some 4-space; some single quotes, some double).

## Scope

Add ESLint + Prettier configs that enforce the project's quality rules:

### ESLint config

```js
// eslint.config.js
import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,vue,astro}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': ts },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-eval': 'error',
      'no-new-func': 'error',
      eqeqeq: 'error',
    },
  },
  {
    files: ['**/*.vue'],
    plugins: { vue },
    rules: { ...vue.configs['vue3-recommended'].rules },
  },
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**'],
  },
]
```

### Prettier config

```json
// .prettierrc.json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-astro"]
}
```

### CI integration

Add to `build.yml`:
```yaml
- name: Lint
  run: npm run lint
```

### npm scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

## Acceptance criteria

- [ ] `eslint.config.js` exists
- [ ] `.prettierrc.json` exists
- [ ] `npm run lint` passes with zero errors (warnings allowed initially)
- [ ] `npm run format:check` passes
- [ ] CI runs lint as a step
- [ ] Pre-commit hook (TODO 12) runs lint on staged files

## Why this matters

- **Automated quality enforcement** — catches regressions before review
- **Consistency** — formatting uniform across files
- **Aligns with TODOs 05, 06** — alias usage + no-`any` rules are machine-enforced

## Risk

Medium. Initial lint run will likely flag dozens of files. Need a "cleanup" PR or batch-suppress with `// eslint-disable` comments where intentional.

## Dependencies

- TODO 12 (pre-commit hooks) — natural pairing
