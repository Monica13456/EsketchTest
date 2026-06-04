import { expect, Locator, Page } from "@playwright/test";

export class ClientSelectionDialog {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get dialog(): Locator {
    return this.page.getByRole("dialog");
  }

  private get selectClientCombobox(): Locator {
    return this.page.getByRole("combobox", { name: "Select Client" });
  }

  private get confirmButton(): Locator {
    return this.page.getByRole("button", { name: "Confirm" });
  }

  private get cancelButton(): Locator {
    return this.page.getByRole("button", { name: "Cancel" });
  }

  private clientOption(clientName: string): Locator {
    return this.selectClientCombobox.locator("option", { hasText: clientName });
  }

  async assertVisible() {
    await expect(this.dialog).toBeVisible();
  }

  async assertClientVisible(clientName: string) {
    await expect(this.selectClientCombobox).toBeVisible();
    await expect(this.selectClientCombobox).toBeEnabled();

    await this.selectClientCombobox.click();
    await expect(this.clientOption(clientName)).toBeVisible();
  }

  async selectClient(clientName: string) {
    await expect(this.selectClientCombobox).toBeVisible();
    await expect(this.selectClientCombobox).toBeEnabled();

    await this.selectClientCombobox.selectOption(clientName);

    await expect(this.confirmButton).toBeVisible();
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click();

    await expect(this.dialog).toBeHidden();
  }

  async cancel() {
    await expect(this.cancelButton).toBeVisible();
    await expect(this.cancelButton).toBeEnabled();
    await this.cancelButton.click();
  }
}
