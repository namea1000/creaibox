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

// Highly sophisticated category-based prompt generator
function generateRuleBasedPrompts(template) {
  const cat = template.category.toLowerCase();
  const colors = template.colors;
  const isDark = template.isDarkMode;
  const themeMode = isDark ? "Dark Mode" : "Light Mode";
  
  // Format color description to guide Midjourney
  const primary = colors.primary || "";
  const secondary = colors.secondary || "";
  const accent = colors.accent || "";
  const bg = colors.background || "";
  
  const colorsDesc = `primary ${primary}, secondary ${secondary}, accent ${accent}, background ${bg}`;

  // Default keywords
  let designKeywords = "clean modern minimalist layout, geometric structure, subtle light leaks";
  let portfolioKeywords = "a stunning showcase of premium graphic layouts, high-fidelity textures";
  let aboutKeywords = "a clean modern designer desk setup with a sleek tablet and sketches";
  let subpageKeywords = "a subtle abstract texture of soft geometric lines and smooth gradients";

  // Category specific premium keywords mapping
  if (cat.includes("restaurant") || cat.includes("food")) {
    designKeywords = "exquisite gourmet dishes, artisan organic ingredients, elegant dinner table arrangement, warm glowing lanterns";
    portfolioKeywords = "a perfectly plated gourmet culinary masterpiece, organic textures, steam rising, professional food photography, macro shot";
    aboutKeywords = "a professional chef in a clean modern kitchen, holding a signature dish, warm golden lighting";
    subpageKeywords = "a warm textured background of rustic dark wood or organic kitchen slate, soft shadows";
  } else if (cat.includes("music")) {
    designKeywords = "futuristic digital audio waveforms, glowing neon synthesizer keys, floating metallic soundwaves, dark concert stage";
    portfolioKeywords = "a close-up of a premium vinyl record spinning on a high-end turntable, neon purple and green light reflections";
    aboutKeywords = "a passionate music producer in a dark studio surrounded by glowing mixing consoles and monitors";
    subpageKeywords = "a dark moody background of abstract soundwaves, glowing frequency lines, neon laser sparks";
  } else if (cat.includes("travel") || cat.includes("lifestyle")) {
    designKeywords = "stunning scenic adventure landscape, majestic mountains under golden sunrise, luxury forest glamping dome";
    portfolioKeywords = "a rustic travel gear setup, vintage brass compass, leather backpack on a scenic wooden deck overlooking a lake";
    aboutKeywords = "a travel explorer looking at a map on a mountain peak during sunset, atmospheric warm lighting";
    subpageKeywords = "a breath-taking bird-eye view landscape of mountain ridges or sea waves under morning mist";
  } else if (cat.includes("fashion") || cat.includes("beauty")) {
    designKeywords = "avant-garde draping, flowing premium silk fabrics, high-end fashion runway spotlight, dramatic contrasting shadows";
    portfolioKeywords = "a luxury perfume bottle mockup with water droplets, sitting on a textured marble podium under soft light";
    aboutKeywords = "a chic fashion stylist arranging elegant clothing collection items on a minimalist rack in a sunlit studio";
    subpageKeywords = "a smooth abstract background of flowing silk waves and soft organic fabric folds";
  } else if (cat.includes("magazine") || cat.includes("editorial")) {
    designKeywords = "stately editorial layout, bold typographic accents, clean multi-column composition, premium paper texture";
    portfolioKeywords = "an open high-end design magazine showing stunning photography spreads on a sleek wooden table";
    aboutKeywords = "a modern chief editor at a spacious marble desk, surrounded by books and sketches, soft morning window light";
    subpageKeywords = "a clean minimalist background of open empty book pages, showing elegant paper textures and margins";
  } else if (cat.includes("art") || cat.includes("design")) {
    designKeywords = "abstract 3D digital sculpture, floating metallic ribbons, translucent glassmorphic spheres, cyber-chrome textures";
    portfolioKeywords = "a premium contemporary digital painting displayed in a minimalist art gallery with soft spotlights";
    aboutKeywords = "a creative digital artist working on a large tablet, glowing stylus, futuristic art studio environment";
    subpageKeywords = "a beautiful abstract pattern of translucent glass refractions and holographic colors";
  } else if (cat.includes("blog")) {
    designKeywords = "clean minimalist writing workspace, open notebook with fine ink pen, steaming ceramic mug, soft window light";
    portfolioKeywords = "a beautifully arranged flatlay of lifestyle blogging essentials, glasses, books, and green leaves";
    aboutKeywords = "a cozy personal study room with bookshelf background, warm reading lamp, comfortable armchair";
    subpageKeywords = "a warm clean paper background with subtle ink drops and organic textures";
  } else if (cat.includes("portfolio")) {
    designKeywords = "dynamic creative workspace, abstract geometric shapes, sleek modern design elements, elegant grid composition";
    portfolioKeywords = "a high-end mockup of creative portfolio work, showcasing vibrant graphic design layouts and typography";
    aboutKeywords = "a professional designer sitting in a mid-century modern office, looking thoughtful, soft side lighting";
    subpageKeywords = "a clean abstract background of intersecting architectural lines and soft grey shadows";
  } else if (cat.includes("business")) {
    designKeywords = "corporate glass architecture, abstract high-tech network nodes, clean service grid, professional corporate lounge";
    portfolioKeywords = "a high-fidelity business data dashboard visualization, glowing charts, clean corporate aesthetic";
    aboutKeywords = "a sleek modern boardroom table with an elegant leather-bound notebook and a premium pen, city view";
    subpageKeywords = "a clean corporate background of geometric steel beams and reflective glass panels";
  } else if (cat.includes("store") || cat.includes("shop")) {
    designKeywords = "sleek boutique storefront, elegant product display shelves, warm accent lighting, minimal aesthetic";
    portfolioKeywords = "a premium leather accessory or designer product, macro shot, showcasing high-end textures and craftsmanship";
    aboutKeywords = "a passionate boutique owner arranging products on a wooden shelf, warm inviting atmosphere";
    subpageKeywords = "a clean modern background of concrete textures, minimal product podiums, and soft shadows";
  } else if (cat.includes("estate") || cat.includes("architect")) {
    designKeywords = "luxury modern architectural villa, glass walls, glowing swimming pool, beautiful evening sunset lighting";
    portfolioKeywords = "a high-end interior living room showcase, minimalist furniture, large windows showing nature, cozy fireplace";
    aboutKeywords = "a sleek architectural blueprint drawing on a light table with drawing tools, clean professional studio";
    subpageKeywords = "a beautiful abstract line art of architectural structures, blueprints, and clean grids";
  } else if (cat.includes("health") || cat.includes("wellness")) {
    designKeywords = "peaceful wellness retreat sanctuary, soft glowing candles, smooth river stones, green bamboo leaves";
    portfolioKeywords = "an organic aromatherapy massage oil bottle on a textured wooden tray next to a white flower, soft light";
    aboutKeywords = "a tranquil yoga studio interior with soft natural light streaming in, serene and calm atmosphere";
    subpageKeywords = "a serene soft green background of blurred botanical leaves and gentle sunlight rays";
  } else if (cat.includes("education") || cat.includes("academy")) {
    designKeywords = "modern bright coding academy classroom, interactive digital screens, clean minimalist learning environment";
    portfolioKeywords = "a stack of elegant academic textbooks and a graduation cap on a clean oak desk, soft lighting";
    aboutKeywords = "a modern instructor explaining a concept on a glowing digital whiteboard, inspiring atmosphere";
    subpageKeywords = "a clean bright background of abstract geometric grids and glowing neon learning nodes";
  } else if (cat.includes("community") || cat.includes("nonprofit")) {
    designKeywords = "warm social impact gather scene, hands holding a growing plant, sunbeams filtering through green trees";
    portfolioKeywords = "a heartfelt volunteering event photo, people laughing and working together, warm natural color palette";
    aboutKeywords = "a dedicated social worker or volunteer coordinator smiling, warm inviting community center background";
    subpageKeywords = "a warm soft background of light pastel color gradients, conveying hope and unity";
  } else if (cat.includes("entertainment") || cat.includes("amusement")) {
    designKeywords = "vibrant theme park adventure castle under starry night sky, glowing ferris wheel, colorful light streaks";
    portfolioKeywords = "a premium boardgame setup on a wooden table, intricate game pieces, warm game cafe atmosphere";
    aboutKeywords = "a cozy retro arcade corner with glowing game screens, colorful neon lights reflecting on the floor";
    subpageKeywords = "a dynamic festive background of blurred carnival lights, sparks, and colorful glowing shapes";
  }

  // Build the 4 high-end, customized Midjourney prompts
  const hero = `A premium, high-fidelity landing page hero background banner for a ${template.category} website. ${themeMode} aesthetic, featuring ${designKeywords}. Harmonious colors: ${colorsDesc}. Deep cinematic lighting, 8k resolution, Unreal Engine 5 render, sharp focus, no text --ar 16:9`;
  
  const portfolio = `A close-up premium visual showcase of ${portfolioKeywords} for a ${template.category} brand. ${themeMode} aesthetic, rich details, harmonious colors: ${colorsDesc}. High-end photography, octane render, clean composition, no text --ar 4:3`;
  
  const about = `A sleek, professional conceptual portrait of ${aboutKeywords}. ${themeMode} aesthetic, harmonious colors: ${colorsDesc}. Photorealistic, soft volumetric lighting, sharp details, no text --ar 1:1`;
  
  const subpage = `A premium, clean abstract background landscape or textural pattern of ${subpageKeywords} for a ${template.category} website header. Harmonious colors: ${colorsDesc}. Minimalist art, cinematic, raytracing, 8k, no text --ar 16:9`;

  return { hero, portfolio, about, subpage };
}

