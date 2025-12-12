# @fjell/common-config

Shared ESLint and build configuration for all Fjell projects. This package provides standardized linting rules and build tools to ensure consistent code quality and style across the entire Fjell ecosystem.

## Installation

```bash
npm install --save-dev @fjell/common-config
```

## Usage

This package exports three different configurations:

### Base Configuration

The base configuration includes all common rules suitable for most TypeScript projects:

```js
// eslint.config.mjs
import fjellConfig from '@fjell/common-config';

export default fjellConfig;
```

### Library Configuration

For library packages, use the library configuration which includes stricter import rules and special handling for examples and tests:

```js
// eslint.config.mjs
import fjellConfig from '@fjell/common-config/library';

export default fjellConfig;
```

### App Configuration

For application packages (docs sites, web apps), use the app configuration with more relaxed rules:

```js
// eslint.config.mjs
import fjellConfig from '@fjell/common-config/app';

export default fjellConfig;
```

## Configuration Details

### Base Rules

- **Code Quality**: Maximum line length of 200 characters, maximum function parameters of 6, maximum file lines of 8000
- **Style**: 2-space indentation, no trailing spaces, single empty line maximum
- **TypeScript**: Unused variables as errors, disabled explicit any warnings
- **Imports**: Sorted imports with case-insensitive ordering

### Library-Specific Rules

- **Import Restrictions**: Enforces absolute imports over relative imports in source code
- **Examples**: Relaxed rules for `examples/` directory allowing any import style
- **Tests**: Allows longer files and more flexible import patterns

### App-Specific Rules

- **Relaxed Limits**: Higher parameter count (8), longer files (10000 lines)
- **Console Usage**: Console statements allowed but with warnings
- **Documentation**: Very relaxed rules for docs and public content
- **Config Files**: No restrictions on build and configuration files

## Ignored Patterns

All configurations ignore:
- `**/dist`
- `**/node_modules`
- `**/output`
- `**/coverage`

## Extending the Configuration

You can extend any configuration with project-specific rules:

```js
// eslint.config.mjs
import fjellConfig from '@fjell/common-config/library';

export default [
  ...fjellConfig,
  {
    // Your project-specific overrides
    rules: {
      'max-len': ['warn', { code: 150 }], // Shorter lines for this project
    },
  },
];
```

## Migration from Existing Configs

