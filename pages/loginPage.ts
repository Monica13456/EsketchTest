import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  private get emailInput(): Locator {
    return this.page.getByLabel("Email");
  }

  private get passwordInput(): Locator {
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
      process.env.APP_USERNAME ??
      "";
    const password =
      params?.password ??
      process.env.TEST_PASSWORD ??
      process.env.APP_PASSWORD ??
      "";

    expect(username, "Missing TEST_USERNAME/APP_USERNAME env var").toBeTruthy();
    expect(password, "Missing TEST_PASSWORD/APP_PASSWORD env var").toBeTruthy();

    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(username);

    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);

    await expect(this.signInButton).toBeEnabled();
    await this.signInButton.click();
  }
}
