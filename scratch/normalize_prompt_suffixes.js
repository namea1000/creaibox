const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

async function normalizePromptSuffixes() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

  console.log("Fetching all rows from '시트1!A1:V350'...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "시트1!A1:V350"
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.error("No data found.");
    return;
  }

  console.log(`Successfully fetched ${rows.length} rows. Starting bulk normalization...`);

  // Columns P, Q, R, S are indices 15, 16, 17, 18
  const colPIndex = 15;
  const colQIndex = 16;
  const colRIndex = 17;
  const colSIndex = 18;

  // Helper to normalize the suffix of a prompt
  // e.g., converts "blah -- no text --ar 16:9" or "blah --no text --ar 16:9" to "blah, no text --ar 16:9"
  function normalizePrompt(val, aspect) {
    if (!val) return "";
    
    let clean = val.trim();
    
    // Look for different variations of "no text" and the aspect ratio
    const regex = /(?:,\s*no\s+text|--\s*no\s+text|--no\s+text)?\s*--ar\s*\d+:\d+/i;
    
    if (regex.test(clean)) {
      // Remove the existing suffix and replace with the standard one
      clean = clean.replace(regex, "").trim();
      // Remove any trailing commas, dashes, or spaces from the core prompt
      clean = clean.replace(/[,\-\s]+$/, "").trim();
      // Append standard suffix
      clean = `${clean}, no text --ar ${aspect}`;
      return clean;
    }
    
    // If it doesn't have --ar at all, append it
    return `${clean}, no text --ar ${aspect}`;
  }

  const writeValues = [];
  let changeCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const templateId = row[1];
    if (!templateId) {
      writeValues.push(["", "", "", ""]);
      continue;
    }

    const pVal = row[colPIndex] || "";
    const qVal = row[colQIndex] || "";
    const rVal = row[colRIndex] || "";
    const sVal = row[colSIndex] || "";

    // For rows where we want to preserve hand-crafted prompts, do not touch them
    if (templateId === "3d_motion_art" || templateId === "architect_studio_art") {
      writeValues.push([pVal, qVal, rVal, sVal]);
      continue;
    }

    const newP = normalizePrompt(pVal, "16:9");
    const newQ = normalizePrompt(qVal, "4:3");
    const newR = normalizePrompt(rVal, "1:1");
    const newS = normalizePrompt(sVal, "16:9");

    if (newP !== pVal || newQ !== qVal || newR !== rVal || newS !== sVal) {
      changeCount++;
    }

    writeValues.push([newP, newQ, newR, newS]);
  }

  const lastRow = writeValues.length + 1;
  const writeRange = `시트1!P2:S${lastRow}`;

  console.log(`Writing normalized prompts for ${writeValues.length} rows to '${writeRange}' in a single bulk request...`);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: writeRange,
    valueInputOption: "RAW",
    requestBody: {
      values: writeValues
    }
  });

  console.log("\n==========================================");
  console.log(`Bulk normalization completed successfully!`);
  console.log(`Normalized and updated prompts for ${changeCount} rows.`);
  console.log(`Link: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
  console.log("==========================================");
}

normalizePromptSuffixes().catch(err => console.error("Error in normalization:", err));
