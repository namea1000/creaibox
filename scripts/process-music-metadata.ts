import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Google Sheet public CSV export URL (gid=1000184272 is the "장르" sheet)
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/19M0tbSSuROudWAhQZ0DR-nKEXOoIHcWBGFtiKQWPClU/export?format=csv&gid=1000184272";

// 24 Mood definitions with keywords for rule-based fallback classification
const MOOD_DEFINITIONS = [
  { mood: "Upbeat", keywords: ["upbeat", "cheerful", "lively", "vlog", "bright", "sunny", "whistle", "positive", "acoustic guitar"] },
  { mood: "Horror", keywords: ["horror", "spooky", "scary", "ghost", "dark pad", "creepy", "dread", "shriek", "dissonant"] },
  { mood: "Cute", keywords: ["cute", "sweet", "lovely", "ukulele", "marimba", "bouncy", "playful", "kids", "toy", "pet"] },
  { mood: "Groovy", keywords: ["groovy", "funky", "rhythmic", "slap bass", "rhodes", "funk", "disco", "dancefloor", "lounge"] },
  { mood: "Suspenseful", keywords: ["suspenseful", "tense", "thrilling", "ticking", "staccato", "mystery", "chase", "thriller", "clock"] },
  { mood: "Minimal", keywords: ["minimal", "simple", "clean", "synth melody", "portfolio", "ambient pad", "subtle", "lo-fi beat"] },
  { mood: "Dramatic", keywords: ["dramatic", "cinematic", "emotional", "orchestral", "strings", "brass", "climax", "epic adventure"] },
  { mood: "Romantic", keywords: ["romantic", "love", "sweet", "classical guitar", "violin", "wedding", "waltz", "couple", "ballad"] },
  { mood: "Dreamy", keywords: ["dreamy", "ethereal", "atmospheric", "vocal texture", "arpeggio", "space", "constellation", "fantasy"] },
  { mood: "Bright", keywords: ["bright", "sunny", "joyful", "summer", "vacation", "commercial", "happy", "whistle"] },
  { mood: "Solemn", keywords: ["solemn", "heroic", "grim", "french horn", "taiko", "battlefield", "epic victory", "anthem", "brass"] },
  { mood: "Sad", keywords: ["sad", "melancholy", "sorrowful", "grief", "farewell", "bittersweet", "crying violin", "heavy piano"] },
  { mood: "Exciting", keywords: ["exciting", "energetic", "uplifting", "future bass", "dance drop", "night drive", "party", "club"] },
  { mood: "Mysterious", keywords: ["mysterious", "mystical", "magical", "ethnic woodwind", "flute", "forest", "ancient temple", "ruins"] },
  { mood: "Nostalgic", keywords: ["nostalgic", "sentimental", "wistful", "retro", "90s", "vintage", "retro 80s", "cassette", "rhodes"] },
  { mood: "Epic", keywords: ["epic", "grand", "majestic", "symphonic", "marching percussion", "adventure", "orchestral rise"] },
  { mood: "Calm", keywords: ["calm", "gentle", "soft", "peaceful", "nylon guitar", "bossa nova", "lullaby", "serene", "lazy"] },
  { mood: "Fun", keywords: ["fun", "playful", "cheerful", "xylophone", "trombone slide", "cartoon", "mischievous", "comedy"] },
  { mood: "Refreshing", keywords: ["refreshing", "cool", "crisp", "crystal bell", "glockenspiel", "spring rain", "blue sky", "breeze"] },
  { mood: "Comical", keywords: ["comical", "humorous", "funny", "tuba", "bassoon", "slapstick", "ng", "blooper", "quirky"] },
  { mood: "Peaceful", keywords: ["peaceful", "serene", "tranquil", "grand piano", "meditation", "yoga", "calm strings", "morning"] },
  { mood: "Happy", keywords: ["happy", "joyful", "glad", "picnic", "rhythmic handclaps", "bright acoustic", "smiles"] },
  { mood: "Hopeful", keywords: ["hopeful", "uplifting", "inspiring", "startup", "motivation", "inspiring piano", "orchestration"] },
  { mood: "Scary", keywords: ["scary", "creepy", "frightening", "haunted", "screech", "shiver", "monster", "dissonant strings"] }
];

