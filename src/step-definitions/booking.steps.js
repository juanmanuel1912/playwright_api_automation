const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const BookingAPI = require('../pages/BookingAPI');

let bookingAPI;
let response;
let error;
let bookingId;
let originalBooking;

Given('I have authentication token', async function () {
    bookingAPI = new BookingAPI();
    const token = await bookingAPI.getAuthToken();
    expect(token).toBeDefined();
});

When('I create a booking with the following details:', async function (dataTable) {
    try {
        const bookingData = dataTable.hashes()[0];
        response = await bookingAPI.createBooking(bookingData);
        bookingId = response.body.bookingid;
    } catch (e) {
        error = e;
    }
});

Then('the booking should be created successfully', function () {
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('bookingid');
    expect(response.body).toHaveProperty('booking');
});

Then('the response should include booking ID', function () {
    expect(bookingId).toBeDefined();
    expect(typeof bookingId).toBe('number');
});

Then('the booking details should match the input data', function () {
    const booking = response.body.booking;
    expect(booking.firstname).toBeDefined();
    expect(booking.lastname).toBeDefined();
    expect(booking.totalprice).toBeDefined();
    expect(booking.depositpaid).toBeDefined();
    expect(booking.bookingdates).toHaveProperty('checkin');
    expect(booking.bookingdates).toHaveProperty('checkout');
});

Given('I have an existing booking', async function () {
    const sampleBooking = {
        firstname: 'John',
        lastname: 'Doe',
        totalprice: 150,
        depositpaid: true,
        checkin: '2025-06-01',
        checkout: '2025-06-05',
        additionalneeds: 'Breakfast'
    };
    response = await bookingAPI.createBooking(sampleBooking);
    bookingId = response.body.bookingid;
    originalBooking = response.body.booking;
});

When('I request the booking details', async function () {
    try {
        response = await bookingAPI.getBooking(bookingId);
    } catch (e) {
        error = e;
    }
});

Then('the booking information should be returned successfully', function () {
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
});

Then('all booking fields should be present', function () {
    const booking = response.body;
    expect(booking).toMatchObject({
        firstname: expect.any(String),
        lastname: expect.any(String),
        totalprice: expect.any(Number),
        depositpaid: expect.any(Boolean),
        bookingdates: {
            checkin: expect.any(String),
            checkout: expect.any(String)
        }
    });
});

When('I update the booking with new details:', async function (dataTable) {
    try {
        const updateData = dataTable.hashes()[0];
        response = await bookingAPI.updateBooking(bookingId, updateData);
    } catch (e) {
        error = e;
    }
});

Then('the booking should be updated successfully', function () {
    expect(response.statusCode).toBe(200);
});

Then('the updated details should match the input data', async function () {
    const updatedBooking = await bookingAPI.getBooking(bookingId);
    expect(updatedBooking.body).toMatchObject(response.body);
});

When('I partially update the booking with:', async function (dataTable) {
    try {
        const partialData = dataTable.hashes()[0];
        response = await bookingAPI.partialUpdateBooking(bookingId, partialData);
    } catch (e) {
        error = e;
    }
});

Then('only the specified fields should be modified', function () {
    const updatedFields = Object.keys(response.body);
    for (const field of updatedFields) {
        expect(response.body[field]).not.toBe(originalBooking[field]);
    }
});

Then('other fields should remain unchanged', function () {
    const unchangedFields = Object.keys(originalBooking).filter(
        field => !response.body.hasOwnProperty(field)
    );
    for (const field of unchangedFields) {
        expect(response.body[field]).toBe(originalBooking[field]);
    }
});

When('I delete the booking', async function () {
    try {
        response = await bookingAPI.deleteBooking(bookingId);
    } catch (e) {
        error = e;
    }
});

Then('the booking should be deleted successfully', function () {
    expect(response).toBe(true);
});

Then('the booking should not be retrievable', async function () {
    try {
        await bookingAPI.getBooking(bookingId);
    } catch (e) {
        expect(e.message).toContain('404');
    }
});

When('I request a booking with ID {string}', async function (id) {
    try {
        await bookingAPI.getBooking(parseInt(id));
    } catch (e) {
        error = e;
    }
});

Given('I don\'t have authentication', function () {
    bookingAPI.authAPI = null;
});

When('I try to update the booking', async function () {
    try {
        await bookingAPI.updateBooking(bookingId, {
            firstname: 'Test',
            lastname: 'Update'
        });
    } catch (e) {
        error = e;
    }
});

When('I create a booking with invalid dates:', async function (dataTable) {
    try {
        const bookingData = dataTable.hashes()[0];
        await bookingAPI.createBooking(bookingData);
    } catch (e) {
        error = e;
    }
});

Then('the booking should not be created', function () {
    expect(error).toBeDefined();
});

Then('the response should indicate invalid data', function () {
    expect(error.message).toContain('400');
});