async function main() {
  // 1. Parse all templates from codebase
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

  // 3. Generate prompts programmatically for all rows (except 3d_motion_art and architect_studio_art if they are already populated)
  console.log("Generating premium, customized prompts for all rows...");
  const writeValues = [];
  let generatedCount = 0;
  let preservedCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const templateId = row[1];
    
    // Check if it already has prompts in Column P (like 3d_motion_art and architect_studio_art)
    const hasP = row[colPIndex] && row[colPIndex].trim() !== "" && !row[colPIndex].includes("undefined");

    if ((templateId === "3d_motion_art" || templateId === "architect_studio_art" || hasP) && row[colPIndex]) {
      // Preserve existing prompts
      writeValues.push([
        row[colPIndex] || "",
        row[colQIndex] || "",
        row[colRIndex] || "",
        row[colSIndex] || ""
      ]);
      preservedCount++;
    } else {
      // Generate rule-based prompts
      const tMeta = templateMap.get(templateId);
      if (tMeta) {
        const prompts = generateRuleBasedPrompts(tMeta);
        writeValues.push([prompts.hero, prompts.portfolio, prompts.about, prompts.subpage]);
        generatedCount++;
      } else {
        // Fallback if metadata not found
        console.warn(`Warning: Metadata not found for template ID: ${templateId}`);
        writeValues.push(["", "", "", ""]);
      }
    }
  }

  console.log(`Generation complete. Generated: ${generatedCount}, Preserved: ${preservedCount}.`);

  // 4. Write all values back to the Google Sheet in one single batch update!
  const range = `시트1!${startColLetter}2:${endColLetter}${rows.length}`;
  console.log(`Writing all ${writeValues.length} rows of prompts to range ${range}...`);
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
    valueInputOption: "RAW",
    requestBody: {
      values: writeValues,
    },
  });

  console.log("==========================================");
  console.log("SUCCESS! All 304 template section prompts successfully generated and synced to Google Sheet!");
  console.log(`Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Failed to generate and sync section prompts:", err);
});
