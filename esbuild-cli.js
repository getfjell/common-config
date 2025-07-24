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
    ...overrides
  } = options;

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
  const config = createCliConfig(options);
  const buildOptions = {
    generateTypes: options.generateTypes ?? false, // CLI tools often don't need types
    typeStrategy: "simple",
    ...options.buildOptions,
  };

  return createBuilder(config, buildOptions);
}

/**
 * Default export for simple usage
 */
export default function (options = {}) {
  return buildCli(options)();
}
