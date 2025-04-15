Feature: Health Check API Testing
    As a system administrator
    I want to monitor the API health
    So that I can ensure the service is available

    @smoke @happy-path
    Scenario: Successfully check API health
        When I send a health check request
        Then the API should respond with status code 201
        And the response time should be within acceptable limits

    @unhappy-path
    Scenario: Handle service unavailability
        Given the API service is unreachable
        When I send a health check request
        Then the request should timeout or fail appropriately