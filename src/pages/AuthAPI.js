const APIClient = require('./APIClient');
const Config = require('../utils/config');

class AuthAPI extends APIClient {
    async createToken(username = null, password = null) {
        const config = Config.getEnvironmentConfig();
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.post('/auth', {
                data: {
                    username: username || config.username,
                    password: password || config.password
                }
            })
        );
        return this.handleResponse(response);
    }

    async verifyToken(token) {
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.post('/auth/validate', {
                headers: {
                    'Cookie': `token=${token}`
                }
            })
        );
        return response.ok();
    }
}

module.exports = AuthAPI;