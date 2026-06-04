import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

test.describe("QM-TC-7 - Login fails with invalid credentials", { tag: "@new" }, () => {
  test("denies access and shows an invalid credentials error", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.loginWithCredentials("invalid@example.com", "invalidPassword");

    // Assert
    await loginPage.assertOnLoginPage();
    await loginPage.assertInvalidCredentialsErrorVisible();
  });
});
