# Aptamil What's Next form

`index.html` is a static, mobile-first page matching the supplied design. The answer box and Submit button are live controls over the supplied artwork.

## Connect the Google Sheet and Apps Script

The existing [Aptamil_Whats_Next_Form_Submissions sheet](https://docs.google.com/spreadsheets/d/1LSz3OZ-YeSN8nvY2GdFivoOy29PjtOkvFiFO4NBHc4w/edit) has column A **Timestamp** and column B **Submitted Text**. The Apps Script is already pointed at its `Sheet1` tab.

1. Open [Google Apps Script](https://script.google.com/), create a new project, and replace `Code.gs` with the contents of this folder's `Code.gs`.
2. Choose **Deploy → New deployment → Web app**. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then deploy. Approve Sheets access when prompted. Copy the URL ending in `/exec`.
3. Paste that URL between the quotes in `config.js` and publish this folder on a static web host. Open `index.html` from that host.

After any later change to `Code.gs`, use **Deploy → Manage deployments → Edit → New version** so the live web app receives the update. The page does not need a new Apps Script deployment when only its local files change.

The page waits for Apps Script to confirm that the sheet accepted a submission. If it cannot confirm, it keeps the attendee's text and shows an error rather than clearing it.
