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

// 18개 원본 카테고리 정의 (create_category_sheet.js 발췌)
const originalCategories = [
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "바다 & 해변 (Sea & Beach)", tertiary: "에메랄드빛 해변, 파도치는 바위 해안, 일몰 비치, 백사장 코코넛 야자수" },
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "산 & 계곡 (Mountains & Valleys)", tertiary: "눈 덮인 고산, 피오르드 협곡, 가을 단풍 산길, 안개 낀 침엽수림" },
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "강 & 호수 (Rivers & Lakes)", tertiary: "거울 같은 호수 잔물결, 울창한 강변 숲, 폭포수가 떨어지는 계곡" },
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "하늘 & 우주 (Sky & Space)", tertiary: "푸른 하늘 and 뭉게구름, 노을빛 황혼, 은하수가 수놓아진 밤하늘, 신비로운 오로라" },
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "날씨 & 계절 (Weather & Seasons)", tertiary: "비 내리는 도시 창가, 눈 내리는 겨울 가로등, 벚꽃이 날리는 봄 길, 낙엽 쌓인 벤치" },

  { primary: "동식물 (Flora & Fauna)", secondary: "반려동물 (Pets)", tertiary: "해맑게 웃는 강아지, 낮잠 자는 고양이, 잔디밭을 뛰어노는 골든 리트리버, 털 뭉치 아기 고양이" },
  { primary: "동식물 (Flora & Fauna)", secondary: "꽃 & 정원 (Flowers & Gardens)", tertiary: "활짝 핀 붉은 장미, 해바라기 밭, 들판의 라벤더, 안개꽃 다발" },
  { primary: "동식물 (Flora & Fauna)", secondary: "야생 동물 (Wildlife)", tertiary: "숲속의 사슴, 하늘을 나는 독수리, 나뭇가지 위 아기 새, 귀여운 다람쥐" },
  { primary: "동식물 (Flora & Fauna)", secondary: "식물 & 숲 (Plants & Forests)", tertiary: "몬스테라 초록 잎사귀, 선인장 정원, 피톤치드 가득한 대나무 숲" },

  { primary: "인물 & 일상 (People & Lifestyle)", secondary: "인물 프로필 (Portraits)", tertiary: "자연스러운 미소의 남성, 카메라를 응시하는 여성, 빈티지 흑백 인물 프로필" },
  { primary: "인물 & 일상 (People & Lifestyle)", secondary: "라이프스타일 (Lifestyle)", tertiary: "카페에서 커피를 마시는 모습, 책을 읽는 일상, 조깅하는 사람, 가족과의 캠핑" },
  { primary: "인물 & 일상 (People & Lifestyle)", secondary: "감성 & 무드 (Moods)", tertiary: "창밖을 바라보는 쓸쓸함, 활기차게 웃는 웃음소리, 아늑한 벽난로 앞 온기" },

  { primary: "비즈니스 & 테크 (Business & Tech)", secondary: "오피스 라이프 (Office)", tertiary: "회의실 브레인스토밍, 노트북 작업대, 모던 오피스 인테리어, 정장을 입을 팀원들" },
  { primary: "비즈니스 & 테크 (Business & Tech)", secondary: "IT & 테크놀로지 (Technology)", tertiary: "사이버펑크 데이터 센터, 인공지능 로봇 손, 코딩 중인 화면, 가상현실 VR 헤드셋" },
  { primary: "비즈니스 & 테크 (Business & Tech)", secondary: "기획 & 금융 (Planning & Finance)", tertiary: "주식 차트 화면, 포스트잇이 붙은 화이트보드, 깔끔하게 정리된 그래프 리포트" },

  { primary: "예술 & 배경 디자인 (Art & Backgrounds)", secondary: "추상화 & 그래픽 (Abstract Art)", tertiary: "다채로운 액체 아크릴 마블링, 네온 기하학 패턴, 미니멀리즘 3D 오브젝트" },
  { primary: "예술 & 배경 디자인 (Art & Backgrounds)", secondary: "템플릿 배경 (Background Templates)", tertiary: "제품 촬영용 파스텔톤 스탠드, 질감이 살아있는 질석 벽면, 대리석 텍스처 백그라운드" },
  { primary: "예술 & 배경 디자인 (Art & Backgrounds)", secondary: "일러스트 & 아트워크 (Illustrations)", tertiary: "동화 같은 수채화 일러스트, 레트로 픽셀 아트, 플랫 디자인 벡터 아이콘" }
];

