import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// .env.local 로드
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ ERROR: .env.local 파일에 GEMINI_API_KEY가 설정되어 있지 않습니다.");
  process.exit(1);
}

// 142개 장르와 각 장르에 부합하는 현대적인 고화질 영문 이미지 생성 프롬프트 사전
interface GenrePromptItem {
  id: string;
  prompt: string;
}

const GENRE_PROMPTS: GenrePromptItem[] = [
  // 록 / 서브컬처 스타일
  { id: "Punk", prompt: "Hyper-realistic gritty raw punk rock concert close-up, messy guitar, dark leather jacket, glowing red stage lights, shallow depth of field" },
  { id: "Hard Rock", prompt: "Dynamic professional photo of a heavy electric guitar on a smoky dark concert stage, strong spotlights, dust particles, volumetric lighting" },
  { id: "Metal", prompt: "Dramatic high contrast photo of metal drum kit on stage under intense cold blue lasers and strobe lights, heavy atmospheric haze" },

  // 라틴 / 댄스 그루브
  { id: "Reggaeton", prompt: "Modern vibrant urban club DJ deck close-up, neon glowing pink and green lights, warm energetic dance music vibe, shallow focus" },
  { id: "Salsa", prompt: "Professional high-speed motion capture photo of dancers, vivid colorful salsa outfits, warm golden spotlights, high energy" },
  { id: "Flamenco", prompt: "Elegant high-contrast photo of a flamenco acoustic guitar close-up, artist hands, moody warm shadows, cinematic look" },
  { id: "Bachata", prompt: "Romantic sensuous Latin dance couple silhouette, warm soft evening stage light, cinematic backdrop, romantic atmosphere" },
  { id: "Samba (Latin)", prompt: "Vibrant high-contrast photo of Rio de Janeiro carnival festival, colorful feather outfits, explosive warm celebration lights" },
  { id: "Cha Cha (Latin)", prompt: "Vivid close-up of ballroom latin dance shoes in mid-action, reflective polished wooden floor, dramatic side lighting" },
  { id: "Latin", prompt: "Professional warm photo of Latin hand drums congas close-up, hands playing in high speed motion, vibrant cultural energy" },
  { id: "Disco", prompt: "Retro glittering silver disco ball hanging in a nightclub, colorful neon laser reflections, energetic dancing crowd silhouette in background" },
  { id: "Dance", prompt: "Futuristic electronic dance music festival mainstage, laser beams, warm stage glow, crowd raising hands, epic party mood" },

  // 전자 음악
  { id: "Electronic", prompt: "Sleek modern synthesizer keyboard close-up, glowing LED keys, futuristic synth bedroom studio, neon blue aesthetics" },
  { id: "Synth Pop", prompt: "80s retro synth-pop aesthetic, glowing neon grid background, vintage analog synthesizer, purple and cyan color palette" },
  { id: "Synthwave", prompt: "Epic neon wireframe sunset grid, glowing sports car silhouette, outrun aesthetic, retro futuristic synthwave theme" },
  { id: "Electro", prompt: "Close-up of DJ mixer console knobs and faders, vibrant glowing audio level meters, tech house music setup" },
  { id: "Future Bass", prompt: "Abstract futuristic sound design, floating 3D neon soundwaves and audio particles, glowing turquoise and orange colors" },
  { id: "Techno & Trance", prompt: "Deep minimalist dark techno club dancefloor, single bright white laser beam piercing through smoke, strobe effect" },
  { id: "House", prompt: "Vibrant summer beach club house DJ deck close-up, tropical sunset light, chill house party atmosphere" },
  { id: "Soft House", prompt: "Cozy warm indoor study room, headphones lying on table next to cup of tea, soft evening sunlight, clean chill aesthetic" },
  { id: "Deep House", prompt: "Moody premium dark lounge club DJ setup, velvet curtains, subtle blue backlighting, deep luxury house vibes" },
  { id: "Drum N Bass", prompt: "Industrial warehouse party scene, massive sound system speakers close-up, heavy bass vibration effects, green lasers" },
  { id: "Dubstep", prompt: "Aggressive abstract digital glitch art, distorted 3D sound waves, sharp metallic shards, electric sparks" },
  { id: "Edm", prompt: "Massive outdoor stadium EDM concert scene, huge fire pyrotechnics, spectacular light show, thousands of fans cheering" },

  // 힙합 / 알앤비 / 재즈 / 블루스
  { id: "Alternative Hip Hop", prompt: "Vibrant street art graffiti wall backdrop, classic turntables setup, modern alternative hip hop street wear" },
  { id: "Old School Hip Hop", prompt: "Retro 90s silver boombox lying on a street asphalt next to basketball, sunset golden hour street vibe" },
  { id: "Mainstream Hip Hop", prompt: "Modern premium rap stage, shiny gold microphone stand, dark background, warm stage flares, hip hop star vibe" },
  { id: "Rap", prompt: "Dynamic close-up of a studio vocal condenser microphone with pop filter, soft moody recording booth background" },
  { id: "Trap", prompt: "Dark urban alleyway at night, neon sign glowing red, heavy 808 bass car speakers vibe, dark trap aesthetic" },
  { id: "Phonk", prompt: "Dark retro sports car drifting in city streets at night under heavy fog, VHS grain effect, phonk aesthetic" },
  { id: "Rnb", prompt: "Sensual warm close-up photo of a modern RnB vocalist, soft purple neon glow, atmospheric shadows, moody studio" },
  { id: "Old School Rnb", prompt: "Vintage wooden record player close-up, vinyl disc spinning, warm retro living room fireplace glow in background" },
  { id: "Motown & Old School Rnb", prompt: "Classic 70s soul record studio, golden retro microphone, warm vintage color tone, motown era vibe" },
  { id: "Traditional Jazz", prompt: "Authentic New Orleans jazz club, close-up of brass saxophone player fingers on keys, warm amber lighting" },
  { id: "Modern Jazz", prompt: "Sleek jazz lounge piano trio closeup, double bass silhouette, soft warm spotlight, high contrast jazz mood" },
  { id: "Smooth Jazz", prompt: "Chic luxury hotel lounge bar, warm candle light, saxophone standing on stand, glass of whiskey next to it" },
  { id: "Acid Jazz", prompt: "Groovy 70s jazz funk drum set close-up, warm wooden studio, retro vibrant warm colors" },
  { id: "Blues", prompt: "Classic vintage electric blues guitar, moody dark wooden bar counter, neon beer sign reflecting in guitar body" },
  { id: "Modern Blues", prompt: "Expressive blues guitarist hands close-up, slide ring on finger, electric guitar body, soft stage smoke" },

  // 팝 / 포크 / 컨트리 / 전통악기
  { id: "Pop", prompt: "Shining pop star concert stage, colorful pastel lights, confetti falling, clean bright happy atmosphere" },
  { id: "Indie Pop", prompt: "Indie folk singer silhouette playing acoustic guitar, warm fairy lights in background, cozy bedroom indie vibe" },
  { id: "Alternative", prompt: "Chic modern indie pop rock band setup, neon blue background, minimalistic synth and bass, modern aesthetic" },
  { id: "Post Rock", prompt: "Epic atmospheric landscape at dusk, starry sky, silhouette of a guitar player, deep emotional post rock theme" },
  { id: "Folk", prompt: "Acoustic guitar sitting on a wooden bench in an autumn forest, soft warm sunlight filtering through trees" },
  { id: "Traditional Country", prompt: "Vintage acoustic guitar leaning against a rustic barn wood wall, cowboy hat sitting on top, golden sunset" },
  { id: "Modern Country", prompt: "Contemporary country music stage setup, large screens in background, warm spotlights, country music festival" },
  { id: "Ska", prompt: "Vibrant ska band horn section close-up, trumpet and trombone brass shiny under warm lights, high energy" },
  { id: "Funk", prompt: "Close-up of hands playing slap bass on a classic bass guitar, colorful disco lights reflecting on glossy wood" },

  // 클래식 / 합주 / 월드뮤직
  { id: "Modern Classical", prompt: "Minimalist grand piano in a modern art gallery, clean white walls, soft morning sun rays shining on keys" },
  { id: "Orchestral", prompt: "Grand symphony orchestra in a majestic concert hall, rows of violins and cellos, dramatic overhead chandeliers" },
  { id: "Cinematic", prompt: "Cinematic close-up of a violin body and strings, dark dramatic background, epic film score vibe" },
  { id: "Epic Classical", prompt: "Epic fantasy castle battle backdrop, movie choir performing, cinematic atmospheric lighting" },
  { id: "Chamber Music", prompt: "Chamber music string quartet close-up, beautiful antique wood texture of violins, soft focus" },
  { id: "Dramatic Classical", prompt: "Expressive pianist playing piano with intense movement, dramatic dark shadows, spotlight on keys" },
  { id: "Choir", prompt: "Ethereal classic cathedral hall, choir singers holding sheet music, soft holy light streaming through stained glass" },
  { id: "Gospel", prompt: "Joyful gospel choir singing with raised hands, bright warm yellow stage lights, celebration vibe" },
  { id: "Instrumental", prompt: "Detail close-up of classical acoustic guitar strings and wood hole, soft focus, bright clean aesthetic" },
  { id: "Ambient", prompt: "Breathtaking minimalist foggy mountain lake at sunrise, calm water, serene peaceful ambient atmosphere" },
  { id: "World", prompt: "Traditional folk drums and hand instruments from around the world sitting in a circle, warm earthen colors" },
  { id: "Arabic", prompt: "Exquisite traditional Arabic Oud instrument close-up, intricate geometric wood carvings, warm middle eastern decor" },
  { id: "Celtic", prompt: "Mystical green Irish hills, Celtic harp standing in grass under morning dew, cinematic foggy morning" },
  { id: "Ireland", prompt: "Cozy traditional Irish pub interior, wooden counter, pint of stout next to a tin whistle, warm fireplace" },
  { id: "Scotland", prompt: "Scottish highland landscape, bagpiper standing in fog near ancient castle ruins, epic historical mood" },
  { id: "China", prompt: "Beautiful traditional Chinese Guzheng string instrument, red silk, cherry blossoms in soft background" },
  { id: "France", prompt: "Parisian cafe terrace view, vintage accordian lying on round metal table, Eiffel tower in soft background" },
  { id: "Greece", prompt: "Greek Santorini landscape, traditional Bouzouki instrument leaning against white wall, turquoise sea view" },
  { id: "India", prompt: "Traditional Indian Sitar instrument closeup, colorful silks, incense smoke, mystical Indian music vibe" },

  // 비디오 씬 / 영상 연출
  { id: "Upbeat", prompt: "Professional cinematic video production setup, high-end cinema camera on gimbal, sunny city background" },
  { id: "Beats", prompt: "Classic vintage MPC drum pad sampler closeup, finger pressing a button, glowing pad lights, lo-fi beatmaker studio" },
  { id: "Main Title", prompt: "Dramatic movie title screen style, dark cinematic background, light leaks, epic cinematic opening theme" },
  { id: "Build Up Scenes", prompt: "Intense suspenseful thriller movie scene, dark dramatic shadows, high tension cinematic composition" },
  { id: "Corporate", prompt: "Bright clean corporate presentation hall, big LED screen showing data charts, modern business environment" },
  { id: "Action", prompt: "Cinematic action movie explosion scene, flying dust and sparks, cinematic action hero silhouette" },
  { id: "Adventure", prompt: "Epic hiking adventure, cinematic view of hiker looking over grand canyon valley, epic journey vibe" },
  { id: "Intro/Outro", prompt: "Abstract clean colorful motion graphics background, neat layout, clean youtube intro outro design" },
  { id: "Mystery", prompt: "Spooky dark foggy old mansion entrance at night, single street lamp light, detective noir mood" },
  { id: "Chase Scene", prompt: "Thrilling car chase scene at night, blurred speed lights, cinematic action movie close-up" },
  { id: "Video Games", prompt: "Vibrant gaming room, glowing neon RGB lights, modern game controller on desk, high-end setup" },
  { id: "Horror Scene", prompt: "Terrifying horror movie scene, dark dimly lit old corridor, creepy shadow appearing, tense mood" },
  { id: "Crime Scene", prompt: "Detective desk closeup, old file folders, magnifying glass, yellow tape, moody noir shadows" },
  { id: "Cartoons", prompt: "Vivid colorful cartoon drawing style room, happy animated toys, cute cartoon style" },
  { id: "Small Drama", prompt: "Moody emotional indie film close-up, tear running down face, soft natural window light" },
  { id: "Drama Scene", prompt: "Theatrical theater stage, spotlight on two dramatic actors, classic dramatic performance" },
  { id: "Jingles", prompt: "Abstract radio signal wave, neon green digital waves on black screen, jingle sound design graphic" },
  { id: "Vaudeville & Variety Show", prompt: "Vintage retro vaudeville stage, classic red velvet curtain, glowing marquee lightbulb sign" },
  { id: "Show Dance", prompt: "Broadway musical dancers group dancing in synch, spectacular stage lights, showtime vibe" },
  { id: "Tragedy", prompt: "Dramatic tragic theatrical scene, crying actress, heavy dark shadows, epic sad tragedy play" },
  { id: "Bloopers", prompt: "Cheerful director laugh behind camera monitor, film crew laughing in background, blooper reel mood" },

  // 감정 / 공간 / 이벤트
  { id: "Cafe", prompt: "Cozy rainy day cafe window view, steaming cup of coffee, warm indoor lighting, street rain outside" },
  { id: "Elevator Music", prompt: "Elegant luxury hotel elevator lobby, marble floors, soft warm ambient lighting, peaceful lounge" },
  { id: "Vintage", prompt: "Retro yellow cassette tape sitting on top of a vintage portable player, retro lo-fi bedroom vibes" },
  { id: "Meditation/Spiritual", prompt: "Calm spiritual meditation room, burning candle, incense smoke, lotus flower, zen atmosphere" },
  { id: "Small Emotions", prompt: "Beautiful sunset view through a cozy room window, soft warm rays, calm emotional mood" },
  { id: "Nostalgia", prompt: "Old polaroid photo lying on wood table showing childhood memories, vintage nostalgic filter" },
  { id: "Supernatural", prompt: "Mystical starry sky with glowing galaxy nebula, supernatural magical portal" },
  { id: "Special Occasions", prompt: "Sparkling champagne glasses toast, glowing fairy lights background, premium party celebration" },
  { id: "Christmas", prompt: "Warm fireplace decorated with Christmas stockings, glowing Christmas tree, cozy holiday atmosphere" },
  { id: "Eccentric & Quirky", prompt: "Fun quirky colorful abstract art, bizarre patterns, pop art eccentric design" },
  { id: "Funerals", prompt: "Solemn single black rose lying on a black surface next to candle, somber memorial vibe" },
  { id: "Wedding", prompt: "Stunning outdoor wedding aisle, white flower arches, soft romantic sunlight" },
  { id: "Religious Theme", prompt: "Holy sunlight beaming through majestic gothic church stained glass window, divine atmosphere" },
  { id: "Amusement Park", prompt: "Vintage amusement park carousel spinning at night, glowing neon carnival lights" },
  { id: "Scary Childrens Tunes", prompt: "Creepy old wooden music box sitting in a dusty dark room, scary doll silhouette" },
  { id: "Happy Childrens Tunes", prompt: "Colorful children playroom, cute stuffed animals, blocks, bright happy morning sun" },
  { id: "Fantasy & Dreamy Childrens'", prompt: "Fairytale fantasy bedroom, glowing ceiling stars, open book showing magical sparks" },
  { id: "Military & Historical", prompt: "Vintage military brass bugle horn resting on an old world historical map" },
  { id: "Usa", prompt: "Classic American road trip, yellow line road stretching into distant desert mountains, route 66 style" },

  // 악기 및 사운드 텍스처
  { id: "Beautiful Plays", prompt: "Chic wooden string instrument ensemble closeup, beautiful bow motion, warm sound wave vibe" },
  { id: "Acoustic Group", prompt: "Acoustic indie group playing together, guitar, cello, cajon, cozy loft studio, warm friendship vibe" },
  { id: "Solo Piano", prompt: "Close up piano keys black and white, dramatic overhead spotlight, solo piano concert" },
  { id: "Solo Instruments", prompt: "Classic cello standing alone on stage under a single cold white spotlight, dark back stage" },
  { id: "Solo Classical Instruments", prompt: "Elegant solo violinist close up play, wood texture violin body, classical solo concert" },
  { id: "Marching Band", prompt: "Marching band snare drummer close-up, shiny chrome drum, marching band uniform, high energy" },
  { id: "Solo Guitar", prompt: "Close up of an acoustic guitar player hands strumming cords in a cozy living room" },
  { id: "Oompah Band", prompt: "Traditional Bavarian oompah band, shiny brass tubas and accordions, oktoberfest theme" },
  { id: "Classical String Quartet", prompt: "Violin, viola, cello quartet close-up performing classical concert, elegant attire" },
  { id: "Big Band", prompt: "Retro jazz big band brass section, saxophones and trumpets playing under red stage lights" },
  { id: "High Drones", prompt: "Abstract visual drone landscape, high altitude mountain fog, glowing white digital lines" },
  { id: "Pulses", prompt: "Electronic modular synthesizer panel with flashing green LED pulse lights and patch cords" },
  { id: "Low Drones", prompt: "Abyssal abstract dark texture, heavy low drone vibration effect, deep dark navy tones" },
  { id: "High Rhythmic Drones", prompt: "Fast modular synthesizer sequencer, rhythmically blinking yellow LED lights" },
  { id: "Low Rhythmic Drones", prompt: "Close-up of a massive subwoofer vibrating violently with deep bass, low frequency waves" },
  { id: "High Non Rhythmic Drones", prompt: "Ethereal dreamy abstract space nebula, floating high frequency particles" },
  { id: "Low Non Rhythmic Drones", prompt: "Deep deep ocean blue dark texture, non rhythmic heavy low frequency soundscape" },
  { id: "Abstract", prompt: "Modern conceptual sound art installation, metallic sound waves in dark gallery space" },
  { id: "Percussion", prompt: "Variety of professional studio percussion instruments, woodblocks, shakers, tambourines" },
  { id: "Oomph / Volume2", prompt: "Extreme sound blast illustration, sound speaker producing massive shockwaves, epic power" },

  // 일렉트로닉 / 힙합 서브컬처
  { id: "Synthwave / Retrowave", prompt: "Epic neon wireframe sunset grid, glowing sports car silhouette, outrun aesthetic, retro futuristic synthwave theme" },
  { id: "Vaporwave", prompt: "Dreamy retro 90s aesthetic, pastel pink and blue grid, floating Greek statue, lo-fi vaporwave vibe" },
  { id: "Future Funk", prompt: "Vibrant neon future funk dancefloor, glowing disco lights, anime retro style vibe" },
  { id: "Melodic Dubstep", prompt: "Spectacular laser show stage at music festival, melodic dubstep energetic bass drop" },
  { id: "Emo Rap / Sad Boy Beats", prompt: "Cozy bedroom with neon blue window light, sad boy lo-fi hip hop bedroom studio vibe" },

  // 팝 / 인디 / 뉴에이지
  { id: "City Pop", prompt: "Retro 80s neon Tokyo city street at night under city lights, classic city pop aesthetic" },
  { id: "Bedroom Pop", prompt: "Cozy retro bedroom pop studio, bedroom synth, soft vintage film camera look" },
  { id: "Neo-Classical", prompt: "Warm wooden cello and piano studio, soft classical ambient afternoon lighting" },
  { id: "Cinematic Post-Rock", prompt: "Epic starry galaxy sky over grand canyon cliff, cinematic post rock guitar" },

  // 아시아 / 월드 에스닉
  { id: "K-Pop (Modern)", prompt: "Modern futuristic K-pop music video dance stage, glowing geometric stage lights, vibrant pastel colors" },
  { id: "J-Pop / Anime Rock", prompt: "Anime style high school rock band stage, energetic lead singer with electric guitar, bright colors" },
  { id: "Afrobeat (Amapiano)", prompt: "Afrobeat dance party, warm orange lights, tribal drums in close-up, high energy rhythm" },

  // 기능성 및 오디오 텍스처
  { id: "ASMR / Textural Soundscape", prompt: "Binaural ASMR microphone close-up, soft brush touching the mic capsule, gentle cozy sound studio" },
  { id: "Dark Ambient", prompt: "Dark foggy midnight forest, misty trees, solitary glowing lamp post, eerie dark ambient mood" },
  { id: "Glitch Hop", prompt: "Cyberpunk matrix green digital glitch background, abstract glitch-hop sound design illustration" }
];