async function classifyMood(genre: string, title: string, prompt: string): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const textToAnalyze = `${genre} ${title} ${prompt}`.toLowerCase();

  if (GEMINI_API_KEY) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const systemPrompt = `You are a music mood classifier. Analyze the song title, genre, and production prompt, and classify it into EXACTLY ONE or TWO of these 24 moods:
${MOOD_DEFINITIONS.map(m => m.mood).join(", ")}.
Reply with only the matching mood names separated by a comma (e.g. "Upbeat" or "Dreamy, Peaceful"). Nothing else.`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Genre: ${genre}\nTitle: ${title}\nPrompt: ${prompt}\n\nWhat is the best matching mood?` }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) {
        const matched = text.split(",")
          .map((m: string) => m.trim())
          .filter((m: string) => MOOD_DEFINITIONS.some(d => d.mood.toLowerCase() === m.toLowerCase()));
        if (matched.length > 0) {
          return matched.join(", ");
        }
      }
    } catch (e) {
      console.warn("⚠️ Gemini classification failed, falling back to rule-based parser.");
    }
  }

  let bestMood = "Calm";
  let maxScore = -1;

  for (const def of MOOD_DEFINITIONS) {
    let score = 0;
    for (const kw of def.keywords) {
      if (textToAnalyze.includes(kw)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMood = def.mood;
    }
  }

  return bestMood;
}

/**
 * Parses CSV text to a 2D array, handling quotes and commas properly.
 */
function parseCSV(content: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = "";

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentVal.trim());
      lines.push(row);
      row = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    lines.push(row);
  }
  return lines;
}

async function processMetadata() {
  console.log("📡 Connecting to live Google Sheet CSV...");
  const response = await fetch(GOOGLE_SHEET_CSV_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet CSV: ${response.statusText}`);
  }
  
  const csvText = await response.text();
  console.log("🚀 Parsing Google Sheet rows and classifying moods...");
  const rawRows = parseCSV(csvText);

  const metadataList: any[] = [];
  const completedRows: string[][] = [];

  let songIndex = 1;

  // Add header
  completedRows.push(rawRows[0]);

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length < 6) {
      completedRows.push(row);
      continue;
    }

    // Row mapping:
    // col 1: Index, col 2: 분위기, col 3: 장르 대분류, col 4: 영어 대분류, col 5: 카테고리 (영문)
    // col 7: 제목1, col 8: 프롬프트1, col 9: 제목2, col 10: 프롬프트2, col 11: 제목3, col 12: 프롬프트3
    const indexVal = row[1];
    const genreGroup = row[3];
    const genreGroupEng = row[4];
    const subGenre = row[5];

    if (!genreGroup || !subGenre || indexVal === undefined || indexVal === "") {
      completedRows.push(row);
      continue;
    }

    const title1 = row[7] || "";
    const prompt1 = row[8] || "";
    const title2 = row[9] || "";
    const prompt2 = row[10] || "";
    const title3 = row[11] || "";
    const prompt3 = row[12] || "";

    const tracks = [
      { title: title1, prompt: prompt1 },
      { title: title2, prompt: prompt2 },
      { title: title3, prompt: prompt3 }
    ].filter(t => t.title && t.title.toString().trim());

    // Auto classify dominant mood using Title 1
    let rowMood = "";
    if (tracks.length > 0) {
      rowMood = await classifyMood(subGenre.toString(), tracks[0].title.toString(), tracks[0].prompt.toString());
      console.log(`✨ Row #${indexVal} [${subGenre}] classified as Mood: [${rowMood}]`);
    }

    // Update '분위기' in Column index 2
    row[2] = rowMood;
    completedRows.push(row);

    // Save individual tracks to music metadata list
    for (const track of tracks) {
      const trackMood = await classifyMood(subGenre.toString(), track.title.toString(), track.prompt.toString());
      const cleanFileName = track.title.toString().replace(/[^a-zA-Z0-9]/g, "_") + ".mp3";
      
      // Build folder structures matching scale requirements: /music/01_Rock_and_Subculture_Styles/Hard_Rock/Filename.mp3
      const cleanSubGenre = subGenre.toString().replace(/[^a-zA-Z0-9]/g, "_");
      const cleanGenreGroup = genreGroupEng.toString().replace(/[^a-zA-Z0-9_-]/g, "_");
      const r2Url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://cdn.creaibox.com"}/music/${cleanGenreGroup}/${cleanSubGenre}/${cleanFileName}`;

      metadataList.push({
        id: `song_${songIndex}`,
        title: track.title.toString(),
        genreGroup: genreGroup.toString(),
        genreGroupEng: genreGroupEng.toString(),
        subGenre: subGenre.toString(),
        mood: trackMood,
        prompt: track.prompt.toString(),
        audioUrl: r2Url
      });

      songIndex++;
    }
  }

  // 1. Output filled JSON for frontend
  const jsonOutputPath = path.resolve(process.cwd(), "src/lib/constants/music_metadata.json");
  fs.mkdirSync(path.dirname(jsonOutputPath), { recursive: true });
  fs.writeFileSync(jsonOutputPath, JSON.stringify(metadataList, null, 2), "utf-8");
  console.log(`✅ Success: Generated music metadata JSON at: ${jsonOutputPath}`);

  // 2. Save completed CSV for easy copy-paste back to Google Sheet
  const csvOutputPath = path.resolve(process.cwd(), "bgm_music_style_prompt_completed.csv");
  const csvContent = completedRows.map(row => row.map(cell => `"${(cell || "").replace(/"/g, '""')}"`).join(",")).join("\n");
  fs.writeFileSync(csvOutputPath, csvContent, "utf-8");
  console.log(`🎉 Success: Saved completed CSV with classified moods to: ${csvOutputPath}`);
}

processMetadata().catch(err => {
  console.error("❌ ERROR running metadata pipeline:", err);
});
