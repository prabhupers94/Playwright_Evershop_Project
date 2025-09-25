import { Page,Locator } from "@playwright/test";

export abstract class BasePage{

protected readonly page;

constructor(page:Page){
    this.page=page;
}

public navigateTo = async(sidebarLink:string):Promise<void>=>{

        await this.page.getByRole('link',{name:sidebarLink,exact:true}).click();

    }
}
