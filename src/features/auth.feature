Feature: Authentication API Testing
    As an API user
    I want to manage authentication
    So that I can access secure endpoints

    @smoke @happy-path
    Scenario: Successfully create authentication token
        When I request a token with valid credentials:
            | username | password    |
            | admin    | password123 |
        Then the token should be created successfully
        And the response should have a valid token format
        And the token should be non-empty

    @unhappy-path
    Scenario: Fail to authenticate with invalid credentials
        When I request a token with invalid credentials:
            | username | password  |
            | invalid  | wrongpass |
        Then the response status code should be 401
        And the response should contain an error message