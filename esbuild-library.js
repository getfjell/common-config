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
  const config = createLibraryConfig(options);
  const buildOptions = {
    generateTypes: true,
    typeStrategy: "temp-config",
    ...options.buildOptions,
  };

  return createBuilder(config, buildOptions);
}

/**
 * Default export for simple usage
 */
export default function (options = {}) {
  return buildLibrary(options)();
}
