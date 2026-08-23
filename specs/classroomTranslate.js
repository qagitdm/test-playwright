import { test, expect } from '@playwright/test';

import * as allureReporter from 'allure-js-commons';
import { webClientInfo } from '../utils/allureUtils';
import { appendUntranslatedTexts } from '../utils/spreadSheetUtils';
import { verifyTextTranslation, verifyNavigationTranslation, assertNoUntranslatedTexts } from '../utils/translationUtils';

import ClassroomLoginPage from '../pageobjects/classroomLoginPage';
import ClassroomSignupPage from '../pageobjects/classroomSignupPage';
import ClassroomResetPasswordPage from '../pageobjects/classroomResetPasswordPage';
import ClassroomPage from '../pageobjects/classroomPage';
import UsahelloPage from '../pageobjects/usahelloPage';

const EMAIL = process.env.EMAIL_REGISTERED;
const FAKE_EMAIL = 'fakevalue@test.com';
const FAKE_PASSWORD = 'fakevalue';

const translationPages = [
    {
        name: 'classroom',
        page: ClassroomPage,
        open: 'openClassroom'
    },
    {
        name: 'login',
        page: ClassroomLoginPage,
        open: 'openLogin'
    },
    {
        name: 'registration',
        page: ClassroomSignupPage,
        open: 'openSignup'
    },
    {
        name: 'reset password',
        page: ClassroomResetPasswordPage,
        open: 'openResetPassword'
    }
];

test.beforeEach(async ({ page }) => {
    const webClient = await webClientInfo(page);
    await allureReporter.suite(`Translate: ${webClient}`);
});

// for (const { name, page: Page, open } of translationPages) {
//   test(`should update the ${name} page URL when switching languages`, async ({ page }) => {
//     const pageObject = new Page(page);
//
//     await pageObject[open]();
//
//     await pageObject.selectSpanish();
//     await expect(page).toHaveURL(/\/es\//);
//
//     await pageObject.selectEnglish();
//     await expect(page).not.toHaveURL(/\/(en|es)\//);
//   });
//
//   test(`should switch ${name} page language between English and Spanish`, async ({ page }) => {
//     const pageObject = new Page(page);
//
//     await pageObject[open]();
//
//     await pageObject.selectSpanish();
//     await pageObject.hoverNav();
//     const spanish = await pageObject.collectLocalizationSnapshot();
//
//     await pageObject.selectEnglish();
//     await pageObject.hoverNav();
//     const english = await pageObject.collectLocalizationSnapshot();
//
//     verifyTextTranslation({ english, spanish });
//   });
// }
//
// test('should display login error messages in English and Spanish with a fake password', async ({ page }) => {
//   const pageObject = new ClassroomLoginPage(page);
//
//   await pageObject.openLogin();
//   await pageObject.enterEmailForLogin(EMAIL);
//   await pageObject.enterPasswordForLogin(FAKE_PASSWORD);
//   await pageObject.clickLoginBtn();
//
//   const english = await pageObject.collectErrorMessagesSnapshot();
//
//   await pageObject.openLoginSpanish();
//   await pageObject.enterEmailForLogin(EMAIL);
//   await pageObject.enterPasswordForLogin(FAKE_PASSWORD);
//   await pageObject.clickLoginBtnSpanish();
//
//   const spanish = await pageObject.collectErrorMessagesSnapshot();
//
//   verifyTextTranslation({ english, spanish });
// });
//
// test('should display login error message in English and Spanish with a fake email', async ({ page }) => {
//   const pageObject = new ClassroomLoginPage(page);
//
//   await pageObject.openLogin();
//   await pageObject.enterEmailForLogin(FAKE_EMAIL);
//   await pageObject.enterPasswordForLogin(FAKE_PASSWORD);
//   await pageObject.clickLoginBtn();
//
//   const english = await pageObject.collectErrorMessagesSnapshot();
//
//   await pageObject.openLoginSpanish();
//   await pageObject.enterEmailForLogin(FAKE_EMAIL);
//   await pageObject.enterPasswordForLogin(FAKE_PASSWORD);
//   await pageObject.clickLoginBtnSpanish();
//
//   const spanish = await pageObject.collectErrorMessagesSnapshot();
//
//   verifyTextTranslation({ english, spanish });
//
// });

// test('should display login error message in English and Spanish with a fake email', async ({ page }) => {
//   const pageObject = new UsahelloPage(page);
//
//   await pageObject.openUsahello();
//   await pageObject.openUsahello();
//   await pageObject.clickAllNavigationItems();
//
// });

test('should update USAHello header when switching languages', async ({ page }) => {
    const pageObject = new UsahelloPage(page);

    await pageObject.openUsahello();
    await pageObject.openUsahello();

    const english = await pageObject.collectHeaderLocalizationSnapshot();

    await pageObject.selectSpanish();
    const spanish = await pageObject.collectHeaderLocalizationSnapshot();

    const untranslatedTexts = verifyTextTranslation(
        {
            english: english.snapshot,
            spanish: spanish.snapshot
        }).map(item => ({
        ...item,
        url: spanish.url
    }));

    await appendUntranslatedTexts(untranslatedTexts);

    assertNoUntranslatedTexts(untranslatedTexts);
});

