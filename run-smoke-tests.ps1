# Clean up reports
Remove-Item -Path "reports\*.html" -ErrorAction SilentlyContinue
Remove-Item -Path "reports\*.json" -ErrorAction SilentlyContinue
Remove-Item -Path "allure-results" -Recurse -ErrorAction SilentlyContinue
Remove-Item -Path "allure-report" -Recurse -ErrorAction SilentlyContinue

# Run smoke tests
npx cucumber-js --tags @smoke --format @cucumber/pretty-formatter --format json:reports/smoke-test-report.json --format html:reports/smoke-test-report.html

# Generate report
node reports/generate-smoke-report.js