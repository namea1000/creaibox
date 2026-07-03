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

const SHORTS_CATEGORIES = [
  { title: "① 동기부여 & 성공 (Motivation)", desc: "동기부여, 갓생 살기, 명언 쇼츠 채널에서 자막 배경으로 가장 많이 사용합니다." },
  { title: "② 금융 & 부의 축적 & 주식 (Wealth & Money)", desc: "주식, 부동산, 부자 되는 법, 쇼츠 재테크 채널의 메인 배경 자료입니다." },
  { title: "③ 지식 & 미스터리 & 우주 (Knowledge & Sci-Fi)", desc: "잡학사전, 흥미로운 역사, 미스터리 지식 설명 쇼츠 유튜버들이 애용합니다." },
  { title: "④ 심리 & 연애 & 인간관계 (Psychology & Love)", desc: "연애 심리학, MBTI 분석, 인간관계 조언 채널들의 자막용 감성 배경입니다." },
  { title: "⑤ 영화/드라마 리뷰용 오마주 (Movie Recap B-roll)", desc: "영화/드라마 요약 및 연예인 비하인드 뉴스를 다루는 이슈 채널의 시각 자료입니다." },
  { title: "⑥ 만족/ASMR & 미학 힐링 (Satisfying ASMR)", desc: "힐링 글귀, 시, 조용한 에세이를 오디오북 느낌으로 제작하는 쇼츠 채널용입니다." },
  { title: "⑦ 푸드 & 쿠킹 클로즈업 (Food Close-up)", desc: "요리법 설명 쇼츠나 꿀팁을 전하는 푸드/리빙 채널의 시인성 높은 B-roll입니다." },
  { title: "⑧ 사이버 & 코딩 & AI 테크 (Coding & AI Tech)", desc: "코딩 팁, AI 툴 소개, 미래 기술을 다루는 테크 쇼츠 채널을 타겟팅합니다." },
  { title: "⑨ 1인칭 여행 & 액티비티 (POV Action)", desc: "브이로그, 여행 정보 공유, 감성 에세이 크리에이터들의 단골 소스입니다." },
  { title: "⑩ 공포 & 심리적 오싹함 (Horror & Urban Legend)", desc: "도시전설, 괴담, 무서운 이야기 쇼츠 채널을 위한 오컬트 감성 배경입니다." },
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

const MOVIE_CATEGORIES = [
  { title: "① 로파이(Lo-Fi) & 감성 방 루프 (Study Loop)", desc: "1시간 이상 재생되는 Study with me, Lo-Fi 음악, 백색소음 채널의 독보적인 1위 소재입니다." },
  { title: "② 명상 & 슬립뮤직 자연 (Sleep Meditation)", desc: "수면 유도 음악, 요가 및 명상, 뇌파 음악 유튜버들이 롱폼 영상을 만들 때 항상 사용하는 자연 루프입니다." },
  { title: "③ 역사 & 철학 & 오래된 서재 (Stoic & History)", desc: "스토아 철학 라디오, 역사 속 전쟁 분석, 고전 명언 아카이빙 채널들의 클래식한 배경입니다." },
  { title: "④ 테크 & 미래 과학 & 인공지능 (Tech B-roll)", desc: "AI 트렌드 리포트, 과학 기술 다큐멘터리 유튜버들의 화면 설명 보조 자료입니다." },
  { title: "⑤ 금융 & 비즈니스 & 글로벌 경제 (Corporate & Wealth)", desc: "재테크 분석, 기업 다큐멘터리, 경제 시황 유튜버들의 시각 전환용입니다." },
  { title: "⑥ 레트로 신스웨이브 & 시티팝 (Synthwave & Citypop)", desc: "시티팝 플레이리스트, 테크노/신스웨이브 음악 채널들의 환상적인 배경 루프입니다." },
  { title: "⑦ 판타지 & 던전 & 신화 속 세계 (Fantasy Loop)", desc: "TRPG 플레이 배경 화면, 타로 카드 해독, 판타지 오디오북 배경으로 강력한 수요가 있습니다." },
  { title: "⑧ 팟캐스트 & 오디오북 라디오 (Podcast Background)", desc: "오디오 에세이, 심야 책 읽어주는 라디오 채널의 집중용 화면입니다." },
  { title: "⑨ 기차/자동차 차창 밖 풍경 (Travel Scenery)", desc: "ASMR 여행 라디오, 조용히 책 읽기 좋은 오디오북 배경입니다." },
  { title: "⑩ 우주 탐사 & 공상과학 SF (Space Exploration)", desc: "SF 다큐멘터리, 공상과학 시나리오 리뷰, 잠잘 때 듣는 우주 명상 채널의 원픽 소재입니다." },
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

async function generatePromptsForCategory(catTitle: string, index: number, isShorts: boolean) {
  const systemPrompt = `You are a professional AI video generator prompt engineer.
Your task is to generate high-quality video generation prompts for a specific theme.
The ratio of the video is: ${isShorts ? "9:16 vertical shorts video" : "16:9 horizontal widescreen video"}.
Generate exactly one item representing item number ${index} for this theme: "${catTitle}".

Provide a JSON object with:
1. "description": A short Korean description of the scene (e.g. "이른 아침 안개가 자욱한 공원을 달리는 고독한 러너의 뒷모습").
2. "image_prompt": A highly detailed English image prompt to generate the starting frame. Must include styling (e.g., cinematic, 3d clay, photorealistic, anime), camera angle, lighting, colors. Specify NO text, watermarks, or writing. Append "aspect ratio ${isShorts ? "9:16" : "16:9"}".
3. "motion_prompt": A highly detailed English motion prompt describing the camera movement and physical animation (e.g., "slow camera pan forward, runners clothing fluttering in wind, mist slowly swirling, loopable, seamless loop").

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
        model: "qwen/qwen3-32b",
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
      const data = JSON.parse(response.choices[0]?.message?.content || "{}");
      if (data.description && data.image_prompt && data.motion_prompt) {
        return data;
      }
    } catch (e) {
      attempt++;
      await delay(2000 * attempt);
    }
  }
  throw new Error("Failed to generate prompt from Groq");
}

async function main() {
  const oauth2Client = new google.auth.OAuth2(process.env.GCP_OAUTH_CLIENT_ID, process.env.GCP_OAUTH_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: process.env.GCP_OAUTH_REFRESH_TOKEN });
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

  // === 1. Prepare & Write Expanded Outlines (20 categories x 20 prompts) ===
  console.log("Preparing sheet outlines for expanded catalog...");
  
  // For each category, we have: Title (1 row), Desc (1 row), Prompts (20 rows), Spacer (1 row) = 23 rows.
  // 20 categories * 23 rows = 460 rows.
  // Plus 1 header row = 461 rows.
  
  const shortsRows: string[][] = [
    ["Topic", "no", "한글 설명", "Image_Prompt", "Motion_Prompt"]
  ];
  for (const cat of SHORTS_CATEGORIES) {
    shortsRows.push([cat.title, "1", "", "", ""]);
    shortsRows.push([cat.desc, "2", "", "", ""]);
    for (let i = 3; i <= 22; i++) {
      shortsRows.push(["", i.toString(), "", "", ""]);
    }
    shortsRows.push(["", "", "", "", ""]);
  }

  const movieRows: string[][] = [
    ["Topic", "no", "한글 설명", "Image_Prompt", "Motion_Prompt"]
  ];
  for (const cat of MOVIE_CATEGORIES) {
    movieRows.push([cat.title, "1", "", "", ""]);
    movieRows.push([cat.desc, "2", "", "", ""]);
    for (let i = 3; i <= 22; i++) {
      movieRows.push(["", i.toString(), "", "", ""]);
    }
    movieRows.push(["", "", "", "", ""]);
  }

  console.log("Writing initial structural outline to 'shorts 9:16'...");
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'shorts 9:16'!A1:E${shortsRows.length}`,
    valueInputOption: "RAW",
    requestBody: { values: shortsRows }
  });

  console.log("Writing initial structural outline to 'movie 16:9'...");
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'movie 16:9'!A1:E${movieRows.length}`,
    valueInputOption: "RAW",
    requestBody: { values: movieRows }
  });

  console.log("Outlines written successfully! Starting incremental prompt generation...");

  // === 2. Populate Shorts (9:16) incrementally ===
  let rowIdx = 1;
  for (const cat of SHORTS_CATEGORIES) {
    console.log(`Processing Shorts Category: ${cat.title}`);
    for (let i = 1; i <= 20; i++) {
      const targetRow = rowIdx + i + 1; // skip title (rowIdx) and desc (rowIdx + 1) -> starts from rowIdx + 2
      console.log(`Generating prompt ${i}/20 for Shorts: ${cat.title} (Sheet Row ${targetRow + 1})...`);
      try {
        const generated = await generatePromptsForCategory(cat.title, i, true);
        
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `'shorts 9:16'!C${targetRow + 1}:E${targetRow + 1}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[generated.description, generated.image_prompt, generated.motion_prompt]]
          }
        });
      } catch (e: any) {
        console.error("Error generating shorts prompt:", e.message);
      }
      await delay(2000);
    }
    rowIdx += 23; // 1 title + 1 desc + 20 prompts + 1 spacer
  }

  // === 3. Populate Movie (16:9) incrementally ===
  rowIdx = 1;
  for (const cat of MOVIE_CATEGORIES) {
    console.log(`Processing Movie Category: ${cat.title}`);
    for (let i = 1; i <= 20; i++) {
      const targetRow = rowIdx + i + 1;
      console.log(`Generating prompt ${i}/20 for Movie: ${cat.title} (Sheet Row ${targetRow + 1})...`);
      try {
        const generated = await generatePromptsForCategory(cat.title, i, false);
        
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `'movie 16:9'!C${targetRow + 1}:E${targetRow + 1}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [[generated.description, generated.image_prompt, generated.motion_prompt]]
          }
        });
      } catch (e: any) {
        console.error("Error generating movie prompt:", e.message);
      }
      await delay(2000);
    }
    rowIdx += 23;
  }

  console.log("🎉 Expanded catalog of 800 prompts populated successfully!");
}

main().catch(console.error);