// 18개 카테고리별 10개 스타일 고품질 완성 프롬프트셋 (expand_prompts_styles.js 발췌)
const originalPrompts = [
  {
    photo: "A breathtaking cinematic view of an emerald green beach, gentle crystal clear waves lapping on white sand, soft golden sunlight, coconut palm trees leaning over the shore, photorealistic, 8k resolution",
    illust: "Whimsical watercolor illustration of a beautiful tropical beach, pastel color palette, soft brush strokes, stylized coconut trees, magical summer breeze atmosphere",
    vector: "Minimalist flat vector icon of a tropical beach with a single palm tree and sun, clean bold outlines, solid primary colors, flat design style",
    render3d: "Cute isometric 3D render of a tropical beach, tiny palm tree, sand castle, blender 3d, toy art, pastel colors, cozy lighting, soft shadows",
    anime: "Vibrant anime summer beach scenery, bright blue sky, fluffy white clouds, crystal clear water, sparkling waves, Makoto Shinkai style, cinematic layout",
    pixel: "16-bit retro pixel art of a beautiful tropical beach, calm ocean waves lapping, palm tree swaying, pixel game background",
    watercolor: "Soft artistic watercolor of a tranquil beach, pastel green water merging with white sand, fluid color bleeding, aesthetic wash painting",
    lineart: "Minimalist line art of a tropical beach scene, single wavy line for ocean, outline of a palm tree, simple black and white design",
    pattern: "Seamless pattern of tiny palm trees, seashells, and waves, beach holiday theme, cute vector background, flat repeat tile",
    popart: "Vintage pop art poster of a tropical beach, bold block colors, retro sunscreen vibes, 70s typography layout, halftone sky"
  },
  {
    photo: "Majestic snow-capped mountain peaks towering over a deep fjord canyon, misty evergreen coniferous forests below, drone shot, dramatic mood, high detail, photorealistic, 8k",
    illust: "Beautiful oil painting of majestic snowy mountains and deep valley, vivid colors, rich impasto texture, impressionistic landscape style",
    vector: "Sleek geometric vector illustration of snow mountain peaks, minimal overlapping shapes, sharp clean lines, blue and white gradient colors",
    render3d: "Stylized 3D render of snowy mountain peaks and a deep river canyon, clean polygon models, soft ambient lighting, game level design, blender render",
    anime: "Epic anime fantasy mountain landscape, snow-capped peaks rising above misty clouds, bright blue sky, majestic canyon, Studio Ghibli style",
    pixel: "Retro 16-bit pixel art of towering snow mountains, deep canyon, pixel art parallax scrolling background, blue sky with pixel clouds",
    watercolor: "Elegant watercolor painting of snow-covered mountains, deep green pine trees, soft misty atmosphere, flowing colors, zen landscape art",
    lineart: "Minimalist geometric line art of mountain peaks, simple clean lines, outline design, modern tattoo style, black ink on white",
    pattern: "Minimalist seamless pattern of tiny geometric mountains and pine trees, scandinavian wrapping paper design, repeating outline vector",
    popart: "Retro travel poster of a mountain canyon, bold screenprint texture, 60s vintage color palette, distressed paper texture, pop art styling"
  },
  {
    photo: "A serene mirror-like lake reflecting lush riverbank forests, soft early morning mist rising from the water, high resolution landscape photography, national geographic style",
    illust: "A dreamy fantasy digital painting of a peaceful forest lake, glowing fireflies, soft twilight hues of purple and blue, ethereal reflection artwork",
    vector: "Flat design vector banner of a calm lake and forest silhouette, minimalist landscape, natural green and teal tones",
    render3d: "Cozy 3D render of a small wooden cabin next to a glass-like lake, dense pine forest, warm window glow, low-poly art style, cute blender mockup",
    anime: "Dreamy anime lake reflection scene, tranquil forest surrounding, soft sunrise light glowing, mist over water, beautiful aesthetic anime landscape",
    pixel: "Pixel art scenery of a calm lake reflecting dark green pine trees, pixelated sunrise, serene nature vibe, indie game background",
    watercolor: "Aesthetic watercolor wash of a quiet forest lake, reflection of green trees, soft blending, misty emerald and blue tones",
    lineart: "Simple clean line art of a forest lake, outline of pine trees and water ripples, minimalist organic shapes",
    pattern: "Seamless pattern of minimalist pine trees and tiny lake ripples, natural green tones, modern scandinavian fabric print",
    popart: "Vintage national park poster of a forest lake, bold color blocks, retro screenprint, textured paper background, pop art style"
  },
  {
    photo: "A spectacular night sky filled with a glowing milky way galaxy and vibrant green aurora borealis reflecting on a calm water surface, starry cosmic wallpaper, highly detailed, 8k",
    illust: "Artistic ink wash painting of aurora borealis over the lake, glowing stars, fluid color gradients, modern abstract watercolor illustration",
    vector: "Simple cosmic vector icon of starry sky and aurora, clean shapes, neon green and dark purple palette, flat style icon",
    render3d: "Fantasy 3D render of a tiny planet under the aurora borealis and starry galaxy, stylized low poly art, glowing neon lights, whimsical blender scene",
    anime: "Stunning anime night sky full of stars, glowing green and purple aurora borealis, starry sky wallpaper, Your Name style, majestic cosmic landscape",
    pixel: "Retro 8-bit space pixel art of starry night, colorful green aurora glowing over distant mountains, pixel night sky backdrop",
    watercolor: "Deep colorful watercolor painting of a starry night sky, emerald and purple aurora wash, gold ink paint splashes for stars, cosmic artwork",
    lineart: "Minimalist line art of a crescent moon, stars, and abstract aurora waves, clean lines, cosmic occult style outline",
    pattern: "Seamless pattern of tiny stars, crescent moons, and constellations, midnight blue background, vector space print",
    popart: "Retro futuristic pop art poster of an aurora night sky, bold neon colors, halftone stars, sci-fi magazine cover aesthetic"
  },
  {
    photo: "A cozy warm street light illuminating a quiet snow-covered winter street at night, soft snowflakes falling gently, cinematic lighting, nostalgic mood, photorealistic",
    illust: "Cute nostalgic chalk pastel drawing of a cozy snowy winter street, glowing warm yellow gas lamp, warm and soft holiday atmosphere",
    vector: "Minimalist vector graphic of a street lamp in the snow, clean flat design, simple winter theme illustration, solid shapes",
    render3d: "Cute cozy 3D render of a snowy winter street scene, a glowing vintage street lamp, warm yellow light casting on snow, clay style, blender 3d",
    anime: "Aesthetic anime winter night street, soft snowflakes falling under a glowing gas lamp, cozy warm light reflection on snow, nostalgic romantic atmosphere",
    pixel: "Cozy 16-bit pixel art of a snowy town street at night, flickering street light, snow piled on roofs, warm window glow, retro game style",
    watercolor: "Dreamy watercolor illustration of a snowy town street, a soft glowing lantern, wet-on-wet watercolor blending, soft blues and warm golds",
    lineart: "Minimalist line art of a vintage street lamp, simple snow outline, clean black strokes on white background",
    pattern: "Seamless pattern of tiny snowflakes and retro street lamps, winter holiday pattern, vector wrapping paper design",
    popart: "Vintage pop art holiday poster, cozy winter street, bold graphic shapes, retro halftone snow pattern, 70s greeting card aesthetic"
  },
  
  {
    photo: "An adorable fluffy golden retriever puppy running happily across a sunny green grass lawn, tongue out, happy expression, action shot, soft natural lighting, extremely detailed fur",
    illust: "Sweet children book style watercolor illustration of a cute golden retriever puppy running in the garden, warm friendly mood, soft colors",
    vector: "Cute flat vector icon of a golden retriever puppy head, minimalist logo style, solid beige colors, clean rounded outlines",
    render3d: "Adorable 3D clay model of a golden retriever puppy, running, happy expression, stylized toy art, glossy finish, cute blender rendering",
    anime: "Cute anime illustration of a happy golden retriever puppy bounding through a sunny meadow, sparkling eyes, wind in fur, cheerful mood",
    pixel: "Cute pixel art of a golden retriever puppy running, animated-style frames, green grass background, indie game animal sprite",
    watercolor: "Loose expressive watercolor portrait of a golden retriever puppy, colorful paint splashes, soft blending, warm golden tones",
    lineart: "Minimalist continuous line art of a running puppy, simple outline of a golden retriever, clean modern logo aesthetic",
    pattern: "Cute seamless pattern of tiny puppy paws and golden retriever heads, baby background, vector flat repeat tile",
    popart: "Colorful pop art poster of a golden retriever puppy, Andy Warhol style, four-quadrant contrasting bright colors, halftone patterns"
  },
  {
    photo: "A vast vibrant field of sunflowers stretching towards the horizon under a bright blue summer sky, glowing golden sunlight, high detail, landscape photography",
    illust: "Gorgeous gouache painting of a sunny sunflower field, textured canvas, bright warm yellow tones, expressive folk art style",
    vector: "Simple graphic vector pattern of a sunflower, isolated flat design icon, bright yellow and brown colors",
    render3d: "Cheerful 3D render of a sunflower patch, stylized cartoon flowers under a bright sun, low-poly design, vibrant toy style",
    anime: "Lush anime sunflower field under a vast clear blue sky, bright sun rays, fluffy white clouds, aesthetic summer scenery",
    pixel: "Vibrant pixel art of a field of sunflowers waving, blue pixel sky, bright summer sun, 16-bit retro scene",
    watercolor: "Warm watercolor wash of sunflowers blooming, vibrant yellow petals, soft green leaves, artistic paint splatters",
    lineart: "Fine line art drawing of a single sunflower, detailed petals, clean outline, modern botanical sketch",
    pattern: "Cheerful seamless pattern of tiny yellow sunflowers, summer vibe pattern, vector surface design",
    popart: "Bold retro pop art poster of sunflowers, high contrast color palette, screenprint texture, 60s vintage vibe"
  },
  {
    photo: "A graceful deer standing in a misty sunlit forest, rays of light filtering through the trees, cinematic wildlife photography, award-winning photo, highly detailed",
    illust: "An elegant art nouveau illustration of a deer in a gold-accented forest, decorative swirls, mystical folklore aesthetic",
    vector: "Geometric low poly vector illustration of a deer silhouette, modern abstract origami style, clean sharp triangles",
    render3d: "Mystical 3D render of a deer silhouette in a low-poly forest, glowing light rays, ambient occlusion, magical toy art",
    anime: "Ethereal anime forest scene, a majestic deer standing in the morning mist, rays of sun filtering through ancient trees, Ghibli vibes",
    pixel: "Serene 16-bit pixel art of a deer standing quietly in a misty green forest, sunbeams breaking through pixel canopy",
    watercolor: "Dreamy watercolor painting of a deer in a foggy forest, soft green and charcoal color washes, mysterious nature illustration",
    lineart: "Minimalist geometric line art of a deer stag, clean lines, celestial elements, modern tattoo art outline",
    pattern: "Minimalist seamless pattern of tiny forest deer and pine trees, Scandinavian design, neutral grey background",
    popart: "Mid-century modern style retro poster of a deer in the woods, minimalist graphic shapes, organic colors, textured print"
  },
  {
    photo: "A close-up aesthetic shot of green monstera leaves with water droplets, minimalist botanical wallpaper, soft natural light, fresh green tones, high quality",
    illust: "Beautiful hand-drawn botanical sketch of monstera leaves, fine ink line art, soft green watercolor wash, fresh plant artwork",
    vector: "Minimalist line art vector icon of a monstera leaf, clean green outline, flat solid background, modern aesthetic design",
    render3d: "Stylized 3D render of monstera plant leaves with shiny glossy water drops, clay style, modern interior plant design, clean render",
    anime: "Fresh anime botanical background, close up of vibrant green monstera leaves covered in dew, morning sunlight shining through",
    pixel: "Pixel art monstera leaf close up, green color gradients, tiny blue pixels for water drops, retro botanical graphic",
    watercolor: "Lush tropical watercolor painting of monstera leaves, deep emerald and teal hues, soft wet blending, artistic botany",
    lineart: "Elegant single-line art of a monstera leaf, clean curves, minimalist outline, modern aesthetic print",
    pattern: "Seamless tropical pattern of monstera and palm leaves, fresh green color scheme, botanical vector print",
    popart: "Vintage pop art print of a tropical monstera plant, bold outline, offset color fill, halftone dots backdrop"
  },

  {
    photo: "A timeless black and white portrait of a woman looking thoughtfully into the camera, dramatic side lighting, high contrast, classic film grain, fine art photography",
    illust: "Beautiful colorful pop art portrait of a woman, expressive messy hair, vibrant watercolors, modern digital illustration style",
    vector: "Minimalist flat vector avatar of a woman, clean outline, pastel color blocking, modern avatar icon design",
    render3d: "High quality 3D portrait of a stylized woman, dramatic key lighting, realistic skin textures, modern digital sculpture, blender render",
    anime: "Gorgeous anime girl portrait, dramatic sunset light highlighting her side profile, highly detailed eyes, emotional cinematic shot",
    pixel: "16-bit pixel art portrait of a woman, side profile with shadow gradients, retro cyberpunk character avatar",
    watercolor: "Artistic watercolor portrait of a woman, soft color bleeding, fluid paint splashes, elegant side lighting profile",
    lineart: "Minimalist abstract outline of a female face, continuous line art, elegant beauty concept, black ink on white",
    pattern: "Abstract seamless pattern of minimalist female face line art and simple organic shapes, earth tones, modern wallpaper",
    popart: "Retro pop art portrait of a woman, bold comic book style dot patterns, speech bubble, bright solid colors"
  },
  {
    photo: "A cozy indoor aesthetic cafe scene, a person reading a book next to a warm steaming cup of coffee, soft natural window light, aesthetic lifestyle photography",
    illust: "Warm colored digital sketch of a person reading in a cafe, hand-drawn texture, cozy lo-fi coffee shop aesthetic",
    vector: "Flat design vector icon of a coffee mug and an open book, clean lines, minimalist cafe theme graphic",
    render3d: "Cute isometric 3D cafe scene, a steam-rising coffee cup on a wooden table next to an open book, soft lighting, cozy toy art",
    anime: "Cozy anime cafe interior, soft window sunlight, steaming mug of coffee, open book on table, warm lo-fi aesthetic backdrop",
    pixel: "Charming 16-bit pixel art of a coffee shop desk, steaming mug, open book, rain tapping on the window outside, cozy pixel loop",
    watercolor: "Warm watercolor illustration of coffee time, a mug with steam, pages of a book, soft sepia and coffee stains wash",
    lineart: "Minimalist line art of a coffee cup and open book, clean outline design, simple outline icon",
    pattern: "Cute seamless pattern of tiny coffee mugs, books, and croissants, cafe theme wallpaper, vector tile",
    popart: "Vintage pop art poster advertising a cafe, bold retro graphics, coffee cup illustration, halftone texture background"
  },
  {
    photo: "A warm cozy living room scene at night, a crackling fireplace glowing with orange light, soft shadows, warm atmosphere, hyper-realistic interior design",
    illust: "Cozy storybook illustration of a fireplace corner, warm orange glow, textures of wool blanket and wooden floor, comforting illustration",
    vector: "Simple vector icon of a fireplace with burning logs, clean flat design, orange flame shapes, solid background",
    render3d: "Cozy 3D render of a modern living room, a glowing brick fireplace, comfy armchair, warm ambient shadows, claymation style",
    anime: "Cozy anime living room at night, embers glowing in the fireplace, soft orange light illuminating the room, holiday warmth atmosphere",
    pixel: "Warm pixel art scene of a fireplace hearth crackling, comfortable rug in front, pixel flames dancing, cozy cabin interior",
    watercolor: "Loose artistic watercolor of a cozy living room corner, glowing fireplace casting warm red and yellow washes, soft illustration",
    lineart: "Simple outline line art of a fireplace with burning logs, clean minimalist home interior design sketch",
    pattern: "Warm winter seamless pattern of tiny fireplaces, stockings, and flame icons, cozy holiday vector wrapper",
    popart: "Mid-century modern retro poster of a fireplace, minimalist geometric shapes, cozy warm colors, vintage pop art texture"
  },

  {
    photo: "A modern aesthetic minimalist office workspace with a laptop, a coffee cup, and green plants next to a large window showing city view, clean lines, productive mood",
    illust: "Cozy isometric 3D digital illustration of a modern home office desk setup, warm plant accents, stylized tech elements",
    vector: "Flat design vector illustration of a laptop on a desk, clean minimalist workspace workspace, solid office icons",
    render3d: "Sleek isometric 3D render of a modern desk workspace, tiny laptop, potted monstera plant, desk organizer, clean clay style",
    anime: "Aesthetic anime workspace, clean desk, glowing laptop screen, small desk plants, soft afternoon sun rays through blinds",
    pixel: "Pixel art office desk setup, laptop screen glowing, green potted plants, modern workspace pixel scene",
    watercolor: "Soft watercolor sketch of a minimalist desk, laptop, leafy green plant, artistic paint drops, clean layout",
    lineart: "Minimalist line art of a desk setup, outlines of a laptop, coffee mug, and a plant pot, modern office graphic",
    pattern: "Minimalist seamless pattern of office icons, laptops, glasses, and tiny plants, work-from-home theme vector",
    popart: "Retro business poster style, minimalist vector laptop and desk plant, bold blocks of corporate blue and orange, screenprint"
  },
  {
    photo: "A futuristic cybersecurity cyber punk data center, neon blue and violet lights illuminating servers, high-tech holographic interface, advanced AI core, detailed",
    illust: "Cool synthwave style illustration of futuristic server racks, neon wireframe graphics, sci-fi computer hardware digital art",
    vector: "Cybersecurity shield and server vector icon, glowing neon line art, clean computer technology concept graphic",
    render3d: "Futuristic 3D render of server racks in a cybersecurity facility, glowing holographic shields, neon blue cables, blender render",
    anime: "Cool cyberpunk hacker den scene, high-tech server racks glowing with neon blue and pink, digital screens, anime sci-fi backdrop",
    pixel: "16-bit retro cyberpunk server room pixel art, blinking server LEDs, dark ambient green and neon purple lights",
    watercolor: "Abstract cyber watercolor, servers and networking wires fading into neon blue and purple color washes, digital concept art",
    lineart: "Modern technology line art of a server rack with security shield, clean tech outlines, minimalist blue lines",
    pattern: "Tech seamless pattern of computer microchips, server icons, and digital locks, neon green on dark background",
    popart: "Retro sci-fi poster, massive glowing supercomputer, halftone grid pattern, synthwave color palette, pop art tech illustration"
  },
  {
    photo: "A sleek professional corporate dashboard with colorful graphs and financial charts displayed on a modern tablet screen, business presentation style",
    illust: "Creative isometric business analysis illustration, tiny characters drawing charts, colorful stats graphic",
    vector: "Infographic bar chart and tablet vector icon, flat design, clean solid shapes, professional finance concept",
    render3d: "Glossy 3D render of a tablet showing bar charts and pie graphs popping out, vibrant business metrics, blender render",
    anime: "Anime style business dashboard illustration, colorful interactive charts on a holographic tablet screen, clean tech aesthetic",
    pixel: "8-bit pixel art of business analytics screen, green bar graphs, red line chart, retro data analysis graphic",
    watercolor: "Creative watercolor style business report, finance charts and graphs blending into soft blue and green watercolor washes",
    lineart: "Minimalist outline of a tablet displaying a line graph, clean business chart line art icon",
    pattern: "Seamless pattern of tiny finance charts, arrows, and target icons, business concept vector surface design",
    popart: "Pop art business poster, hands holding a tablet showing colorful pie charts, bold halftone dots, retro comic book style"
  },

  {
    photo: "An elegant abstract fluid art of colorful liquid acrylic marbling, swirls of gold, royal blue, and pastel pink, smooth waves, modern luxury background",
    illust: "Abstract expressive alcohol ink painting, metallic gold veins, fluid pastel color washes, artistic canvas background",
    vector: "Abstract geometric pattern vector backdrop, overlapping wavy gradient shapes, trendy fluid graphic design",
    render3d: "Glossy 3D liquid render of swirling acrylic fluid art, waves of metallic gold and pink glass, octane render, luxury abstract",
    anime: "Aesthetic fluid backdrop, swirling marble patterns in soft anime pastel colors, sparkling dreamscape, modern fantasy art",
    pixel: "Retro pixel art fluid wave pattern, colorful neon pink and cyan color dithered gradients, dither marbling effect",
    watercolor: "Vibrant abstract watercolor marbling, fluid paint swirls of indigo, gold, and magenta, wet-on-wet paint bleeding texture",
    lineart: "Minimalist topological line art pattern, clean flowing wave outlines on white background, abstract topography design",
    pattern: "Trendy seamless fluid marble pattern, pastel color washes with metallic veins, elegant wallpaper tile",
    popart: "Bold pop art poster featuring psychedelic liquid swirls, vibrant 70s colors, high-contrast graphic shapes"
  },
  {
    photo: "A clean minimalist 3D rendering of product mockup stage, pastel pink podium stand against a textured stone wall, soft shadows, studio lighting",
    illust: "Minimalist pastel drawing of 3D geometric shapes, soft grain texture, warm aesthetic gallery space illustration",
    vector: "Simple vector illustration of a podium stand, flat isometric shapes, clean pastel colors, product mockup template",
    render3d: "Premium 3D render of a clean geometric podium stage, pastel pink background, arch accents, studio lighting, smooth clay",
    anime: "Dreamy anime-inspired product stage, pastel pink arches, soft morning light casting long shadows, minimalist aesthetic",
    pixel: "Minimal pixel art podium stage, soft pink background, clean retro grid platform, isometric mockup space",
    watercolor: "Soft watercolor sketch of a geometric display stand, pastel pink and beige washes, clean elegant product presentation backdrop",
    lineart: "Minimalist architectural line art of a podium stage, simple arches and platform outlines, clean line design",
    pattern: "Seamless pattern of minimalist arches and geometric shapes, soft pastel pink tones, scandinavian wallpaper",
    popart: "Mid-century modern style product mockup ad, minimalist pink podium, bold shadows, retro graphic styling, textured paper"
  },
  {
    photo: "A magical whimsical watercolor illustration of a house on a tiny floating island in the sky, colorful clouds, cozy fantasy mood, children book illustration style",
    illust: "Beautiful dreamy digital painting of a fantasy floating island castle, magical clouds, rich textures, adventure book art",
    vector: "Charming flat design vector icon of a floating sky island, simple cartoon cloud shapes, solid pastel colors",
    render3d: "Whimsical 3D render of a cute cozy house on a miniature floating island, tiny trees, clouds, stylized toy art, blender 3d",
    anime: "Magical anime floating island with a small cottage, green meadow, pink cherry blossom tree, clear blue sky, Ghibli style",
    pixel: "Retro 16-bit pixel art of a cozy cottage on a floating sky island, animated pixel clouds passing, indie game layout",
    watercolor: "Dreamy watercolor illustration of a sky island, floating cottage among fluffy pastel clouds, wet-on-wet watercolor washes",
    lineart: "Charming line art of a floating house in the clouds, clean outline drawing, simple cartoon design",
    pattern: "Seamless pattern of tiny floating islands, castles, and clouds, cute kids room wallpaper design, vector repeat",
    popart: "Retro fantasy travel poster of a floating island city, bold block colors, distressed vintage paper texture, pop art graphic"
  }
];

