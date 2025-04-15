const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');

BeforeAll(async function() {
    // Setup global test context
    global.testContext = {};
});

Before(async function(scenario) {
    // Reset test context before each scenario
    global.testContext = {
        scenarioName: scenario.pickle.name
    };
});

After(async function(scenario) {
    // Cleanup after each scenario
    if (scenario.result.status === 'FAILED') {
        console.log(`Scenario failed: ${scenario.pickle.name}`);
        console.log(`Error: ${scenario.result.exception}`);
    }
});

AfterAll(async function() {
    // Cleanup after all scenarios
    global.testContext = null;
});