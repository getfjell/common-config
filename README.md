# @fjell/eslint-config

Shared ESLint configuration for all Fjell projects. This package provides standardized linting rules to ensure consistent code quality and style across the entire Fjell ecosystem.

## Installation

```bash
npm install --save-dev @fjell/eslint-config
# or
pnpm add -D @fjell/eslint-config
```

## Usage

This package exports three different configurations:

### Base Configuration

The base configuration includes all common rules suitable for most TypeScript projects:

```js
// eslint.config.mjs
import fjellConfig from '@fjell/eslint-config';

export default fjellConfig;
```

### Library Configuration

For library packages, use the library configuration which includes stricter import rules and special handling for examples and tests:

```js
// eslint.config.mjs
import fjellConfig from '@fjell/eslint-config/library';

export default fjellConfig;
```

### App Configuration

For application packages (docs sites, web apps), use the app configuration with more relaxed rules:

```js
// eslint.config.mjs
import fjellConfig from '@fjell/eslint-config/app';

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
import fjellConfig from '@fjell/eslint-config/library';

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

Built with love by the Fjell team.
