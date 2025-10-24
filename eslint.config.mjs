import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
    rules: {
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['warn', 'single'],
      '@stylistic/ts/semi': ['error', 'always'],
      '@stylistic/ts/object-curly-spacing': ['warn', 'always'],
      'max-len': ['error', { 'code': 80, 'tabWidth': 2 }]
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js, '@stylistic/ts': stylisticTs },
    extends: ['js/recommended'],
  },
  tseslint.configs.recommended,
]);
