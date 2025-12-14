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


}
