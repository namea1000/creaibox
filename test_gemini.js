const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function run() {
  try {
    const apiKey = process.env.GEMINI_API_KEY_1;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
    
    const prompt = `Hello`;

    console.log("Calling Gemini...");
    const result = await model.generateContent(prompt);
    console.log("Result:", result.response.text());
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
