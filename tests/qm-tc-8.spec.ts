import { test } from "@playwright/test";
import { ClientSelectionDialog } from "../pages/clientSelectionDialog";
import { LoginPage } from "../pages/loginPage";
import { UserStoriesPage } from "../pages/userStoriesPage";
import type { LoginCredentials } from "../types/auth.types";

test.describe(
  "QM-TC-8 - Client selection",
  {
    tag: ["@new"],
  },
  () => {
    test("@new Client 'TEST' is visible and selectable after login", async ({ page }) => {
      const loginPage = new LoginPage(page);
      const clientSelectionDialog = new ClientSelectionDialog(page);
      const userStoriesPage = new UserStoriesPage(page);

      const username = process.env.TEST_USERNAME ?? process.env.APP_USERNAME;
      const password = process.env.TEST_PASSWORD ?? process.env.APP_PASSWORD;

      if (!username || !password) {
        throw new Error(
          "Missing credentials. Set TEST_USERNAME/TEST_PASSWORD (or APP_USERNAME/APP_PASSWORD) environment variables."
        );
      }

      const credentials: LoginCredentials = {
        username,
        password,
      };

      // Arrange
      await loginPage.goto();

      // Act
      await loginPage.login(credentials);

      // Assert
      await loginPage.assertLoggedIn();
      await userStoriesPage.assertOnPage();

      await clientSelectionDialog.assertVisible();
      await clientSelectionDialog.assertClientVisible("TEST");
      await clientSelectionDialog.selectClient("TEST");

      await userStoriesPage.assertClientSelected("TEST");
    });
  }
);
