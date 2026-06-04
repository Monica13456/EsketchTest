import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import type { LoginCredentials } from "../types/auth.types";

test.describe(
  "QM-TC-6 - Successful login redirects to dashboard or client selection",
  { tag: "@new" },
  () => {
    test("47c8bd81-bed2-4528-8ef1-29f09a849863 - Login with valid credentials", async ({ page }) => {
      const loginPage = new LoginPage(page);

      const username = process.env.TEST_USERNAME ?? process.env.APP_USERNAME;
      const password = process.env.TEST_PASSWORD ?? process.env.APP_PASSWORD;

      if (!username || !password) {
        throw new Error(
          "Missing credentials. Set TEST_USERNAME/TEST_PASSWORD (preferred) or APP_USERNAME/APP_PASSWORD in environment variables.",
        );
      }

      const credentials: LoginCredentials = { username, password };

      // Arrange
      await loginPage.goto();
      await loginPage.assertLoginPageVisible();

      // Act
      await loginPage.loginWithCredentials(credentials);

      // Assert
      await loginPage.assertRedirectedToPostLoginLandingPage();
    });
  },
);
