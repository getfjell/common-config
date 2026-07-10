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
    outfile,
    outdir,
    external = [],
    platform = "neutral",
    format = "esm",
    jsx = "automatic",
    jsxImportSource = "react",
    additionalExternals = [],
    ...rest
  } = options;

  // Builder-only keys must never reach esbuild (it rejects unknown options)
  const overrides = { ...rest };
  delete overrides.generateTypes;
  delete overrides.typeStrategy;
  delete overrides.onSuccess;
  delete overrides.onError;
  delete overrides.buildOptions;

  const packageDeps = getExternalDependencies();

  // Use outdir if provided, otherwise default to outfile
  const outputConfig = outdir ? { outdir } : { outfile: outfile || "dist/index.js" };

  return {
    ...baseConfig,
    entryPoints,
    ...outputConfig,
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
  // Separate build options from esbuild config options (esbuild rejects unknown keys)
  const { generateTypes, typeStrategy, onSuccess, onError, buildOptions, ...esbuildOptions } = options;

  const config = createReactConfig(esbuildOptions);
  const resolvedBuildOptions = {
    generateTypes: generateTypes !== undefined ? generateTypes : true,
    typeStrategy: typeStrategy || "simple", // React projects often have complex type setups
    onSuccess,
    onError,
    ...buildOptions,
  };

  return createBuilder(config, resolvedBuildOptions);
}

/**
 * Default export for simple usage
 */
export default function (options = {}) {
  return buildReact(options)();
}
