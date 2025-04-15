const { test, expect } = require('@playwright/test');
const { BookingAPI } = require('../pages/BookingAPI');

test.describe('Booking Tests', () => {
    let bookingAPI;
    let bookingId;

    const sampleBooking = {
        firstname: "John",
        lastname: "Doe",
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
            checkin: "2025-06-01",
            checkout: "2025-06-05"
        },
        additionalneeds: "Breakfast"
    };

    test.beforeEach(async () => {
        bookingAPI = new BookingAPI();
    });

    test.afterEach(async () => {
        if (bookingId) {
            try {
                await bookingAPI.deleteBooking(bookingId);
            } catch (error) {
                console.log('Cleanup - Delete booking failed:', error.message);
            }
        }
    });

    test('should create a new booking', async () => {
        const response = await bookingAPI.createBooking(sampleBooking);
        bookingId = response.bookingid;
        
        expect(response.booking).toBeDefined();
        expect(response.bookingid).toBeDefined();
        expect(response.booking.firstname).toBe(sampleBooking.firstname);
        expect(response.booking.lastname).toBe(sampleBooking.lastname);
        expect(response.booking.totalprice).toBe(sampleBooking.totalprice);
        expect(response.booking.depositpaid).toBe(sampleBooking.depositpaid);
        expect(response.booking.bookingdates).toEqual(sampleBooking.bookingdates);
        expect(response.booking.additionalneeds).toBe(sampleBooking.additionalneeds);
    });

    test('should get an existing booking', async () => {
        // Create a booking first
        const createResponse = await bookingAPI.createBooking(sampleBooking);
        bookingId = createResponse.bookingid;

        // Get the booking
        const booking = await bookingAPI.getBooking(bookingId);
        expect(booking).toEqual(sampleBooking);
    });

    test('should update an existing booking', async () => {
        // Create a booking first
        const createResponse = await bookingAPI.createBooking(sampleBooking);
        bookingId = createResponse.bookingid;

        // Update booking
        const updateData = {
            ...sampleBooking,
            firstname: "Jane",
            totalprice: 200
        };

        const updatedBooking = await bookingAPI.updateBooking(bookingId, updateData);
        expect(updatedBooking.firstname).toBe("Jane");
        expect(updatedBooking.totalprice).toBe(200);
        
        // Verify the update
        const getBooking = await bookingAPI.getBooking(bookingId);
        expect(getBooking).toEqual(updateData);
    });

    test('should partially update a booking', async () => {
        // Create a booking first
        const createResponse = await bookingAPI.createBooking(sampleBooking);
        bookingId = createResponse.bookingid;

        // Partial update
        const partialUpdate = {
            firstname: "Robert",
            lastname: "Smith"
        };

        const updatedBooking = await bookingAPI.partialUpdateBooking(bookingId, partialUpdate);
        expect(updatedBooking.firstname).toBe("Robert");
        expect(updatedBooking.lastname).toBe("Smith");
        
        // Other fields should remain unchanged
        expect(updatedBooking.totalprice).toBe(sampleBooking.totalprice);
        expect(updatedBooking.depositpaid).toBe(sampleBooking.depositpaid);
    });

    test('should delete a booking', async () => {
        // Create a booking first
        const createResponse = await bookingAPI.createBooking(sampleBooking);
        bookingId = createResponse.bookingid;

        // Delete the booking
        const isDeleted = await bookingAPI.deleteBooking(bookingId);
        expect(isDeleted).toBe(true);

        // Verify booking is deleted
        try {
            await bookingAPI.getBooking(bookingId);
            throw new Error('Booking should not exist');
        } catch (error) {
            expect(error.message).toContain('404');
        }

        // Clear bookingId since we've already deleted it
        bookingId = null;
    });

    test('should fail to get non-existent booking', async () => {
        try {
            await bookingAPI.getBooking(999999999);
            throw new Error('Should not get non-existent booking');
        } catch (error) {
            expect(error.message).toContain('404');
        }
    });

    test('should fail to update non-existent booking', async () => {
        try {
            await bookingAPI.updateBooking(999999999, sampleBooking);
            throw new Error('Should not update non-existent booking');
        } catch (error) {
            expect(error.message).toContain('404');
        }
    });
});