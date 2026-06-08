import { test, expect } from '@playwright/test';

test.describe('ES-TC-4 - Data Action - Updating Analog object\'s mode and Manual Value', () => {
  test('@new ES-TC-4 - Placeholder (blocked: environment not reachable)', async ({ page }) => {
    // Arrange
    const baseURL = process.env.BASE_URL;
    test.skip(!baseURL, 'BASE_URL env var is not set.');

    // Act
    await page.goto(baseURL);

    // Assert
    await expect(page).toHaveURL(baseURL);
  });
});
