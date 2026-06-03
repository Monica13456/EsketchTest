import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators (getters only)
  private get usernameInput(): Locator {
    // Some builds don't expose an accessible name for the textbox; use the labeled group as a stable anchor.
    return this.page.getByRole("group", { name: /email/i }).getByRole("textbox");
  }

  private get passwordInput(): Locator {
    return this.page.getByRole("group", { name: /password/i }).getByRole("textbox");
  }

  private get loginButton(): Locator {
    // App uses "Sign In" button text
    return this.page.getByRole("button", { name: /sign in/i });
  }

  private get invalidCredentialsAlert(): Locator {
    // Common patterns for auth errors across apps
    return this.page.getByRole("alert");
  }

  private get invalidCredentialsText(): Locator {
    // Fallback when alert role isn't used
    return this.page.getByText(/invalid|incorrect|wrong|failed|unauthorized/i);
  }

  // Actions
  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async assertLoginFormVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEnabled();

    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();

    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
  }

  async fillUsername(username: string): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEnabled();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();
    await this.passwordInput.fill(password);

    // Validate masking (best-effort, app-dependent)
    await expect(this.passwordInput).toHaveAttribute("type", /password/i);
  }

  async submit(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async assertLoginFailed(): Promise<void> {
    // User should remain on login page (form still visible)
    await this.assertLoginFormVisible();

    // Error message should be shown (prefer role=alert, fallback to common error text)
    let errorFound = false;

    try {
      await expect(this.invalidCredentialsAlert).toBeVisible();
      errorFound = true;
    } catch {
      // fallback
    }

    if (!errorFound) {
      await expect(this.invalidCredentialsText).toBeVisible();
    }
  }
}
