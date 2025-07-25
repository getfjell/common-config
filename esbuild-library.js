/* eslint-env node */
import {
  baseConfig,
  getExternalDependencies,
  NODE_BUILTINS,
  createBuilder
} from "./esbuild.js";

/**
 * Configuration for Node.js libraries
 * - Single entry point bundling
 * - All dependencies external
 * - Node.js platform optimized
 * - TypeScript declarations included
 */
export function createLibraryConfig(options = {}) {
  const {
    entryPoints = ["src/index.ts"],
    outfile,
    outdir,
    external = [],
    platform = "node",
    format = "esm",
    additionalExternals = [],
    ...overrides
  } = options;

  const packageDeps = getExternalDependencies();

  // Use outdir if provided, otherwise default to outfile
  const outputConfig = outdir ? { outdir } : { outfile: outfile || "dist/index.js" };

  return {
    ...baseConfig,
    entryPoints,
    ...outputConfig,
    format,
    platform,
    external: [
      ...NODE_BUILTINS,
      ...packageDeps,
      ...additionalExternals,
      ...external,
    ],
    metafile: true,
    ...overrides,
  };
}

/**
 * Build function for Node.js libraries
 */
export function buildLibrary(options = {}) {
  // Separate build options from esbuild config options
  const { generateTypes, typeStrategy, onSuccess, onError, ...esbuildOptions } = options;

  const config = createLibraryConfig(esbuildOptions);
  const buildOptions = {
    generateTypes: generateTypes !== undefined ? generateTypes : true,
    typeStrategy: typeStrategy || "temp-config",
    onSuccess,
    onError,
  };

  return createBuilder(config, buildOptions);
}

/**
 * Default export for simple usage
 */
export default function (options = {}) {
  return buildLibrary(options)();
}
