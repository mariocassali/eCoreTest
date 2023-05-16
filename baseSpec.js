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

                    // const invoiceDate = element.all(by.css('ul li .font-weight-bold')).filter(function(elem, index) {
                    //     return elem.getText().then(function(text) {
                    //       return text === 'Invoice Date:';
                    //     });
                    //   }).first().element(by.xpath('..'));
                    // // const invoiceDate = await element(by.cssContainingText('ul li .font-weight-bold', 'Invoice Date')).element(by.xpath('..'));
                    // // console.log(invoiceDate.getText());
                    // // expect(invoiceDate.isPresent()).toBe(true);
                    // expect(invoiceDate.getText()).toContain('14/01/2018');

                });
            }
        );


    }
);