1. Install this package
2. Replace your existing `eslint.config.mjs` with the appropriate import
3. Remove ESLint-related dependencies from your project (they're included here)
4. Add any project-specific rules as extensions

## Rule Philosophy

These rules are designed to:
- Maintain consistency across all Fjell projects
- Catch common errors without being overly restrictive
- Support both library and application development patterns
- Allow flexibility where teams need it most

## Contributing

When updating rules, consider:
- Impact on all Fjell projects
- Backwards compatibility
- Clear documentation of changes
- Version bumping according to semver

## Esbuild Configuration

This package also provides standardized esbuild configurations for different project types, ensuring consistent build processes across the Fjell ecosystem.

### Installation

The esbuild configurations require esbuild as a peer dependency:

```bash
npm install --save-dev esbuild
# or
npm install --save-dev esbuild
```

### Usage

#### Node.js Libraries

For most Fjell libraries (fjell-core, fjell-registry, fjell-cache, etc.):

```js
// build.js
import buildLibrary from '@fjell/common-config/esbuild/library';

// Simple usage with defaults
buildLibrary();

// With custom options
buildLibrary({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  additionalExternals: ['@fjell/custom-package'],
});
```

#### React/UI Libraries

For React components and UI libraries (fjell-providers):

```js
// build.js
import buildReact from '@fjell/common-config/esbuild/react';

buildReact({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
});
```

#### CLI Tools and Scripts

For executable CLI tools and scripts:

```js
// build.js
import buildCli from '@fjell/common-config/esbuild/cli';

buildCli({
  entryPoints: ['src/cli.ts'],
  outdir: 'dist',
  executable: true, // Adds shebang banner
  generateTypes: false, // CLI tools often don't need types
});
```

#### Multi-File Compilation

For projects that need to compile each TypeScript file separately (fjell-express-router):

```js
// build.js
import buildMultiFile from '@fjell/common-config/esbuild/multi-file';

buildMultiFile({
  srcDir: './src',
  outdir: './dist',
});
```

### Watch Mode

All configurations support watch mode:

```bash
node build.js --watch
```

### Advanced Usage

#### Custom Configuration

You can also import the configuration functions and use them with your own build logic:

```js
import { createLibraryConfig } from '@fjell/common-config/esbuild/library';
import { build } from 'esbuild';

const config = createLibraryConfig({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  minify: true, // Override defaults
});

await build(config);
```

#### Using Base Utilities

```js
import {
  getExternalDependencies,
  NODE_BUILTINS,
  generateTypeScript,
  createBuilder
} from '@fjell/common-config/esbuild';

// Get dependencies from package.json
const deps = getExternalDependencies();

// Generate TypeScript declarations
await generateTypeScript({
  strategy: 'temp-config',
  outDir: 'dist',
  rootDir: 'src'
});
```

### Configuration Options

#### Common Options (all configs)

- `entryPoints`: Array of entry point files (default: `['src/index.ts']`)
- `external`: Additional external dependencies to exclude from bundle
- `additionalExternals`: Convenience option to add to the default externals
- `platform`: Target platform - 'node', 'browser', or 'neutral'
- `format`: Output format - 'esm', 'cjs', or 'iife'
- All other esbuild options can be passed and will override defaults

#### Library-Specific Options

- `outfile`: Single output file path (default: `'dist/index.js'`)
- `typeStrategy`: 'simple' or 'temp-config' for TypeScript generation

#### React-Specific Options

- `jsx`: JSX transform mode (default: `'automatic'`)
- `jsxImportSource`: JSX import source (default: `'react'`)

#### CLI-Specific Options

- `outdir`: Output directory for CLI tools (default: `'dist'`)
- `executable`: Add shebang banner for executable scripts (default: `true`)
- `generateTypes`: Whether to generate TypeScript declarations (default: `false`)

#### Multi-File Options

- `srcDir`: Source directory to scan (default: `'./src'`)
- `outdir`: Output directory (default: `'./dist'`)
- `preserveSymlinks`: Preserve symbolic links (default: `false`)

### TypeScript Declaration Generation

All configurations automatically generate TypeScript declarations using one of two strategies:

1. **Simple**: Direct `tsc` call with specific parameters
2. **Temp Config**: Creates a temporary `tsconfig.build.json` for more control

The strategy can be configured per build type or overridden in options.

### Migration from Existing Builds

1. **Install the shared config**: `npm install --save-dev @fjell/common-config`
2. **Replace your build script**: Choose the appropriate configuration type
3. **Update package.json**: Change your build script to use the new configuration
4. **Remove old build files**: Delete old `esbuild.config.js` or custom build scripts
5. **Test**: Ensure the build output matches your expectations

#### Example Migration

**Before** (fjell-core/esbuild.config.js):
```js
// ... 57 lines of custom esbuild configuration
```

**After** (fjell-core/build.js):
```js
import buildLibrary from '@fjell/common-config/esbuild/library';
buildLibrary();
```

**Package.json update**:
```json
{
  "scripts": {
    "build": "node build.js",
    "build:watch": "node build.js --watch"
  }
}
```

### Benefits

- **Consistency**: All projects use the same build patterns and optimizations
- **Maintenance**: Updates to build logic are centralized
- **Simplicity**: Reduce boilerplate in individual projects
- **Best Practices**: Automatically includes proper externals, TypeScript generation, and watch mode
- **Flexibility**: Easy to override or extend for specific project needs

Built with love by the Fjell team.
TEST
