const{test,expect} = require('@playwright/test');
import{homePage} from '../pages/homePage';
import { signUpPage } from '../pages/signUpPage';
import { myAccountPage } from '../pages/myAccountPage'; 
import { productPage } from '../pages/productPage';
import { cartPage } from '../pages/cartPage';
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
let firstProduct = "Printed Chiffon Dress"
let secondProduct = "Printed Summer Dress"
let address = {
    adress: "821 3rd Lane Manhattan",
    city: "New York",
    state: "New York",
    zipcode: "82044",
    homePhone: "01 2428 242134",
    mobilePhone: "01 23322 13123",
    addressAlias: "Home"
}


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
    await accountPage.addAddress(address);
})

test('Add Address', async()=>{
    const home = new homePage(page);
    await home.userLogin(userEmail, userPassword);
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
    await home.openProduct(firstProduct);
    const details = new productPage(page);
    await details.verifyProductDetails(firstProduct);
})

test('TC-007: Filter Product Size and Color In Stock', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
})

test('TC-008: Add Product to Cart', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductToCart(firstProduct);
})

test('TC-009: Increase Product Quantity in Cart', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductToCart(firstProduct);
    await cart.openCart();
    await cart.increaseProductQuantity(firstProduct);
})

test('TC-010: Remove Product From Cart', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductToCart(firstProduct);
    await cart.openCart();
    await cart.removeProduct(firstProduct);
})

test('TC-011: Verify Product Price Calculation', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductToCart(firstProduct);
    await home.searchProduct(searchProduct);
    await home.openProduct(secondProduct);
    await details.filterProduct();
    await details.addProductToCart(secondProduct);
    await cart.openCart();
    await cart.verifyPriceCalculation();
})

test('TC-012: Checkout – Summary Step', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductandCheckout(firstProduct);
    await cart.verifySummary(firstProduct);
})

test.only('Checkout – Sign in Step (If not logged in)', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductandCheckout(firstProduct);
    await cart.verifySummary(firstProduct);
    await cart.signIn(userEmail, userPassword);
})















