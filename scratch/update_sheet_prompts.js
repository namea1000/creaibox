const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

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

// 12개 템플릿의 N~S 데이터 정의
const updateData = {
  63: [
    "깨끗한 신재생 에너지(풍력, 태양광)와 탄소 중립 그래프 비주얼을 활용하여, 신뢰할 수 있고 친환경적인 기업 ESG 가치를 전문적으로 전달하는 컨설팅 테마입니다, no text",
    "A consulting theme that professionally conveys reliable and eco-friendly corporate ESG values using clean renewable energy (wind, solar) and carbon-neutral graph visuals, no text",
    "A pristine and professional ESG consulting website hero background, clean wind turbines and solar panels under a clear blue sky, eco-friendly green leaves, HSL #0f766e and #10b981 tones, light mode aesthetic, no text --ar 16:9",
    "A series of clean green energy charts, recycling system icons, and eco-friendly office workspace layouts, matching HSL #0f766e and #ccfbf1 colors, set of 3 images, no text --ar 4:3",
    "A professional consultant smiling warmly in a bright eco-friendly corporate office with green potted plants, modern sustainable corporate interior, HSL #0f766e and #10b981 accents, no text --ar 1:1",
    "A clean and abstract corporate background with soft teal and mint gradient waves and subtle leaf pattern shadows, HSL #fafdfc and #ccfbf1 tones, no text --ar 16:9"
  ],
  64: [
    "세련된 다크 네이비와 골드 옐로우의 하이라이트를 통해, 글로벌 비즈니스 빌딩과 전문적인 투자 제안서, 이사회 테이블 비주얼로 신뢰감을 주는 벤처 캐피탈 테마입니다, no text",
    "A venture capital theme that builds trust with professional investment pitch decks, boardrooms, and global corporate towers utilizing sophisticated dark navy and gold yellow highlights, no text",
    "A high-end corporate boardroom overlooking a modern city skyline at dusk, glass walls, sleek leather chairs, HSL #1e3a8a and #f59e0b color theme, premium corporate landing page background, no text --ar 16:9",
    "Close-ups of global financial market charts, abstract technological startup growth arrows, and smart business analysis graphs, matching HSL #1e3a8a and #dbeafe colors, set of 3 images, no text --ar 4:3",
    "A confident venture capitalist partner in a professional suit standing in a modern glass office, warm corporate lighting, HSL #1e3a8a and #f59e0b accents, no text --ar 1:1",
    "A sleek and minimal abstract business background, soft geometric navy blue lines with subtle amber gold light leaks, clean corporate style, HSL #fafbfc and #dbeafe, no text --ar 16:9"
  ],
  65: [
    "노출 콘크리트의 미니멀한 단면과 오렌지 점토 타일, 기하학적 건축 구조물이 밝은 햇살 속에서 조화를 이루어 현대적인 건축 포트폴리오를 우아하게 표현하는 테마입니다, no text",
    "An architectural portfolio theme that elegantly expresses modern design with monolithic raw concrete, terracotta clay tiles, and geometric structures in bright sunlight, no text",
    "Monolithic raw concrete villa facade with large glass windows reflecting a lush green forest, warm bright sunlight casting dramatic geometric shadows, terracotta tiles, modern architecture, no text --ar 16:9",
    "Minimalist architectural interior corners, raw concrete stairs, exposed brick wall segments, matching HSL #111827 and #ea580c colors, set of 3 images, no text --ar 4:3",
    "An architect sketching drafts on a clean wooden drawing table in a sunny, minimalist studio, blueprints in background, HSL #111827 and #ea580c accents, no text --ar 1:1",
    "Abstract architectural surface texture, rough concrete close-up with geometric sunlight cast and terracotta shadows, HSL #fafaf9 and #f3f4f6 tones, minimal design, no text --ar 16:9"
  ],
  97: [
    "울창한 소나무 숲속에서 노는 아이들, 친환경 나무집, 유기농 텃밭 등의 네이럴 비주얼이 어우러져 자연 친화적 유치원의 건강한 일상을 보여주는 교육 테마입니다, no text",
    "An education theme demonstrating a nature-friendly kindergarten's daily life with kids playing in a pine forest, wooden treehouses, and organic gardens, no text",
    "Children playing happily around a beautiful wooden treehouse in a bright sunny pine forest, organic gardens, natural toys, warm sunlight beams, HSL #16a34a and #fef08a colors, no text --ar 16:9",
    "Handmade wooden forest toys, organic vegetable patches with small sprouts, and children's colorful pine cone crafts, matching HSL #16a34a and #f97316 colors, set of 3 images, no text --ar 4:3",
    "A friendly kindergarten teacher reading a storybook to kids outdoors under a large oak tree, warm smiles, HSL #16a34a and #fef08a accents, no text --ar 1:1",
    "A soft and bright natural background, pastel green and soft yellow gradient with subtle tree leaf overlays, cozy education style, HSL #fafdfa and #fef08a, no text --ar 16:9"
  ],
  103: [
    "마호가니 책장, 만년필과 원고지, 황동 스탠드 조명의 따스한 불빛이 어우러져 아늑하고 고전적인 지적 작업실 감성을 담은 창작용 아카데미 테마입니다, no text",
    "A writing studio academy theme that evokes a cozy, intellectual writing salon with mahogany bookshelves, a vintage fountain pen on thick novel paper, and brass desk lamps, no text",
    "A vintage writing desk with an elegant fountain pen resting on a thick manuscript sheet, a brass desk lamp casting warm light, mahogany bookshelves, cozy library atmosphere, HSL #14532d and #b45309, no text --ar 16:9",
    "Stack of leather-bound antique books, close-up of inkwell bottles with metallic nibs, and a cozy study armchair corner, matching HSL #14532d and #f5f5f4 colors, set of 3 images, no text --ar 4:3",
    "A writer drinking hot tea next to a typewriter in a quiet classic study, bookshelves background, HSL #14532d and #b45309 accents, no text --ar 1:1",
    "Textured blank parchment paper background with soft shadows of library window frames and bookshelves, cozy warm tone, HSL #fafaf6 and #f5f5f4, no text --ar 16:9"
  ],
  109: [
    "반짝이는 컴퓨터 코드 화면과 기판 회로, 레고 로봇 교구 등 미래지향적인 STEM 로봇 교육 현장의 에너제틱한 감성을 보여주는 다크 모드 테마입니다, no text",
    "A dark-themed education template showcasing futuristic STEM and robotics labs for kids, coding screens, electronic circuits, and colorful LEGO robotics, no text",
    "A futuristic STEM robotics classroom with kids building smart robot cars, glowing computer screens with block coding, electronic circuit boards, neon violet and cyan neon lights, no text --ar 16:9",
    "Close-up of a small microchip circuit, a colorful LEGO robotic arm, and lines of glowing programming code, matching HSL #0891b2 and #8b5cf6 colors, set of 3 images, no text --ar 4:3",
    "An instructor explaining coding on a tablet to a kid in a modern digital tech lab, neon tech accents, HSL #0891b2 and #cffafe accents, no text --ar 1:1",
    "Abstract tech background with glowing code lines, cyan circuit board patterns, and neon purple light streaks on a dark obsidian background, HSL #090d16 and #0891b2, no text --ar 16:9"
  ],
  211: [
    "칠흑 같은 어둠 속에서 마젠타 핑크와 네온 시안 광원이 흐르는 액체 금속 스플래시와 3D 구체 비주얼로 미래적인 아방가르드 3D 아티스트의 정체성을 어필하는 테마입니다, no text",
    "An avant-garde 3D artist portfolio theme utilizing abstract 3D spheres with glowing magenta pink and neon cyan light reflections, liquid metallic gold splashes, no text",
    "Abstract 3D CGI spheres with glowing magenta pink and neon cyan light reflections on an ultra-modern obsidian dark background, liquid metallic gold splashes, futuristic cyber art, no text --ar 16:9",
    "Closeup of neon pink fluid dynamics render, abstract cyan wireframe geometric models, and glossy chrome metallic splashes, matching HSL #ec4899 and #06b6d4 colors, set of 3 images, no text --ar 4:3",
    "A creative digital artist working in front of a giant glowing neon monitor display, creative workspace setup, HSL #ec4899 and #a78bfa accents, no text --ar 1:1",
    "Minimalist dark cyber background, glowing magenta and cyan neon wave lines with high-contrast obsidian texture, abstract 3D art vibe, HSL #050508 and #06b6d4, no text --ar 16:9"
  ],
  213: [
    "모놀리식 콘크리트 빌딩과 통유리창, 기하학적 그림자가 아방가르드하게 조화를 이루는 아키텍처 스튜디오 및 공간 기획자를 위한 프리미엄 아카이브 테마입니다, no text",
    "A premium portfolio theme for architecture studios and space designers, showcasing monolithic raw concrete villas, terracotta tiles, and geometric sunlight shadows, no text",
    "A sleek minimalist modern villa architecture, large glass panels reflecting green forest trees, concrete patio under bright sunlight with geometric shadows, HSL #27272a and #d97706, no text --ar 16:9",
    "Minimalist raw concrete column designs, sleek steel window frame joints, and warm oak wooden floor corners, matching HSL #27272a and #f4f4f5 colors, set of 3 images, no text --ar 4:3",
    "A creative architect partner standing in a sunlit architectural gallery, wooden tables, minimal design models, HSL #27272a and #d97706 accents, no text --ar 1:1",
    "Clean architectural texture close-up, raw plaster concrete surface with warm amber sunlight beam and diagonal geometric shadow lines, HSL #fafaf9 and #f4f4f5, no text --ar 16:9"
  ],
  221: [
    "시선을 사로잡는 벨벳 레드 액센트와 하이 콘트라스트의 모델 촬영 스튜디오 비주얼로 미니멀하고 시크한 패션 런웨이 컬렉션을 조명하는 룩북 테마입니다, no text",
    "A chic fashion runway lookbook portfolio theme with high-contrast studio shadows, model shots wearing bold velvet red and black outfits, rose red accent, no text",
    "High-fashion runway photography background, models wearing bold velvet dark outfits with vivid red rose patterns, minimal studio lighting, high contrast dramatic shadows, HSL #111827 and #b91c1c, no text --ar 16:9",
    "Close-up of rich red velvet fabric texture, a minimalist gold-framed apparel hanger display, and sleek leather boots on a concrete studio floor, matching HSL #111827 and #fae8ff, set of 3 images, no text --ar 4:3",
    "A stylish fashion designer adjusting an outfit on a mannequin in a bright loft creative workshop, HSL #111827 and #b91c1c accents, no text --ar 1:1",
    "Clean minimalist fashion studio backdrop, soft rose pink and gray studio walls with deep high-contrast dramatic shadow lines, chic layout, HSL #fafaf9 and #fae8ff, no text --ar 16:9"
  ],
  254: [
    "따뜻한 화덕의 불빛, 도마 위에 얹어진 노릇노릇한 사워도우 빵과 바구니의 나무 텍스처로 파리의 빈티지 빵집 감성을 생생히 불어넣은 베이커리 테마입니다, no text",
    "A rustic bakery theme that brings to life a vintage Parisian bakery with warm stone ovens, sourdough loaves on wooden boards, and earthy wood textures, no text",
    "A rustic French bakery interior, stone bread oven with glowing amber light inside, wooden counter with freshly baked sourdough bread loaves, dusting of flour, warm cozy atmosphere, HSL #7c2d12 and #ea580c, no text --ar 16:9",
    "Close-up of golden crispy sourdough crust pattern, raw grain ears in a wicker basket, and traditional wooden baker peels, matching HSL #7c2d12 and #ffedd5 colors, set of 3 images, no text --ar 4:3",
    "A happy artisan baker holding a fresh round bread loaf in front of a rustic wooden counter, flour on hands, HSL #7c2d12 and #ea580c accents, no text --ar 1:1",
    "A warm natural background, rustic flour-dusted wood texture with soft warm lighting and shadow of wheat ears, cozy bakery style, HSL #faf8f5 and #ffedd5, no text --ar 16:9"
  ],
  258: [
    "책장 비밀문, 촛불 아래에서 크리스탈 얼음을 깎는 바텐더의 손길, 에스프레소 가죽 카운터 위의 아로마틱한 위스키 한 잔을 매칭해 고혹적인 바 감성을 묘사하는 테마입니다, no text",
    "A mysterious speakeasy bar theme depicting a secret bookshelf door entrance, dim warm candle light, hand-carving crystal ice balls, and amber whiskey glasses, no text",
    "A mysterious speakeasy bar interior, a secret bookshelf door slightly open, dim warm candle light, amber whiskey glasses on dark leather cushion bar counters, HSL #0f172a and #d97706, no text --ar 16:9",
    "Bartenders hands carving a crystal clear round ice ball, a smoky dark cocktail glass with orange peel garnish, and premium whiskey bottles lining a wooden shelf, matching HSL #0f172a and #fef3c7, set of 3 images, no text --ar 4:3",
    "A professional mixologist pouring a cocktail shaker in a high-end luxury dark lounge bar, moody warm glow, HSL #0f172a and #d97706 accents, no text --ar 1:1",
    "High-contrast luxury dark bar background, abstract velvet curtain texture with warm amber light leaks and shadows of crystal glassware, HSL #070a13 and #0f172a, no text --ar 16:9"
  ],
  273: [
    "뜨겁게 달궈진 철판 위의 한우와 랍스터, 셰프의 화려한 불꽃 쇼(플람베)와 검은 천연석 카운터로 고급스럽고 역동적인 미식 경험을 강조하는 철판 오마카세 테마입니다, no text",
    "A dynamic teppanyaki dining theme highlighting sizzling Hanwoo beef and lobster on hot iron griddles, dramatic chef fire flambé shows, and elegant dark stone counter bars, no text",
    "A high-end luxury Teppanyaki restaurant, chef performing a fiery flambé show with huge dramatic flames on a hot iron griddle plate, dark stone counter bar seating, HSL #1e1b4b and #f43f5e, no text --ar 16:9",
    "A sizzling marble wagyu beef slice on the hot plate, fresh red lobster tails grilling on iron surface, and premium teppanyaki sauce dishes, matching HSL #1e1b4b and #fee2e2, set of 3 images, no text --ar 4:3",
    "A master chef holding long metal spatulas smiling in front of a smoking hot iron griddle, dynamic fire cooking, HSL #1e1b4b and #f43f5e accents, no text --ar 1:1",
    "Sleek luxury dark stone texture background with abstract red embers and soft gray smoke overlays, high-end dining vibe, HSL #0f0f15 and #1e1b4b, no text --ar 16:9"
  ]
};

async function main() {
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  const listResponse = await drive.files.list({
    q: "name contains 'CreAibox_Template_Image_Prompts' and mimeType = 'application/vnd.google-apps.spreadsheet'",
    fields: "files(id, name)",
  });

  const files = listResponse.data.files;
  if (!files || files.length === 0) {
    console.log("No sheet found by that name.");
    return;
  }

  const spreadsheetId = files[0].id;
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetName = meta.data.sheets[0].properties.title;

  console.log(`Target Spreadsheet ID: ${spreadsheetId}`);
  console.log(`Sheet Name: ${sheetName}`);

  for (const [rowNum, values] of Object.entries(updateData)) {
    const range = `${sheetName}!N${rowNum}:S${rowNum}`;
    console.log(`Updating Row ${rowNum} (${range})...`);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [values]
      }
    });
  }

  console.log("All 12 empty rows have been successfully updated!");
}

main().catch(err => console.error(err));
