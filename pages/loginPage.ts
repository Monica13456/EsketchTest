import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get emailInput(): Locator {
    return this.page.getByRole("group", { name: "Email" }).getByRole("textbox");
  }

  private get passwordInput(): Locator {
    return this.page.getByRole("group", { name: "Password" }).getByRole("textbox");
  }

  private get signInButton(): Locator {
    return this.page.getByRole("button", { name: "Sign In" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
    await expect(this.page).toHaveURL("https://demo.qmagic.ai/login");
  }

  async login(params?: { username?: string; password?: string }): Promise<void> {
    const username = params?.username ?? process.env.TEST_USERNAME ?? process.env.APP_USERNAME;
    const password = params?.password ?? process.env.TEST_PASSWORD ?? process.env.APP_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "Missing credentials. Set TEST_USERNAME/TEST_PASSWORD (or APP_USERNAME/APP_PASSWORD) environment variables.",
      );
    }

    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(username);

    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);

    await expect(this.signInButton).toBeVisible();
    await expect(this.signInButton).toBeEnabled();
    await this.signInButton.click();
  }

  async assertLoggedIn(): Promise<void> {
    await expect(this.page).not.toHaveURL("https://demo.qmagic.ai/login");
    await expect(this.signInButton).toHaveCount(0);
  }
}
