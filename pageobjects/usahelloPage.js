import * as allureReporter from 'allure-js-commons';

class UsahelloPage {
    constructor(page) {
        this.page = page;

    }

    get nav() { return this.navbar.locator('a:is([title="Explore classes"], [title="Explora clases"])'); }
    get header() { return this.page.locator('#masthead'); }
    get navbar() { return this.header.locator('#menu-primary-navigation > li[data-target]') }
    get language() { return this.page.locator('#header-language-selector-toggle'); }
    get lang() { return this.page.locator('a:has(span:is([title="Select language"], [title="Selecciona idioma"]))'); }
//    get english() { return this.page.locator('#language-selection-modal').getByRole('link', { name: 'English' }); }
//    get spanish() { return this.page.locator('#language-selection-modal').getByRole('link', { name: /Español/ }); }
    get english() { return this.page.locator('.language-grid .language-item a').nth(0); }
    get spanish() { return this.page.locator('.language-grid .language-item a').nth(1); }
    get content() { return this.page.locator('#content'); }
    get footer() { return this.page.locator('#hello-colophon'); }

    get excludeElements() { return ['.classroom-perks', '[class*="classes usahello-fullwidth"]']; }
    get excludeTexts() {
        return [ 'hello@usahello.org', 'FindHello', 'CC BY-NC-SA 4.0', '*BTQ+', 'ged.com', '.', 'Blog', 'Facebook', 'Instagram', 'LinkedIn', 'Marketing', 'No', 'Pashto', 'Radio', 'X (Twitter)', 'Twitter', 'YouTube', 'Head Start', 'Digital Learn', 'GCFLearnfree.org', 'HIAS', 'DACA', '*TPS', 'VAWA', 'Video', '*E1, E2, E3', '*Hong Kong', '*Liberia', '*Tagalog', '*Urdu', '*Amharic', 'Medicare', 'Alabama', 'Alaska',
            'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
            'Florida', 'Georgia', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
            'Kansas', 'Kentucky', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
            'Minnesota', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
            'Ohio', 'Oklahoma', 'Rhode Island', 'Tennessee', 'Texas', 'Utah',
            'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming' ];
    }

    get excludeHeaderSelectors() {
        return [ '#menu-primary-navigation > li[data-target]' ];
    }

    get excludeContentSelectors() {
        return [ '[id$="-drivers"]' ];
    }

    get excludedSitemaps() {
        return ['/life-in-usa/life-in-usa-sitemap/', '/education/education-sitemap/', '/work/work-sitemap/', '/immigration/immigration-sitemap', '/citizenship/citizenship-sitemap/', '/health/health-sitemap/' ];
    }

    async openUsahello() {
        await allureReporter.step('Open classroom page', async () => {
            await this.page.goto('about:blank');
            // await this.page.goto('https://staging-usahello.kinsta.cloud/spanish/?noRecaptcha=true');
            await this.page.goto(`${process.env.USAHello_URL}`);
            await this.page.waitForTimeout(3000);
        });
    }

    async hoverNav() {
        await allureReporter.step('Hover navigation menu', async () => {
            await this.nav.hover();
        });
    }

    async selectEnglish() {
        await allureReporter.step('Select English', async () => {
            await this.language.click();
            await this.english.click();

            await this.page.waitForLoadState('domcontentloaded');
        });
    }

    async selectSpanish() {
        return await allureReporter.step('Select Spanish', async () => {
            await this.language.click();

            // if (await this.spanish.isVisible()) {
            //     await this.spanish.click();
            //     await this.page.waitForLoadState('domcontentloaded');
            // }

            if (!(await this.spanish.count())) {
                return false;
            }

            await this.spanish.click();
            await this.page.waitForLoadState('domcontentloaded');

            return true;
        });
    }

    async collectHeaderLocalizationSnapshot() {
        const snapshot = await this.collectLocalizationSnapshot({
            containers: [
                {
                    name: 'Header',
                    element: this.header
                }
            ],
            excludeSelectors: this.excludeHeaderSelectors
        });

        return {
            url: this.page.url(),
            snapshot
        };
    }

    async collectNavLocalizationSnapshot() {
        return await allureReporter.step('Collect navigation localization snapshot', async () => {
                const items = await this.collectNavigationItems();

                return {
                    url: this.page.url(),

                    snapshot: {
                        "Navigation menu": items
                            .map(item => ({ ...item }))
                            .sort((a, b) =>
                                a.id.localeCompare(b.id) ||
                                a.text.localeCompare(b.text)
                            )
                    }
                };
            }
        );
    }

