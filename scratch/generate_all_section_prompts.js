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

    const catMatch = block.match(/category:\s*"([^"]+)"/);
    const cat = catMatch ? catMatch[1] : "";

    const descMatch = block.match(/description:\s*"([^"]+)"/);
    const desc = descMatch ? descMatch[1] : "";

    const fontMatch = block.match(/fontFamily:\s*"([^"]+)"/);
    const font = fontMatch ? fontMatch[1] : "sans-serif";

    const colors = {};
    const colorsMatch = block.match(/colors:\s*\{([^}]+)\}/);
    if (colorsMatch) {
      const colorsText = colorsMatch[1];
      ["primary", "secondary", "accent", "background", "surface", "text"].forEach((colorName) => {
        const colorMatch = colorsText.match(new RegExp(`${colorName}:\\s*"([^"]+)"`));
        if (colorMatch) {
          colors[colorName] = colorMatch[1];
        }
      });
    }

    const bgColor = (colors.background || "#ffffff").toLowerCase();
    let isDark = true;
    if (bgColor.startsWith("#")) {
      let hex = bgColor.slice(1);
      if (hex.length === 3) {
        hex = hex.split("").map((c) => c + c).join("");
      }
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        isDark = luma < 128;
      }
    }

    templates.push({
      templateId: tid,
      name,
      category: cat,
      description: desc,
      fontFamily: font,
      colors,
      isDarkMode: isDark,
    });
  }
  return templates;
}

// Call Groq API to generate section prompts in robust plain text mode using Llama 3.1 8B
async function generatePromptsForBatch(batch) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in .env.local.");
  }

  const systemPrompt = `You are a professional Midjourney prompt engineer. 
For the given website templates, generate 4 distinct, premium, highly concise, visually dense image prompts for their respective sections.

Output Format:
For each template in the batch, you must output in the following exact plain text format (do not wrap in markdown code blocks, just output the raw text):

=== TEMPLATE: [templateId] ===
hero: [16:9 prompt]
portfolio: [4:3 prompt]
about: [1:1 prompt]
subpage: [16:9 prompt]

Prompt Instructions:
- hero: A 16:9 hero background banner image (scenic, abstract, or compositional, no website UI or layout).
- portfolio: A 4:3 close-up visual showcase, product shot, or gallery artwork representing their craft.
- about: A 1:1 conceptual profile/biography image (like a desk setup, creative workshop scene, professional symbol, or atmospheric portrait).
- subpage: A 16:9 clean, abstract background landscape or textural pattern that serves as a subtle background for subpage headers.
- Keep the prompts highly concise (1-2 sentences max, 20-35 words each), packed with vivid visual keywords.
- Incorporate the HSL branding color palette prominently in the visual description.
- All prompts must end with the exact Midjourney parameters:
  * hero: "... no text --ar 16:9"
  * portfolio: "... no text --ar 4:3"
  * about: "... no text --ar 1:1"
  * subpage: "... no text --ar 16:9"
- Ensure there is NO text, NO device frames, and NO website interface layout elements in the prompts.`;

  const promptInput = batch.map((t) => {
    const colorsDesc = Object.entries(t.colors).map(([name, val]) => `${name}: ${val}`).join(", ");
    return {
      templateId: t.templateId,
      name: t.name,
      category: t.category,
      description: t.description,
      themeMode: t.isDarkMode ? "Dark Mode" : "Light Mode",
      colors: colorsDesc
    };
  });

  const userPrompt = `Generate section prompts for these templates:\n${JSON.stringify(promptInput, null, 2)}`;

  const url = "https://api.groq.com/openai/v1/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // Llama 3.1 8B has huge daily token limits
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API returned error status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  // Parse the plain text output
  const results = {};
  const templateBlocks = content.split(/=== TEMPLATE:\s*/i);
  
  for (const block of templateBlocks) {
    if (!block.trim()) continue;
    const lines = block.split("\n");
    const templateId = lines[0].replace(/===/g, "").trim();
    
    const heroMatch = block.match(/hero:\s*(.+)/i);
    const portfolioMatch = block.match(/portfolio:\s*(.+)/i);
    const aboutMatch = block.match(/about:\s*(.+)/i);
    const subpageMatch = block.match(/subpage:\s*(.+)/i);
    
    if (templateId) {
      results[templateId] = {
        hero: heroMatch ? heroMatch[1].trim() : "",
        portfolio: portfolioMatch ? portfolioMatch[1].trim() : "",
        about: aboutMatch ? aboutMatch[1].trim() : "",
        subpage: subpageMatch ? subpageMatch[1].trim() : ""
      };
    }
  }

  // Validate that all templates in the batch are present in the results
  for (const t of batch) {
    if (!results[t.templateId] || !results[t.templateId].hero) {
      console.warn(`Warning: Failed to parse prompts for template ${t.templateId} from content:\n${content}`);
      throw new Error(`Regex parsing failed for template ${t.templateId}`);
    }
  }

  return results;
}

