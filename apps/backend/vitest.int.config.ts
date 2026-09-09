import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Inject the testing environment variables using Vite's loadEnv from the root folder
  const env = loadEnv(mode, resolve(__dirname, '../../.env.test.local'), '');

  return {
    plugins: [tsconfigPaths()],
    test: {
      globals: true,
      environment: 'node',
      include: ['**/*.int-spec.ts'],
      fileParallelism: false, // Crucial for real DB testing to prevent race conditions
      env,
      testTimeout: 30000, // Increase timeout for integration tests that may take longer
      hookTimeout: 30000, // Increase hook timeout for setup/teardown
    },
  };
});
