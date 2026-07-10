/* eslint-env node */
import {
  baseConfig,
  getExternalDependencies,
  NODE_BUILTINS,
  createBuilder
} from "./esbuild.js";

/**
 * Configuration for CLI tools and scripts
 * - Node.js platform optimized
 * - Shebang banner for executable scripts
 * - All dependencies external
 * - TypeScript declarations optional
 */
export function createCliConfig(options = {}) {
  const {
    entryPoints = ["src/index.ts"],
    outdir = "dist",
    external = [],
    platform = "node",
    format = "esm",
    splitting = false,
    executable = true,
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

  const config = {
    ...baseConfig,
    entryPoints,
    outdir,
    format,
    platform,
    splitting,
    external: [
      ...NODE_BUILTINS,
      ...packageDeps,
      ...additionalExternals,
      ...external,
    ],
    metafile: true,
    ...overrides,
  };

  // Add shebang banner for executable scripts
  if (executable) {
    config.banner = {
      js: "#!/usr/bin/env node",
      ...config.banner,
    };
  }

  return config;
}

/**
 * Build function for CLI tools
 */
export function buildCli(options = {}) {
  // Separate build options from esbuild config options (esbuild rejects unknown keys)
  const { generateTypes, typeStrategy, onSuccess, onError, buildOptions, ...esbuildOptions } = options;

  const config = createCliConfig(esbuildOptions);
  const resolvedBuildOptions = {
    generateTypes: generateTypes ?? false, // CLI tools often don't need types
    typeStrategy: typeStrategy || "simple",
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
  return buildCli(options)();
}
