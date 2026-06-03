import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { PostLoginPage } from "../pages/postLoginPage";

test.describe(
  "QM-TC-6 - Login redirects to dashboard or client selection",
  { tag: "@new" },
  () => {
    test(
      "Verify successful login with valid credentials redirects to dashboard or client selection page",
      async ({ page }) => {
        const loginPage = new LoginPage(page);
        const postLoginPage = new PostLoginPage(page);

        const username = process.env.TEST_USERNAME ?? process.env.APP_USERNAME;
        const password = process.env.TEST_PASSWORD ?? process.env.APP_PASSWORD;

        if (!username || !password) {
          throw new Error(
            "Missing credentials. Set TEST_USERNAME/TEST_PASSWORD (preferred) or APP_USERNAME/APP_PASSWORD in environment variables.",
          );
        }

        // Arrange: Navigate to login page
        await loginPage.goto();
        await loginPage.assertLoginFormVisible();

        // Act: Log in
        await loginPage.fillUsername(username);
        await loginPage.fillPassword(password);
        await loginPage.submit();

        // Assert: Redirected to dashboard or client selection
        await postLoginPage.assertRedirectedToDashboardOrClientSelection();
      },
    );
  },
);
