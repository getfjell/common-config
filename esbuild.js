/* eslint-env node */
/* global console, process */
import { build, context, analyzeMetafile } from "esbuild";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";

/**
 * Read dependencies from package.json to mark them as external
 */
export function getExternalDependencies(packageJsonPath = "./package.json") {
  if (!existsSync(packageJsonPath)) {
    return [];
  }

  const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  return [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ];
}

/**
 * Common Node.js built-in modules to keep external
 */
export const NODE_BUILTINS = [
  "util", "path", "fs", "os", "crypto", "stream", "buffer", "events", "url",
  "querystring", "http", "https", "zlib", "net", "tls", "cluster", "child_process",
  "dgram", "dns", "domain", "module", "readline", "repl", "string_decoder",
  "sys", "timers", "tty", "v8", "vm", "worker_threads", "assert", "console",
  "constants", "perf_hooks", "process", "punycode", "worker_threads"
];

/**
 * React-specific externals
 */
export const REACT_EXTERNALS = [
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
];

/**
 * Generate TypeScript declarations using different strategies
 */
export async function generateTypeScript(options = {}) {
  const {
    strategy = "simple", // 'simple' | 'temp-config'
    outDir = "dist",
    rootDir = "src",
    entryPoint = "src/index.ts",
    configPath = "./tsconfig.json"
  } = options;

  console.log("Generating TypeScript declarations...");

  try {
    if (strategy === "temp-config") {
      // Create temporary tsconfig for type generation
      const tempTsConfig = {
        extends: configPath,
        compilerOptions: {
          declaration: true,
          emitDeclarationOnly: true,
          noEmit: false,
          outDir: `./${outDir}`,
          rootDir: `./${rootDir}`
        },
        include: [`./${rootDir}/**/*.ts`, `./${rootDir}/**/*.tsx`],
        exclude: ["./tests/**/*.ts", "./examples/**/*.ts", "./docs/**/*.ts"]
      };

      writeFileSync("./tsconfig.build.json", JSON.stringify(tempTsConfig, null, 2));

      try {
        execSync("npx tsc --project tsconfig.build.json", { stdio: "inherit" });
      } finally {
        // Clean up temp config
        execSync("rm -f tsconfig.build.json", { stdio: "ignore" });
      }
    } else {
      // Simple strategy - direct tsc call
      execSync(`npx tsc --emitDeclarationOnly --declaration --declarationDir ${outDir} --rootDir ${rootDir} ${entryPoint}`, {
        stdio: "inherit"
      });
    }

    console.log("TypeScript declarations generated successfully.");
  } catch (error) {
    console.warn("Warning: Failed to generate TypeScript declarations:", error.message);
    console.warn("The JavaScript build completed successfully. Fix TypeScript errors to generate declarations.");
  }
}

/**
 * Create a build function with common patterns
 */
export function createBuilder(baseConfig, options = {}) {
  const {
    generateTypes = true,
    typeStrategy = "simple",
    onSuccess,
    onError
  } = options;

  return async function buildProject() {
    const isWatchMode = process.argv.includes("--watch");

    try {
      if (generateTypes && !isWatchMode) {
        await generateTypeScript({ strategy: typeStrategy });
      }

      if (isWatchMode) {
        console.log("Starting watch mode...");
        const ctx = await context(baseConfig);
        await ctx.watch();

        if (generateTypes) {
          await generateTypeScript({ strategy: typeStrategy });
        }

        console.log("Watch mode active. Press Ctrl+C to stop.");

        // Keep the process alive
        process.on("SIGINT", async () => {
          await ctx.dispose();
          process.exit(0);
        });
      } else {
        console.log("Building...");
        const result = await build(baseConfig);

        if (result.metafile && baseConfig.metafile) {
          const analysis = await analyzeMetafile(result.metafile);
          console.log(analysis);
        }

        console.log("Build complete!");

        if (onSuccess) {
          await onSuccess(result);
        }
      }
    } catch (error) {
      console.error("Build failed:", error);
      if (onError) {
        await onError(error);
      }
      process.exit(1);
    }
  };
}

/**
 * Common base configuration
 */
export const baseConfig = {
  bundle: true,
  target: "es2022",
  sourcemap: true,
  minify: false,
  platform: "neutral",
  mainFields: ["module", "main"],
  conditions: ["import", "module", "default"],
};

export default {
  baseConfig,
  getExternalDependencies,
  NODE_BUILTINS,
  REACT_EXTERNALS,
  generateTypeScript,
  createBuilder
};
