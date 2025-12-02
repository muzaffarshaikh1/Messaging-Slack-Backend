import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

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
