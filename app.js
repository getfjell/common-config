import baseConfig from "./index.js";

/**
 * ESLint configuration for Fjell application packages (docs, web apps)
 * More relaxed rules appropriate for applications vs libraries
 */
export default [
  ...baseConfig,
  {
    // More relaxed rules for application code
    rules: {
      "max-params": ["warn", 8], // Apps may have more complex function signatures
      "max-lines": ["warn", 10000], // Apps can have larger files
      "no-console": "warn", // Allow console in apps but warn
    },
  },
  {
    // Very relaxed rules for docs and public content
    files: ["docs/**/*", "public/**/*", "src/components/**/*"],
    rules: {
      "max-len": ["warn", { code: 300 }], // Docs can have longer lines
      "max-lines": "off", // No limit for docs
      "@typescript-eslint/no-explicit-any": "off",
      "no-restricted-imports": "off",
    },
  },
  {
    // Development and build files
    files: ["*.config.js", "*.config.ts", "*.config.mjs", "vite.config.*", "vitest.config.*"],
    rules: {
      "no-restricted-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "max-lines": "off",
    },
  },
];
