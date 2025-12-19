const {expect} = require('@playwright/test')
exports.myAccountPage = class myAccountPage{
    constructor(page){
        this.page =page;
        this.pageHeading = '//h1[@class="page-heading" and normalize-space() ="My account"]';
        this.information = '//a[@title="Information"]';
        this.mrRadioButton = '//input[@type = "radio" and @id="id_gender1"]';
        this.mrsRadioButton = '//input[@type = "radio" and @id="id_gender2"]';
        this.firstName = '//input[@id="firstname"]';
        this.lastName = '//input[@id="lastname"]';
        this.email = '//input[@id="email"]';
        this.birthDay ='//select[@id="days"]';
        this.birthMonth ='//select[@id="months"]'
        this.birthYear ='//select[@id="years"]'
        this.oldPassword = '//input[@id="old_passwd"]';
        this.newPassword = '//input[@id = "passwd"]';
        this.confirmPassword = '//input[@id="confirmation"]';
        this.offersCheckbox = '//input[@id="optin"]';
        this.registerButton ='//button[@id="submitAccount"]';
        this.errorMessage ='//div[@class="alert alert-danger"]'
        this.errorList ='//div[@class="alert alert-danger"]//li'
        this.logout ='//a[@class="logout"]'
        this.firstAddress = '//span[normalize-space()="Add my first address"]'
        this.adressInputBox ='//input[@id="address1"]';
        this.city = '//input[@id="city"]';
        this.state = '//select[@id="id_state"]';
        this.zipcode = '//input[@id="postcode"]';
        this.homePhone = '//input[@id="phone"]';
        this.mobilePhone = '//input[@id="phone_mobile"]'
        this.company = '//input[@id="company"]'
        this.adressLine2 = '//input[@id="address2"]'
        this.additionalInformation = '//textarea[@id="other"]';
        this.addressAlias= '//input[@id="alias"]'
        this.saveAddress = '//button[@id="submitAddress"]'
        this.myAccount = '//a[@class="account"]'
        this.myOrders = '//a[@title="Orders"]';
        this.orderTable ='//table[@id="order-list"]';
        this.orderTableRow = '//tbody/tr';
        this.orderReference = '//a[@class="color-myaccount"]';
        this.orderDate = '//td[@class="history_date bold"]'
        this.orderPrice = '//td[@class="history_price"]'
        this.orderDetailsHeading = '//form[@id="submitReorder"]/p';
        this.orderInfoBox ='//div[@class="info-order box"]'
    }
    
    async verifySignIn(){
        const pageHeading = this.page.locator(this.pageHeading);
        await expect(pageHeading).toContainText("My account");
    }

    async userLogout(){
        await this.page.locator(this.logout).click();
    }

    async safeFill(locator, value) {
        if(value==undefined){
            value=""
        }
        if (value !== undefined) {
            await this.page.locator(locator).clear();
            await this.page.locator(locator).type(value, {delay: 10});
            await this.page.locator(locator).press('Tab');
        }
    }

    async addAddress(data) {
        await this.page.click(this.firstAddress);
        await this.safeFill(this.adressInputBox, data.address);
        await this.safeFill(this.adressLine2, data.adressline2);
        await this.safeFill(this.city, data.city);
        await this.safeFill(this.zipcode, data.zipcode);
        await this.safeFill(this.homePhone, data.homePhone);
        await this.safeFill(this.mobilePhone, data.mobilePhone);
        await this.safeFill(this.company, data.company);
        await this.safeFill(this.additionalInformation, data.additionalInformation);
        await this.safeFill(this.addressAlias, data.addressAlias);
        await this.page.locator(this.state).selectOption({label: data.state})
        await this.page.click(this.saveAddress)
    }
    async openMyOrders(){
        await this.page.click(this.myOrders);
    }

    async verifyOrderHistory(reference, value, date){
        const tablerow = this.page.locator(this.orderTableRow);
        const requiredRow = tablerow.filter({
            has: this.page.locator('td'),
            hasText: reference
        })
        const dateOfOrder = requiredRow.locator(this.orderDate);
        const priceOfOrder = requiredRow.locator(this.orderPrice);
        await expect.soft(dateOfOrder).toHaveText(date);
        await expect.soft(priceOfOrder).toHaveText(value);
    }

    async verifyOrderDetails(reference){
        const tablerow = this.page.locator(this.orderTableRow);
        const requiredRow = tablerow.filter({
            has: this.page.locator('td'),
            hasText: reference
        })
        await requiredRow.locator(this.orderReference).click();
        await expect.soft(this.page.locator(this.orderDetailsHeading)).toContainText(reference)
        const orderInfo = await this.page.locator(this.orderInfoBox);
        await expect.soft(orderInfo).toContainText('Carrier My carrier');
        await expect.soft(orderInfo).toContainText('Payment method Bank wire');
    }
} 