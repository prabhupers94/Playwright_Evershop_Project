import { test as base } from '@playwright/test';
import { getUser } from '../data/factories';
import { PageFactory } from 'pages/PageFactory';

type Fixtures = {
  pageFactory: PageFactory;
};

export const test = base.extend<Fixtures>({
  pageFactory: async ({ page }, use) => {
    const factory = new PageFactory(page);
    const adminlogin = await factory.getAdminLoginPage();
    await adminlogin.go();
    await adminlogin.loginAsAdmin(getUser('default_user'));
    await use(factory);
  },
});

export { expect } from '@playwright/test';
