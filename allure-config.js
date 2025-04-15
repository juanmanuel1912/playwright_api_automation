const { CucumberJSAllureFormatter } = require("allure-cucumberjs");
const { AllureRuntime } = require("allure-js-commons");

function createAllureFormatter(options) {
    return new CucumberJSAllureFormatter(
        options,
        new AllureRuntime({ resultsDir: "./allure-results" }),
        {
            labels: [
                {
                    pattern: [/@feature:(.*)/],
                    name: "epic"
                },
                {
                    pattern: [/@severity:(.*)/],
                    name: "severity"
                }
            ],
            links: [
                {
                    pattern: [/@issue=(.*)/],
                    type: "issue",
                    urlTemplate: "http://localhost/issues/%s"
                }
            ]
        }
    );
}

module.exports = createAllureFormatter;