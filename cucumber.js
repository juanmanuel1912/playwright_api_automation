const path = require('path');

const config = {
    default: {
        paths: [path.join(process.cwd(), 'src', 'features', '*.feature')],
        require: [path.join(process.cwd(), 'src', 'step-definitions', '*.js')],
        requireModule: ['@cucumber/pretty-formatter'],
        format: [
            '@cucumber/pretty-formatter',
            ['html:reports/cucumber-report.html'],
            ['json:reports/cucumber-report.json']
        ],
        publishQuiet: true,
        worldParameters: {
            baseUrl: 'https://restful-booker.herokuapp.com'
        }
    }
};

module.exports = config;