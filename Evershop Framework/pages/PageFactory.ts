import { Page } from "@playwright/test";
import { AdminLogin } from "./AdminLogin.page";
import {NewProduct} from './NewProduct.page';

export class PageFactory {
  private readonly pageInstances = new Map<string, any>();

  constructor(private readonly page: Page) {}

  private getOrCreatePage<T>(key: string, factory: () => T): T {
    if (!this.pageInstances.has(key)) {
      this.pageInstances.set(key, factory());
    }
    return this.pageInstances.get(key) as T;
  }

  getAdminLoginPage(): AdminLogin {
    return this.getOrCreatePage("AdminLogin", () => new AdminLogin(this.page));
  }

  addNewProduct() : NewProduct{
    return this.getOrCreatePage("NewProduct", () => new NewProduct(this.page))
  }
}