    async collectContentLocalizationSnapshot() {
        const snapshot = await this.collectLocalizationSnapshot({
            containers: [
                {
                    name: 'Content',
                    element: this.content
                }
            ],
            excludeSelectors: this.excludeContentSelectors
        });

        return {
            url: this.page.url(),
            snapshot
        };
    }

    async collectFooterLocalizationSnapshot() {
        const snapshot = await this.collectLocalizationSnapshot({
            containers: [
                {
                    name: 'Footer',
                    element: this.footer
                }
            ]
        });

        return {
            url: this.page.url(),
            snapshot
        };
    }

    async collectNavigationItems() {
        const result = [];

        const menuItems = await this.navbar.all();

        for (const menuItem of menuItems) {
            const menuId = await menuItem.getAttribute('id');

            const mainLink = menuItem.locator('a.tier-1');

            const mainInfo = await mainLink.evaluate(el => ({
                text: el.innerText.trim(),
                html: el.outerHTML,
                tag: el.tagName.toLowerCase(),
                className: el.className
            }));

            if (!mainInfo.text) {
                continue;
            }

            await mainLink.hover();
            await this.page.waitForTimeout(500);

            const subMenus = await menuItem
                .locator('.dr-Submenu-container a.primary-nav-link')
                .evaluateAll(links =>
                    links
                        .filter(link => link.offsetParent !== null)
                        .map(link => ({
                            text: link.innerText.trim(),
                            html: link.outerHTML,
                            tag: link.tagName.toLowerCase(),
                            className: link.className
                        }))
                );

            for (const subInfo of subMenus) {
                if (!subInfo.text || this.excludeTexts.includes(subInfo.text)) {
                    continue;
                }

                result.push({
                    id: menuId,
                    location: [
                        'Navigation menu',
                        mainInfo.text
                    ],
                    ...subInfo
                });
            }
        }

        console.log(
            JSON.stringify(result,
                null,
                2
            )
        );

        return result;
    }

    async collectTextSnapshot({
                                  containers,
                                  selectors,
                                  excludeTexts = [],
                                  excludeSelectors = [],
                                  removeSelectors = []
                              }) {
        const snapshot = {};

        for (const { name, element } of containers) {
            if (!(await element.count())) {
                continue;
            }

            const texts = await element.locator(selectors).evaluateAll((elements, {
                    removeSelectors, excludeSelectors }) => elements.filter((el) => {
                    const rect = el.getBoundingClientRect();

                    return (
                        rect.width > 0 &&
                        rect.height > 0 &&
                        !excludeSelectors.some(selector => el.closest(selector))
                    );
                },
                {
                    name,
                    removeSelectors,
                    excludeSelectors
                })
                    .map((el) => {
                        const clone = el.cloneNode(true);

                        removeSelectors.forEach(selector => {
                            clone.querySelectorAll(selector)
                                .forEach(elem => elem.remove());
                        });

                        const text =
                            clone.innerText.trim() ||
                            el.getAttribute('placeholder') ||
                            '';

                        return {
                            location: [
                                name,
                                el.tagName.toLowerCase()
                            ],
                            text,
                            html: el.outerHTML
                        };
                    })
                    .filter(item => item.text),
                {
                    removeSelectors,
                    excludeSelectors
                }
            );

            snapshot[name] = texts
                .filter(item => !excludeTexts.some(excludeText => {
                    if (excludeText.startsWith('*')) {
                        return item.text.includes(excludeText.slice(1));
                    }

                    return item.text === excludeText;
                }))
                .sort((a, b) => a.text.localeCompare(b.text));
        }
        // console.log(`Texts: ${JSON.stringify(snapshot)}`)

        return snapshot;
    }

    async collectLocalizationSnapshot({
                                          containers,
                                          excludeTexts = this.excludeTexts,
                                          excludeSelectors = []
                                      } = {}) {
        return await allureReporter.step('Collect localization snapshot', async () => {
            return this.collectTextSnapshot({
                containers,
                selectors: `a[class], p, button, input[placeholder], textarea[placeholder], label, h1,h2,h3,h4,h5,h6, option, legend`,
                excludeTexts,
                excludeSelectors,
                removeSelectors: [
                    'svg',
                    'style',
                    'script',
                    '.visually-hidden'
                ]
            });
        });
    }

    async clickAllNavigationItems(onPage) {
        const menuLinks = this.page.locator(
            '#menu-primary-navigation > li[data-target] > a.tier-1'
        );

        const count = await menuLinks.count();

        for (let i = 0; i < count; i++) {
            const link = menuLinks.nth(i);

            const menu = (await link.innerText()).trim();
            const href = await link.getAttribute('href');

            if (!menu || !href) {
                continue;
            }

            try {
                await this.page.goto(href, {
                    waitUntil: 'domcontentloaded'
                });

                await onPage({
                    page: this.page,
                    menu,
                    url: this.page.url()
                });

            } catch ({ message }) {
                console.log(`Failed opening ${menu}: ${message}`);
            }
        }
    }

