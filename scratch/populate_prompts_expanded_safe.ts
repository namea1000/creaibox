import * as fs from 'fs';
import { google } from 'googleapis';
import Groq from 'groq-sdk';

const SPREADSHEET_ID = "1-01HEzdUN-w305uJKA4f5zkm-5_7nYuk7z-ugQYXIek";

// Load environment variables from .env.local
const dotenvPath = '/Users/a1234/Local Sites/creaibox/.env.local';
const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
dotenvContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    process.env[key] = value;
  }
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const SHORTS_CATEGORIES_NEW = [
  { title: "⑪ 건강 & 피트니스 다이어트 (Health & Fitness)", desc: "고강도 홈트레이닝, 필라테스, 식단 조절, 다이어트 자극용 세로 쇼츠 배경입니다." },
  { title: "⑫ 뷰티 & 메이크업 패션 (Beauty & Fashion)", desc: "데일리 룩북 코디, 스킨케어 루틴, 화장품 클로즈업 등 트렌디한 패션 뷰티 배경입니다." },
  { title: "⑬ 자연 경관 & 평화로운 풍경 (Nature & Scenery)", desc: "구름 위 일출, 잔잔한 들꽃 들판, 숲속 안개 등 자연 치유적이고 무해한 풍경입니다." },
  { title: "⑭ 귀여운 동물 & 펫 라이프 (Pets & Animals)", desc: "강아지, 고양이 등의 귀여운 일상 3D 일러스트 및 실감 나는 펫 힐링 B-roll입니다." },
  { title: "⑮ 게임 하이라이트 & 레트로 게임 (Gaming & Retro)", desc: "레트로 픽셀 게임 조이스틱 조작, 가상 현실 미래 게이머, 사이버 오락실 분위기입니다." },
  { title: "⑯ 비즈니스 생산성 & 시간 관리 (Productivity)", desc: "뽀모도로 플래너 작성, 듀얼 모니터 데스크테리어, 디지털 노마드의 생산적인 아침입니다." },
  { title: "⑰ 역사적 사실 & 고대 문명 (Historical Facts)", desc: "중세 기사의 갑옷 광택, 옛날 양장본 지도의 나침반, 고대 그리스 조각상 앵글입니다." },
  { title: "⑱ 미니멀 라이프 & 인테리어 (Minimalist Room Decor)", desc: "오가닉 린넨 침대보, 아기자기한 테라코타 화분, 감성 조명 원룸 인테리어 쇼츠 배경입니다." },
  { title: "⑲ 축제 & 여행 명소 투어 (Festivals & Travel Spots)", desc: "에펠탑 야경 시선 POV, 화려한 밤하늘 불꽃축제 실시간 현장, 골목길 감성 야시장입니다." },
  { title: "⑳ 판타지 애니메이션 아트 스타일 (Fantasy Anime Art)", desc: "지브리 스타일의 초록빛 언덕 기차, 신카이 마코토 풍의 붉은 노을 하늘과 뭉게구름입니다." }
];

