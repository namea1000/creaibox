# AI 이미지 프롬프트 10대 스타일 가이드라인 (Prompt Style Guide)

이 문서는 크리에이박스(CreAIbox) 내 여러 콘텐츠 제작 스튜디오(이미지 스튜디오, 무료 에셋 라이브러리, 비디오 제작 스튜디오 등)를 구축하거나 고도화할 때, 일관된 고품질 AI 이미지 생성을 보장하기 위한 **10대 핵심 이미지 스타일 표준**을 정의합니다.

새로운 스튜디오 또는 생성 템플릿 모듈을 개발할 때 이 문서의 명세와 키워드를 참조하여 DB 스키마, 프롬프트 생성 파이프라인(Prompt Pipeline), UI 셀렉터 프리셋을 구성하십시오.

---

## 1. 프롬프트 표준 템플릿 구조

다양한 AI 이미지 모델(Midjourney, Stable Diffusion, Imagen 3, DALL-E 3 등)에서 균일한 퀄리티의 결과물을 얻기 위해 다음 구조로 프롬프트를 조립하여 모델에 전달합니다.

$$\text{Prompt} = [\text{Subject (주제)}] + [\text{Style Modifier (스타일 지정어)}] + [\text{Lighting \& Detail (조명 및 상세 묘사)}] + [\text{Parameters (옵션/매개변수)}]$$

* 예시: `An adorable fluffy cat, [3D render, claymation style, cute chibi, blender 3d], [soft ambient lighting, pastel colors, white background], [--ar 1:1]`

---

## 2. 10대 핵심 스타일 상세 명세

아래의 10개 스타일은 디자이너, 마케터, 개발자 등 사용자의 요구가 가장 높은 최적의 제작 사양을 기준으로 선정되었습니다.

### 1) Photorealistic (실사 / 사진)
* **특징**: 실제 카메라로 촬영한 듯한 극도의 사실감과 질감 묘사.
* **추가 추천 분야**: 쇼핑몰 목업, 인물 프로필, 실사 배경, 블로그 대표 이미지.
* **핵심 키워드**: `photorealistic, hyper-realistic, 8k resolution, dramatic natural lighting, shot on 35mm lens, high detail, cinematic lighting, depth of field`

### 2) Illustration (일러스트)
* **특징**: 회화적이고 예술적인 느낌의 디지털 페인팅 스타일. 따뜻하고 감성적인 스토리텔링에 적합.
* **추가 추천 분야**: 도서 삽화, 블로그 콘텐츠 배너, 웹소설 표지.
* **핵심 키워드**: `digital illustration, conceptual art, whimsical storybook style, soft digital painting, warm color palette, aesthetic colors`

### 3) Vector (벡터)
* **특징**: 평면적이고 경계선이 명확하며, 현대적인 플랫 디자인 스타일. 크기 조절에 용이한 깔끔함이 강점.
* **추가 추천 분야**: 로고, 앱 아이콘, 인포그래픽, 프레젠테이션 삽입 그래픽.
* **핵심 키워드**: `flat vector, minimalist vector, solid colors, clean bold outlines, flat design style, corporate illustration, isolated on white background`

### 4) 3D Render / Clay (3D 렌더링 / 클레이)
* **특징**: 점토(Clay)로 빚은 듯한 질감이나 3D 그래픽 툴로 렌더링한 입체적인 느낌. 귀여움과 트렌디한 감성을 극대화.
* **추가 추천 분야**: 모바일 토이 UI, 캐릭터 디자인, 입체 앱 아이콘, 스타트업 랜딩페이지 그래픽.
* **핵심 키워드**: `3D render, claymation, cute chibi character, blender 3d, toy art, octane render, soft shadows, volumetric lighting, glossy finish`

### 5) Anime / Webtoon (애니메이션 / 웹툰)
* **특징**: 셀 채색(Cell shading) 기법과 커다란 눈망울, 역동적인 빛 묘사가 돋보이는 만화풍 스타일.
* **추가 추천 분야**: 서브컬처 콘텐츠, 캐릭터 일러스트, 웹툰 배경 소스.
* **핵심 키워드**: `anime style, manga panel, cell shading, key visual, beautiful anime illustration, Makoto Shinkai style, sparkling eyes, dramatic sunset sky`

