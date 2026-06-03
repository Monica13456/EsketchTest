import { test, expect } from '@playwright/test';

// QM-TC-6
test.describe('Login - Successful login redirects to dashboard or client selection (QM-TC-6)', () => {
  test('QM-TC-6 - Valid credentials redirect to dashboard or client selection', async ({ page }) => {
    // Arrange
    const baseUrl: string | undefined = process.env.BASE_URL;
    const username: string | undefined = process.env.TEST_USERNAME;
    const password: string | undefined = process.env.TEST_PASSWORD;

    expect(baseUrl, 'BASE_URL env var must be set').toBeTruthy();
    expect(username, 'TEST_USERNAME env var must be set').toBeTruthy();
    expect(password, 'TEST_PASSWORD env var must be set').toBeTruthy();

    await page.goto(baseUrl!);

    // Act
    // Use resilient, user-facing locators with fallbacks.
    const usernameInput = page
      .getByLabel(/user(name)?/i)
      .or(page.getByRole('textbox', { name: /user(name)?/i }))
      .or(page.getByPlaceholder(/user(name)?|email/i));

    const passwordInput = page
      .getByLabel(/password/i)
      .or(page.getByRole('textbox', { name: /password/i }))
      .or(page.getByPlaceholder(/password/i));

    const loginButton = page
      .getByRole('button', { name: /log\s*in|sign\s*in|submit/i })
      .or(page.getByRole('button', { name: /continue/i }));

    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toBeEnabled();
    await usernameInput.fill(username!);

    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    await passwordInput.fill(password!);

    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      loginButton.click(),
    ]);

    // Assert
    // Accept either dashboard or client selection landing.
    // Prefer URL-based assertion with tolerant patterns.
    await expect(page).toHaveURL(/dashboard|client|select|home|\/app/i);
  });
});
