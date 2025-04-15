const APIClient = require('./APIClient');

class PingAPI extends APIClient {
    async healthCheck() {
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.get('/ping')
        );
        const result = await this.handleResponse(response);
        return {
            isHealthy: result.statusCode === 201,
            responseTime: this.getResponseTime(),
            statusCode: result.statusCode
        };
    }
}

module.exports = PingAPI;