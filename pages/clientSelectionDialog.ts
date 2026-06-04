import { expect, type Locator, type Page } from "@playwright/test";

export class ClientSelectionDialog {
  constructor(private readonly page: Page) {}

  private get dialog(): Locator {
    return this.page.getByRole("dialog");
  }

  private get selectClientCombobox(): Locator {
    return this.page.getByRole("combobox");
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

  async assertVisible(): Promise<void> {
    await expect(this.dialog).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  async assertClientVisible(clientName: string): Promise<void> {
    // <option> elements inside a native <select> are not always "visible" to Playwright
    // unless the combobox is opened. Assert presence instead.
    await expect(this.clientOption(clientName)).toHaveCount(1);
  }

  async selectClient(clientName: string): Promise<void> {
    await this.selectClientCombobox.selectOption([clientName]);
    await expect(this.confirmButton).toBeEnabled();
    await this.confirmButton.click();
    await expect(this.dialog).toHaveCount(0);
  }
}
