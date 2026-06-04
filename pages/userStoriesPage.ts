import { expect, Locator, Page } from "@playwright/test";

export class UserStoriesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get clientsButton(): Locator {
    return this.page.getByRole("button", { name: "Clients" });
  }

  private get clientsButtonWithSelectedClient(): Locator {
    return this.page.getByRole("button", { name: /^Clients\s+/ });
  }

  async goto() {
    await this.page.goto("/user-stories");
  }

  async openClientSelection() {
    await expect(this.clientsButton).toBeVisible();
    await expect(this.clientsButton).toBeEnabled();
    await this.clientsButton.click();
  }

  async assertClientSelected(clientName: string) {
    await expect(this.clientsButtonWithSelectedClient).toBeVisible();
    await expect(this.clientsButtonWithSelectedClient).toContainText(clientName);
  }
}
