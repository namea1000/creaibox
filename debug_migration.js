const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

async function debug() {
  try {
    const res = await fetch("https://davich.com/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    const htmlText = await res.text();
    const cleanHtml = htmlText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    const availableTemplateIds = "service_1, service_2, portfolio_1";
    const hasMain = false;
    const depth = '1-page';

    const prompt = `
          You are an expert Frontend Developer and Designer. Your task is to perfectly clone the layout, design, header, footer, and sections of the provided target website using beautifully crafted, modern Tailwind CSS HTML.
          Analyze the following cleaned HTML content of the website and generate an EXACT replica of its visual structure.
          
          You MUST output a strict JSON object with the following schema:
          {
            "template_id": "Choose the BEST matching template ID from the list below",
            ${!hasMain ? `"header_html": "<header class='...'>...</header>",
            "footer_html": "<footer class='...'>...</footer>",
            "main_sections": [
              {
                "section_type": "custom_html",
                "html": "<section class='...'>...</section>"
              }
            ],` : ""}
            ${depth === 'full' ? `"subpages": [
              {
                "page_slug": "exact string of the link (e.g. dojos from /dojos)",
                "html": "<main class='...'>...</main>"
              }
            ]` : ""}
          }

          Guidelines:
          - PRO-CLONING RULE 1 (Colors & Identity): Extract the EXACT HEX color codes, background colors (e.g., brand blue), and font colors from the original HTML structure and apply them as inline Tailwind arbitrary values (e.g., \`bg-[#005aab]\`, \`text-[#333333]\`). DO NOT use generic colors if a specific brand color is present.
          - PRO-CLONING RULE 2 (Data Preservation): DO NOT summarize, omit, or hallucinate text. Copy ALL specific statistics (e.g., '321개', '1,789명'), detailed numbers, company information in the footer, and exact copywriting VERBATIM.
          - PRO-CLONING RULE 3 (Images, Logos & VIDEOS): You MUST preserve all \`<img>\`, \`<video>\`, and \`<source>\` tags. Do not replace videos with solid colors. Include their original \`src\` so they can be brought over.
          - PRO-CLONING RULE 4 (Lazy-Loaded Media): Always prioritize \`data-src\`, \`data-lazy\`, or \`srcset\` attributes over a simple \`src\` if they exist. Use the highest resolution media URL available in the raw HTML.
          - PRO-CLONING RULE 5 (Navigation & Language Exact Match): Preserve the EXACT language and casing of header navigation menus (e.g., if it says 'ABOUT', do not translate it to '회사소개'). DO NOT hallucinate or extract hidden mobile menus if a clear desktop navigation exists.
          - CRITICAL RULE: All image URLs (\`src\` attributes or \`style="background-image: ..."\`) MUST be ABSOLUTE URLs. 
          - CRITICAL RULE 2: All internal links (\`<a href="...">\`) MUST be RELATIVE paths (e.g. \`href="/dojos"\`). Do not use absolute domains for internal navigation.
          - Use modern Tailwind CSS classes (e.g. flex, grid, px-8, py-16) for styling, but combine them with extracted brand colors.
          - Make the HTML fully responsive (use md:, lg: prefixes).
          - Do NOT use Markdown formatting in the strings.
          - From the following list of templates, choose the MOST appropriate 'template_id' based on the website's industry, content, and vibe: [${availableTemplateIds}].
          ${!hasMain ? `- Replicate the header menu links and footer structure exactly.
          - If the original site uses anchor links (e.g., href="#section") for a one-page layout, you MUST preserve these exact anchor links in the header and ensure the corresponding <section> blocks in main_sections have the matching id attributes.
          - Split the main body into 3 to 6 logical \`<section>\` blocks, each as a separate item in the \`main_sections\` array.` : ""}
          ${depth === 'full' ? `- You are provided with the HTML of actual subpages below. You MUST generate a "subpages" array mapping EACH provided subpage to its corresponding "page_slug" (e.g., if the link is "/dojos", the page_slug is "dojos"). Recreate the HTML for each subpage accurately.` : ""}
          - Output ONLY valid JSON. No other text.

          HTML content to analyze:
          --- MAIN PAGE ---
          ${cleanHtml.substring(0, 40000)} // Limit size
        `;

    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);
    let aiText = result.response.text().trim();
    console.log("RAW OUTPUT START");
    console.log(aiText.substring(0, 500) + "...\n..." + aiText.substring(aiText.length - 500));
    console.log("RAW OUTPUT END");
    
    if (aiText.startsWith("```json")) {
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    const parsedAi = JSON.parse(aiText);
    console.log("JSON Parsing: SUCCESS");
  } catch(e) {
    console.error("ERROR CAUGHT:", e);
  }
}
debug();
