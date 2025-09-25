import { Page,expect } from '@playwright/test';
import { BasePage } from '../pages/Base.page'
export class AdminLanding extends BasePage {
    

    constructor(page:Page){

        super(page);
    }

    private get locators (){
        return{

            dashboardTitle:this.page.locator('.page-heading-title'),
            settingsLink:this.page.getByRole('link',{name:'SETTING'})
 }as const
    }

    public assertLandingPageLoaded = async():Promise<void>=>{

        await expect(this.locators.dashboardTitle).toBeVisible();
    }

    



}