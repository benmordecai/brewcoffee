
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const appTsxPath = path.resolve(__dirname, '../src/App.tsx');

try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const appVersion = packageJson.version;

    let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
    const updatedContent = appTsxContent.replace(/__APP_VERSION__/g, appVersion);

    fs.writeFileSync(appTsxPath, updatedContent, 'utf8');
    console.log(`App version updated to: ${appVersion}`);
} catch (error) {
    console.error('Error updating app version:', error);
    process.exit(1);
}
