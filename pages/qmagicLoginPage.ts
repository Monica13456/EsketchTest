import { expect, Locator, Page } from "@playwright/test";

export class QmagicLoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators (getters only)
  private get usernameInput(): Locator {
    // Some builds render the textbox without an accessible name (wrapped in a "group Email").
    // Prefer label-based lookup, then fall back to the first textbox inside the Email group.
    return this.page
      .getByLabel(/email|user(name)?/i)
      .or(this.page.getByRole("group", { name: /email/i }).getByRole("textbox"));
  }

  private get passwordInput(): Locator {
    return this.page
      .getByLabel(/password/i)
      .or(this.page.getByRole("group", { name: /password/i }).getByRole("textbox"));
  }

  private get submitButton(): Locator {
    return this.page.getByRole("button", { name: /sign\s*in|log\s*in|submit/i });
  }

  private get errorAlert(): Locator {
    return this.page.getByRole("alert");
  }

  // Actions
  async goto() {
    await this.page.goto("/");
  }

  async fillUsername(username: string) {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEnabled();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();
    await this.passwordInput.fill(password);
  }

  async submit() {
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  // Assertions
  async assertLoginPageIsDisplayed() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async assertInvalidCredentialsErrorIsShown() {
    // App renders a notifications region; prefer alert when present, otherwise fall back to region text.
    const notificationsRegion = this.page.getByRole("region", { name: /notifications/i });

    if (await this.errorAlert.count()) {
      await expect(this.errorAlert).toBeVisible();
      await expect(this.errorAlert).toContainText(/invalid|incorrect|failed|unauthorized/i);
      return;
    }

    await expect(notificationsRegion).toBeVisible();
    await expect(notificationsRegion).toContainText(/invalid|incorrect|failed|unauthorized/i);
  }

  async assertUserRemainsOnLoginPage() {
    await this.assertLoginPageIsDisplayed();
    await expect(this.page).toHaveURL(/login|sign\s*in|auth|\/\s*$/i);
  }

  async assertUserIsRedirectedToDashboardOrClientSelection() {
    // URL-based assertion is the most stable across different post-login landing pages.
    await expect(this.page).toHaveURL(/dashboard|client|select|home|\/app\b/i);

    // Ensure we are no longer on the login form.
    await expect(this.submitButton).toHaveCount(0);
  }
}
