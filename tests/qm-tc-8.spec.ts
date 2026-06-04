import { test } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { ClientSelectionDialog } from "../pages/clientSelectionDialog";

test.describe("QM-TC-8 - Client selection", { tag: "@new" }, () => {
  test("@new Verify client 'TEST' is visible and selectable in the client list after login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const clientSelectionDialog = new ClientSelectionDialog(page);

    // Arrange
    await loginPage.goto();
    await loginPage.login();
    await loginPage.assertLoggedIn();

    // Act
    await clientSelectionDialog.assertVisible();
    await clientSelectionDialog.openClientList();

    // Assert
    await clientSelectionDialog.assertClientOptionVisible("TEST");
    await clientSelectionDialog.selectClient("TEST");
    await clientSelectionDialog.assertConfirmEnabled();
  });
});
