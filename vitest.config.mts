import { defineConfig } from 'vitest/config';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    environment: 'jsdom', // Use 'jsdom' for frontend tests
    coverage: {
      provider: 'istanbul', // Use 'istanbul' as the provider for code coverage,
      reporter: ['text', 'json', 'html'], // Report formats
      reportsDirectory: path.join(__dirname, 'coverage'), // Directory to store coverage reports
      include: [
        'app/**/*.{ts,tsx}', // Include all TypeScript files in the app folder
        'components/**/*.{ts,tsx}', // Include all TypeScript files in the components folder
        'lib/**/*.{ts,tsx}', // Include all TypeScript files in the lib folder
        'services/**/*.{ts,tsx}', // Include all TypeScript files in the services folder
      ],
      exclude: [
        '**/node_modules/**', // Exclude files in node_modules
        '**/test/**',
        'components/ui/**/*.{ts,tsx}', // Exclude shadcn components
      ],
    },
    globals: true, // Enable globals like `describe`, `it`, `expect` in the tests
    // Include and exclude patterns to target only unit and integration tests
    include: [
      'tests/unit/**/*.spec.{ts,tsx}',
      'tests/integration/**/*.spec.{ts,tsx}',
    ],
    exclude: ['tests/e2e/**/*'], // Exclude e2e tests to avoid running them in Vitest
    setupFiles: ['tests/setup.tsx'], // Optional: setup files (like mocks or global configurations)
  },
  // Enable automatic path alias resolution based on the tsconfig.json file
  plugins: [tsconfigPaths()],
});
