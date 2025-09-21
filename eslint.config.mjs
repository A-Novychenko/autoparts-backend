import { defineConfig } from 'eslint-define-config';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['node_modules', 'dist', '.next', 'coverage'],
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'script', // CommonJS
      },
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
]);
