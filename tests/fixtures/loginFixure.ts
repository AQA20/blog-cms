import { test as baseTest } from '@playwright/test';
import { Page } from 'playwright';
import envConfig from '@/envConfig';

const { WEB_URL } = envConfig;

type MyFixtures = {
  loginPage: Page;
};

type PageFunc = (r: Page) => Promise<void>;

export const test = baseTest.extend<MyFixtures>({
  loginPage: async ({ browser }, use: PageFunc) => {
    const page = await browser.newPage();

    // Go to the login page before each test
    await page.goto(`${WEB_URL}/login`);

    // Provide the page to the test TypeScript is mistakenly inferring `use` as
    // a React hook (introduced in React 19), so we are explicitly casting it to
    // a `PageFunc` type to ensure the correct function signature.
    await (use as PageFunc)(page);

    // Clean up after each test
    await page.close();
  },
});
