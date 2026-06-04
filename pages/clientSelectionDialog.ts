import { expect, Locator, Page } from "@playwright/test";

export class ClientSelectionDialog {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get dialog(): Locator {
    return this.page.getByRole("dialog");
  }

  private get selectClientHeading(): Locator {
    return this.dialog.getByRole("heading", { name: "Select Client" });
  }

  private get clientCombobox(): Locator {
    return this.page.getByRole("combobox");
  }

  private get confirmButton(): Locator {
    return this.page.getByRole("button", { name: "Confirm" });
  }

  async assertVisible(): Promise<void> {
    await expect(this.dialog).toBeVisible();
    await expect(this.selectClientHeading).toBeVisible();
  }

  async openClientList(): Promise<void> {
    await expect(this.clientCombobox).toBeVisible();
    await expect(this.clientCombobox).toBeEnabled();
    await this.clientCombobox.click();
  }

  async assertClientOptionVisible(clientName: string): Promise<void> {
    const option = this.page.getByRole("option", { name: clientName });
    await expect(option).toBeVisible();
  }

  async selectClient(clientName: string): Promise<void> {
    const option = this.page.getByRole("option", { name: clientName });
    await expect(option).toBeVisible();
    await option.click();
  }

  async assertConfirmEnabled(): Promise<void> {
    await expect(this.confirmButton).toBeEnabled();
  }
}