const MOVIE_CATEGORIES_NEW = [
  { title: "⑪ 아늑한 카페 & 빗소리 백색소음 (Cozy Cafe ASMR)", desc: "비 내리는 재즈 카페, 커피 머신 소음, 따뜻한 백색 등 조명이 있는 평화로운 내부 풍경 루프입니다." },
  { title: "⑫ 사이버펑크 도시 스카이라인 (Cyberpunk Cityscape)", desc: "네온사인 홀로그램 광고가 켜진 비 내리는 미래 도시의 빌딩 숲 공중 뷰입니다." },
  { title: "⑬ 웅장한 오케스트라 & 판타지 모험 (Orchestral Adventure)", desc: "모험 판타지 음악, 거대한 대천사상이나 신비로운 고대 성 성곽의 드론 루프입니다." },
  { title: "⑭ 아쿠아리움 & 깊은 바닷속 생물 (Deep Ocean & Aquarium)", desc: "심해 해파리들의 신비로운 자체 발광 움직임, 대형 수족관 가오리의 유영 루프입니다." },
  { title: "⑮ 감성 캠핑 & 탁 트인 자연 모닥불 (Camping Fireplace)", desc: "모닥불 타오르는 타닥타닥 소리, 별이 쏟아지는 호숫가 텐트 야영 B-roll입니다." },
  { title: "⑯ 도서관 & 독서 백색소음 (Library reading ambience)", desc: "천장 높은 고딕 양식 대학 도서관, 은은한 스탠드 불빛 아래 펼쳐진 두꺼운 책더미입니다." },
  { title: "⑰ 고요한 설산 & 겨울 오두막 풍경 (Snowy Cabin fireplace)", desc: "밖에는 폭설이 내리고, 안에서는 벽난로 불꽃이 활활 타오르는 겨울 별장 라운지 루프입니다." },
  { title: "⑱ 미니멀 오피스 & 차분한 노동음악 (Workspace ambience)", desc: "차분하고 집중도 높은 프로그래머 오피스, 유리창 너머 빌딩 야경과 듀얼 모니터 코딩 풍경입니다." },
  { title: "⑲ 고대 동양 정원 & 바람 소리 (Oriental Zen Garden)", desc: "대나무 숲 사이로 부는 바람, 모래정원(카레산스이)의 정갈한 바위와 졸졸 흐르는 대나무 물통 루프입니다." },
  { title: "⑳ 가을 단풍 숲 & 낙엽 밟는 소리 (Autumn Forest scenery)", desc: "오렌지빛 낙엽이 흩날리는 숲속 오솔길, 안개 낀 자작나무 숲의 운치 있는 풍경입니다." }
];

const ORIGINAL_SHORTS_TITLES = [
  "① 동기부여 & 성공 (Motivation)",
  "② 금융 & 부의 축적 & 주식 (Wealth & Money)",
  "③ 지식 & 미스터리 & 우주 (Knowledge & Sci-Fi)",
  "④ 심리 & 연애 & 인간관계 (Psychology & Love)",
  "⑤ 영화/드라마 리뷰용 오마주 (Movie Recap B-roll)",
  "⑥ 만족/ASMR & 미학 힐링 (Satisfying ASMR)",
  "⑦ 푸드 & 쿠킹 클로즈업 (Food Close-up)",
  "⑧ 사이버 & 코딩 & AI 테크 (Coding & AI Tech)",
  "⑨ 1인칭 여행 & 액티비티 (POV Action)",
  "⑩ 공포 & 심리적 오싹함 (Horror & Urban Legend)"
];

const ORIGINAL_MOVIE_TITLES = [
  "① 로파이(Lo-Fi) & 감성 방 루프 (Study Loop)",
  "② 명상 & 슬립뮤직 자연 (Sleep Meditation)",
  "③ 역사 & 철학 & 오래된 서재 (Stoic & History)",
  "④ 테크 & 미래 과학 & 인공지능 (Tech B-roll)",
  "⑤ 금융 & 비즈니스 & 글로벌 경제 (Corporate & Wealth)",
  "⑥ 레트로 신스웨이브 & 시티팝 (Synthwave & Citypop)",
  "⑦ 판타지 & 던전 & 신화 속 세계 (Fantasy Loop)",
  "⑧ 팟캐스트 & 오디오북 라디오 (Podcast Background)",
  "⑨ 기차/자동차 차창 밖 풍경 (Travel Scenery)",
  "⑩ 우주 탐사 & 공상과학 SF (Space Exploration)"
];

