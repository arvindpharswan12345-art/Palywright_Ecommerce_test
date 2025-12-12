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
    }
    
    async verifySignIn(){
        const pageHeading = this.page.locator(this.pageHeading);
        await expect(pageHeading).toContainText("My account");
    }

    async userLogout(){
        await this.page.locator(this.logout).click();
    }
} 