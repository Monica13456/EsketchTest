import { expect, type Locator, type Page } from "@playwright/test";

export class UserStoriesPage {
  constructor(private readonly page: Page) {}

  private get clientsButton(): Locator {
    return this.page.getByRole("button", { name: "Clients" });
  }

  private get clientsSelectedValue(): Locator {
    return this.page.getByRole("button", { name: "Clients" }).getByText("TEST");
  }

  async assertOnPage(): Promise<void> {
    await expect(this.page).toHaveURL(
      "https://demo.qmagic.ai/user-stories?projectId=&userStoryId=&isRefinementPage=&testCaseId=&addTestCase=&editMode=&currentStep="
    );
    await expect(this.clientsButton).toBeVisible();
  }

  async assertClientSelected(clientName: string): Promise<void> {
    await expect(this.page.getByRole("button", { name: `Clients ${clientName}` })).toBeVisible();
  }
}