async function generatePromptsForCategory(
  catTitle: string,
  index: number,
  isShorts: boolean,
  existingPrompts: string[]
) {
  const existingPromptsContext = existingPrompts && existingPrompts.length > 0
    ? `Here are the Korean descriptions of the existing prompts already in this category. You MUST NOT duplicate, mimic, or repeat any of these concepts, themes, situations, or subjects. Make this new prompt completely different, fresh, and unique:\n${existingPrompts.map((p, idx) => `- Existing Prompt ${idx + 1}: "${p}"`).join('\n')}`
    : '';

  const systemPrompt = `You are a professional AI video generator prompt engineer.
Your task is to generate high-quality video generation prompts for a specific theme.
The ratio of the video is: ${isShorts ? "9:16 vertical shorts video" : "16:9 horizontal widescreen video"}.
Generate exactly one item representing item number ${index} for this theme: "${catTitle}".

${existingPromptsContext}

Provide a JSON object with:
1. "description": A short Korean description of the scene.
2. "image_prompt": A highly detailed English image prompt to generate the starting frame. Specify NO text, watermarks, or writing. Append "aspect ratio ${isShorts ? "9:16" : "16:9"}".
3. "motion_prompt": A highly detailed English motion prompt describing the camera movement and physical animation (loopable, seamless loop).

Return ONLY a JSON object:
{
  "description": "string",
  "image_prompt": "string",
  "motion_prompt": "string"
}`;

  let attempt = 0;
  while (attempt < 5) {
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "system", content: systemPrompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.75,
        response_format: { type: "json_object" }
      });
      const data = JSON.parse(response.choices[0]?.message?.content || "{}");
      if (data.description && data.image_prompt && data.motion_prompt) {
        return data;
      }
    } catch (e: any) {
      attempt++;
      console.warn(`[Groq API Attempt ${attempt}] Error: ${e.message}. Retrying in ${attempt * 3.5}s...`);
      await delay(3500 * attempt);
    }
  }
  throw new Error("Failed to generate prompt from Groq after 5 attempts");
}

