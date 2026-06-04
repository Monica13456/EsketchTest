import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get emailInput(): Locator {
    // Some builds render the textbox without an accessible name, but it is still grouped under "Email".
    // Prefer label-based lookup for resilience.
    return this.page.getByLabel("Email");
  }

  private get passwordInput(): Locator {
    // Some builds render the textbox without an accessible name, but it is still grouped under "Password".
    return this.page.getByLabel("Password");
  }

  private get signInButton(): Locator {
    return this.page.getByRole("button", { name: "Sign In" });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(params?: { username?: string; password?: string }) {
    const username =
      params?.username ??
      process.env.TEST_USERNAME ??
      process.env.APP_USERNAME;
    const password =
      params?.password ??
      process.env.TEST_PASSWORD ??
      process.env.APP_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "Missing credentials. Set TEST_USERNAME/TEST_PASSWORD (or APP_USERNAME/APP_PASSWORD) in environment variables.",
      );
    }

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
}
