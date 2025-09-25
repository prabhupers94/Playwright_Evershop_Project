import { Page } from '@playwright/test';
import { BasePage } from '../pages/Base.page'


export class NewProduct extends BasePage{

    constructor(page:Page){
        super(page);
    }

    private get locators(){

        return{
            productNameInput:this.page.getByPlaceholder('Name'),
            productSKU:this.page.getByPlaceholder('SKU'),
            productPrice:this.page.getByPlaceholder('Price'),
            productWeight:this.page.getByPlaceholder('Weight'),
            

        }as const
    }
    
}