import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{js,mjs,jsx,vue}"],
  },
  {
    name: "app/files-to-ignore",
    ignores: ["dist/**", "src-tauri/**", "node_modules/**"],
  },

  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],

  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["*.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    rules: {
      // Vue
      "vue/multi-word-component-names": "off",
      "vue/valid-v-slot": "off",
      "vue/block-order": ["error", { order: ["template", "script", "style"] }],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/no-unused-vars": "error",

      // JavaScript
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "error",
      "prefer-const": "error",
      "no-var": "error",

      // Imports
      "sort-imports": ["error", { ignoreCase: true, ignoreDeclarationSort: true }],
    },
  },
];
