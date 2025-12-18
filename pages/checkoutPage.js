const{expect} =require('@playwright/test')
exports.checkoutPage =class checkoutPage{
    constructor(page){
        this.page = page;
        this.userEmail = '//input[@id="email"]';
        this.userPassword = '//input[@id="passwd"]';
        this.submitLogin ='//button[@id="SubmitLogin"]';
        this.deliveryAddress = '//ul[@class="address item box"]';
        this.billingAddress = '//ul[@class="address alternate_item box"]';
        this.addressTitle = '//li[@class="address_title"]/h3';
        this.addressLine = '//li[contains(@class,"address_address1")]';
        this.addressCityStateZipCode = '//li[contains(@class,"address_city")]';
        this.addressCountry = '//li[contains(@class,"address_country")]';
        this.addressPhone = '//li[@class="address_phone"]';
        this.addressMobilePhone = '//li[@class="address_phone_mobile"]';
        this.addressSelectionDropdown = '//select[@id="id_address_delivery"]';
        this.Checkout = '//button[normalize-space() ="Proceed to checkout"]';
        this.termsCheckBox = '//input[@id="cgv"]';
        this.termsError = '//p[@class="fancybox-error"]'
        this.errorClose ='//a[@class="fancybox-item fancybox-close"]'
    }
    
    async signIn(email, password){
        await this.page.locator(this.userEmail).fill(email);
        await this.page.locator(this.userPassword).fill(password);
        await this.page.click(this.submitLogin);
    }


    async checkData(section, locator, value) {
        if (value !== undefined) {
            const data = section.locator(locator);
            await expect.soft(data).toHaveText(value);
        }
    }

    async verifyDeliveryAddress(data){
        await this.page.locator(this.addressSelectionDropdown).selectOption({label: data.addressAlias})
        const delivery = this.page.locator(this.deliveryAddress)
        await this.checkData(delivery, this.addressTitle, 'Your delivery address');
        await this.checkData(delivery, this.addressLine, data.address);
        await this.checkData(delivery, this.addressCityStateZipCode, `${data.city}, ${data.state} ${data.zipcode}`);
        await this.checkData(delivery, this.addressCountry, 'United States');
        await this.checkData(delivery, this.addressPhone, data.homePhone);
        await this.checkData(delivery, this.addressMobilePhone, data.mobilePhone);
    }
    async verifyBillingAddress(data){
        const billing = this.page.locator(this.billingAddress)
        await this.checkData(billing, this.addressTitle, 'Your billing address');
        await this.checkData(billing, this.addressLine, data.address);
        await this.checkData(billing, this.addressCityStateZipCode, `${data.city}, ${data.state} ${data.zipcode}`);
        await this.checkData(billing, this.addressCountry, 'United States');
        await this.checkData(billing, this.addressPhone, data.homePhone);
        await this.checkData(billing, this.addressMobilePhone, data.mobilePhone);
    }

    async proceedToCheckout(){
        await this.page.click(this.Checkout)
    }

    async proceedWithoutTerms(){
        const errors = this.page.locator(this.termsError);
        const checkbox = this.page.locator(this.termsCheckBox);
        await expect.soft(checkbox).not.toBeChecked();
        await this.proceedToCheckout();
        await expect.soft(errors).toBeVisible();
        await expect.soft(errors).toHaveText('You must agree to the terms of service before continuing.');
        await this.page.click(this.errorClose);
    }

    async acceptTerms(){
        const checkbox = this.page.locator(this.termsCheckBox);
        await checkbox.check();
        await expect(checkbox).toBeChecked();
    }

}
