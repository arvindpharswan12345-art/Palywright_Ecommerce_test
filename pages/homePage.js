const{expect} = require('@playwright/test');
exports.homePage = class homePage{
    constructor(page){
        this.page = page;
        this.signInButton = '//a[@class="login"]';
        this.emailInput = '//input[@id="email_create"]';
        this.createAccountButton = '//button[@id="SubmitCreate"]';
        this.userEmail = '//input[@id="email"]';
        this.userPassword = '//input[@id="passwd"]';
        this.submitLogin ='//button[@id="SubmitLogin"]';
        this.authenticationPage = '//h1[@class="page-heading" and normalize-space() ="Authentication"]';
        this.productSearch ='//input[@id="search_query_top"]';
        this.searchIcon ='//button[@name="submit_search"]';
        this.searchedProductNames = '//div[@class ="product-container"]//a[@class="product-name"]'
    }
    async openURL(){
        await this.page.goto('http://www.automationpractice.pl/index.php');
    }
    async SignUp(email){
        await this.page.click(this.signInButton);
        await this.page.fill(this.emailInput,email);
        await this.page.click(this.createAccountButton);
    }

    async userLogin(email, password){
        await this.page.click(this.signInButton);
        await this.page.locator(this.userEmail).fill(email);
        await this.page.locator(this.userPassword).fill(password);
        await this.page.click(this.submitLogin);
    }

    async verifyLogout(){
        const pageHeading = this.page.locator(this.authenticationPage);
        await expect(pageHeading).toContainText("Authentication");
    }

    async searchProduct(product){
        await this.page.fill(this.productSearch, product);
        await this.page.click(this.searchIcon);
        const productList = this.page.locator(this.searchedProductNames);
        const count = await productList.count();
        let productMatching = false;
        for (let i = 0; i < count; i++) {
            const text = await productList.nth(i).textContent()
            if(text.includes(product)){
                productMatching = true;
                break;
            } 
        }
        await expect(productMatching).toBeTruthy();
    }

    async openProduct(product){
        const productList = await this.page.$$(this.searchedProductNames);
        for (let product1 of productList) {
            const text = await product1.textContent();
            if(text.trim() === product){
                await product1.click();
                break;
            } 
        }
    }
}