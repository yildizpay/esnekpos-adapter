import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    passWithNoTests: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Only track files actually imported by tests.
      // With all: true, files with no tests show 0% and fail thresholds.
      // Switch back to all: true once the first real tests exist.
      all: false,
      include: ['src/**/*.ts'],
      exclude: ['src/testing/**', 'src/**/*.test.ts', 'src/**/*.d.ts'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
