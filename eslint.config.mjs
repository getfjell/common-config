import js from "@eslint/js";

/**
 * ESLint configuration for the Fjell ESLint config package itself
 * This is a JavaScript project, so we use basic JS rules
 */
export default [
  js.configs.recommended,
  {
    ignores: ["**/node_modules", "**/dist"],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // Code quality
      "no-unused-vars": "error",
      "no-var": "error",
      "prefer-const": "error",

      // Style consistency
      "indent": ["warn", 2],
      "quotes": ["warn", "double"],
      "semi": ["error", "always"],

      // Allow console in config files
      "no-console": "off",

      // Line length
      "max-len": ["warn", { code: 120 }],

      // No trailing spaces
      "no-trailing-spaces": "error",

      // No multiple empty lines
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
    },
  },
];
