const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const SPREADSHEET_ID = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

// Convert column index (0-based) to A1 notation column letter
function colIndexToLabel(index) {
  let label = "";
  let temp = index;
  while (temp >= 0) {
    label = String.fromCharCode((temp % 26) + 65) + label;
    temp = Math.floor(temp / 26) - 1;
  }
  return label;
}

// Helper to append "no text" to a prompt string safely
function appendNoTextToPrompt(prompt) {
  if (!prompt || typeof prompt !== "string") return "";
  
  const trimmed = prompt.trim();
  if (trimmed === "") return "";

  // If "no text" already exists in the prompt (case-insensitive), don't duplicate it
  if (/no\s+text/i.test(trimmed)) {
    return trimmed;
  }

  // Check if the prompt ends with a Midjourney parameter (like --ar 16:9, --v 6.0, --style raw, etc.)
  // We match parameters at the end, e.g., --ar 16:9, --v 6.0, or multiple parameters like --style raw --ar 16:9
  const parameterRegex = /(\s+--[a-z0-9]+(?:\s+[^\s]+)*)$/i;
  const match = trimmed.match(parameterRegex);

  if (match) {
    // Insert ", no text" before the parameters
    const params = match[1];
    const mainPrompt = trimmed.slice(0, trimmed.length - params.length).trim();
    
    // Ensure we don't end the main prompt with a double comma or dot
    const cleanMain = mainPrompt.replace(/[.,\s]+$/, "");
    return `${cleanMain}, no text${params}`;
  } else {
    // Just append ", no text" to the end
    const cleanMain = trimmed.replace(/[.,\s]+$/, "");
    return `${cleanMain}, no text`;
  }
}

async function main() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  console.log("Fetching spreadsheet data...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "시트1!A1:Z350",
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.error("No data found in the spreadsheet.");
    return;
  }

  const headers = rows[0];
  console.log("Spreadsheet headers:", headers);

  // Identify column indices
  // Column K (index 10): Main Prompt
  // Column P (index 15): Hero Section Prompt
  // Column Q (index 16): Portfolio Section Prompt
  // Column R (index 17): About Section Prompt
  // Column S (index 18): Subpages Section Prompt
  const mainPromptColIndex = 10; // Column K
  const sectionCols = [15, 16, 17, 18]; // Columns P, Q, R, S

  console.log(`Main Prompt Column: ${colIndexToLabel(mainPromptColIndex)}`);
  console.log(`Section Prompts Columns: ${sectionCols.map(colIndexToLabel).join(", ")}`);

  // We will prepare updates for:
  // 1. Column K (Main Prompts)
  // 2. Columns P, Q, R, S (Section Prompts)
  
  const updatedMainPrompts = [];
  const updatedSectionPrompts = []; // Array of rows, each containing [P, Q, R, S]

  let mainPromptUpdatesCount = 0;
  let sectionPromptUpdatesCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    // Process Column K (Main Prompt)
    const origK = row[mainPromptColIndex] || "";
    const updatedK = appendNoTextToPrompt(origK);
    if (origK !== updatedK) mainPromptUpdatesCount++;
    updatedMainPrompts.push([updatedK]);

    // Process Columns P, Q, R, S (Section Prompts)
    const sectionRow = [];
    sectionCols.forEach((colIdx) => {
      const origVal = row[colIdx] || "";
      const updatedVal = appendNoTextToPrompt(origVal);
      if (origVal !== updatedVal) sectionPromptUpdatesCount++;
      sectionRow.push(updatedVal);
    });
    updatedSectionPrompts.push(sectionRow);
  }

  console.log(`Prepared ${mainPromptUpdatesCount} updates for Column K.`);
  console.log(`Prepared ${sectionPromptUpdatesCount} updates for Columns P, Q, R, S.`);

  // Write Column K updates
  if (mainPromptUpdatesCount > 0) {
    const rangeK = `시트1!${colIndexToLabel(mainPromptColIndex)}2:${colIndexToLabel(mainPromptColIndex)}${rows.length}`;
    console.log(`Writing Column K updates to ${rangeK}...`);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: rangeK,
      valueInputOption: "RAW",
      requestBody: {
        values: updatedMainPrompts,
      },
    });
  }

  // Write Columns P, Q, R, S updates
  if (sectionPromptUpdatesCount > 0) {
    const startColLetter = colIndexToLabel(sectionCols[0]);
    const endColLetter = colIndexToLabel(sectionCols[sectionCols.length - 1]);
    const rangeSections = `시트1!${startColLetter}2:${endColLetter}${rows.length}`;
    console.log(`Writing Columns P-S updates to ${rangeSections}...`);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: rangeSections,
      valueInputOption: "RAW",
      requestBody: {
        values: updatedSectionPrompts,
      },
    });
  }

  console.log("==========================================");
  console.log("Prompts successfully updated with ', no text' suffix!");
  console.log(`Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Failed to update prompts:", err);
});
