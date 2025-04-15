class Config {
    static getEnvironmentConfig() {
        return {
            baseURL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
            timeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
            retries: parseInt(process.env.TEST_RETRIES) || 2,
            username: process.env.AUTH_USERNAME || 'admin',
            password: process.env.AUTH_PASSWORD || 'password123'
        };
    }

    static getRequestHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    static getTestConfig() {
        return {
            parallel: 3,
            retry: this.getEnvironmentConfig().retries,
            timeout: this.getEnvironmentConfig().timeout,
            reporter: [
                ['list'],
                ['allure-cucumberjs']
            ]
        };
    }
}

module.exports = Config;