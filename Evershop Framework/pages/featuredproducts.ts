import { Locator, Page } from "@playwright/test";

export class GridBaseClass {
  constructor(private readonly page: Page) {}

  /** Generic locators for grid/list pages */
  get gridLocators() {
    return {
      // Page title (e.g., "Products", "Categories")
      pageTitle: (title: string) => this.page.locator('.card-header h2.card-title', { hasText: title }),

      // Primary action button/link (e.g., Add Products, Add Category)
      primaryButton: (text: string) => this.page.locator('.card-header .card-action a', { hasText: text }),

      searchInput: this.page.locator('.card-section input[type="text"][placeholder]'),

      totalItemsText: this.page.locator('.card-section i'),   

      // Grid row by product/category name or any text
      getRowByText: (text: string) =>
        this.page.locator('.card-section .grid').filter({ hasText: text }),

      // Product/row image
      getRowImage: (rowText: string) =>
        this.page.locator('.card-section .grid').filter({ hasText: rowText }).locator('img'),

      // Product/row main link (e.g., product name)
      getRowLink: (rowText: string) =>
        this.page.locator('.card-section .grid').filter({ hasText: rowText }).locator('a.font-semibold'),

      // Remove/Delete button in a row
      getRowRemoveButton: (rowText: string) =>
        this.page.locator('.card-section .grid').filter({ hasText: rowText }).locator('a.text-critical')
    } as const;
  }


  async clickPrimaryButton(text: string) {
    await this.gridLocators.primaryButton(text).click();
  }

  async searchText(text: string) {
    await this.gridLocators.searchInput.fill(text);
    await this.gridLocators.searchInput.press('Enter');
  }

  async getRowLinkText(rowText: string) {
    return await this.gridLocators.getRowLink(rowText).innerText();
  }

  async verifyRowImage(rowText: string) {
    return await this.gridLocators.getRowImage(rowText).isVisible();
  }

  async clickRowRemoveButton(rowText: string) {
    await this.gridLocators.getRowRemoveButton(rowText).click();
  }
}
