# Design Specification: News Content Studio (뉴스 콘텐츠 스튜디오)

본 문서는 실시간 뉴스 수집, AI 뉴스 요약, 뉴스 기반 블로그/유튜브 스크립트 생성 및 자동 발행을 처리하는 **뉴스 콘텐츠 스튜디오**의 기술 설계 및 API 요구사항을 정의합니다.

---

## 1. 주요 요구 기능 및 워크플로우

1. **실시간 뉴스 수집 및 트렌드/이슈 감지**: 특정 키워드 또는 카테고리별 뉴스의 메타데이터(제목, 링크, 요약)를 실시간으로 수집합니다.
2. **원문 뉴스 스크래핑**: 수집된 뉴스 링크의 HTML에서 본문 텍스트와 이미지만 깨끗하게 추출(Scraping)합니다.
3. **AI 뉴스 요약 및 블로그/스크립트 생성**: 추출된 원문을 LLM을 통해 요약하고, 블로그 포스팅용 글 또는 유튜브 영상 제작을 위한 대본(Script)으로 변환합니다.
4. **뉴스 카드(News Card) 제작**: 본문 핵심 요약 텍스트를 인스타그램, 블로그 업로드용 카드뉴스 이미지로 자동 렌더링합니다.
5. **AI 뉴스 앵커**: 요약된 스크립트를 바탕으로 인공지능 아바타가 뉴스를 읽어주는 쇼츠/비디오 형태의 영상 콘텐츠를 자동 생성합니다.
6. **콘텐츠 자동 발행**: 생성된 원고와 카드를 사용자 네이버 블로그, 워드프레스 또는 유튜브 쇼츠로 원클릭 자동 배포합니다.

---

## 2. 필요 API 및 도구 준비 목록

### ① 네이버 개발자 API (Naver Open API) — 필수
네이버 에코시스템 연동과 한국어 콘텐츠 제작에 필수적입니다.
* **네이버 검색 API (뉴스/블로그)**:
  * `https://openapi.naver.com/v1/search/news.json`
  * **용도**: 실시간 이슈 키워드로 최신 네이버 뉴스 검색 데이터(제목, 링크, 요약 설명) 수집.
* **네이버 블로그 API (OAuth 2.0)**:
  * `https://openapi.naver.com/blog/writePost.json`
  * **용도**: 뉴스 기반으로 작성된 완성형 원고와 이미지 카드를 사용자의 네이버 블로그에 자동으로 포스팅(글쓰기).

### ② 웹 크롤러 및 본문 파서 (Web Scraper / Parser) — 필수
뉴스 검색 API는 짧은 요약문(Snippet)만 반환하므로, AI 요약을 하려면 뉴스 본문의 원문을 가져와야 합니다.
* **추천 외부 API**:
  * **Firecrawl API** or **Jina Reader API (`https://r.jina.ai/[URL]`)**: 웹페이지 URL만 보내면 마크다운 형식의 순수 텍스트 본문만 깨끗하게 파싱하여 반환해 주어 RAG 및 LLM 프롬프트에 넣기 최적입니다.
* **자체 구축 시**: Node.js에서 `Puppeteer` 또는 `Cheerio`를 이용한 파서 라이브러리 개발 (단, 뉴스 사이트별 차단 우회 및 레이아웃 패턴 처리가 필요).

### ③ AI LLM 및 검색 연동 API — 필수
* **Google Gemini 1.5 Pro / Flash API**:
  * **용도**: 수집된 긴 뉴스 원문을 요약하고 다양한 어조(Tone)의 블로그 글 및 유튜브 스크립트로 재생성.
  * **특장점**: Gemini API의 **Google Search Grounding** 도구를 활성화하면 최신 팩트체크 및 최신 데이터를 실시간으로 보강하여 오정보(Hallucination)를 예방할 수 있습니다.

### ④ 비디오/비주얼 생성 API — 선택 (AI 앵커 및 카드뉴스 고도화 시)
* **HeyGen API / D-ID API**:
  * **용도**: AI 뉴스 앵커 아바타 비디오 생성. 스크립트를 입력하면 말하는 아바타 비디오 파일(MP4)을 렌더링합니다.
* **HTML-to-Image / Serverless Canvas**:
  * **용도**: SVG 템플릿에 뉴스 텍스트를 주입하고 `html-to-image` 또는 `Puppeteer`를 통해 카드뉴스 PNG 이미지로 렌더링.

---

## 3. 데이터베이스 스키마 설계 (Supabase)

### `news_articles` (수집된 원본 뉴스)
```sql
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  origin_link TEXT UNIQUE NOT NULL,
  description TEXT,
  pub_date TIMESTAMP WITH TIME ZONE,
  source TEXT, -- 예: 'Naver News', 'Google News'
  category TEXT, -- 예: 'IT', '경제'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### `news_summaries` (AI 뉴스 요약 및 스크립트 결과물)
```sql
CREATE TABLE news_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES news_articles(id) ON DELETE SET NULL,
  user_id UUID NOT NULL, -- 작성/요청한 크리에이터 ID
  summary_text TEXT NOT NULL, -- AI 요약문
  blog_content TEXT, -- 블로그용 마크다운 본문
  youtube_script TEXT, -- 유튜브 대본용 텍스트
  status TEXT DEFAULT 'draft', -- draft, completed, published
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### `news_cards` (카드뉴스 에셋)
```sql
CREATE TABLE news_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_id UUID REFERENCES news_summaries(id) ON DELETE CASCADE,
  image_urls TEXT[], -- 생성된 카드뉴스 이미지 경로 배열
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```