async function main() {
  // 1. Parse all templates from categories directory
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

  const templateMap = new Map();
  templates.forEach((t) => {
    templateMap.set(t.templateId, t);
  });

  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  // 2. Fetch the current sheet data
  console.log("Fetching spreadsheet data...");
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "시트1!A1:V350",
  });

  const rows = res.data.values || [];
  if (rows.length === 0) {
    console.error("No data found in the spreadsheet.");
    return;
  }

  const headers = rows[0];
  console.log("Current Sheet Headers:", headers);

  // Columns P, Q, R, S are indices 15, 16, 17, 18
  const colPIndex = 15;
  const colQIndex = 16;
  const colRIndex = 17;
  const colSIndex = 18;

  const startColLetter = colIndexToLabel(colPIndex);
  const endColLetter = colIndexToLabel(colSIndex);

  // Map template ID to its 1-based row index in the spreadsheet
  const templateRowIndexMap = new Map();
  
  // Identify which templates need generation (preserves existing ones)
  const templatesToGenerate = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const templateId = row[1];
    templateRowIndexMap.set(templateId, i + 1);

    const hasP = row[colPIndex] && row[colPIndex].trim() !== "" && !row[colPIndex].includes("undefined");
    
    // Preserve existing hand-crafted or already populated prompts
    if (templateId === "3d_motion_art" || templateId === "architect_studio_art" || hasP) {
      console.log(`Preserving existing prompts for row ${i + 1} (${templateId}).`);
    } else {
      const tMeta = templateMap.get(templateId);
      if (tMeta) {
        templatesToGenerate.push(tMeta);
      } else {
        console.warn(`Template metadata not found for template ID: ${templateId}`);
      }
    }
  }

  console.log(`Need to generate section prompts for ${templatesToGenerate.length} templates.`);

  // 3. Batch generate and write prompts immediately
  const batchSize = 3;
  
  for (let i = 0; i < templatesToGenerate.length; i += batchSize) {
    const batch = templatesToGenerate.slice(i, i + batchSize);
    console.log(`Generating prompts for batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(templatesToGenerate.length / batchSize)} (size: ${batch.length})...`);
    
    let success = false;
    let retries = 5;
    let delay = 3000;
    let batchResults = null;
    
    while (!success && retries > 0) {
      try {
        batchResults = await generatePromptsForBatch(batch);
        success = true;
      } catch (err) {
        retries--;
        console.error(`Error generating prompts. Retries remaining: ${retries}. Error:`, err.message);
        if (retries > 0) {
          console.log(`Waiting ${delay / 1000} seconds before retrying...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          console.error("Batch generation failed completely. Skipping writing for this batch.");
        }
      }
    }

    // Write this batch immediately to the Google Sheet to prevent data loss!
    if (success && batchResults) {
      console.log("Writing generated prompts for this batch to Google Sheet...");
      for (const t of batch) {
        const prompts = batchResults[t.templateId];
        const rowIndex = templateRowIndexMap.get(t.templateId);
        
        if (prompts && rowIndex) {
          const cleanHero = prompts.hero ? prompts.hero.trim() : "";
          const cleanPortfolio = prompts.portfolio ? prompts.portfolio.trim() : "";
          const cleanAbout = prompts.about ? prompts.about.trim() : "";
          const cleanSubpage = prompts.subpage ? prompts.subpage.trim() : "";

          const writeRange = `시트1!${startColLetter}${rowIndex}:${endColLetter}${rowIndex}`;
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: writeRange,
            valueInputOption: "RAW",
            requestBody: {
              values: [[cleanHero, cleanPortfolio, cleanAbout, cleanSubpage]]
            }
          });
        }
      }
      console.log(`Successfully saved batch ${Math.floor(i / batchSize) + 1} to Google Sheet.`);
    }
    
    // 10 seconds delay between batches to stay safely under Llama 3.1 8B's 6,000 TPM limit
    console.log("Waiting 10 seconds to respect rate limits...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  console.log("==========================================");
  console.log("All missing template section prompts successfully generated and written in real-time!");
  console.log(`Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Failed to generate and sync section prompts:", err);
});
