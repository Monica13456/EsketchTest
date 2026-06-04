import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";

test.describe("QM-TC-7: Login fails with invalid credentials", { tag: "@new" }, () => {
  test("denies access and shows an invalid credentials error", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange
    await loginPage.goto();
    await loginPage.assertLoginPageVisible();

    const invalidUsername = `${process.env.TEST_USERNAME ?? process.env.APP_USERNAME ?? ""}-invalid`;
    const invalidPassword = `${process.env.TEST_PASSWORD ?? process.env.APP_PASSWORD ?? ""}-invalid`;

    // Act
    await loginPage.loginWithCredentials({ username: invalidUsername, password: invalidPassword });

    // Assert
    await loginPage.assertInvalidCredentialsErrorVisible();
    await loginPage.assertStillOnLoginPage();
  });
});
