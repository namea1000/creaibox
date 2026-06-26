const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

const CATEGORIES_DIR = "./src/lib/templates/categories";
const PUBLIC_TEMPLATES_DIR = "./public/templates";

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in .env.local.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

function cleanIdToTitle(templateId) {
  return templateId
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function getDesignDetails(category, templateId) {
  const cat = category.toLowerCase();
  let details = "Clean grid layout, modern UI components, elegant whitespace.";

  if (cat.includes("restaurant")) {
    details = "High-quality gourmet food photography placeholder, structured dinner menu columns, chef special highlights, elegant booking reservation form, and opening hours layout.";
  } else if (cat.includes("music")) {
    details = "Audio player controls, music release album art grid, upcoming tour dates table, band member profile section, and custom retro instrument icon designs.";
  } else if (cat.includes("community")) {
    details = "Warm social impact hero section, clean donation progress bar, upcoming volunteering events grid, newsletters subscription card, and trust badges.";
  } else if (cat.includes("travel")) {
    details = "Stunning scenic nature photography background, trip booking search bar, outdoor travel package itinerary cards, customer testimonial slider, and travel gear checklists.";
  } else if (cat.includes("fashion")) {
    details = "High-end fashion model photography lookbook grid, minimalist clothing collection banners, elegant brand values typography, and chic color swatches.";
  } else if (cat.includes("magazine")) {
    details = "Stately editorial layout with bold headline text, multi-column article grid, prominent featured story section, author profile cards, and clean typography hierarchy.";
  } else if (cat.includes("store")) {
    details = "Sleek e-commerce storefront, grid of featured product cards with pricing and badges, shopping cart preview, promotion banners, and newsletter subscribe box.";
  } else if (cat.includes("portfolio")) {
    details = "Minimalist personal portfolio layout, creative works gallery grid, professional biography with skills badges, client testimonial carousel, and contact form.";
  } else if (cat.includes("business")) {
    details = "Corporate landing page with clean service grids, enterprise statistics counters, team member cards, client logotypes slider, and contact form.";
  } else if (cat.includes("art")) {
    details = "Art gallery collection grid with elegant frames, exhibition schedule list, artist statement with premium typography, and upcoming events newsletter.";
  } else if (cat.includes("education")) {
    details = "Academy courses catalog with pricing and duration badges, curriculum timeline, instructor profile cards, student review rating stars, and registration form.";
  } else if (cat.includes("health")) {
    details = "Wellness treatment packages list, doctor/trainer schedule table, client success stories, organic lifestyle tip cards, and consultation request form.";
  } else if (cat.includes("entertainment")) {
    details = "Vibrant entertainment event schedule banner, ticket booking selection, gallery of active attraction zones, food/cafe menu icons, and guest safety policy cards.";
  }

  if (templateId.includes("sushi")) {
    details = "Minimalist Zen style, high-end sushi chef platters, delicate bamboo lines, clean menu grid, elegant reservations section.";
  } else if (templateId.includes("glamping")) {
    details = "Luxury forest dome tents, cozy bonfire scenes, warm glowing lanterns, package options grid, nature-inspired icons.";
  } else if (templateId.includes("yacht")) {
    details = "Sleek luxury yacht deck under sunset, deep ocean wave accents, yacht charter pricing tables, nautical map iconography.";
  } else if (templateId.includes("dj")) {
    details = "Glow-in-the-dark synthesizer board, neon wave frequency charts, music track waveforms, vinyl deck controller closeups.";
  } else if (templateId === "artisan_sourdough_bakery") {
    details = "Rustic French bakery, stone bread oven, warm glowing oven light, wooden cutting boards with sourdough loaves, flour dusting, rustic baskets, traditional baker tools, natural earthy wood textures.";
  } else if (templateId === "teppanyaki_omakase_dining") {
    details = "Sleek modern Teppanyaki restaurant, hot iron griddle plate with sizzling Hanwoo beef and lobster, chef performing a fiery flambé show with giant flame, elegant dark stone counter bar seating, high-end luxury dark mood.";
  } else if (templateId === "cocktail_whiskey_speakeasy") {
    details = "Mysterious dark Speakeasy bar, secret bookshelf door entrance, dim warm candle light, bartenders hand-carving a crystal clear ice ball, amber whiskey glasses on dark leather cushion bar counters, elegant velvet textures.";
  } else if (templateId === "stem_robotics_academy") {
    details = "Futuristic STEM and robotics lab for kids, colorful LEGO robotics, glowing computer screens with block coding and code lines, electronic circuit boards, small robotic cars driving on a track, electric neon cyan and violet lighting.";
  } else if (templateId === "professional_writing_studio") {
    details = "Classic library and creative writing study, mahogany wood bookshelves, vintage fountain pen on thick novel paper, leather-bound books, brass desk lamp casting warm light, cozy intellectual writer salon atmosphere.";
  } else if (templateId === "kids_forest_kindergarten") {
    details = "Outdoor forest kindergarten, children playing happily in a fresh green pine forest, wooden treehouses, organic vegetable garden patches, raw wood log bridges, safe natural toys, bright sunny day meadow vibes.";
  } else if (templateId === "venture_capital_investment") {
    details = "Corporate landing page for venture capital, modern executive boardroom overlooking a city skyline, corporate charts, professional pitch deck consulting slides, sleek slate navy and amber gold color highlights.";
  } else if (templateId === "esg_green_consulting") {
    details = "Pristine corporate ESG consulting landing page, clean green energy wind turbines and solar panels in the background, eco-friendly green leaves, carbon neutral charts, professional clean grid layout with teal and mint tones.";
  } else if (templateId === "architecture_design_studio" || templateId === "architect_space_portfolio") {
    details = "Sleek minimalist architectural portfolio showcase, monolithic raw concrete structures, terracotta clay tile walls, large glass facades reflecting a green forest, geometric architectural forms, dramatic shadows and bright sunlight.";
  } else if (templateId === "fashion_lookbook_portfolio") {
    details = "High-fashion runway lookbook portfolio, professional photography studio with high-contrast shadows, haute couture models wearing bold velvet red and black outfits, sleek minimalist layout with a velvet rose red accent.";
  } else if (templateId === "3d_motion_graphic_portfolio") {
    details = "Avant-garde 3D motion graphic artist portfolio, ultra-modern obsidian dark background, abstract 3D CGI spheres with glowing magenta pink and neon cyan light reflections, liquid metallic gold splashes, futuristic cyber vibes.";
  }

  return details;
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

    const imageMatch = block.match(/image:\s*"([^"]+)"/);
    const imagePath = imageMatch ? imageMatch[1] : `/templates/${tid}.png`;
    const imageFilename = path.basename(imagePath);

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
      imagePath,
      imageFilename,
      fontFamily: font,
      colors,
      isDarkMode: isDark,
    });
  }

  return templates;
}

