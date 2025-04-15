const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const PingAPI = require('../pages/PingAPI');

let pingAPI;
let response;
let error;

When('I send a health check request', async function () {
    pingAPI = new PingAPI();
    try {
        response = await pingAPI.healthCheck();
    } catch (e) {
        error = e;
    }
});

Then('the API should respond with status code {int}', function (expectedStatus) {
    expect(response.statusCode).toBe(expectedStatus);
});

Then('the response time should be within acceptable limits', function () {
    expect(response.responseTime).toBeLessThan(2000); // 2 seconds threshold
});

Given('the API service is unreachable', function () {
    pingAPI = new PingAPI();
    pingAPI.setBaseURL('https://invalid-url.example.com');
});

Then('the request should timeout or fail appropriately', function () {
    expect(error).toBeDefined();
});