const { defineConfig, devices } = require('@playwright/test');
const commonConfig = require('./common.config');
const path = require('path');

const capabilities = commonConfig.getCapabilities(
    'pw-webkit',
    'macOS Big Sur',
    'Playwright BigSur Webkit',
    'Login Test',
    path.basename(__filename, '.config.js')
);

module.exports = defineConfig({
    ...commonConfig,
    projects: [
        {
            name: 'Playwright macOS Big sur',
            use: {
                ...devices['Desktop Safari'],
                connectOptions: {
                    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
                        JSON.stringify(capabilities)
                    )}`,
                },
            },
            testIgnore: [
                '**/specs/classroomTranslate.js'
            ],
        },
    ],
});