import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

test.describe(
  "QM-TC-7 - Login fails with invalid credentials",
  { tag: "@new" },
  () => {
    test(
      "Verify login fails with invalid credentials",
      async ({ page }) => {
        const loginPage = new LoginPage(page);

        const validUsername = process.env.TEST_USERNAME ?? process.env.APP_USERNAME;
        const validPassword = process.env.TEST_PASSWORD ?? process.env.APP_PASSWORD;

        if (!validUsername || !validPassword) {
          throw new Error(
            "Missing credentials. Set TEST_USERNAME/TEST_PASSWORD (preferred) or APP_USERNAME/APP_PASSWORD in environment variables.",
          );
        }

        // Arrange: Navigate to login page
        await loginPage.goto();
        await loginPage.assertLoginFormVisible();

        // Act: Attempt login with invalid credentials
        await loginPage.fillUsername(`${validUsername}.invalid`);
        await loginPage.fillPassword(`${validPassword}.invalid`);
        await loginPage.submit();

        // Assert: User remains on login page and sees an error
        await loginPage.assertLoginFailed();
      },
    );
  },
);
