# Usage Guide

Comprehensive usage guidance for `@fjell/common-config`.

## Installation

```bash
npm install @fjell/common-config
```

## API Highlights

- `eslint.config.mjs` baseline configuration
- `esbuild.js`, `esbuild-library.js`, `esbuild-react.js`, and related presets
- `index.js`, `library.js`, and `app.js` entry points

## Quick Example

```ts
// eslint.config.mjs
import fjellConfig from "@fjell/common-config/eslint.config.mjs";

export default [...fjellConfig];
```

## Model Consumption Rules

1. Import from the package root (`@fjell/common-config`) instead of deep-internal paths unless explicitly documented.
2. Keep usage aligned with exported public symbols listed in this guide.
3. Prefer explicit typing at package boundaries so generated code remains robust during upgrades.
4. Keep error handling deterministic and map infrastructure failures into domain-level errors.
5. Co-locate integration wrappers in your app so model-generated code has one canonical entry point.

## Best Practices

- Keep examples and abstractions consistent with existing Fjell package conventions.
- Favor composable wrappers over one-off inline integration logic.
- Add targeted tests around generated integration code paths.
