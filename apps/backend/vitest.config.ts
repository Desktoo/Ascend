import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // Allows you to use describe/it/expect without importing them
    environment: 'node',
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
});
