import baseConfig from "./index.js";
import importPlugin from "eslint-plugin-import";

/**
 * ESLint configuration for Fjell library packages
 * Extends the base config with library-specific rules like import restrictions
 */
export default [
  ...baseConfig,
  {
    plugins: {
      import: importPlugin,
    },
  },
  {
    // Stricter rules for library source code
    files: ["src/**/*.ts", "src/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
      // Don't require extensions for TypeScript files
      "import/extensions": "off",
    },
  },
  {
    // More relaxed rules for tests
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
      "max-lines": ["warn", 10000], // Tests can be longer
      // Don't require extensions for TypeScript files
      "import/extensions": "off",
    },
  },
  {
    // Allow examples to import from src and use relative imports
    files: ["examples/**/*.ts", "examples/**/*.tsx"],
    rules: {
      "no-restricted-imports": "off",
      "max-lines": ["warn", 2000], // Examples should be concise
      // Don't require extensions for TypeScript files
      "import/extensions": "off",
    },
  },
];
