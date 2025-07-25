/* eslint-env node */
/* global console */
import {
  baseConfig,
  getExternalDependencies,
  NODE_BUILTINS,
  createBuilder
} from "./esbuild.js";
import { readdirSync, statSync } from "fs";
import { join, relative } from "path";

/**
 * Get all TypeScript files from a directory recursively
 */
function getAllTsFiles(dir, baseDir = dir) {
  const files = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllTsFiles(fullPath, baseDir));
    } else if (item.endsWith(".ts") && !item.endsWith(".d.ts")) {
      files.push(relative(baseDir, fullPath));
    }
  }

  return files;
}

/**
 * Configuration for multi-file compilation
 * - Compiles each TypeScript file separately
 * - Preserves directory structure
 * - No bundling
 * - All dependencies external
 */
export function createMultiFileConfig(options = {}) {
  const {
    srcDir = "./src",
    outdir = "./dist",
    external = [],
    platform = "node",
    format = "esm",
    preserveSymlinks = false,
    additionalExternals = [],
    ...overrides
  } = options;

  const packageDeps = getExternalDependencies();
  const entryPoints = getAllTsFiles(srcDir);

  console.log(`Found ${entryPoints.length} TypeScript files to compile`);

  const config = {
    ...baseConfig,
    entryPoints: entryPoints.map(file => `${srcDir}/${file}`),
    bundle: false, // Don't bundle - compile each file separately
    outdir,
    format,
    platform,
    preserveSymlinks,
    outExtension: {
      ".js": ".js"
    },
    metafile: true,
    ...overrides,
  };

  // Only include external when bundling is enabled
  // When bundle: false, esbuild doesn't resolve imports so external is not needed
  if (config.bundle !== false) {
    config.external = [
      ...NODE_BUILTINS,
      ...packageDeps,
      ...additionalExternals,
      ...external,
    ];
  }

  return config;
}

/**
 * Build function for multi-file compilation
 */
export function buildMultiFile(options = {}) {
  const config = createMultiFileConfig(options);
  const buildOptions = {
    generateTypes: true,
    typeStrategy: "temp-config",
    onSuccess: (result) => {
      console.log(`Successfully compiled ${Object.keys(result.metafile?.outputs || {}).length} files`);
    },
    ...options.buildOptions,
  };

  return createBuilder(config, buildOptions);
}

/**
 * Default export for simple usage
 */
export default function (options = {}) {
  return buildMultiFile(options)();
}
