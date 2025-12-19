const{ expect} =require('@playwright/test');
exports.signUpPage = class signUpPage{
    constructor(page){
        this.page =page;
        this.emailInput = '//input[@id="email_create"]';
        this.createAccountButton = '//button[@id="SubmitCreate"]';
        this.mrRadioButton = '//input[@type = "radio" and @id="id_gender1"]';
        this.mrsRadioButton = '//input[@type = "radio" and @id="id_gender2"]'
        this.firstName ='//input[@id="customer_firstname"]';
        this.lastName = '//input[@id="customer_lastname"]'
        this.email ='//input[@id="email"]';
        this.password ='//input[@id="passwd"]';
        this.birthDay ='//select[@id="days"]';
        this.birthMonth ='//select[@id="months"]'
        this.birthYear ='//select[@id="years"]'
        this.newsletterCheckbox = '//input[@id="newsletter"]';
        this.offersCheckbox = '//input[@id="optin"]';
        this.registerButton ='//button[@id="submitAccount"]';
        this.errorMessage ='//div[@class="alert alert-danger"]'
        this.errorList ='//div[@class="alert alert-danger"]//li'
    }
    async selectGender(gender){
        const isMrChecked = await this.page.locator(this.mrRadioButton);
        const isMrsChecked = await this.page.locator(this.mrsRadioButton);
        if(gender=="male"){
            await isMrChecked.check()
            expect.soft(await isMrChecked).toBeChecked();
            expect.soft(await isMrsChecked).not.toBeChecked();
        }
        else if(gender=="female"){
            await isMrsChecked.check()
            expect.soft(await isMrChecked).not.toBeChecked();
            expect.soft(await isMrsChecked).toBeChecked();
        }
        else{
            console.log('Please input male or female to select the gender')
            expect.soft(await isMrChecked).not.toBeChecked();
            expect.soft(await isMrsChecked).not.toBeChecked();
        }
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

    async fillForm(data) {
        await this.safeFill(this.firstName, data.firstname);
        await this.safeFill(this.lastName, data.lastname);
        await this.safeFill(this.password, data.password);
        await this.safeFill(this.email, data.email);
    }

    async selectBirthDate(birthDate){
        const [day, month, year] = birthDate.split("/");
        if (day !== undefined && day!==null && day!=="") {
            await this.page.locator(this.birthDay).selectOption(day);
        }
        if (month !== undefined && month!==null && month!=="") {
            await this.page.locator(this.birthMonth).selectOption(month);
        }
        if (year !== undefined && year!==null && year!=="") {
            await this.page.locator(this.birthYear).selectOption(year);
        }
    }

    async checkboxes(checks ={}){
        const newsletter = this.page.locator(this.newsletterCheckbox)
        const offers = this.page.locator(this.offersCheckbox)
        if (checks.newsletter == "Y" && checks.offers == "Y" ) {
            await newsletter.check();
            await offers.check();
            await expect(newsletter).toBeChecked();
            await expect(offers).toBeChecked();
        }
        else if (checks.newsletter == "Y" && checks.offers == "N" ) {
            await newsletter.check();
            await expect(newsletter).toBeChecked();
            await expect(offers).not.toBeChecked();
        }
        else if (checks.newsletter == "N" && checks.offers == "Y" ) {
            await offers.check();
            await expect(newsletter).not.toBeChecked();
            await expect(offers).toBeChecked();
        }  
        else if (checks.newsletter == "N" && checks.offers == "N" ) {
            await expect(newsletter).not.toBeChecked();
            await expect(offers).not.toBeChecked();
        }
        else{
            await expect(newsletter).not.toBeChecked();
            await expect(offers).not.toBeChecked();
        }
    }

    async submitRegistration(){
        await this.page.click(this.registerButton);
    }

    async checkError(expectederror){
        const error = this.page.locator(this.errorMessage).first();
        const errorList = this.page.locator(this.errorList);
        
        const errorText = 
            expectederror.length>1?`There are ${expectederror.length} errors`: `There is ${expectederror.length} error`;
        await expect.soft(error).toBeVisible()
        await expect.soft(error).toContainText(errorText);
        await expect.soft(errorList).toHaveCount(expectederror.length)
        
        for(let msg of expectederror){
            await expect.soft(error).toContainText(msg);
        }

    }


}


 
