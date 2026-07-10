import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createCliConfig } from '../esbuild-cli.js';
import { createLibraryConfig } from '../esbuild-library.js';
import { createReactConfig } from '../esbuild-react.js';

const BUILDER_ONLY_KEYS = [
  'generateTypes',
  'typeStrategy',
  'onSuccess',
  'onError',
  'buildOptions',
];

describe('esbuild config factories', () => {
  it('createCliConfig strips builder-only options that esbuild rejects', () => {
    const config = createCliConfig({
      entryPoints: ['src/cli.ts'],
      generateTypes: false,
      typeStrategy: 'simple',
      onSuccess: () => {},
      onError: () => {},
      buildOptions: { generateTypes: false },
      minify: true,
    });

    for (const key of BUILDER_ONLY_KEYS) {
      assert.equal(key in config, false, `expected ${key} to be stripped`);
    }
    assert.equal(config.minify, true);
    assert.deepEqual(config.entryPoints, ['src/cli.ts']);
  });

  it('createLibraryConfig strips builder-only options', () => {
    const config = createLibraryConfig({
      generateTypes: true,
      typeStrategy: 'temp-config',
      buildOptions: {},
      sourcemap: false,
    });

    for (const key of BUILDER_ONLY_KEYS) {
      assert.equal(key in config, false, `expected ${key} to be stripped`);
    }
    assert.equal(config.sourcemap, false);
  });

  it('createReactConfig strips builder-only options', () => {
    const config = createReactConfig({
      generateTypes: true,
      onSuccess: () => {},
      jsx: 'automatic',
    });

    for (const key of BUILDER_ONLY_KEYS) {
      assert.equal(key in config, false, `expected ${key} to be stripped`);
    }
    assert.equal(config.jsx, 'automatic');
  });
});