### 6) Pixel Art (픽셀 아트 / 도트)
* **특징**: 고전 8-bit, 16-bit 게임기를 연상시키는 레트로하고 아기자기한 도트 그래픽 스타일.
* **추가 추천 분야**: Y2K 레트로 마케팅 소스, 인디 게임 그래픽, 소형 SNS 프로필.
* **핵심 키워드**: `8-bit pixel art, 16-bit, retro video game style, game asset, pixelated, dithered shading, nostalgic aesthetic`

### 7) Watercolor (수채화풍)
* **특징**: 물감과 물이 번지는 자연스럽고 우아한 느낌. 감성적이고 정적인 따뜻한 분위기 유도.
* **추가 추천 분야**: 패키지 디자인, 청첩장/엽서 도안, 감성 브랜딩 에셋.
* **핵심 키워드**: `watercolor painting, soft brush strokes, pastel colors, wet-on-wet watercolor wash, fluid paint bleeding, gold ink splatters`

### 8) Line Art (라인 아트 / 도안)
* **특징**: 색을 배제하고 오직 검은색 선으로만 대상을 미니멀하게 표현한 아웃라인 그래픽.
* **추가 추천 분야**: 미니멀 타투 도안, 고급 명함 디자인, 아동/성인용 컬러링북 페이지.
* **핵심 키워드**: `minimalist line art, clean outlines, coloring page, black ink on white background, simple sketches, minimalist continuous line art`

### 9) Seamless Pattern (심리스 패턴)
* **특징**: 상하좌우를 반복해서 타일 형태로 이어붙여도 경계선이 생기지 않는 무한 반복형 디자인 소스.
* **추가 추천 분야**: 포장지 디자인, 패브릭/원단 굿즈, 웹사이트 백그라운드 텍스처.
* **핵심 키워드**: `seamless pattern, tileable texture, repeating pattern, flat vector repeat, seamless tile background`

### 10) Retro Pop Art (레트로 팝아트 / 포스터)
* **특징**: 망점(Halftone) 효과와 굵은 외곽선, 고대비의 강렬한 보색 대비가 특징인 미국의 60-70년대 팝아트 포스터 스타일.
* **추가 추천 분야**: 스트리트 패션 의류 그래픽, 레트로 빈티지 광고 포스터, 힙한 SNS 썸네일.
* **핵심 키워드**: `vintage comic book style, pop art Andy Warhol style, bold colors, halftone dots pattern, screen printing, retro poster aesthetic, 1970s typography`

---

## 3. 주제별 10대 스타일 대조 예시 (Reference Grid)

개발 및 디자인 시 스타일 감각을 직관적으로 비교할 수 있도록 **"마법의 푸른 묘약 병 (A magical blue potion bottle)"**이라는 동일한 피사체에 10개 스타일을 대조한 프롬프트 레퍼런스 가이드입니다.

| 스타일 번호 | 스타일 명칭 | 미드저니용 레퍼런스 영문 프롬프트 (Prompt Example) |
| :--- | :--- | :--- |
| **01** | **Photorealistic** | `A detailed close-up shot of a glowing blue magic potion bottle sitting on an old wooden table, dust particles floating in light beam, photorealistic, 8k resolution, cinematic lighting, depth of field` |
| **02** | **Illustration** | `Whimsical digital illustration of a magical blue potion bottle, soft dreamlike painting style, glowing dust, starry sparkles, fantasy art, warm aesthetic colors` |
| **03** | **Vector** | `Minimalist flat vector icon of a blue magic potion bottle, clean bold outlines, solid primary colors, flat design style, isolated on white background` |
| **04** | **3D Render** | `Cute isometric 3D render of a magical blue potion bottle, bubbles rising inside, blender 3d, glossy glass texture, soft clay style, cozy ambient lighting, toy art` |
| **05** | **Anime** | `Aesthetic anime illustration of a glowing blue magic potion bottle, magical sparkles rising, high-detail glass reflection, Studio Ghibli style background` |
| **06** | **Pixel Art** | `Retro 16-bit pixel art of a glowing blue potion bottle, pixelated bubbles, game item inventory sprite, dark background, nostalgic classic RPG aesthetic` |
| **07** | **Watercolor** | `Artistic watercolor painting of a blue potion bottle, soft blue paint wash, wet-on-wet watercolor bleeding, elegant gold ink paint splatters around` |
| **08** | **Line Art** | `Minimalist line art of a magic potion bottle, clean black ink outlines, mystical celestial shapes inside, simple outline sketch on pure white background` |
| **09** | **Pattern** | `Seamless pattern of tiny magical blue potion bottles, stars, and wizard hats, clean vector pattern, dark blue repeating tile background` |
| **10** | **Pop Art** | `Vintage pop art poster featuring a magic potion bottle, bold screenprint texture, retro halftone dots pattern, bright neon colors, 1960s comic book style` |

