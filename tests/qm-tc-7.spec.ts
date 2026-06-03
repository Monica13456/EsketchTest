import { test } from "@playwright/test";
import { QmagicLoginPage } from "../pages/qmagicLoginPage";

test.describe("QM-TC-7 - Login fails with invalid credentials", { tag: "@new" }, () => {
  test("QM-TC-7 - User is denied access and shown an error message", async ({ page }) => {
    const loginPage = new QmagicLoginPage(page);

    const validUsername = process.env.TEST_USERNAME || process.env.APP_USERNAME;
    const validPassword = process.env.TEST_PASSWORD || process.env.APP_PASSWORD;

    if (!validUsername || !validPassword) {
      throw new Error(
        "Missing credentials env vars. Set TEST_USERNAME/TEST_PASSWORD (preferred) or APP_USERNAME/APP_PASSWORD."
      );
    }

    const invalidUsername = `${validUsername}.invalid`;
    const invalidPassword = `${validPassword}.invalid`;

    // Arrange: Navigate to login page
    await loginPage.goto();
    await loginPage.assertLoginPageIsDisplayed();

    // Act: Attempt login with invalid credentials
    await loginPage.fillUsername(invalidUsername);
    await loginPage.fillPassword(invalidPassword);
    await loginPage.submit();

    // Assert: Error shown and user remains on login page
    await loginPage.assertInvalidCredentialsErrorIsShown();
    await loginPage.assertUserRemainsOnLoginPage();
  });
});