//test('should update USAHello navigation and footer when switching languages', async ({ page }) => {
//    const pageObject = new UsahelloPage(page);
//
//    await pageObject.openUsahello();
//    await pageObject.openUsahello();
//
//    const english = await pageObject.collectNavLocalizationSnapshot();
//
//    await pageObject.selectSpanish();
//    const spanish = await pageObject.collectNavLocalizationSnapshot();
//
//    const untranslatedTexts = verifyNavigationTranslation({
//       english: english.snapshot,
//       spanish: spanish.snapshot
//   }).map(item => ({
//       ...item,
//       url: spanish.url
//   }));
//
//  await appendUntranslatedTexts(untranslatedTexts);
//
//   assertNoUntranslatedTexts(untranslatedTexts);
//});
//
//test('should update USAHello content when switching languages', async ({ page }) => {
//    const pageObject = new UsahelloPage(page);
//
//    await pageObject.openUsahello();
//    await pageObject.openUsahello();
//
//    const english = await pageObject.collectContentLocalizationSnapshot();
//
//    await pageObject.selectSpanish();
//    const spanish = await pageObject.collectContentLocalizationSnapshot();
//
//    const untranslatedTexts = verifyTextTranslation({
//        english: english.snapshot,
//        spanish: spanish.snapshot
//    }).map(item => ({
//        ...item,
//        url: spanish.url
//    }));
//
//    await appendUntranslatedTexts(untranslatedTexts);
//
//    assertNoUntranslatedTexts(untranslatedTexts);
//});
//
//test('should update USAHello footer when switching languages', async ({ page }) => {
//    const pageObject = new UsahelloPage(page);
//
//    await pageObject.openUsahello();
//    await pageObject.openUsahello();
//
//    const english = await pageObject.collectFooterLocalizationSnapshot();
//
//    await pageObject.selectSpanish();
//    const spanish = await pageObject.collectFooterLocalizationSnapshot();
//
//    const untranslatedTexts = verifyTextTranslation({
//        english: english.snapshot,
//        spanish: spanish.snapshot
//    }).map(item => ({
//        ...item,
//        url: spanish.url
//    }));
//
//    await appendUntranslatedTexts(untranslatedTexts);
//
//    assertNoUntranslatedTexts(untranslatedTexts);
//});
//
//test('should translate every navigation page', async ({ page }) => {
//    const pageObject = new UsahelloPage(page);
//
//    await pageObject.openUsahello();
//    await pageObject.openUsahello();
//
//    const allUntranslated = [];
//
//     await pageObject.clickAllNavigationItems(async ({ menu }) => {
//         await pageObject.selectSpanish();
//         const spanish = await pageObject.collectHeaderLocalizationSnapshot();
//
//        await pageObject.selectEnglish();
//         const english = await pageObject.collectHeaderLocalizationSnapshot();
//
//        const untranslated = verifyTextTranslation({
//            english: english.snapshot,
//            spanish: spanish.snapshot
//        });
//
//        allUntranslated.push(...untranslated.map(item => ({ ...item, url: spanish.url, menu })));
//    });
//
//    await appendUntranslatedTexts(allUntranslated);
//
//    assertNoUntranslatedTexts(allUntranslated);
//});
//
// test('should navigate and translate every page', async ({ page }, testInfo) => {
//     test.slow();
//     testInfo.setTimeout(1800000);
//     const pageObject = new UsahelloPage(page);
//
//     await pageObject.openUsahello();
//     await pageObject.openUsahello();
//
//     const allUntranslated = [];
//
//     await pageObject.clickAllSitemapPages(async ({ url }) => {
//         const english = await pageObject.collectContentLocalizationSnapshot()
//
//         const hasSpanish = await pageObject.selectSpanish();
//
// 	if (!hasSpanish) {
//            return;
// 	}
//
//         const spanish = await pageObject.collectContentLocalizationSnapshot()
//
//         const untranslated = verifyTextTranslation({
//           english: english.snapshot,
//           spanish: spanish.snapshot
//         });
//
//         allUntranslated.push(
//           ...untranslated.map(item => ({
//             ...item,
//               url: spanish.url
//           }))
//         );
//     });
//
//     await appendUntranslatedTexts(allUntranslated);
//
//     assertNoUntranslatedTexts(allUntranslated);
// });

// test('should verify all translated pages', async ({ page }, testInfo) => {
//     testInfo.setTimeout(3100000);
//
//     const pageObject = new UsahelloPage(page);
//     await pageObject.openUsahello();
//     await pageObject.openUsahello();

//    await page.goto('https://usahello.org/language-archive/spanish/');

//     const allUntranslated = [];
//
//     await pageObject.clickAllTranslatedPages(async () => {
//         const english = await pageObject.collectContentLocalizationSnapshot();
//         const hasSpanish = await pageObject.selectSpanish();
//
//         if (!hasSpanish) { return; }
//         const spanish = await pageObject.collectContentLocalizationSnapshot();
//
//         const untranslated = verifyTextTranslation({
//             english: english.snapshot,
//             spanish: spanish.snapshot
//         });
//
//         allUntranslated.push(
//             ...untranslated.map(item => ({ ...item, url: spanish.url }))
//         );
//     });
//
//     await appendUntranslatedTexts(allUntranslated);
//
//     assertNoUntranslatedTexts(allUntranslated);
//
//
// });