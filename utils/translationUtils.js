const { expect } = require('@playwright/test');

function verifyTextTranslation({ english, spanish }) {
    const untranslatedTexts = [];

    for (const section of Object.keys(english)) {
        const englishTexts = english[section];
        const spanishTexts = spanish[section] || [];

        englishTexts.forEach(englishText => {
            const spanishMatch = spanishTexts.find(spanishText => spanishText.text === englishText.text);

            if (spanishMatch) {
                untranslatedTexts.push({ selector: section, text: englishText.text, html: englishText.html });
            }
        });
    }
    return untranslatedTexts;
}

function verifyNavigationTranslation({ english, spanish }) {
    const untranslatedTexts = [];
    const spanishItems = spanish["Navigation menu"] || [];

    english["Navigation menu"].forEach(item => {
        const spanishMatch = spanishItems.find(
            spanishItem =>
                spanishItem.id === item.id &&
                spanishItem.text === item.text
        );

        if (spanishMatch) {
            untranslatedTexts.push({ selector: spanishMatch.location, text: item.text, html: item.html});
        }
    });
    return untranslatedTexts;
}

function assertNoUntranslatedTexts(untranslatedTexts) {
    expect(
        untranslatedTexts,
        `Untranslated texts found: ${JSON.stringify(untranslatedTexts)}`
    ).toHaveLength(0);
}

module.exports = {
    verifyTextTranslation,
    verifyNavigationTranslation,
    assertNoUntranslatedTexts
};