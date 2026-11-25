/** Aptamil What's Next form — paste into a standalone Apps Script project. */
const SPREADSHEET_ID = '1LSz3OZ-YeSN8nvY2GdFivoOy29PjtOkvFiFO4NBHc4w';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  const requestId = String((e && e.parameter && e.parameter.requestId) || '').slice(0, 100);
  try {
    const text = String((e && e.parameter && e.parameter.response) || '').trim();
    if (!text || text.length > 1000) throw new Error('Invalid response');

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
      if (!sheet) throw new Error('Submission sheet is missing');
      // Prevent an answer starting with =, +, - or @ from becoming a sheet formula.
      const cellText = /^[\s\uFEFF]*[=+\-@]/.test(text) ? "'" + text : text;
      sheet.appendRow([new Date(), cellText]);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    return resultPage_({ type: 'aptamil-submission', requestId: requestId, ok: true });
  } catch (error) {
    console.error(error);
    return resultPage_({ type: 'aptamil-submission', requestId: requestId, ok: false });
  }
}

function resultPage_(result) {
  const payload = JSON.stringify(result).replace(/</g, '\\u003c');
  return HtmlService.createHtmlOutput(
    '<!doctype html><html><body><script>window.top.postMessage(' + payload + ', "*");</script></body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
