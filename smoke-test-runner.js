const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure reports directory exists
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Clean previous reports
try {
    ['html', 'json'].forEach(ext => {
        const files = fs.readdirSync(reportsDir)
            .filter(file => file.endsWith(`.${ext}`))
            .map(file => path.join(reportsDir, file));
        
        files.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
    });

    ['allure-results', 'allure-report'].forEach(dir => {
        const dirPath = path.join(__dirname, dir);
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
    });
} catch (error) {
    console.log('Clean up warning:', error.message);
}

// Run smoke tests
console.log('Running smoke tests...');
try {
    const cucumberPath = path.join(__dirname, 'node_modules', '.bin', 'cucumber-js');
    const cmd = [
        cucumberPath,
        '--tags "@smoke"',
        '--format @cucumber/pretty-formatter',
        `--format json:${path.join(reportsDir, 'smoke-test-report.json')}`,
        `--format html:${path.join(reportsDir, 'smoke-test-report.html')}`,
        '--require "src/step-definitions/*.js"',
        'src/features/*.feature'
    ].join(' ');

    execSync(cmd, {
        stdio: 'inherit',
        env: {
            ...process.env,
            FORCE_COLOR: 1
        }
    });

    // Generate HTML report
    console.log('\nGenerating HTML report...');
    require('./reports/generate-smoke-report.js');

    console.log('\nSmoke tests completed! Check the reports directory for results.');
} catch (error) {
    console.error('\nError running tests:', error.message);
    process.exit(1);
}