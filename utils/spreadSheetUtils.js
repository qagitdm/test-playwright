const { google } = require('googleapis');
const path = require('path');

async function editSpreadsheet(sheets, spreadsheetId) {
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    updateDimensionProperties: {
                        range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 1},
                        properties: { pixelSize: 100 },
                        fields: 'pixelSize'
                    }
                },
                {
                    updateDimensionProperties: {
                        range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 },
                        properties: { pixelSize: 400 },
                        fields: 'pixelSize'
                    }
                },
                {
                    updateDimensionProperties: {
                        range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 },
                        properties: { pixelSize: 300 },
                        fields: 'pixelSize'
                    }
                },
                {
                    updateDimensionProperties: {
                        range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 },
                        properties: { pixelSize: 600 },
                        fields: 'pixelSize'
                    }
                },
                {
                    repeatCell: {
                        range: {
                            sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 4
                        },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 0.706, green: 0.900, blue: 0.800 },
                                horizontalAlignment: 'CENTER',
                                textFormat: {
                                    bold: true
                                }
                            }
                        },
                        fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,textFormat)'
                    }
                }
            ]
        }
    });
}

async function freezeRow(sheets, spreadsheetId) {
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    updateSheetProperties: {
                        properties: {
                            gridProperties: {
                                frozenRowCount: 1
                            }
                        },
                        fields: 'gridProperties.frozenRowCount'
                    }
                }
            ]
        }
    });
}

async function appendUntranslatedTexts(rows) {

    if (!rows.length) { return; }

    const auth = new google.auth.GoogleAuth({
        keyFile: path.resolve(process.cwd(), 'google-service.json'),
        scopes: [ 'https://www.googleapis.com/auth/spreadsheets' ]
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.SPREADSHEET_ID;

    const existing = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:D1'
    });

    const hasHeader = existing.data.values &&
        existing.data.values.length > 0;

    const values = [];

    if (!hasHeader) {
        values.push([
            'Date',
            'URL',
            'Section',
            'Untranslated'
        ]);
    }

    const date = new Date().toLocaleDateString('en-US');

    values.push(
        ...rows.map(item => [
            date,
            item.url,
            Array.isArray(item.selector)
                ? item.selector.join(': ')
                : item.selector,
            `Text: ${ item.text }

HTML: ${item.html}`
        ])
    );

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values
        }
    });

    const metadata = await sheets.spreadsheets.get({ spreadsheetId: process.env.SPREADSHEET_ID });

    // const sheetId = metadata.data.sheets.find(sheet => sheet
    // .properties.title === 'Untranslated')
    //     .properties.sheetId;

    await editSpreadsheet(sheets, process.env.SPREADSHEET_ID);
    await freezeRow(sheets, process.env.SPREADSHEET_ID);
}

module.exports = {
    appendUntranslatedTexts
};
