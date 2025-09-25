import { expect,Page } from '@playwright/test'
import { BasePage } from '../pages/Base.page'

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

    public loginAsAdmin=async(email:string,password:string):Promise<void>=>{

        await expect(this.locators.adminLoginForm).toBeVisible({timeout:5000});
        await this.locators.emailInput.fill(email);
        await this.locators.passwordInput.fill(password);
        await this.locators.signInBtn.click();
 }

 
}
