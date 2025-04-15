const { test, expect } = require('@playwright/test');
const { AuthAPI } = require('../pages/AuthAPI');

test.describe('Authentication Tests', () => {
    let authAPI;

    test.beforeEach(async () => {
        authAPI = new AuthAPI();
    });

    test('should create token with valid credentials', async () => {
        const response = await authAPI.createToken('admin', 'password123');
        expect(response.token).toBeDefined();
        expect(typeof response.token).toBe('string');
        expect(response.token.length).toBeGreaterThan(0);
    });

    test('should fail to create token with invalid credentials', async () => {
        try {
            await authAPI.createToken('invalid', 'wrongpass');
        } catch (error) {
            expect(error.message).toContain('401');
        }
    });

    test('should validate a valid token', async () => {
        const { token } = await authAPI.createToken('admin', 'password123');
        const isValid = await authAPI.validateToken(token);
        expect(isValid).toBe(true);
    });

    test('should fail to validate invalid token', async () => {
        const isValid = await authAPI.validateToken('invalid_token');
        expect(isValid).toBe(false);
    });
});