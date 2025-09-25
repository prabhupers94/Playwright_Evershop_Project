import {test,Page,Locator} from '@playwright/test';
import { AdminLogin } from '../pages/AdminLogin.page'
import { AdminLanding } from '../pages/AdminLanding.page'

test.describe('Evershop',()=>{

let adminLoginPage:AdminLogin;
let adminLandingPage:AdminLanding;
test('Admin Login',async({page})=>{
 adminLoginPage=new AdminLogin(page);
 adminLandingPage = new AdminLanding(page);
 await page.goto('/admin')
//  await page.goto('http://localhost:3000/admin');
 await adminLoginPage.loginAsAdmin('admin@admin.com','admin123');

 await adminLandingPage.assertLandingPageLoaded();
 await adminLandingPage.navigateTo('Categories');

})
})
