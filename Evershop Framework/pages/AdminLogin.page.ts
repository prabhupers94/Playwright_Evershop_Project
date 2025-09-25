import { expect,Page } from '@playwright/test'
import { BasePage } from '../pages/Base.page'
import { TestUser } from '../data/factories';
import { log } from '../utils/logger.js';
import {appEnv} from '../config/env';
export class AdminLogin extends BasePage{

    

    constructor(page: Page) {
       super(page);

    }

    private get locators() {

        return {
            emailInput: this.page.getByPlaceholder('Email'),
            passwordInput: this.page.getByPlaceholder('Password'),
            signInBtn:this.page.getByRole('button',{name:'SIGN IN'}),
            adminLoginForm:this.page.locator('.admin-login-form')
        } as const
    }

    public loginAsAdmin=async(AdminLogginUser: TestUser):Promise<void>=>{

        await expect(this.locators.adminLoginForm).toBeVisible({timeout:5000});
        await this.locators.emailInput.fill(AdminLogginUser.email);
        await this.locators.passwordInput.fill(AdminLogginUser.password);
        await this.locators.signInBtn.click();
        await log.info(`Login initiated successfully for email: ${AdminLogginUser.email}`);
 }

  async go(): Promise<void> {
    await this.page.goto(appEnv.baseUrl);
  }
}
