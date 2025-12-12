const{test,expect} = require('@playwright/test');
import{homePage} from '../pages/homePage';
import { signUpPage } from '../pages/signUpPage';
import { myAccountPage } from '../pages/myAccountPage'; 
import { productPage } from '../pages/productPage';
let page;
let userEmail = "testuser@chainmail.com";
let userGender = "female";
let userFirstName = "Mimansa";
let userLastName = "Bhagat";
let userPassword = "abcd1234"
let userBirthDay = "29/3/1996"
let newsLetterCheck ='Y'
let offersCheck = 'N'
let searchProduct = "Dress"
let selectProduct = "Printed Chiffon Dress"

test.beforeEach(async ({browser}) => {
    page = await browser.newPage();
    const home = new homePage(page);
    await home.openURL();
});

test.skip('TC-001: User Registration', async() =>{
    const home = new homePage(page);
    await home.SignUp(userEmail);
    const register = new signUpPage(page);
    await register.selectGender(userGender);
    await register.fillForm({firstname:userFirstName, lastname: userLastName, password: userPassword, email: userEmail})
    await register.selectBirthDate(userBirthDay);
    await register.checkboxes({newsletter: newsLetterCheck, offers: offersCheck})
    await register.submitRegistration();
    const accountPage = new myAccountPage(page);
    await accountPage.verifySignIn();
})

test('TC-002: Login With Valid Credentials', async()=>{
    const home = new homePage(page);
    await home.userLogin(userEmail, userPassword);
    const accountPage = new myAccountPage(page);
    await accountPage.verifySignIn();
})

test('TC-003: Logout', async()=>{
    const home = new homePage(page);
    await home.userLogin(userEmail, userPassword);
    const accountPage = new myAccountPage(page);
    await accountPage.userLogout();
    await home.verifyLogout();
})

test('TC-004: Login With Invalid Credentials', async()=>{
    const home = new homePage(page);
    await home.userLogin(userEmail, "abcd123");
    const authenticationError = new signUpPage(page);
    await authenticationError.checkError(["Authentication failed."]);
})

test('TC-005: Search for a Product', async()=>{
    const home = new homePage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
})

test('TC-006: View Product Details', async()=>{
    const home = new homePage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
    await home.openProduct(selectProduct);
    const details = new productPage(page);
    await details.verifyProductDetails(selectProduct);
})

test('TC-007: Filter Product Size and Color In Stock', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
    await home.openProduct(selectProduct);
    await details.filterProduct();
})










