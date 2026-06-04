import { expect, Locator, Page } from "@playwright/test";

export class ClientSelectionDialog {
  constructor(private readonly page: Page) {}

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
    return this.selectClientCombobox.getByRole("option", { name: clientName });
  }

  async assertVisible() {
    await expect(this.dialog).toBeVisible();
    await expect(this.selectClientCombobox).toBeVisible();
  }

  async openClientList() {
    await this.assertVisible();
    await expect(this.selectClientCombobox).toBeEnabled();
    await this.selectClientCombobox.click();
  }

  async assertClientVisible(clientName: string) {
    await this.openClientList();
    await expect(this.clientOption(clientName)).toBeVisible();
  }

  async selectClient(clientName: string) {
    await this.openClientList();
    await this.clientOption(clientName).click();
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click();
    await expect(this.dialog).toBeHidden();
  }

  async cancel() {
    await this.assertVisible();
    await expect(this.cancelButton).toBeEnabled();
    await this.cancelButton.click();
    await expect(this.dialog).toBeHidden();
  }
}
