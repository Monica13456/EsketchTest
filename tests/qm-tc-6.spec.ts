import { test } from "@playwright/test";
import { QmagicLoginPage } from "../pages/qmagicLoginPage";

test.describe(
  "QM-TC-6 - Successful login redirects to dashboard or client selection",
  { tag: "@new" },
  () => {
    test(
      "QM-TC-6 - Authenticated user lands on dashboard or client selection page",
      async ({ page }) => {
        const loginPage = new QmagicLoginPage(page);

        const username = process.env.TEST_USERNAME || process.env.APP_USERNAME;
        const password = process.env.TEST_PASSWORD || process.env.APP_PASSWORD;

        if (!username || !password) {
          throw new Error(
            "Missing credentials env vars. Set TEST_USERNAME/TEST_PASSWORD (preferred) or APP_USERNAME/APP_PASSWORD."
          );
        }

        // Arrange: Navigate to login page
        await loginPage.goto();
        await loginPage.assertLoginPageIsDisplayed();

        // Act: Login with valid credentials
        await loginPage.fillUsername(username);
        await loginPage.fillPassword(password);
        await loginPage.submit();

        // Assert: Redirected to dashboard or client selection page
        await loginPage.assertUserIsRedirectedToDashboardOrClientSelection();
      }
    );
  }
);
