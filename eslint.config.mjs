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
  // Rules for source files in ./src
  {
    files: ["./src/**/*.js", "./src/**/*.mjs", "./src/**/*.ts", "./src/**/*.tsx"],
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

      // Console usage in source code
      "no-console": "error",

      // Line length
      "max-len": ["warn", { code: 180 }],

      // No multiple empty lines
      "no-multiple-empty-lines": ["error", { max: 3, maxEOF: 3 }],
    },
  },
  // Rules for test files in ./tests
  {
    files: ["./tests/**/*.js", "./tests/**/*.mjs", "./tests/**/*.ts", "./tests/**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // Code quality
      "no-unused-vars": "off",
      "no-var": "error",
      "prefer-const": "error",

      // Style consistency
      "indent": "off",
      "quotes": "off",
      "semi": "off",

      // Allow console in test files
      "no-console": "off",

      // More lenient line length for tests
      "max-len": ["warn", { code: 200 }],

      // No trailing spaces
      "no-trailing-spaces": "off",

      // No multiple empty lines
      "no-multiple-empty-lines": "off",

      // Test-specific rules
      "no-magic-numbers": "off", // Allow magic numbers in tests
    },
  },
  // Fallback rules for other files
  {
    files: ["**/*.js", "**/*.mjs", "**/*.ts", "**/*.tsx"],
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
      "indent": "off",
      "quotes": "off",
      "semi": "off",

      // Allow console in config files
      "no-console": "off",

      // Line length
      "max-len": ["warn", { code: 180 }],

      // No trailing spaces
      "no-trailing-spaces": "off",

      // No multiple empty lines
      "no-multiple-empty-lines": "off",
    },
  },
];
