import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { ClientSelectionDialog } from "../pages/clientSelectionDialog";
import { UserStoriesPage } from "../pages/userStoriesPage";

test.describe("QM-TC-8 - Client selection", { tag: "@new" }, () => {
  test("QM-TC-8 - Verify client 'TEST' is visible and selectable in the client list after login", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const userStoriesPage = new UserStoriesPage(page);
    const clientSelectionDialog = new ClientSelectionDialog(page);

    // Arrange: login and land on the post-login page
    await loginPage.goto();
    await loginPage.login();

    // Act: verify client exists and select it
    await clientSelectionDialog.assertVisible();
    await clientSelectionDialog.assertClientVisible("TEST");
    await clientSelectionDialog.selectClient("TEST");

    // Assert: client is selected
    await userStoriesPage.assertClientSelected("TEST");
  });
});
