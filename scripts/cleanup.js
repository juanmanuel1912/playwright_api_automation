const fs = require('fs');
const path = require('path');

const directories = ['reports', 'allure-results', 'allure-report'];

function cleanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            cleanDirectory(fullPath);
            fs.rmdirSync(fullPath);
        } else {
            fs.unlinkSync(fullPath);
        }
    }
}

// Ensure reports directory exists
const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Clean directories
directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    console.log(`Cleaning directory: ${dirPath}`);
    cleanDirectory(dirPath);
});

console.log('Cleanup completed successfully!');