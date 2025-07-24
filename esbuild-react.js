/* eslint-env node */
import {
  baseConfig,
  getExternalDependencies,
  NODE_BUILTINS,
  REACT_EXTERNALS,
  createBuilder
} from "./esbuild.js";

/**
 * Configuration for React/UI libraries
 * - React JSX support
 * - All dependencies external (including React)
 * - Neutral platform for browser/node compatibility
 * - TypeScript declarations included
 */
export function createReactConfig(options = {}) {
  const {
    entryPoints = ["src/index.ts"],
    outfile = "dist/index.js",
    external = [],
    platform = "neutral",
    format = "esm",
    jsx = "automatic",
    jsxImportSource = "react",
    additionalExternals = [],
    ...overrides
  } = options;

  const packageDeps = getExternalDependencies();

  return {
    ...baseConfig,
    entryPoints,
    outfile,
    format,
    platform,
    jsx,
    jsxImportSource,
    external: [
      ...NODE_BUILTINS,
      ...packageDeps,
      ...REACT_EXTERNALS,
      ...additionalExternals,
      ...external,
    ],
    metafile: true,
    ...overrides,
  };
}

/**
 * Build function for React/UI libraries
 */
export function buildReact(options = {}) {
  const config = createReactConfig(options);
  const buildOptions = {
    generateTypes: true,
    typeStrategy: "simple", // React projects often have complex type setups
    ...options.buildOptions,
  };

  return createBuilder(config, buildOptions);
}

/**
 * Default export for simple usage
 */
export default function (options = {}) {
  return buildReact(options)();
}
