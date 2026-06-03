import { expect, type Locator, type Page } from "@playwright/test";

export class PostLoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators (broad, app-agnostic signals)
  private get mainRegion(): Locator {
    return this.page.getByRole("main");
  }

  private get dashboardHeading(): Locator {
    return this.page.getByRole("heading", { name: /dashboard/i });
  }

  private get clientSelectionHeading(): Locator {
    return this.page.getByRole("heading", { name: /client selection|select client|clients?/i });
  }

  private get userMenuButton(): Locator {
    return this.page.getByRole("button", { name: /user|profile|account/i });
  }

  async assertRedirectedToDashboardOrClientSelection(): Promise<void> {
    // URL-based assertion (common for post-login pages)
    await expect(this.page).toHaveURL(/dashboard|client|home|app/i);

    // UI-based assertion: at least one strong signal should be visible.
    // We avoid non-web-first assertions in tests; here we use expect with locators.
    const candidates: Locator[] = [
      this.dashboardHeading,
      this.clientSelectionHeading,
      this.mainRegion,
      this.userMenuButton,
    ];

    let anyVisible = false;
    for (const candidate of candidates) {
      try {
        await expect(candidate).toBeVisible();
        anyVisible = true;
        break;
      } catch {
        // try next candidate
      }
    }

    expect(anyVisible).toBeTruthy();
  }
}
