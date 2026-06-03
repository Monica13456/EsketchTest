import { test, expect } from '@playwright/test';

// QM-TC-7
// Tags: new

test.describe('Login - Invalid credentials show error and deny access (QM-TC-7)', () => {
  test('QM-TC-7 - Login fails with invalid credentials', async ({ page }) => {
    // Arrange
    const baseUrl: string | undefined = process.env.BASE_URL;
    expect(baseUrl, 'BASE_URL env var must be set').toBeTruthy();

    const invalidUsername: string = process.env.INVALID_USERNAME ?? 'invalid.user@example.com';
    const invalidPassword: string = process.env.INVALID_PASSWORD ?? 'invalid-password';

    await page.goto(baseUrl!);

    // Act
    const usernameInput = page
      .getByLabel(/user(name)?|email/i)
      .or(page.getByRole('textbox', { name: /user(name)?|email/i }))
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
    await usernameInput.fill(invalidUsername);

    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    await passwordInput.fill(invalidPassword);

    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    await Promise.all([
      page.waitForLoadState('domcontentloaded'),
      loginButton.click(),
    ]);

    // Assert
    // Stay on login page (no redirect to authenticated areas)
    await expect(page).not.toHaveURL(/dashboard|client|select|home|\/app/i);

    // Error message should be visible
    const errorMessage = page
      .getByRole('alert')
      .or(page.getByText(/invalid|incorrect|failed|unable|error/i));

    await expect(errorMessage).toBeVisible();
  });
});
