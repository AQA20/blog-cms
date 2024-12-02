import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directory that will be recursively scanned for test files
  testDir: 'tests/e2e',
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] }, // Use Chrome in desktop view
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] }, // Mobile emulation with iPhone 12
    },
  ],
});
