import { Locator, Page } from "@playwright/test";

export class TableBaseClass {
  constructor(private readonly page: Page) {}

  get tableLocators() {
    return {
      // Generic page elements
      primaryButton: (text: string) => this.page.locator('.primaryButton', { hasText: text }),
      pageTitle: (title: string) => this.page.locator('.page-heading-title', { hasText: title }),
      clearFilter:(link: string)=> this.page.locator('.text-interactive', { hasText: link }),
      search: this.page.getByPlaceholder('Search'),

      // Pagination and records
      rowsPerPageInput: this.page.locator('div.limit input[type="text"]'),
      perPageDropdown: this.page.locator('div.form-field-container.dropdown select.form-field'),
      totalRecordsText: (records: string | number) =>
        this.page.locator('div.flex.space-x-4 span', { hasText: `${records} records` }),
      firstPage: this.page.locator('div.first a'),
      prevPage: this.page.locator('div.prev a'),
      nextPage: this.page.locator('div.next a'),
      lastPage: this.page.locator('div.last a'),

      // Dynamic dropdowns
      dropdownButton: (dropdownName: string) =>
        this.page.locator(`.filter-container button:has(span:text-is("${dropdownName}"))`),
      dropdownOption: (dropdownName: string, optionText: string) =>
        this.page.locator(
          `.filter-container:has(button:has(span:text-is("${dropdownName}"))) >> text="${optionText}"`
        ),

      // Table-related locators (dynamic by row text + column header)
      table: this.page.locator('table.listing.sticky'),

      // Get a row by cell text
      getRowByText: (rowText: string) =>
        this.page.locator('table.listing.sticky tbody tr', { hasText: rowText }),

      // Get column index by header text
      getColumnIndexByHeader: async (columnName: string) => {
        const headers = await this.page.locator('table.listing.sticky thead th span').allTextContents();
        return headers.indexOf(columnName);
      },

      // Get cell by row text and column name
      getCell: async (rowText: string, columnName: string) => {
        const headers = await this.page.locator('table.listing.sticky thead th span').allTextContents();
        const colIndex = headers.indexOf(columnName);
        return this.page.locator('table.listing.sticky tbody tr', { hasText: rowText })
                   .locator(`td:nth-child(${colIndex + 1})`);
      },

      // Get checkbox in first column of a row
      getCheckbox: (rowText: string) =>
        this.page.locator('table.listing.sticky tbody tr', { hasText: rowText })
                 .locator('td:first-child input[type="checkbox"]'),

      // Get image in a column by row text + column name
      getImage: async (rowText: string, columnName: string) => {
        const headers = await this.page.locator('table.listing.sticky thead th span').allTextContents();
        const colIndex = headers.indexOf(columnName);
        return this.page.locator('table.listing.sticky tbody tr', { hasText: rowText })
                   .locator(`td:nth-child(${colIndex + 1}) img`);
      },

      // Get status dot by row text + column header
      getStatusDot: async (rowText: string, columnName: string) => {
        const headers = await this.page.locator('table.listing.sticky thead th span').allTextContents();
        const colIndex = headers.indexOf(columnName);
        return this.page.locator('table.listing.sticky tbody tr', { hasText: rowText })
                   .locator(`td:nth-child(${colIndex + 1}) span`);
      }
    } as const;
  }

  async clickPrimaryButton(text: string) {
    await this.tableLocators.primaryButton(text).click();
  }

  async verifyPageTitle(title: string) {
    return this.tableLocators.pageTitle(title).isVisible();
  }

  async clicklink(link: string) {
    await this.tableLocators.clearFilter(link).click();
  }

  async searchText(text: string) {
    await this.tableLocators.search.fill(text);
    await this.tableLocators.search.press('Enter');
  }

  async setRowsPerPage(rows: number) {
    await this.tableLocators.rowsPerPageInput.fill(rows.toString());
    await this.tableLocators.rowsPerPageInput.press('Enter');
  }

  async selectPerPageDropdown(option: string) {
    await this.tableLocators.perPageDropdown.selectOption({ label: option });
  }

  async goToFirstPage() {
    await this.tableLocators.firstPage.click();
  }

  async goToPrevPage() {
    await this.tableLocators.prevPage.click();
  }

  async goToNextPage() {
    await this.tableLocators.nextPage.click();
  }

  async goToLastPage() {
    await this.tableLocators.lastPage.click();
  }

  async selectDropdownOption(dropdownName: string, optionText: string) {
    await this.tableLocators.dropdownButton(dropdownName).click();
    await this.tableLocators.dropdownOption(dropdownName, optionText).click();
  }

  // ---- Table Methods ----

  // Get cell locator by row text and column header
  getCell(rowText: string, columnName: string) {
    return this.tableLocators.table.locator('thead th span')
      .locator(`:text("${columnName}")`)
      .first()
      .evaluateHandle((header, rowText) => {
        const ths = Array.from(header.closest('table')!.querySelectorAll('thead th'));
        const colIndex = ths.indexOf(header as HTMLElement);
        const row = Array.from(header.closest('table')!.querySelectorAll('tbody tr')).find(r =>
          r.textContent?.includes(rowText)
        );
        return row?.querySelectorAll('td')[colIndex];
      }, rowText);
  }

  // Check checkbox in a row
  async checkRowCheckbox(rowText: string) {
    const checkbox = this.tableLocators.table.locator('tbody tr', { hasText: rowText }).locator('input[type="checkbox"]');
    if (!(await checkbox.isChecked())) await checkbox.check();
  }

  // Verify image in a row
  async verifyRowImage(rowText: string) {
    const img = this.tableLocators.table.locator('tbody tr', { hasText: rowText }).locator('img');
    return img.isVisible();
  }

  // Get status dot color in a row
  async getStatusDotColor(rowText: string) {
    const dot = this.tableLocators.table.locator('tbody tr', { hasText: rowText }).locator('span.dot');
    return dot.evaluate(el => getComputedStyle(el).backgroundColor);
  }

  // Get text of a cell
  async getCellText(rowText: string, columnName: string) {
  const cell = this.tableLocators.table.locator('tbody tr', { hasText: rowText })
    .locator('td')
    .filter({
      has: this.tableLocators.table.locator('thead th span', { hasText: columnName })
    })
  return await cell.first().innerText();
}
}

