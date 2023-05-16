const { browser, ExpectedConditions, element } = require("protractor");


async function checkTextAfterLogin(user, pass, expectedSelector, expectedText) {
    const userName = element(by.css('[name="username"]'));
    const password = element(by.css('[name="password"]'));
    browser.wait(ExpectedConditions.elementToBeClickable(userName));
    userName.sendKeys(user);
    browser.wait(ExpectedConditions.elementToBeClickable(password));
    password.sendKeys(pass);
    await element(by.css('button[id="btnLogin"]')).click();
    browser.sleep(500);
    const nameTitle = await element(by.css(expectedSelector));
    expect(nameTitle.getText()).toContain(expectedText);
}

describe(
    "Test Cases",
    function () {
        const enderecoTeste = "https://automation-sandbox-python-mpywqjbdza-uc.a.run.app";
        beforeEach(
            function () {
                browser.waitForAngularEnabled(false);
                browser.get(enderecoTeste);
            }
        );
        it(
            "TC001 - Login (Positive)",
            async function () {

                await checkTextAfterLogin('demouser', 'abc123', 'h2[class="mt-5"]', 'Invoice List');
            }
        );
        it(
            "TC002 - Login (Negative)",
            async function () {
                const invalidCredentials = [
                    {
                        user: 'Demouser',
                        password: 'abc123',
                        isValid: false,
                    },
                    {
                        user: 'demouser_',
                        password: 'xyz',
                        isValid: false,
                    },
                    {
                        user: 'demouser',
                        password: 'nananana',
                        isValid: false,
                    },
                    {
                        user: 'demouser',
                        password: 'abc123',
                        isValid: true
                    }
                ];

                const alertDangerSelector = '.alert-danger';

                for (const invalidCredential of invalidCredentials) {
                    if (invalidCredential.isValid) {
                        const userName = element(by.css('[name="username"]'));
                        const password = element(by.css('[name="password"]'));
                        browser.wait(ExpectedConditions.elementToBeClickable(userName));
                        userName.sendKeys(invalidCredential.user);
                        browser.wait(ExpectedConditions.elementToBeClickable(password));
                        password.sendKeys(invalidCredential.password);
                        await element(by.css('button[id="btnLogin"]')).click();
                        browser.sleep(500);
                        const nameTitle = await element(by.css(alertDangerSelector));
                        expect(nameTitle.isPresent()).toBe(false);

                        continue;
                    }

                    await checkTextAfterLogin(invalidCredential.user, invalidCredential.password, alertDangerSelector, 'Wrong username or password.');
                }
            }
        );
        it(
            "TC003 - Validate invoice details",
            async function () {

                await checkTextAfterLogin('demouser', 'abc123', 'h2[class="mt-5"]', 'Invoice List');
                browser.sleep(500);

                await element(by.cssContainingText('.row .col.border.p-2', 'Rendezvous Hotel')).element(by.xpath('..')).element(by.css('.col.border.p-2 a')).click();

                browser.getAllWindowHandles().then(async function (handles) {
                    var newWindow = handles[1];
                    browser.switchTo().window(newWindow);

                    browser.sleep(1500);

                    const hotelName = await element(by.css('.container h4.mt-5'));
                    expect(hotelName.isPresent()).toBe(true);
                    expect(hotelName.getText()).toContain('Rendezvous Hotel');

                    const invoiceDate = await element(by.xpath('/html/body/section/div/ul/li[1]/text()'));
                    expect(invoiceDate.isPresent()).toBe(true);
                    expect(invoiceDate.getText()).toContain('14/01/2018');

                    const dueDate = await element(by.xpath('/html/body/section/div/ul/li[2]/text()'));
                    expect(dueDate.isPresent()).toBe(true);
                    expect(dueDate.getText()).toContain('15/01/2018');

                    const invoiceNumber = await element(by.xpath('/html/body/section/div/h6'));
                    expect(invoiceNumber.isPresent()).toBe(true);
                    expect(invoiceNumber.getText()).toContain('Invoice #110 details');
                    
                    const bookingCode = await element(by.xpath('/html/body/section/div/table[1]/tbody/tr[1]/td[2]'));
                    expect(bookingCode.isPresent()).toBe(true);
                    expect(bookingCode.getText()).toContain('0875');

                    const customerDetails = await element(by.xpath('/html/body/section/div/div/text()[1]'));
                    expect(customerDetails.isPresent()).toBe(true);
                    expect(customerDetails.getText()).toContain('JOHNY SMITH');
                    
                    const room = await element(by.xpath('/html/body/section/div/table[1]/tbody/tr[2]/td[2]'));
                    expect(room.isPresent()).toBe(true);
                    expect(room.getText()).toContain('Superior Double');

                    const checkIn = await element(by.xpath('/html/body/section/div/table[1]/tbody/tr[5]/td[2]'));
                    expect(checkIn.isPresent()).toBe(true);
                    expect(checkIn.getText()).toContain('14/01/2018');

                    const checkOut = await element(by.xpath('/html/body/section/div/table[1]/tbody/tr[6]/td[2]'));
                    expect(checkOut.isPresent()).toBe(true);
                    expect(checkOut.getText()).toContain('15/01/2018');

                    const totalStayCount = await element(by.xpath('/html/body/section/div/table[1]/tbody/tr[3]/td[2]'));
                    expect(totalStayCount.isPresent()).toBe(true);
                    expect(totalStayCount.getText()).toContain('1');

                    const totalStayAmount = await element(by.xpath('/html/body/section/div/table[1]/tbody/tr[4]/td[2]'));
                    expect(totalStayAmount.isPresent()).toBe(true);
                    expect(totalStayAmount.getText()).toContain('$150');

                    const depositNow = await element(by.xpath('/html/body/section/div/table[2]/tbody/tr/td[1]'));
                    expect(depositNow.isPresent()).toBe(true);
                    expect(depositNow.getText()).toContain('USD $20.90');

                    const taxeVat = await element(by.xpath('/html/body/section/div/table[2]/tbody/tr/td[2]'));
                    expect(taxeVat.isPresent()).toBe(true);
                    expect(taxeVat.getText()).toContain('USD $19.00');

                    const totalAmount = await element(by.xpath('/html/body/section/div/table[2]/tbody/tr/td[3]'));
                    expect(totalAmount.isPresent()).toBe(true);
                    expect(totalAmount.getText()).toContain('USD $209.00');
                    
                });
            }
        );


    }
);