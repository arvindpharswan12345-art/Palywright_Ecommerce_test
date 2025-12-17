const{expect} =require('@playwright/test')
exports.cartPage =class cartPage{
    constructor(page){
        this.page = page;
        this.cartButton = '//a[@title="View my shopping cart"]';
        this.cartTable = '//table[@id="cart_summary"]';
        this.cartRow = '//table[@id="cart_summary"]/tbody/tr';
        this.increaseQuantity = '//i[@class="icon-plus"]';
        this.decreaseQuantity = '//i[@class="icon-minus"]';
        this.deleteItem = '//i[@class="icon-trash"]';
        this.unitPrice = '//li[@class="price special-price"]';
        this.quantity ='//input[@class="cart_quantity_input form-control grey"]';
        this.totalItemPrice ='//span[contains(@id,"total_product_price")]';
        this.totalProductPrice = '//td[@id="total_product"]';
        this.shippingPrice = '//td[@id="total_shipping"]';
        this.totalCartPrice ='//span[@id="total_price"]';
        this.productName = '//td/p[@class="product-name"]/a';
        this.emptyCart ='//p[@class="alert alert-warning"]';
        this.proceedToCheckout = '//p[@class="cart_navigation clearfix"]//a[@title="Proceed to checkout"]'
        this.userEmail = '//input[@id="email"]';
        this.userPassword = '//input[@id="passwd"]';
        this.submitLogin ='//button[@id="SubmitLogin"]';
    }

    async openCart(){
        await this.page.click(this.cartButton);
    }

    async getPrice(row, price){
        const priceText = await row.locator(price).textContent();
        const priceValue = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        return priceValue;
    }

    async priceCalculation(quantity,unitPrice,value){
        let calculation= false;
        if(value ==quantity*unitPrice){
            calculation = true;
        }
        return calculation;
    }

    async checkQuantity(inital, final, number){
        let quantityUpdated = false;
        const initialNum = parseInt(inital);
        const finalNum = parseInt(final);
        if(finalNum==initialNum+number){
            quantityUpdated = true;
        }
        return quantityUpdated;
    }

    async increaseProductQuantity(product){
        const productRow = this.page.locator(this.cartRow);
        const requiredRow = productRow.filter({
            has: this.page.locator('td'),
            hasText: product
        })
        const currentQuantity = await requiredRow.locator(this.quantity).inputValue();
        const unitProductPrice = await this.getPrice(requiredRow, this.unitPrice);
        const InitialPrice = await this.getPrice(requiredRow, this.totalItemPrice);
        const priceCheck = await this.priceCalculation(currentQuantity, unitProductPrice, InitialPrice);
        await expect.soft(priceCheck).toBeTruthy();
        await requiredRow.locator(this.increaseQuantity).click();
        await expect(requiredRow.locator(this.quantity)).toHaveValue(String(parseInt(currentQuantity) + 1));
        const updatedQuantity = await requiredRow.locator(this.quantity).inputValue();
        const FinalPrice = await this.getPrice(requiredRow, this.totalItemPrice);
        const finalPriceCheck = await this.priceCalculation(updatedQuantity, unitProductPrice, FinalPrice);
        await expect.soft(finalPriceCheck).toBeTruthy();
    }

    async removeProduct(product){
        const productRow = this.page.locator(this.cartRow);
        const emptyCartText = this.page.locator(this.emptyCart);
        const requiredRow = productRow.filter({
            has: this.page.locator('td'),
            hasText: product
        })
        await requiredRow.locator(this.deleteItem).click();
        await expect.soft(requiredRow).not.toBeVisible();
        if(await productRow.count()== 0){
            await expect.soft(emptyCartText).toHaveText("Your shopping cart is empty.");
        }
    }

    async verifyPriceCalculation(){
        const productRow = this.page.locator(this.cartRow);
        await productRow.first().waitFor({ state: 'visible' });
        const productCount = await productRow.count();
        //console.log('productcount',productCount)
        let addProductPrice = null
        for(let i=0; i<productCount ;i++){
            let ithPrice = await this.getPrice(productRow.nth(i), this.totalItemPrice);
            //console.log(`${i}product price: ${ithPrice}`)
            addProductPrice += ithPrice; 
        }
        addProductPrice = Number(addProductPrice.toFixed(2));
        const allProductPrice = await this.getPrice(this.page, this.totalProductPrice);
        const shipping = await this.getPrice(this.page, this.shippingPrice);
        const totalCart = await this.getPrice(this.page, this.totalCartPrice);
        const totalCartValueCalculated = shipping + addProductPrice;
        //console.log(`addProductPrice=${addProductPrice}, allProductPrice=${allProductPrice}, shipping=${shipping}, totalCart=${totalCart}, totalCartValueCalculated=${totalCartValueCalculated}`)
        expect.soft(allProductPrice).toBe(addProductPrice);
        expect.soft(totalCart).toBe(totalCartValueCalculated);
    }

    async verifySummary(product){
        const productRow = this.page.locator(this.cartRow);
        const requiredRow = productRow.filter({
            has: this.page.locator('td'),
            hasText: product
        })
        await expect.soft(requiredRow).toBeVisible();
    }
    
    async signIn(email, password){
        await this.page.click(this.proceedToCheckout);
        await this.page.locator(this.userEmail).fill(email);
        await this.page.locator(this.userPassword).fill(password);
        await this.page.click(this.submitLogin);
    }


}
