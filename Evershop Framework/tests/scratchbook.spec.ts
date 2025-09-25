//import { test, Page, Locator } from "@playwright/test";
import { AdminLogin } from "../pages/AdminLogin.page";
import { AdminLanding } from "../pages/AdminLanding.page";
import {test,expect} from "../fixtures/adminLogin.fixtures";
import { getUser } from "../data/factories";

test.describe("Evershop", () => {
  let adminLoginPage: AdminLogin;
  let adminLandingPage: AdminLanding;
  
  test.only("admin login", async ({pageFactory})=>{
   console.log("logged in")
  }
  )
});