---

## 4. 향후 신규 스튜디오 개발 시 연동 아키텍처 가이드 (For Developers)

다음 스튜디오(예: AI 이미지 스튜디오 고도화, AI 비디오/애니메이터 모듈 등)를 개발할 때 이 10대 스타일을 데이터베이스 및 API와 다음과 같이 설계하여 바인딩하십시오.

### 1) DB 스키마 설계 표준
* 이미지 생성 기록 테이블(`generated_images` 등)에 `prompt_style` 컬럼을 `VARCHAR` 형식으로 추가하고 아래의 프리셋 코드값(slug) 중 하나를 저장하도록 제약조건을 수립합니다.
  ```sql
  -- 예시: 생성 이미지 테이블 스키마
  CREATE TABLE generated_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    image_url TEXT NOT NULL,
    original_prompt TEXT NOT NULL,
    prompt_style VARCHAR(30) DEFAULT 'photorealistic' 
      CHECK (prompt_style IN ('photorealistic', 'illustration', 'vector', '3d_render', 'anime', 'pixel', 'watercolor', 'line_art', 'pattern', 'pop_art')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
  );
  ```

### 2) 백엔드 API 프롬프트 파이프라인 (Prompt Assembly Pipeline)
* 클라이언트가 전송한 `originalPrompt` 와 선택한 `style` 값을 기반으로, 백엔드 API에서 스타일별 특화 핵심 키워드군을 동적으로 덧붙여(Append) 최종 생성 모델 API(Imagen, Midjourney API 등)에 탑재하여 전송합니다.
  ```typescript
  // 예시: TypeScript 기반 스타일 조립 모듈
  export function getFormattedPrompt(userPrompt: string, styleSlug: string): string {
    const styleModifiers: Record<string, string> = {
      photorealistic: "photorealistic, hyper-realistic, 8k resolution, cinematic lighting, depth of field",
      illustration: "digital illustration, whimsical storytelling, soft digital painting, aesthetic colors",
      vector: "flat vector, minimalist vector, solid colors, clean bold outlines, flat design style, isolated",
      "3d_render": "3D render, claymation, cute toy art, blender 3d, soft ambient lighting, octane render",
      anime: "anime style, cell shading, key visual, beautiful anime illustration, high detail",
      pixel: "16-bit retro pixel art, game asset, pixelated, dithered shading, nostalgic aesthetic",
      watercolor: "watercolor painting, soft brush strokes, wet-on-wet paint bleeding, artistic textures",
      line_art: "minimalist line art, clean outlines, coloring page, black ink outline on white background",
      pattern: "seamless pattern, tileable texture, repeating pattern, vector repeat design",
      pop_art: "vintage comic book style, pop art, bold colors, halftone dots pattern, screen printing"
    };

    const modifier = styleModifiers[styleSlug] || styleModifiers.photorealistic;
    return `${userPrompt}, ${modifier}`;
  }
  ```

### 3) 프론트엔드 UI/UX 설계 표준
* 사용자가 이미지 프롬프트 작성 시, 10종의 스타일 아이콘/버튼 카드를 그리드 또는 가로 캐러셀 슬라이드로 선택할 수 있도록 제공합니다.
* 사용자가 스타일 카드를 탭할 때마다 해당하는 스타일의 실시간 예시 미리보기 이미지(위 3번 항목의 물약 병 예시 이미지 등)를 하단에 보조 툴팁으로 제공하면 사용자의 인지 효율이 극대화됩니다.
* 캔버스(Workspace) 및 블로그 글 작성기 등 이미지 에셋이 파생되는 모든 메뉴에서 이 10대 스타일 인풋 규격을 유기적으로 통일하여, 사용자가 어느 화면에서나 동질한 AI 생성 피드백을 받도록 일관성(Consistency)을 유지해 주십시오.
