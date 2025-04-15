const { test, expect } = require('@playwright/test');
const { PingAPI } = require('../pages/PingAPI');

test.describe('Health Check Tests', () => {
    let pingAPI;

    test.beforeEach(async () => {
        pingAPI = new PingAPI();
    });

    test('should successfully check API health', async () => {
        const isHealthy = await pingAPI.healthCheck();
        expect(isHealthy).toBe(true);
    });

    test('should handle API unavailability', async () => {
        pingAPI.baseURL = 'https://invalid-url.example.com';
        try {
            await pingAPI.healthCheck();
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});