    async clickAllSitemapPages(onPage) {
        const sitemapUrls = await this.page
            .locator(
                '#menu-primary-navigation .dr-Submenu-container a.primary-nav-link',
                { hasText: 'See all pages' }
            )
            .evaluateAll(links =>
                links
                    .map(link => link.href)
                    .filter(href => href)
            );

        const urlsToVisit = sitemapUrls.filter(
            href => !this.excludedSitemaps.some(
                excluded => href.includes(excluded)
            )
        );

        for (const sitemapUrl of urlsToVisit) {
            try {
                console.log(`Opening sitemap: ${sitemapUrl}`);

                await this.page.goto(sitemapUrl, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                });

                const pageLinks = await this.page
                    .locator('.hello-sitemap a')
                    .evaluateAll(links =>
                        [
                            ...new Map(
                                links.map(link => [
                                    link.href,
                                    {
                                        text: link.innerText.trim(),
                                        href: link.href
                                    }
                                ])
                            ).values()
                        ]
                    );

                console.log(
                    `Found ${pageLinks.length} pages in ${sitemapUrl}`
                );

                for (const { text, href } of pageLinks) {
                    try {
                        console.log(`Opening page: ${text}`);

                        await this.page.goto(href, {
                            waitUntil: 'domcontentloaded',
                            timeout: 30000
                        });

                        await onPage({
                            page: this.page,
                            url: this.page.url(),
                            sitemap: sitemapUrl,
                            title: text
                        });

                    } catch (error) {
                        console.log(
                            `Failed opening page ${href}: ${error.message}`
                        );
                    }
                }

            } catch (error) {
                console.log(
                    `Failed opening sitemap ${sitemapUrl}: ${error.message}`
                );
            }
        }
    }

    async clickAllTranslatedPages(onPage) {
        const pageLinks = await this.page
            .locator('a.translated-page-preview')
            .evaluateAll(links =>
                [
                    ...new Map(
                        links.map(link => [
                            link.href,
                            {
                                title: link.querySelector('.page-title')?.innerText.trim() ?? '',
                                href: link.href
                            }
                        ])
                    ).values()
                ]
            );

        console.log(`Found ${pageLinks.length} translated pages`);

        for (const { title, href } of pageLinks) {
            try {
                console.log(`Opening page: ${title}`);

                await this.page.goto(href, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                });

                await onPage({
                    page: this.page,
                    title,
                    url: this.page.url()
                });

            } catch (error) {
                console.log(`Failed opening ${href}: ${error.message}`);
            }
        }
    }



    // async clickAllSeeAllPages() {
    //     const seeAllPagesLinks = this.page.locator(
    //         '#menu-primary-navigation .dr-Submenu-container a.primary-nav-link',
    //         {
    //             hasText: 'See all pages'
    //         }
    //     );
    //
    //     const count = await seeAllPagesLinks.count();
    //
    //     for (let i = 0; i < count; i++) {
    //         const link = seeAllPagesLinks.nth(i);
    //
    //         const href = await link.getAttribute('href');
    //         const text = (await link.innerText()).trim();
    //
    //         if (!href) {
    //             continue;
    //         }
    //
    //         try {
    //             console.log(`Opening ${text}: ${href}`);
    //
    //             await this.page.goto(href, {
    //                 waitUntil: 'domcontentloaded',
    //                 timeout: 30000
    //             });
    //
    //         } catch ({ message }) {
    //             console.log(`Failed opening ${href}: ${message}`);
    //         }
    //     }
    // }

    // async clickAllSeeAllPages(onPage) {
    //     const seeAllPagesLinks = this.page.locator(
    //         '#menu-primary-navigation .dr-Submenu-container a.primary-nav-link',
    //         {
    //             hasText: 'See all pages'
    //         }
    //     );
    //
    //     const links = await seeAllPagesLinks.evaluateAll(elements =>
    //         elements.map(link => ({
    //             text: link.innerText.trim(),
    //             href: link.href
    //         }))
    //     );
    //
    //     for (const { text, href } of links) {
    //         if (!href) {
    //             continue;
    //         }
    //
    //         try {
    //             console.log(`Opening ${text}: ${href}`);
    //
    //             await this.page.goto(href, {
    //                 waitUntil: 'domcontentloaded',
    //                 timeout: 30000
    //             });
    //
    //             await onPage({
    //                 url: this.page.url(),
    //                 text
    //             });
    //
    //         } catch ({ message }) {
    //             console.log(`Failed opening ${href}: ${message}`);
    //         }
    //     }
    // }
}

module.exports = UsahelloPage;
