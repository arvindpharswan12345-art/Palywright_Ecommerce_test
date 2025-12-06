const{test,expect} = require('@playwright/test');
import{homePage} from '../pages/homePage';
import { signUpPage } from '../pages/signUpPage'; 
let page;
let userEmail = "test@abcd.com";
let userGender = "female";
let userFirstName = "Rohit";
let userLastName = "Srivastava";
let userPassword = "abcd1234"
let userBirthDay = "12-3-1999"
let newsLetterCheck ='Y'
let offersCheck = 'N'

test.beforeEach(async ({browser}) => {
    page = await browser.newPage();
    const home = new homePage(page);
    await home.openURL();
    await home.SignUp(userEmail);
});

test('Missing FirstName', async () => {
    const register = new signUpPage(page);
    await register.fillForm({lastname: userLastName, email: userEmail, password: userPassword})
    await register.submitRegistration()
    await register.checkError(["firstname is required."])
});

test('Missing FirstName and LastName', async () => {
    const register = new signUpPage(page);
    await register.fillForm({email: userEmail, password: userPassword})
    await register.submitRegistration()
    await register.checkError(["firstname is required.", "lastname is required."])

});

test('Missing FirstName and LastName and Password', async () => {
    const register = new signUpPage(page);
    await register.fillForm({email: userEmail})
    await register.submitRegistration()
    await register.checkError(["firstname is required.", "lastname is required.","passwd is required."])

});

test('Missing All Fields', async () => {
    const register = new signUpPage(page);
    await register.fillForm({email: ""})
    await register.submitRegistration()
    await register.checkError(["firstname is required.", "lastname is required.","passwd is required.","email is required."])

});

test.only("Invalid password", async()=>{
    const register = new signUpPage(page);
    await register.fillForm({firstname:userFirstName ,lastname: userLastName, email: userEmail, password: "abc"})
    await register.submitRegistration()
    await register.checkError(["passwd is invalid."])
})
test.skip('Missing FirstName1', async () => {
    const register = new signUpPage(page);
    await register.selectGender(userGender);
    await register.fillForm({lastname: userLastName, password: userPassword, email: userEmail})
    await register.selectBirthDate(userBirthDay)
    await register.checkboxes({newsletter: newsLetterCheck, offers: offersCheck})
    await page.waitForTimeout(5000);
});