import { expect, type Locator, type Page } from "@playwright/test";
import type { LoginCredentials } from "../types/auth.types";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get loginHeading(): Locator {
    return this.page.getByRole("heading", { name: "QMagic" });
  }

  private get usernameInput(): Locator {
    // The textbox itself has no accessible name; the label is exposed via a surrounding group.
    return this.page.getByLabel("Email");
  }

  private get passwordInput(): Locator {
    // The textbox itself has no accessible name; the label is exposed via a surrounding group.
    return this.page.getByLabel("Password");
  }

  private get loginButton(): Locator {
    return this.page.getByRole("button", { name: "Sign In" });
  }

  private get invalidCredentialsAlert(): Locator {
    return this.page.getByRole("region", { name: "Notifications alt+T" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/web/index.php/auth/login");
  }

  async assertLoginPageVisible(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async loginWithCredentials({ username, password }: LoginCredentials): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);

    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);

    await expect(this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async assertInvalidCredentialsErrorVisible(): Promise<void> {
    await expect(this.invalidCredentialsAlert).toBeVisible();
    await expect(this.invalidCredentialsAlert).toContainText("Invalid");
  }

  async assertStillOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/web\/index\.php\/auth\/login$/);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async assertRedirectedToPostLoginLandingPage(): Promise<void> {
    // After successful login, user should no longer be on the login page.
    await expect(this.page).not.toHaveURL(/\/web\/index\.php\/auth\/login$/);

    // Accept either a dashboard-like landing page or a client selection page.
    // We keep this assertion URL-based to avoid guessing UI text for post-login pages.
    await expect(this.page).toHaveURL(
      /\/web\/index\.php\/(dashboard\/index|pim\/viewEmployeeList|admin\/viewSystemUsers|time\/viewEmployeeTimesheet|leave\/viewLeaveList|recruitment\/viewCandidates|directory\/viewDirectory|maintenance\/purgeEmployee|buzz\/viewBuzz|auth\/selectClient)/,
    );
  }
}
