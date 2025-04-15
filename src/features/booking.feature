Feature: Booking API Testing
    As a hotel manager
    I want to manage hotel bookings
    So that I can handle room reservations effectively

    Background:
        Given I have authentication token

    @smoke @happy-path
    Scenario: Create a new booking successfully
        When I create a booking with the following details:
            | firstname | lastname | totalprice | depositpaid | checkin    | checkout   | additionalneeds |
            | John     | Doe      | 150        | true        | 2025-06-01 | 2025-06-05 | Breakfast      |
        Then the booking should be created successfully
        And the response should include booking ID
        And the booking details should match the input data

    @smoke @happy-path
    Scenario: Retrieve an existing booking
        Given I have an existing booking
        When I request the booking details
        Then the booking information should be returned successfully
        And all booking fields should be present

    @happy-path
    Scenario: Update an existing booking completely
        Given I have an existing booking
        When I update the booking with new details:
            | firstname | lastname | totalprice | depositpaid | checkin    | checkout   | additionalneeds |
            | Jane     | Smith    | 200        | true        | 2025-07-01 | 2025-07-10 | Dinner         |
        Then the booking should be updated successfully
        And the updated details should match the input data

    @happy-path
    Scenario: Partially update a booking
        Given I have an existing booking
        When I partially update the booking with:
            | firstname | totalprice |
            | Robert   | 175        |
        Then the booking should be updated successfully
        And only the specified fields should be modified
        And other fields should remain unchanged

    @smoke @happy-path
    Scenario: Delete an existing booking
        Given I have an existing booking
        When I delete the booking
        Then the booking should be deleted successfully
        And the booking should not be retrievable

    @smoke @unhappy-path
    Scenario: Attempt to retrieve non-existent booking
        When I request a booking with ID "999999999"
        Then the response status code should be 404

    @unhappy-path
    Scenario: Attempt to update booking without authentication
        Given I have an existing booking
        And I don't have authentication
        When I try to update the booking
        Then the response status code should be 403

    @unhappy-path
    Scenario: Create booking with invalid dates
        When I create a booking with invalid dates:
            | firstname | lastname | totalprice | depositpaid | checkin    | checkout   |
            | John     | Doe      | 150        | true        | 2025-06-05 | 2025-06-01 |
        Then the booking should not be created
        And the response should indicate invalid data