const fs = require('fs');
const { google } = require('googleapis');

// Load environment variables
const dotenvPath = '/Users/a1234/Local Sites/creaibox/.env.local';
const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
dotenvContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    process.env[key] = value;
  }
});

async function main() {
  const oauth2Client = new google.auth.OAuth2(process.env.GCP_OAUTH_CLIENT_ID, process.env.GCP_OAUTH_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: process.env.GCP_OAUTH_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  
  console.log('--- shorts 9:16 A1:E30 ---');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1-01HEzdUN-w305uJKA4f5zkm-5_7nYuk7z-ugQYXIek',
    range: "'shorts 9:16'!A1:E30"
  });
  const rows = res.data.values || [];
  rows.forEach((r, idx) => {
    console.log(`Row ${idx+1}: [${r.join(' | ')}]`);
  });
}
main().catch(console.error);
