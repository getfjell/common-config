import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

/**
 * Base ESLint configuration for Fjell projects
 * Standardized rules based on analysis of all existing Fjell project configs
 */
export default [{
  ignores: ["**/dist", "**/node_modules", "**/output", "**/coverage"],
}, ...compat.extends("plugin:@typescript-eslint/recommended"), {
  plugins: {
    "@typescript-eslint": typescriptEslint,
  },

  languageOptions: {
    parser: tsParser,
  },

  rules: {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",

    // General JavaScript rules
    "no-console": "off",
    "no-unused-vars": "off", // Handled by TypeScript rule above
    "no-var": "error",
    "no-undefined": "error",

    // Code quality and style
    "max-len": ["warn", {
      code: 200,
    }],

    "max-depth": ["error", 4],
    "max-params": ["warn", 6],
    "max-lines": ["warn", 8000],

    "no-multiple-empty-lines": ["error", {
      max: 1,
      maxEOF: 1,
    }],

    "no-trailing-spaces": ["error", {
      skipBlankLines: true,
    }],

    // Indentation with JSX support
    indent: ["warn", 2, {
      SwitchCase: 1,
      ignoredNodes: [
        "TemplateLiteral",
        "JSXElement",
        "JSXElement > *",
        "JSXAttribute",
        "JSXIdentifier",
        "JSXNamespacedName",
        "JSXMemberExpression",
        "JSXSpreadAttribute",
        "JSXExpressionContainer",
        "JSXOpeningElement",
        "JSXClosingElement",
        "JSXFragment",
        "JSXOpeningFragment",
        "JSXClosingFragment",
        "JSXText",
        "JSXEmptyExpression",
        "JSXSpreadChild"
      ],
      offsetTernaryExpressions: true,
    }],

    // Import sorting
    "sort-imports": ["error", {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
    }],
  },
}];
