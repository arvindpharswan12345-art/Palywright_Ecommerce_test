const{test,expect} = require('@playwright/test');
import{homePage} from '../pages/homePage';
import { signUpPage } from '../pages/signUpPage';
import { myAccountPage } from '../pages/myAccountPage'; 
import { productPage } from '../pages/productPage';
import { cartPage } from '../pages/cartPage';
import { checkoutPage } from '../pages/checkoutPage';
let page;
let dummyEmail = "testuser@chainsdadasf.com";
let userEmail = "testuser@chainmail.com";
let userGender = "female";
let userFirstName = "Test";
let userLastName = "User";
let userPassword = "abcd1234"
let userBirthDay = "29/3/1996"
let newsLetterCheck ='Y'
let offersCheck = 'N'
let searchProduct = "Dress"
let firstProduct = "Printed Chiffon Dress"
let secondProduct = "Printed Summer Dress"
let outOfStockProduct = "Blouse";
let address = {
    address: "821 3rd Lane Manhattan",
    city: "New York",
    state: "New York",
    zipcode: "82044",
    homePhone: "01 2428 242134",
    mobilePhone: "01 23322 13123",
    addressAlias: "Home"
}
let paymentMethod = "Bank-wire payment";
let orderReference = "WPJNQZDFM";
let totalCartPrice = "$23.40";
let orderDate = "12/19/2025"


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

test('TC-013: Checkout – Sign in Step (If not logged in)', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    const checkout =new checkoutPage(page);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductandCheckout(firstProduct);
    await cart.proceedToCheckout();
    await checkout.signIn(userEmail, userPassword);
})

test('TC-014: Checkout – Address Step', async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    const checkout =new checkoutPage(page);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductandCheckout(firstProduct);
    await cart.proceedToCheckout();
    await checkout.signIn(userEmail, userPassword);
    await checkout.verifyDeliveryAddress(address);
    await checkout.verifyBillingAddress(address);
    await checkout.proceedToCheckout();
})

test('TC-015: Checkout – Shipping Step',async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    const checkout =new checkoutPage(page);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductandCheckout(firstProduct);
    await cart.proceedToCheckout();
    await checkout.signIn(userEmail, userPassword);
    await checkout.proceedToCheckout();
    await checkout.proceedWithoutTerms();
    await checkout.acceptTerms();
    await checkout.proceedToCheckout();
})

test('TC-016: Checkout – Payment Selection',async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    const checkout =new checkoutPage(page);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductandCheckout(firstProduct);
    await cart.proceedToCheckout();
    await checkout.signIn(userEmail, userPassword);
    await checkout.proceedToCheckout();
    await checkout.acceptTerms();
    await checkout.proceedToCheckout();
    await checkout.selectPaymentMethod(paymentMethod);
})

test('TC-017: Order Confirmation',async()=>{
    const home = new homePage(page);
    const details = new productPage(page);
    const cart = new cartPage(page);
    const checkout =new checkoutPage(page);
    await home.searchProduct(searchProduct);
    await home.openProduct(firstProduct);
    await details.filterProduct();
    await details.addProductandCheckout(firstProduct);
    await cart.proceedToCheckout();
    await checkout.signIn(userEmail, userPassword);
    await checkout.proceedToCheckout();
    await checkout.acceptTerms();
    await checkout.proceedToCheckout();
    await checkout.selectPaymentMethod(paymentMethod);
    await checkout.confirmOrder();
})

test('TC-018: View Order History', async()=>{
    const home = new homePage(page);
    const accountPage = new myAccountPage(page);
    await home.userLogin(userEmail, userPassword);
    await accountPage.openMyOrders();
    await accountPage.verifyOrderHistory(orderReference, totalCartPrice,orderDate)
})

test('TC-019: View Order Details', async()=>{
    const home = new homePage(page);
    const accountPage = new myAccountPage(page);
    await home.userLogin(userEmail, userPassword);
    await accountPage.openMyOrders();
    await accountPage.verifyOrderDetails(orderReference);

})

test('TC-020: Missing Fields in Registration Form', async () => {
    const home = new homePage(page);
    await home.SignUp(dummyEmail);
    const register = new signUpPage(page);
    await register.fillForm({lastname: userLastName, email: dummyEmail, password: userPassword})
    await register.submitRegistration()
    await register.checkError(["firstname is required."])
    await register.fillForm({email: dummyEmail, password: userPassword})
    await register.submitRegistration()
    await register.checkError(["firstname is required.", "lastname is required."])
    await register.fillForm({email: dummyEmail})
    await register.submitRegistration()
    await register.checkError(["firstname is required.", "lastname is required.","passwd is required."])
    await register.fillForm({email: ""})
    await register.submitRegistration()
    await register.checkError(["firstname is required.", "lastname is required.","passwd is required.","email is required."])
});

test('TC-021: Invalid data in Registration Form', async () => {
    const home = new homePage(page);
    await home.SignUp(dummyEmail);
    const register = new signUpPage(page);
    await register.fillForm({firstname:userFirstName ,lastname: userLastName, email: dummyEmail, password: "abc"})
    await register.submitRegistration()
    await register.checkError(["passwd is invalid."])
    await register.fillForm({firstname:userFirstName ,lastname: userLastName, email: "abcafhbafa", password: userPassword})
    await register.submitRegistration()
    await register.checkError(["email is invalid."])
    await register.fillForm({firstname:"", lastname: userLastName, password: userPassword, email: dummyEmail})
    await register.selectBirthDate("12/10/")
    await register.submitRegistration()
    await register.checkError(["firstname is required.","Invalid date of birth"])
});

test('TC-022: Add to Cart With Out-of-Stock Product', async () => {
    const home = new homePage(page);
    const details = new productPage(page);
    await home.userLogin(userEmail, userPassword);
    await home.searchProduct(searchProduct);
    await home.openProduct(outOfStockProduct);
    await details.OutOfStockToCart();
});


