async function main() {
  const existingImages = new Set(
    fs.existsSync(PUBLIC_TEMPLATES_DIR)
      ? fs.readdirSync(PUBLIC_TEMPLATES_DIR).filter((f) => f.endsWith(".png"))
      : []
  );

  console.log(`Found ${existingImages.size} existing images in public/templates`);

  const allTemplates = [];
  const files = fs.readdirSync(CATEGORIES_DIR);
  for (const file of files) {
    if (file.endsWith(".ts")) {
      const categoryTemplates = parseCategoryFile(path.join(CATEGORIES_DIR, file));
      allTemplates.push(...categoryTemplates);
      console.log(`Parsed ${categoryTemplates.length} templates from ${file}`);
    }
  }

  // Sort by category, then by templateId
  allTemplates.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.templateId.localeCompare(b.templateId);
  });

  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  console.log("Creating Google Spreadsheet on Google Drive...");

  // Create Google Spreadsheet
  const driveResponse = await drive.files.create({
    requestBody: {
      name: "CreAibox_Template_Image_Prompts",
      mimeType: "application/vnd.google-apps.spreadsheet",
    },
    fields: "id, name",
  });

  const spreadsheetId = driveResponse.data.id;
  console.log(`Created Spreadsheet ID: ${spreadsheetId}`);

  // Make it readable by anyone (optional, but good practice per project standards)
  await drive.permissions.create({
    fileId: spreadsheetId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });
  console.log("Permission granted: anyone can view.");

  // Prepare Headers and Rows
  const headers = [
    [
      "Category",
      "Template ID",
      "Template Name (Korean)",
      "Template Name (English)",
      "Theme Mode",
      "Font Family",
      "Primary Color",
      "Secondary Color",
      "Accent Color",
      "Background Color",
      "Prompt",
      "Image Filename",
      "Status",
    ],
  ];

  const rows = allTemplates.map((item) => {
    const titleEn = cleanIdToTitle(item.templateId);
    const modeDesc = item.isDarkMode ? "Dark Mode" : "Light Mode";

    // Format colors for prompt description
    const colorParts = Object.entries(item.colors).map(([name, val]) => `${name} ${val}`);
    const colorDesc = colorParts.join(", ");
    const fontDesc = item.fontFamily ? `typography using ${item.fontFamily}` : "clean modern typography";
    const details = getDesignDetails(item.category, item.templateId);

    const prompt =
      `A premium, high-fidelity landing page interface for a ${item.category} website named '${titleEn}'. ` +
      `${modeDesc} aesthetic, ${fontDesc}. ` +
      `Harmonious colors: ${colorDesc}. ` +
      `Design details: ${details} ` +
      `Strict English text, no device frames.`;

    const status = existingImages.has(item.imageFilename)
      ? "Generated & Deployed"
      : "Pending Generation (Scheduler)";

    return [
      item.category,
      item.templateId,
      item.name,
      titleEn,
      modeDesc,
      item.fontFamily,
      item.colors.primary || "",
      item.colors.secondary || "",
      item.colors.accent || "",
      item.colors.background || "",
      prompt,
      item.imageFilename,
      status,
    ];
  });

  const values = [...headers, ...rows];

  console.log("Writing template prompts data to the sheet...");
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "시트1!A1",
    valueInputOption: "RAW",
    requestBody: { values },
  });

  // Apply beautiful styling (dark navy header, auto resize columns)
  console.log("Applying styles and auto-resize...");
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 13,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.08, green: 0.18, blue: 0.36 }, // Deep Navy
                textFormat: {
                  bold: true,
                  foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, // White
                  fontSize: 10,
                },
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE",
              },
            },
            fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
          },
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 13,
            },
          },
        },
      ],
    },
  });

  console.log("==========================================");
  console.log("Google Sheets creation succeeded!");
  console.log(`Link: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
  console.log("==========================================");
}

main().catch((err) => {
  console.error("Execution failed:", err);
});
