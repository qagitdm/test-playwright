function userAgentInfo(value) {
    const chromeClient = value.match(/Chrome\/([\d.]+)/);
    const safariClient = value.match(/Version\/([\d.]+) Safari/);

    if (chromeClient && !value.includes('Edge')) {
        return `Chrome ${chromeClient[1]}`;
    }

    if (safariClient && !value.includes('Chrome')) {
        return `WebKit ${safariClient[1]}`;
    }

    return 'Unknown';
}

async function webClientInfo(value) {
    const userAgent = await value.evaluate(() => navigator.userAgent);
    const webClient = userAgentInfo(userAgent);

    return `${webClient}`;
}

module.exports = {
    webClientInfo
};