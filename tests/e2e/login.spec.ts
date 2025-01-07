import { expect } from '@playwright/test';
import { test } from '@/fixtures';
import envConfig from '@/envConfig';

const { EMAIL, PASSWORD } = envConfig;

test('Login form displays correctly and submits', async ({ loginPage }) => {
  // Ensure the login form is visible
  const loginForm = loginPage.locator('form');
  await expect(loginForm).toBeVisible();

  // Check if input fields are visible
  await expect(loginPage.locator('input[name="email"]')).toBeVisible();
  await expect(loginPage.locator('input[name="password"]')).toBeVisible();

  // Fill in email and password
  await loginPage.fill('input[name="email"]', EMAIL);
  await loginPage.fill('input[name="password"]', PASSWORD);

  //  Submit the form
  await loginPage.click('button[type="submit"]');

  // Check for a successful login response (this will depend on your app behavior)
  await expect(loginPage.locator('text=EMAIL')).toBeVisible();
});

test('should show error when log in is unsuccessful', async ({ loginPage }) => {
  await loginPage.fill('input[name="email"]', 'test@test.com');
  await loginPage.fill('input[name="password"]', 'test$1Abcd32@fs');
  await loginPage.click('button[type="submit"]');
  await expect(loginPage.locator('text=Invalid credentials')).toBeVisible();
});

test('should show validation error when email is empty', async ({
  loginPage,
}) => {
  await loginPage.fill('input[name="email"]', '');
  await loginPage.click('button[type="submit"]');

  await expect(loginPage.locator('text=Invalid email')).toBeVisible();
});

test('should show validation error when email is invalid', async ({
  loginPage,
}) => {
  await loginPage.fill('input[name="email"]', 'test@test');
  await loginPage.click('button[type="submit"]');

  await expect(loginPage.locator('text=Invalid email')).toBeVisible();
});

test('should show validation error when password is empty', async ({
  loginPage,
}) => {
  await loginPage.fill('input[name="password"]', '');
  await loginPage.click('button[type="submit"]');

  await expect(
    loginPage.locator('text=Password cannot be empty'),
  ).toBeVisible();
});

test('password filed should be of type password', async ({ loginPage }) => {
  await expect(loginPage.locator('input[name="password"]')).toHaveAttribute(
    'type',
    'password',
  );
});

test('show password icon should be showed initially', async ({ loginPage }) => {
  await expect(loginPage.locator('span[title="Show password"]')).toBeVisible();
});

test('Change the password field type from password to text when clicking show password icon', async ({
  loginPage,
}) => {
  await expect(loginPage.locator('span[title="Show password"]')).toBeVisible();
  await loginPage.click('span[title="Show password"]');

  await expect(loginPage.locator('input[name="password"]')).toHaveAttribute(
    'type',
    'text',
  );
});

test('Change the password field type from text to password when clicking hide password icon', async ({
  loginPage,
}) => {
  await expect(loginPage.locator('span[title="Show password"]')).toBeVisible();
  await loginPage.click('span[title="Show password"]');
  await expect(loginPage.locator('span[title="Hide password"]')).toBeVisible();
  await loginPage.click('span[title="Hide password"]');

  await expect(loginPage.locator('input[name="password"]')).toHaveAttribute(
    'type',
    'password',
  );
});
