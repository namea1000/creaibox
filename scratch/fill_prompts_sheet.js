const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in environment variables.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

// 각 카테고리에 대응하는 고품질 미드저니 및 Google Flow용 영문 프롬프트와 추천 툴 목록
const promptsData = [
  // 1. 자연 & 풍경
  {
    prompt: "A breathtaking cinematic view of an emerald green beach, gentle crystal clear waves lapping on white sand, soft golden sunlight, coconut palm trees leaning over the shore, photorealistic, 8k resolution",
    tool: "Google Flow / Midjourney"
  },
  {
    prompt: "Majestic snow-capped mountain peaks towering over a deep fjord canyon, misty evergreen coniferous forests below, drone shot, dramatic mood, high detail, photorealistic, 8k",
    tool: "Midjourney"
  },
  {
    prompt: "A serene mirror-like lake reflecting lush riverbank forests, soft early morning mist rising from the water, high resolution landscape photography, national geographic style",
    tool: "Google Flow"
  },
  {
    prompt: "A spectacular night sky filled with a glowing milky way galaxy and vibrant green aurora borealis reflecting on a calm water surface, starry cosmic wallpaper, highly detailed, 8k",
    tool: "Midjourney"
  },
  {
    prompt: "A cozy warm street light illuminating a quiet snow-covered winter street at night, soft snowflakes falling gently, cinematic lighting, nostalgic mood, photorealistic",
    tool: "Google Flow"
  },
  
  // 2. 동식물
  {
    prompt: "An adorable fluffy golden retriever puppy running happily across a sunny green grass lawn, tongue out, happy expression, action shot, soft natural lighting, extremely detailed fur",
    tool: "Google Flow / Midjourney"
  },
  {
    prompt: "A vast vibrant field of sunflowers stretching towards the horizon under a bright blue summer sky, glowing golden sunlight, high detail, landscape photography",
    tool: "Midjourney"
  },
  {
    prompt: "A graceful deer standing in a misty sunlit forest, rays of light filtering through the trees, cinematic wildlife photography, award-winning photo, highly detailed",
    tool: "Midjourney"
  },
  {
    prompt: "A close-up aesthetic shot of green monstera leaves with water droplets, minimalist botanical wallpaper, soft natural light, fresh green tones, high quality",
    tool: "Google Flow"
  },

  // 3. 인물 & 일상
  {
    prompt: "A timeless black and white portrait of a woman looking thoughtfully into the camera, dramatic side lighting, high contrast, classic film grain, fine art photography",
    tool: "Midjourney"
  },
  {
    prompt: "A cozy indoor aesthetic cafe scene, a person reading a book next to a warm steaming cup of coffee, soft natural window light, aesthetic lifestyle photography",
    tool: "Google Flow"
  },
  {
    prompt: "A warm cozy living room scene at night, a crackling fireplace glowing with orange light, soft shadows, warm atmosphere, hyper-realistic interior design",
    tool: "Google Flow"
  },

  // 4. 비즈니스 & 테크
  {
    prompt: "A modern aesthetic minimalist office workspace with a laptop, a coffee cup, and green plants next to a large window showing city view, clean lines, productive mood",
    tool: "Google Flow"
  },
  {
    prompt: "A futuristic cybersecurity cyber punk data center, neon blue and violet lights illuminating servers, high-tech holographic interface, advanced AI core, detailed",
    tool: "Midjourney"
  },
  {
    prompt: "A sleek professional corporate dashboard with colorful graphs and financial charts displayed on a modern tablet screen, business presentation style",
    tool: "Google Flow"
  },

  // 5. 예술 & 배경 디자인
  {
    prompt: "An elegant abstract fluid art of colorful liquid acrylic marbling, swirls of gold, royal blue, and pastel pink, smooth waves, modern luxury background",
    tool: "Midjourney"
  },
  {
    prompt: "A clean minimalist 3D rendering of product mockup stage, pastel pink podium stand against a textured stone wall, soft shadows, studio lighting",
    tool: "Google Flow"
  },
  {
    prompt: "A magical whimsical watercolor illustration of a house on a tiny floating island in the sky, colorful clouds, cozy fantasy mood, children book illustration style",
    tool: "Midjourney"
  }
];

async function fillPrompts() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1cI6-XYJKAYtaTSL97X8ryOaast7vIGoGR892dx7S59I";

  console.log("Fetching current sheet data to align rows...");
  
  // D열(프롬프트)과 E열(AI 툴) 범위 업데이트 데이터 준비
  const values = promptsData.map(item => [item.prompt, item.tool]);

  console.log("Writing prompts to Google Sheet...");
  
  // D2:E19 범위에 데이터 기록 (D열이 프롬프트, E열이 AI 툴)
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "시트1!D2:E19",
    valueInputOption: "RAW",
    requestBody: {
      values
    }
  });

  console.log("Successfully written prompts and tool info to Google Sheet!");
}

fillPrompts().catch(err => {
  console.error("Failed to populate prompts:", err);
});
