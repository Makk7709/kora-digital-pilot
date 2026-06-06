/**
 * Global test setup for the CI suite.
 *
 * IMPORTANT: This setup is shared by every test that runs through the
 * default `vitest` config (i.e. the CI suite). Production tests that
 * actually hit Perplexity live under `src/test/production/**` and are
 * excluded from the default run via `vitest.config.ts`.
 *
 * The previous version of this file used a `beforeAll` that threw when
 * `VITE_PERPLEXITY_API_KEY` was missing, which broke every CI run and
 * caused most of the suites to hang or fail on environments without
 * secrets. We keep the validation, but scoped: it only runs when the
 * caller explicitly opted in via `RUN_PRODUCTION_TESTS=1` or when the
 * test file path lives under `src/test/production/`.
 */

import '@testing-library/jest-dom';
import { afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const REQUIRED_PROD_ENV = ['VITE_PERPLEXITY_API_KEY'] as const;

const isProductionRun = () => {
  if (process.env.RUN_PRODUCTION_TESTS === '1') return true;
  const taskFilePath =
    // @ts-expect-error vitest task globals can be present in some workers
    (typeof globalThis !== 'undefined' &&
      globalThis.__vitest_worker__?.state?.current?.file?.filepath) ||
    '';
  return typeof taskFilePath === 'string' && taskFilePath.includes('/test/production/');
};

beforeAll(() => {
  if (!isProductionRun()) return;

  const missing = REQUIRED_PROD_ENV.filter((name) => {
    const value = process.env[name] || (import.meta as any).env?.[name];
    return !value || /your_|demo/i.test(String(value));
  });

  if (missing.length > 0) {
    throw new Error(
      `Production tests require: ${missing.join(', ')}. ` +
        `Set them in .env.local or export them before running.`,
    );
  }
});

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

// jsdom on Node 20+ already exposes a global `fetch`. We only need a guard
// against future regressions, so we leave a no-op stub if it is missing.
if (globalThis.fetch === undefined) {
  globalThis.fetch = (() => {
    throw new Error('global fetch is missing — tests should mock fetch explicitly');
  }) as unknown as typeof fetch;
}

declare global {
  // eslint-disable-next-line no-var
  var __TEST_MODE__: boolean;
}

(globalThis as unknown as { __TEST_MODE__: boolean }).__TEST_MODE__ = true;
