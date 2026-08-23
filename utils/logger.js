const { allure } = require('allure-playwright');

class Logger {
    static step(message) {
        allure.step(message, async () => {});
        console.log(`STEP: ${message}`);
    }

    static info(message) {
        allure.step(`INFO: ${message}`, async () => {});
        console.log(`INFO: ${message}`);
    }

    static warn(message) {
        allure.step(`WARN: ${message}`, async () => {});
        console.warn(`WARN: ${message}`);
    }

    static error(message) {
        allure.step(`ERROR: ${message}`, async () => {});
        console.error(`ERROR: ${message}`);
    }
}

module.exports = Logger;