async function main() {
  const oauth2Client = new google.auth.OAuth2(process.env.GCP_OAUTH_CLIENT_ID, process.env.GCP_OAUTH_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: process.env.GCP_OAUTH_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  // === 1. Read existing values up to Row 450 to build non-duplication context and enable resuming ===
  console.log("Reading existing prompts from 'shorts 9:16'...");
  const shortsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'shorts 9:16'!A1:E450"
  });
  const shortsRows = shortsRes.data.values || [];

  // Build existing prompt descriptions map to prevent duplication
  const shortsExistingMap = new Map<number, string[]>(); // catIdx -> array of descriptions
  
  // For Categories 1 to 10
  for (let catIdx = 0; catIdx < 10; catIdx++) {
    const rowIdx = 1 + (catIdx * 21);
    const existing: string[] = [];
    for (let offset = 0; offset < 20; offset++) {
      const row = shortsRows[rowIdx + offset];
      if (row && row[2]) {
        existing.push(row[2]);
      }
    }
    shortsExistingMap.set(catIdx, existing);
    console.log(`- Loaded ${existing.length} existing prompts for Shorts category ${catIdx + 1}: ${ORIGINAL_SHORTS_TITLES[catIdx]}`);
  }

  // For Categories 11 to 20
  for (let catIdx = 10; catIdx < 20; catIdx++) {
    const rowIdx = 1 + (catIdx * 21);
    const existing: string[] = [];
    for (let offset = 0; offset < 20; offset++) {
      const row = shortsRows[rowIdx + offset];
      if (row && row[2]) {
        existing.push(row[2]);
      }
    }
    shortsExistingMap.set(catIdx, existing);
    console.log(`- Loaded ${existing.length} existing prompts for Shorts category ${catIdx + 1}: ${SHORTS_CATEGORIES_NEW[catIdx - 10].title}`);
  }

  console.log("\nReading existing prompts from 'movie 16:9'...");
  const movieRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'movie 16:9'!A1:E450"
  });
  const movieRows = movieRes.data.values || [];

  const movieExistingMap = new Map<number, string[]>();
  
  // For Categories 1 to 10
  for (let catIdx = 0; catIdx < 10; catIdx++) {
    const rowIdx = 1 + (catIdx * 21);
    const existing: string[] = [];
    for (let offset = 0; offset < 20; offset++) {
      const row = movieRows[rowIdx + offset];
      if (row && row[2]) {
        existing.push(row[2]);
      }
    }
    movieExistingMap.set(catIdx, existing);
    console.log(`- Loaded ${existing.length} existing prompts for Movie category ${catIdx + 1}: ${ORIGINAL_MOVIE_TITLES[catIdx]}`);
  }

  // For Categories 11 to 20
  for (let catIdx = 10; catIdx < 20; catIdx++) {
    const rowIdx = 1 + (catIdx * 21);
    const existing: string[] = [];
    for (let offset = 0; offset < 20; offset++) {
      const row = movieRows[rowIdx + offset];
      if (row && row[2]) {
        existing.push(row[2]);
      }
    }
    movieExistingMap.set(catIdx, existing);
    console.log(`- Loaded ${existing.length} existing prompts for Movie category ${catIdx + 1}: ${MOVIE_CATEGORIES_NEW[catIdx - 10].title}`);
  }

  // === 2. Make sure Category 11 to 20 outlines exist ===
  console.log("\nEnsuring Categories 11 to 20 outlines are written starting at Row 212...");
  const shortsNewRows: string[][] = [];
  for (const cat of SHORTS_CATEGORIES_NEW) {
    shortsNewRows.push([cat.title, "1", "", "", ""]);
    shortsNewRows.push([cat.desc, "2", "", "", ""]);
    for (let i = 3; i <= 21; i++) {
      shortsNewRows.push(["", i.toString(), "", "", ""]);
    }
    shortsNewRows.push(["", "", "", "", ""]);
  }

  const movieNewRows: string[][] = [];
  for (const cat of MOVIE_CATEGORIES_NEW) {
    movieNewRows.push([cat.title, "1", "", "", ""]);
    movieNewRows.push([cat.desc, "2", "", "", ""]);
    for (let i = 3; i <= 21; i++) {
      movieNewRows.push(["", i.toString(), "", "", ""]);
    }
    movieNewRows.push(["", "", "", "", ""]);
  }

  // Only write outline if row 212 is currently empty
  if (shortsRows.length < 212 || !shortsRows[211] || !shortsRows[211][0]) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "'shorts 9:16'!A212:E",
      valueInputOption: "RAW",
      requestBody: { values: shortsNewRows }
    });
  }

  if (movieRows.length < 212 || !movieRows[211] || !movieRows[211][0]) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "'movie 16:9'!A212:E",
      valueInputOption: "RAW",
      requestBody: { values: movieNewRows }
    });
  }

  console.log("Outlines checked and ready! Starting duplication-safe, resume-supported prompt generation...\n");

  // === 3. Generate empty slots for Shorts 9:16 ===
  // Categories 1 to 10: fill prompts 11 to 20
  console.log("--- Generating Shorts 1 to 10 empty prompts ---");
  for (let catIdx = 0; catIdx < 10; catIdx++) {
    const catTitle = ORIGINAL_SHORTS_TITLES[catIdx];
    const rowIdx = 1 + (catIdx * 21);
    const existing = shortsExistingMap.get(catIdx) || [];
    
    for (let i = 11; i <= 20; i++) {
      const offset = i - 1; // 10 to 19
      const targetRow = rowIdx + offset + 1; // Row 13 to 22
      
      // Resume check: Skip if already filled
      const existingRow = shortsRows[targetRow - 1];
      if (existingRow && existingRow[2] && existingRow[3]) {
        console.log(`[Shorts Category ${catIdx + 1}] Prompt ${i}/20 is already filled. Skipping.`);
        continue;
      }

      console.log(`Generating Shorts [${catTitle}] Prompt ${i}/20 (Sheet Row ${targetRow})...`);
      try {
        const generated = await generatePromptsForCategory(catTitle, i, true, existing);
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `'shorts 9:16'!C${targetRow}:E${targetRow}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[generated.description, generated.image_prompt, generated.motion_prompt]]
          }
        });
        existing.push(generated.description);
      } catch (e: any) {
        console.error(`Error at Shorts [${catTitle}] Prompt ${i}:`, e.message);
      }
      await delay(3500); // 3.5 seconds delay to stay below 30 RPM limit comfortably
    }
  }

  // Categories 11 to 20: fill prompts 1 to 20
  console.log("\n--- Generating Shorts 11 to 20 prompts ---");
  for (let catIdx = 10; catIdx < 20; catIdx++) {
    const cat = SHORTS_CATEGORIES_NEW[catIdx - 10];
    const rowIdx = 1 + (catIdx * 21);
    const existing = shortsExistingMap.get(catIdx) || [];
    
    for (let i = 1; i <= 20; i++) {
      const offset = i - 1;
      const targetRow = rowIdx + offset + 1;
      
      const existingRow = shortsRows[targetRow - 1];
      if (existingRow && existingRow[2] && existingRow[3]) {
        console.log(`[Shorts Category ${catIdx + 1}] Prompt ${i}/20 is already filled. Skipping.`);
        continue;
      }

      console.log(`Generating Shorts [${cat.title}] Prompt ${i}/20 (Sheet Row ${targetRow})...`);
      try {
        const generated = await generatePromptsForCategory(cat.title, i, true, existing);
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `'shorts 9:16'!C${targetRow}:E${targetRow}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[generated.description, generated.image_prompt, generated.motion_prompt]]
          }
        });
        existing.push(generated.description);
      } catch (e: any) {
        console.error(`Error at Shorts [${cat.title}] Prompt ${i}:`, e.message);
      }
      await delay(3500);
    }
  }

  // === 4. Generate empty slots for Movie 16:9 ===
  // Categories 1 to 10: fill prompts 11 to 20
  console.log("\n--- Generating Movie 1 to 10 empty prompts ---");
  for (let catIdx = 0; catIdx < 10; catIdx++) {
    const catTitle = ORIGINAL_MOVIE_TITLES[catIdx];
    const rowIdx = 1 + (catIdx * 21);
    const existing = movieExistingMap.get(catIdx) || [];
    
    for (let i = 11; i <= 20; i++) {
      const offset = i - 1;
      const targetRow = rowIdx + offset + 1;
      
      const existingRow = movieRows[targetRow - 1];
      if (existingRow && existingRow[2] && existingRow[3]) {
        console.log(`[Movie Category ${catIdx + 1}] Prompt ${i}/20 is already filled. Skipping.`);
        continue;
      }

      console.log(`Generating Movie [${catTitle}] Prompt ${i}/20 (Sheet Row ${targetRow})...`);
      try {
        const generated = await generatePromptsForCategory(catTitle, i, false, existing);
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `'movie 16:9'!C${targetRow}:E${targetRow}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[generated.description, generated.image_prompt, generated.motion_prompt]]
          }
        });
        existing.push(generated.description);
      } catch (e: any) {
        console.error(`Error at Movie [${catTitle}] Prompt ${i}:`, e.message);
      }
      await delay(3500);
    }
  }

  // Categories 11 to 20: fill prompts 1 to 20
  console.log("\n--- Generating Movie 11 to 20 prompts ---");
  for (let catIdx = 10; catIdx < 20; catIdx++) {
    const cat = MOVIE_CATEGORIES_NEW[catIdx - 10];
    const rowIdx = 1 + (catIdx * 21);
    const existing = movieExistingMap.get(catIdx) || [];
    
    for (let i = 1; i <= 20; i++) {
      const offset = i - 1;
      const targetRow = rowIdx + offset + 1;
      
      const existingRow = movieRows[targetRow - 1];
      if (existingRow && existingRow[2] && existingRow[3]) {
        console.log(`[Movie Category ${catIdx + 1}] Prompt ${i}/20 is already filled. Skipping.`);
        continue;
      }

      console.log(`Generating Movie [${cat.title}] Prompt ${i}/20 (Sheet Row ${targetRow})...`);
      try {
        const generated = await generatePromptsForCategory(cat.title, i, false, existing);
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `'movie 16:9'!C${targetRow}:E${targetRow}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[generated.description, generated.image_prompt, generated.motion_prompt]]
          }
        });
        existing.push(generated.description);
      } catch (e: any) {
        console.error(`Error at Movie [${cat.title}] Prompt ${i}:`, e.message);
      }
      await delay(3500);
    }
  }

  console.log("\n🎉 Duplication-safe expanded catalog of 800 prompts populated successfully!");
}

main().catch(console.error);
