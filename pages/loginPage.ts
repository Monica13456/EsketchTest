import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get emailInput(): Locator {
    // The login form renders the "Email" text inside a group, but the textbox itself
    // may not be programmatically associated with the label (so getByLabel can fail).
    // Use the group accessible name and then target the textbox within it.
    return this.page.getByRole("group", { name: "Email" }).getByRole("textbox");
  }

  private get passwordInput(): Locator {
    return this.page.getByRole("group", { name: "Password" }).getByRole("textbox");
  }

  private get signInButton(): Locator {
    return this.page.getByRole("button", { name: "Sign In" });
  }

  private get invalidCredentialsNotification(): Locator {
    return this.page.getByText("Invalid credentials");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async loginWithCredentials(username: string, password: string) {
    await expect(this.emailInput).toBeVisible();
    await expect(this.emailInput).toBeEnabled();
    await this.emailInput.fill(username);

    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();
    await this.passwordInput.fill(password);

    await expect(this.signInButton).toBeVisible();
    await expect(this.signInButton).toBeEnabled();
    await this.signInButton.click();
  }

  async assertOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.signInButton).toBeVisible();
  }

  async assertInvalidCredentialsErrorVisible() {
    await expect(this.invalidCredentialsNotification).toBeVisible();
  }

  async assertRedirectedToDashboardOrClientSelection() {
    // Product requirement: after successful login user lands on dashboard OR client selection.
    // We assert by URL pattern to avoid coupling to specific UI copy.
    await expect(this.page).not.toHaveURL(/\/login$/);
    await expect(this.page).toHaveURL(/\/(dashboard|client-selection)(\/)?$/);
  }
}

