const {expect} =require('@playwright/test')
exports.productPage = class productPage{
    constructor(page){
        this.page = page;
        this.productImage = '//img[@id="bigpic"]'
        this.productDescription = '//div[@id="short_description_content"]'
        this.productPrice = '//span[@class="price"]'
        this.productAvailability = '//span[@id="availability_value"]'
        this.sizeDropdown = '//select[@id="group_1"]'
        this.availableColors ='//ul[@id="color_to_pick_list"]/li/a'
    }

    async verifyProductDetails(productName){
        const image = this.page.locator(this.productImage);
        const price = this.page.locator(this.productPrice);
        const availability = this.page.locator(this.productAvailability);
        const description = this.page.locator(this.productDescription)
        await expect.soft(image).toHaveAttribute('title', productName);
        await expect.soft(description).toHaveText(/.+/);
        await expect.soft(price).toHaveText(/^\$\d+\.\d{2}$/);
        await expect.soft(availability).toHaveText(/^(In stock|This product is no longer in stock with those attributes but is available with others\.|This product is no longer in stock)$/i)

    }

    async filterProduct(){
        let exit = false;
        let selectIndex = 0;
        const colors = this.page.locator(this.availableColors);
        const sizeSelection = this.page.locator(this.sizeDropdown);
        const availability = this.page.locator(this.productAvailability);
        const availableText = await availability.textContent()
        if(availableText.trim() === 'This product is no longer in stock'){
            throw new Error("The Item is Out of Stock");
        }
        else{
            const colorsCount = await colors.count()
            while(!exit){
                await sizeSelection.selectOption({index: selectIndex});
                for(let i=0; i<colorsCount; i++){
                    const selectColor = colors.nth(i)
                    await selectColor.click()
                    const availabilityText = await availability.textContent()
                    if(availabilityText.trim() === 'In stock'){
                        exit= true;
                        break;
                    }
                }
                selectIndex++;
            }
        }

    }

}