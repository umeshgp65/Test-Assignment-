import { Selector } from 'testcafe';
import { faker } from '@faker-js/faker';

fixture('SauceDemo')
    .page('https://www.saucedemo.com')
    .beforeEach(async t => {
        await t.setTestSpeed(0.5);
    });

const username = 'performance_glitch_user';
const password = 'secret_sauce';
const productName1 = 'Sauce Labs Bolt T-Shirt';
const productName2 = 'Sauce Labs Bike Light';
const addToCartButton1 = Selector('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
const addToCartButton2 = Selector('[data-test="add-to-cart-sauce-labs-bike-light"]');

// Create Selector for the price of the product
const price = Selector('.inventory_item_price').withExactText('$49.99');

const continueButton = Selector('#continue');
const finishButton = Selector('#finish');

const login = async (t) => {
    await t.typeText('#user-name', username);
    await t.typeText('#password', password);
    await t.click('#login-button');
};

const addToCart = async (t, productName, addToCartButton) => {
    const item = await Selector('.inventory_item_name').withExactText(productName);
    await t.click(addToCartButton);
};



test('Add products to cart and checkout', async (t) => {
    // Login
    await login(t);

    // Use the Selector to retrieve the text of the price
    const priceText = await price.innerText;

    // Assert the price of the product is $49.99
    await t.expect(priceText).eql('$49.99');

    // Add products to cart
    await addToCart(t, productName1, addToCartButton1);
    await addToCart(t, productName2, addToCartButton2);


    // Go to cart
    await t.click('.shopping_cart_link');

    // Verify selected items are in cart
    await t.expect(Selector('.cart_item').count).eql(2);

    // Checkout
    await t.click('.checkout_button');

    // Fill out checkout information
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const zipCode = faker.address.zipCode();
    await t.typeText('#first-name', firstName);
    await t.typeText('#last-name', lastName);
    await t.typeText('#postal-code', zipCode);

    // Continue to next step
    await t.click(continueButton);

    // Finish checkout
    await t.click(finishButton);

    // Verify order completion
    await t.expect(Selector('.complete-header').innerText).eql('Thank you for your order!');
});