const TARGET_DIR = path.resolve(process.cwd(), "public/images/genres");

// 저장 디렉토리 존재 확인 및 생성
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateImage(genreId: string, promptText: string) {
  const cleanId = genreId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${cleanId}.png`;
  const filePath = path.join(TARGET_DIR, fileName);

  // 이미 이미지가 존재하면 스킵 (API Quota 절약)
  if (fs.existsSync(filePath)) {
    console.log(`[SKIP] Already exists: ${fileName}`);
    return;
  }

  console.log(`[GENERATE] Starting: ${genreId} ...`);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: promptText,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          outputMimeType: "image/png",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || "Unknown API Error";
      throw new Error(`API Error: ${errMsg}`);
    }

    const base64Bytes = data.predictions?.[0]?.bytesBase64Encoded;

    if (!base64Bytes) {
      throw new Error("No image bytes returned in API response.");
    }

    const buffer = Buffer.from(base64Bytes, "base64");
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ SUCCESS: Saved ${fileName}`);

  } catch (err: any) {
    console.error(`❌ FAILED: ${genreId} -`, err.message);
    if (err.message.includes("quota") || err.message.includes("429")) {
      console.warn("⚠️ WARNING: API Quota Limit reached. Stopping batch job to prevent consecutive failures.");
      process.exit(2);
    }
  }
}

async function run() {
  console.log(`🚀 Starting AI Image Generation Batch for ${GENRE_PROMPTS.length} genres...`);
  
  for (let i = 0; i < GENRE_PROMPTS.length; i++) {
    const item = GENRE_PROMPTS[i];
    console.log(`\n[Progress: ${i + 1}/${GENRE_PROMPTS.length}]`);
    await generateImage(item.id, item.prompt);
    
    // API 호출 간 4초의 딜레이를 주어 속도 한도(Rate limit) 방지
    await sleep(4000);
  }
  
  console.log("\n🎉 ALL DONE! Check public/images/genres folder.");
}

run();
