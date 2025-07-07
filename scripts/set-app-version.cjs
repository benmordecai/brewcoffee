
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const appTsxPath = path.resolve(__dirname, '../src/App.tsx');
const buildGradlePath = path.resolve(__dirname, '../android/app/build.gradle');

try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const appVersion = packageJson.version;
    const [major, minor, patch] = appVersion.split('.').map(Number);
    const versionCode = major * 10000 + minor * 100 + patch; // Simple scheme for versionCode

    // Update App.tsx
    let appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
    const updatedAppTsxContent = appTsxContent.replace(/__APP_VERSION__/g, appVersion);
    fs.writeFileSync(appTsxPath, updatedAppTsxContent, 'utf8');
    console.log(`App version updated to: ${appVersion}`);

    // Update build.gradle
    let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
    const updatedBuildGradleContent = buildGradleContent
        .replace(/versionCode \d+/, `versionCode ${versionCode}`)
        .replace(/versionName "[\d.]+"/, `versionName "${appVersion}"`);
    fs.writeFileSync(buildGradlePath, updatedBuildGradleContent, 'utf8');
    console.log(`Android build.gradle updated with versionCode: ${versionCode}, versionName: ${appVersion}`);

} catch (error) {
    console.error('Error updating app version:', error);
    process.exit(1);
}
