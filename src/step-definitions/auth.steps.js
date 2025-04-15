const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const AuthAPI = require('../pages/AuthAPI');

let authAPI;
let response;
let error;

When('I request a token with valid credentials:', async function (dataTable) {
    authAPI = new AuthAPI();
    try {
        const credentials = dataTable.hashes()[0];
        response = await authAPI.createToken(credentials.username, credentials.password);
        this.response = response;
    } catch (e) {
        error = e;
        this.response = error.response;
    }
});

Then('the token should be created successfully', async function () {
    await expect(response.status).toBe(200);
    await expect(response.data).toHaveProperty('token');
});

Then('the response should have a valid token format', async function () {
    await expect(typeof response.data.token).toBe('string');
    await expect(response.data.token).toMatch(/^[A-Za-z0-9-_]+$/);
});

Then('the token should be non-empty', async function () {
    await expect(response.data.token.length).toBeGreaterThan(0);
});

When('I request a token with invalid credentials:', async function (dataTable) {
    authAPI = new AuthAPI();
    try {
        const credentials = dataTable.hashes()[0];
        response = await authAPI.createToken(credentials.username, credentials.password);
        this.response = response;
    } catch (e) {
        error = e;
        this.response = error.response;
    }
});

Then('the response status code should be {int}', async function (statusCode) {
    await expect(this.response.status).toBe(statusCode);
});

Then('the response should contain an error message', async function () {
    const responseBody = this.response.data || {};
    await expect(responseBody).toHaveProperty('message');
    await expect(typeof responseBody.message).toBe('string');
});