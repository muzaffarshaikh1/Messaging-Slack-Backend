import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config.js'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js
    },
    rules: {},
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node
    }
  }
])