async function restoreSampleSheet() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1cI6-XYJKAYtaTSL97X8ryOaast7vIGoGR892dx7S59I";

  console.log("Restoring original 18 prompts to 'Sample' sheet...");

  // 1. 헤더 (10종 스타일 명세)
  const headers = [
    [
      "1차 대분류 카테고리 (Primary)", 
      "2차 중분류 카테고리 (Secondary)", 
      "3차 소분류 추천 키워드 (Tertiary Keywords)", 
      "이미지 프롬프트 (Image Prompts)_Photorealistic", 
      "이미지 프롬프트 (Image Prompts)_Illustration", 
      "이미지 프롬프트 (Image Prompts)_Vector",
      "이미지 프롬프트 (Image Prompts)_3D Render",
      "이미지 프롬프트 (Image Prompts)_Anime",
      "이미지 프롬프트 (Image Prompts)_Pixel Art",
      "이미지 프롬프트 (Image Prompts)_Watercolor",
      "이미지 프롬프트 (Image Prompts)_Line Art",
      "이미지 프롬프트 (Image Prompts)_Seamless Pattern",
      "이미지 프롬프트 (Image Prompts)_Retro Pop Art"
    ]
  ];

  // 2. 데이터 매핑
  const rows = originalCategories.map((cat, index) => {
    const data = originalPrompts[index] || {};
    return [
      cat.primary,
      cat.secondary,
      cat.tertiary,
      data.photo || "",
      data.illust || "",
      data.vector || "",
      data.render3d || "",
      data.anime || "",
      data.pixel || "",
      data.watercolor || "",
      data.lineart || "",
      data.pattern || "",
      data.popart || ""
    ];
  });

  const finalValues = [...headers, ...rows];

  // 3. 'Sample' 시트에 데이터 덮어쓰기 (클리어 후 업로드)
  console.log("Clearing 'Sample' sheet...");
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "Sample!A1:M100"
  });

  console.log("Writing restored prompts to 'Sample' sheet...");
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sample!A1:M${finalValues.length}`,
    valueInputOption: "RAW",
    requestBody: {
      values: finalValues
    }
  });

  // 셀 너비 자동 재정렬 (Sample 시트)
  // 우선 Sample 시트의 ID를 찾기 위해 메타데이터 조회
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sampleSheet = meta.data.sheets.find(s => s.properties.title === "Sample");
  const sampleSheetId = sampleSheet ? sampleSheet.properties.sheetId : 0;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: sampleSheetId,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 13
            }
          }
        }
      ]
    }
  });

  console.log("Sample sheet restoration successfully completed!");
}

restoreSampleSheet().catch(err => {
  console.error("Restoration failed:", err);
});
