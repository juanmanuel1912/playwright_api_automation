const { AllureRuntime } = require('allure-js-commons');
const { CucumberAllureFormatter } = require('allure-cucumberjs');

module.exports = class Reporter extends CucumberAllureFormatter {
    constructor(options) {
        super(
            options,
            new AllureRuntime({ resultsDir: './allure-results' }),
            {
                labels: [
                    {
                        name: 'epic',
                        pattern: [/@feature:(.*)/]
                    },
                    {
                        name: 'severity',
                        pattern: [/@severity:(.*)/]
                    }
                ]
            }
        );
    }
};