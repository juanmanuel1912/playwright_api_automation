const reporter = require('cucumber-html-reporter');
const path = require('path');

const options = {
    theme: 'bootstrap',
    jsonFile: path.join(__dirname, 'cucumber.json'),
    output: path.join(__dirname, 'cucumber-report.html'),
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    metadata: {
        "App Version": "1.0.0",
        "Test Environment": "Test",
        "Platform": "Windows",
        "Ejecutado": "Local"
    },
    customData: {
        title: 'Reporte de Pruebas',
        data: [
            { label: 'Proyecto', value: 'API Testing Framework' },
            { label: 'Fecha de Ejecución', value: new Date().toLocaleString() }
        ]
    }
};

reporter.generate(options);