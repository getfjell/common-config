# @fjell/common-config - Agentic Guide

## Purpose

Shared build and lint configuration package for Fjell repositories.

This guide is optimized for AI-assisted code generation and integration workflows.

## Documentation

- **[Usage Guide](./usage.md)** - API-oriented usage patterns and model-safe examples
- **[Integration Guide](./integration.md)** - Architecture placement, composition rules, and implementation guidance

## Key Capabilities

- Publishes reusable ESLint and build configuration modules
- Supports library, app, React, and CLI build profile composition
- Reduces config drift across Fjell package repositories

## Installation

```bash
npm install @fjell/common-config
```

## Public API Highlights

- `eslint.config.mjs` baseline configuration
- `esbuild.js`, `esbuild-library.js`, `esbuild-react.js`, and related presets
- `index.js`, `library.js`, and `app.js` entry points
