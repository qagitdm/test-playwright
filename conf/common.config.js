const { defineConfig } = require('@playwright/test');
const path = require('path');
require('dotenv').config();

const commonCapabilities = {
    network: true,
    video: true,
    console: true,
};

const getCapabilities = (browserName, platform, buildName, testName, specName) => ({
    browserName,
    browserVersion: 'latest',
    'LT:Options': {
        ...commonCapabilities,
        platform,
        build: buildName,
        name: `${specName}`,
        user: process.env.USERNAME_LT,
        accessKey: process.env.ACCESS_KEY_LT,
    },
});

module.exports = defineConfig({
    testDir: path.resolve(__dirname, '../specs'),
    timeout: 300000,
    retries: 0,
    reporter: [['list'], ['allure-playwright']],
    use: {
        baseURL: process.env.BASE_URL,
        headless: false,
        screenshot: 'only-on-failure',
        video: 'off',
        viewport: null,
        launchOptions: {
            args: ['--window-size=1920,1080']
        },
        screenshotPath: './allure-results/screenshots'
    },
    getCapabilities,
    testMatch: '**/specs/*.js',
    outputDir: './allure-results',
    test: {
        afterEach: async ({ page }, testInfo) => {
            if (testInfo.status === 'failed') {
                const screenshot = await page.screenshot();
                testInfo.attachments.push({
                    name: 'Failure Screenshot', path: screenshot, contentType: 'image/png'
                });
            }
        }
    }
});
