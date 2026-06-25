const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const CATEGORIES_DIR = "./src/lib/templates/categories";
const SPREADSHEET_ID = "11AQ7HfO7tpjeU2FDLW3u85q015yWJ09Navoh4ryklpM";

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

// Convert column index (0-based) to A1 notation column letter (e.g., 13 -> N, 14 -> O)
function colIndexToLabel(index) {
  let label = "";
  let temp = index;
  while (temp >= 0) {
    label = String.fromCharCode((temp % 26) + 65) + label;
    temp = Math.floor(temp / 26) - 1;
  }
  return label;
}

function parseCategoryFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const blocks = content.split("templateId:");
  const templates = [];

  for (let i = 1; i < blocks.length; i++) {
    let block = "templateId:" + blocks[i];

    const tidMatch = block.match(/templateId:\s*"([^"]+)"/);
    if (!tidMatch) continue;
    const tid = tidMatch[1];

    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : "";

    const descMatch = block.match(/description:\s*"([^"]+)"/);
    const desc = descMatch ? descMatch[1] : "";

    templates.push({
      templateId: tid,
      name,
      description: desc,
    });
  }
  return templates;
}

// Translate a batch of descriptions using Groq API
async function translateBatch(batch) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in .env.local.");
  }

  const promptInput = {};
  for (const item of batch) {
    promptInput[item.templateId] = item.description;
  }

  const systemPrompt = `You are an expert translator. Translate the following website theme descriptions from Korean to English. 
Keep the tone premium, sophisticated, and professional, suitable for a high-end web design studio. 
Return ONLY a valid JSON object mapping each templateId to its English translation. 
Do not include any markdown formatting, code block ticks, or introductory/explanatory text. Just return the raw JSON object.`;

  const userPrompt = `Translate this JSON object:\n${JSON.stringify(promptInput, null, 2)}`;

  // Use fetch or https to call Groq API
  const url = "https://api.groq.com/openai/v1/chat/completions";
  
  // Use llama-3.1-8b-instant which has a much higher rate limit and is very fast
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API returned error status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse JSON response from Groq:", content);
    throw new Error("Invalid JSON response from translation model.");
  }
}

async function translateAllDescriptions(templates) {
  console.log("Starting translation of descriptions using Groq...");
  const translations = new Map();
  const batchSize = 20; // Reduced batch size slightly for safety
  
  for (let i = 0; i < templates.length; i += batchSize) {
    const batch = templates.slice(i, i + batchSize);
    console.log(`Translating batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(templates.length / batchSize)} (size: ${batch.length})...`);
    
    let success = false;
    let retries = 5;
    let delay = 3000; // Start with 3 seconds backoff
    
    while (!success && retries > 0) {
      try {
        const batchTranslations = await translateBatch(batch);
        for (const [tid, translation] of Object.entries(batchTranslations)) {
          translations.set(tid, translation);
        }
        success = true;
      } catch (err) {
        retries--;
        console.error(`Error translating batch. Retries remaining: ${retries}. Error:`, err.message);
        if (retries > 0) {
          console.log(`Waiting ${delay / 1000} seconds before retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          console.error("Batch translation failed completely. Falling back to empty strings for this batch.");
          for (const item of batch) {
            translations.set(item.templateId, "");
          }
        }
      }
    }
    
    // 3 seconds delay between batches to fully stay under TPM limit
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  
  return translations;
}

async function main() {
  // 1. Parse all descriptions from categories directory
  console.log("Parsing templates from codebase...");
  const templates = [];
  const files = fs.readdirSync(CATEGORIES_DIR);
  for (const file of files) {
    if (file.endsWith(".ts")) {
      const categoryTemplates = parseCategoryFile(path.join(CATEGORIES_DIR, file));
      templates.push(...categoryTemplates);
    }
  }
  console.log(`Parsed ${templates.length} templates from codebase.`);

  const descriptionMap = new Map();
  templates.forEach((t) => {
    if (t.templateId && t.description) {
      descriptionMap.set(t.templateId, t.description);
    }
  });

  // 2. Translate all descriptions to English
  const englishTranslationMap = await translateAllDescriptions(templates);
  console.log(`Translated ${englishTranslationMap.size} descriptions to English.`);

  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  // 3. Fetch the current sheet data (up to column Z to find columns)
  console.log("Fetching spreadsheet columns and rows...");
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
  console.log("Current Sheet Headers:", headers);

  // 4. Find the column indices for "테마 설명(한글)" and "테마 설명(영문)"
  let koreanColIndex = -1;
  let englishColIndex = -1;

  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].trim();
    if (h === "테마 설명(한글)") {
      koreanColIndex = i;
    } else if (h === "테마 설명(영문)") {
      englishColIndex = i;
    }
  }

  // Fallback check if headers aren't exact but contain the terms
  if (koreanColIndex === -1) {
    koreanColIndex = headers.indexOf("테마 설명");
  }

  if (koreanColIndex === -1 || englishColIndex === -1) {
    console.error(`Could not find required columns. Korean Index: ${koreanColIndex}, English Index: ${englishColIndex}`);
    console.log("Adding columns if missing...");
    if (koreanColIndex === -1) koreanColIndex = 13;
    if (englishColIndex === -1) englishColIndex = 14;
  }

  console.log(`Korean Description Column: Column ${colIndexToLabel(koreanColIndex)} (index ${koreanColIndex})`);
  console.log(`English Description Column: Column ${colIndexToLabel(englishColIndex)} (index ${englishColIndex})`);

  // 5. Prepare the description values for all rows
  const isAdjacent = Math.abs(koreanColIndex - englishColIndex) === 1;
  
  if (isAdjacent) {
    const startColIndex = Math.min(koreanColIndex, englishColIndex);
    const endColIndex = Math.max(koreanColIndex, englishColIndex);
    const startColLetter = colIndexToLabel(startColIndex);
    const endColLetter = colIndexToLabel(endColIndex);
    
    const descriptionValues = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const templateId = row[1]; // Column B is Template ID
      const koreanDesc = descriptionMap.get(templateId) || "";
      const englishDesc = englishTranslationMap.get(templateId) || "";
      
      if (startColIndex === koreanColIndex) {
        descriptionValues.push([koreanDesc, englishDesc]);
      } else {
        descriptionValues.push([englishDesc, koreanDesc]);
      }
    }

    const writeRange = `시트1!${startColLetter}2:${endColLetter}${rows.length}`;
    console.log(`Writing ${descriptionValues.length} rows to range ${writeRange}...`);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: writeRange,
      valueInputOption: "RAW",
      requestBody: {
        values: descriptionValues,
      },
    });
  } else {
    console.log("Columns are not adjacent. Writing separately...");
    
    const koreanValues = [];
    const englishValues = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const templateId = row[1];
      koreanValues.push([descriptionMap.get(templateId) || ""]);
      englishValues.push([englishTranslationMap.get(templateId) || ""]);
    }
    
    const koreanLetter = colIndexToLabel(koreanColIndex);
    const englishLetter = colIndexToLabel(englishColIndex);
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `시트1!${koreanLetter}2:${koreanLetter}${rows.length}`,
      valueInputOption: "RAW",
      requestBody: { values: koreanValues },
    });
    
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `시트1!${englishLetter}2:${englishLetter}${rows.length}`,
      valueInputOption: "RAW",
      requestBody: { values: englishValues },
    });
  }

  console.log("==========================================");
  console.log("Theme descriptions (Korean & English) successfully synced to Google Sheet!");
  console.log(`Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Failed to sync descriptions:", err);
});
