import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

test.describe("QM-TC-6 - Login redirects to dashboard or client selection", { tag: "@new" }, () => {
  test("47c8bd81-bed2-4528-8ef1-29f09a849863 - Successful login with valid credentials redirects", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange
    const username = process.env.TEST_USERNAME ?? process.env.APP_USERNAME;
    const password = process.env.TEST_PASSWORD ?? process.env.APP_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "Missing credentials. Set TEST_USERNAME/TEST_PASSWORD (preferred) or APP_USERNAME/APP_PASSWORD in environment variables.",
      );
    }

    await loginPage.goto();
    await loginPage.assertOnLoginPage();

    // Act
    await loginPage.loginWithCredentials(username, password);

    // Assert
    await loginPage.assertRedirectedToDashboardOrClientSelection();
  });
});
