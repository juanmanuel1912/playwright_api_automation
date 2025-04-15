const APIClient = require('./APIClient');
const AuthAPI = require('./AuthAPI');

class BookingAPI extends APIClient {
    constructor() {
        super();
        this.authAPI = new AuthAPI();
    }

    async getAuthToken() {
        const response = await this.authAPI.createToken('admin', 'password123');
        return response.body.token;
    }

    async createBooking(bookingData) {
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.post('/booking', {
                data: {
                    firstname: bookingData.firstname,
                    lastname: bookingData.lastname,
                    totalprice: parseInt(bookingData.totalprice),
                    depositpaid: Boolean(bookingData.depositpaid),
                    bookingdates: {
                        checkin: bookingData.checkin,
                        checkout: bookingData.checkout
                    },
                    additionalneeds: bookingData.additionalneeds
                }
            })
        );
        return this.handleResponse(response);
    }

    async getBooking(bookingId) {
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.get(`/booking/${bookingId}`)
        );
        return this.handleResponse(response);
    }

    async getAllBookings(queryParams = {}) {
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.get('/booking', {
                params: queryParams
            })
        );
        return this.handleResponse(response);
    }

    async updateBooking(bookingId, bookingData) {
        const token = await this.getAuthToken();
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.put(`/booking/${bookingId}`, {
                headers: {
                    'Cookie': `token=${token}`
                },
                data: {
                    firstname: bookingData.firstname,
                    lastname: bookingData.lastname,
                    totalprice: parseInt(bookingData.totalprice),
                    depositpaid: Boolean(bookingData.depositpaid),
                    bookingdates: {
                        checkin: bookingData.checkin,
                        checkout: bookingData.checkout
                    },
                    additionalneeds: bookingData.additionalneeds
                }
            })
        );
        return this.handleResponse(response);
    }

    async partialUpdateBooking(bookingId, partialData) {
        const token = await this.getAuthToken();
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.patch(`/booking/${bookingId}`, {
                headers: {
                    'Cookie': `token=${token}`
                },
                data: partialData
            })
        );
        return this.handleResponse(response);
    }

    async deleteBooking(bookingId) {
        const token = await this.getAuthToken();
        const context = await this.createRequest();
        const response = await this.measureResponseTime(() => 
            context.delete(`/booking/${bookingId}`, {
                headers: {
                    'Cookie': `token=${token}`
                }
            })
        );
        return response.ok();
    }
}

module.exports = BookingAPI;