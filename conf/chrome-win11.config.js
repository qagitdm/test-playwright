const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');

const capabilities = commonConfig.getCapabilities(
    'Chrome',
    'Windows 11',
    'Playwright Win 11 Chrome',
    'Login Test',
    path.basename(__filename, '.config.js')
);

module.exports = defineConfig({
    ...commonConfig,
    projects: [
        {
            name: 'Playwright Windows 11',
            use: {
                ...devices['Desktop Chrome'],
                connectOptions: {
                    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
                        JSON.stringify(capabilities)
                    )}`,
                },
            },
        },
    ],
});