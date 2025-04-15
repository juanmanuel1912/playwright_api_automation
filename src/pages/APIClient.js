const { request } = require('@playwright/test');
const Config = require('../utils/config');

class APIClient {
    constructor() {
        const config = Config.getEnvironmentConfig();
        this.baseURL = config.baseURL;
        this.timeout = config.timeout;
        this.responseTime = null;
    }

    setBaseURL(url) {
        this.baseURL = url;
    }

    getResponseTime() {
        return this.responseTime;
    }

    async measureResponseTime(requestFn) {
        const start = Date.now();
        try {
            const response = await requestFn();
            this.responseTime = Date.now() - start;
            return response;
        } catch (error) {
            this.responseTime = Date.now() - start;
            throw error;
        }
    }

    async createRequest() {
        return await request.newContext({
            baseURL: this.baseURL,
            headers: Config.getRequestHeaders(),
            timeout: this.timeout
        });
    }

    async handleResponse(response) {
        const result = {
            statusCode: response.status(),
            body: null,
            responseTime: this.responseTime
        };

        if (response.ok()) {
            try {
                result.body = await response.json();
            } catch (e) {
                result.body = await response.text();
            }
        } else {
            throw new Error(`API request failed with status ${response.status()}: ${await response.text()}`);
        }

        return result;
    }
}

module.exports = APIClient;