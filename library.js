import baseConfig from "./index.js";

/**
 * ESLint configuration for Fjell library packages
 * Extends the base config with library-specific rules like import restrictions
 */
export default [
  ...baseConfig,
  {
    // Stricter rules for library source code
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    // More relaxed rules for tests
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
      "max-lines": ["warn", 10000], // Tests can be longer
    },
  },
  {
    // Allow examples to import from src and use relative imports
    files: ["examples/**/*.ts", "examples/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
      "max-lines": ["warn", 2000], // Examples should be concise
    },
  },
];
