const fs = require("fs");
const path = require("path");

const CATEGORIES_DIR = "./src/lib/templates/categories";
const PREVIEWS_DIR = "./public/templates";

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

    templates.push({
      templateId: tid,
      name,
      category: cat,
      description: desc,
    });
  }
  return templates;
}

function main() {
  const templates = [];
  const files = fs.readdirSync(CATEGORIES_DIR);
  for (const file of files) {
    if (file.endsWith(".ts")) {
      const categoryTemplates = parseCategoryFile(path.join(CATEGORIES_DIR, file));
      templates.push(...categoryTemplates);
    }
  }

  console.log(`Total templates in codebase: ${templates.length}`);

  const existingPreviews = new Set(
    fs.readdirSync(PREVIEWS_DIR)
      .filter(f => f.endsWith(".png"))
      .map(f => f.replace(".png", ""))
  );

  console.log(`Existing preview images: ${existingPreviews.size}`);

  const missing = templates.filter(t => !existingPreviews.has(t.templateId));
  console.log(`Missing preview images: ${missing.length}`);

  // Group by category
  const grouped = {};
  missing.forEach(t => {
    if (!grouped[t.category]) {
      grouped[t.category] = [];
    }
    grouped[t.category].push(t);
  });

  console.log("\n--- Missing Previews by Category ---");
  for (const [cat, list] of Object.entries(grouped)) {
    console.log(`${cat}: ${list.length} missing`);
    // Print first 3 of each category
    list.slice(0, 3).forEach(t => {
      console.log(`  - ${t.templateId} (${t.name})`);
    });
  }
}

main();
