# 스튜디오 연동 필요 API 및 발급 사이트 안내서

본 문서는 **AI 리포트 스튜디오**와 **뉴스 콘텐츠 스튜디오**의 모든 기능들을 실제 백엔드와 연동하여 완전 자동화 서비스로 구동하기 위해 발급받아야 하는 API 리스트 및 공식 가입 주소를 정리한 개발 참조 문서입니다.

---

## 1. AI 리포트 스튜디오 (AI Report Studio) 관련 API

### ① 인공지능 LLM 텍스트 생성 API
리포트 본문 작성, RAG 질의응답 및 생산성 분석 보고서 자동 완성에 필수적인 AI 뇌 역할을 수행합니다.
- **OpenAI API (GPT-4o)**
  - **용도**: 기본적인 텍스트 초안 작성 및 구조화
  - **가입 및 발급 주소**: [https://platform.openai.com/](https://platform.openai.com/)
- **Anthropic Claude API (Claude 3.5 Sonnet)**
  - **용도**: 논리 전개가 치밀하고 장문의 전문적인 분석 보고서 생성용 (추천)
  - **가입 및 발급 주소**: [https://console.anthropic.com/](https://console.anthropic.com/)
- **Google Gemini API (Gemini 1.5 Pro)**
  - **용도**: 대용량 PDF 문서 RAG 분석 및 실시간 정보 추론 보조용
  - **가입 및 발급 주소**: [https://aistudio.google.com/](https://aistudio.google.com/)

### ② RAG 벡터 데이터베이스 API
"AI 리서치 센터"에 업로드된 대용량 PDF 보고서나 논문을 분석하고 시맨틱 검색(RAG)을 수행하는 보관소입니다.
- **Pinecone DB API**
  - **용도**: 임베딩된 텍스트 벡터 인덱싱 및 초고속 검색
  - **가입 및 발급 주소**: [https://www.pinecone.io/](https://www.pinecone.io/)
- **Supabase (기본 데이터베이스)**
  - **용도**: 내장된 `pgvector` 확장을 사용해 벡터 저장 가능 (별도 외부 API 비용 절감 가능)
  - **가입 및 발급 주소**: [https://supabase.com/](https://supabase.com/)

### ③ 금융 및 글로벌 주가 데이터 API
"AI 투자 분석" 메뉴에서 실시간 주가 차트 및 재무 분석 장표를 바인딩하는 용도입니다.
- **Alpha Vantage API**
  - **용도**: 글로벌 빅테크 및 반도체 종목 주가 흐름, 재무 메트릭 데이터 수집
  - **가입 및 발급 주소**: [https://www.alphavantage.co/](https://www.alphavantage.co/)
- **Yahoo Finance API (RapidAPI 경유)**
  - **용도**: 실시간 글로벌 지수 및 주가 수집용
  - **가입 및 발급 주소**: [https://rapidapi.com/apidojo/api/yahoo-finance1/](https://rapidapi.com/apidojo/api/yahoo-finance1/)

### ④ 이메일 뉴스레터 대량 발송 API
"AI 뉴스 브리핑"에서 빌드된 뉴스레터 템플릿을 구독자들에게 메일로 대량 발송합니다.
- **Resend API**
  - **용도**: 개발 친화적이고 속도가 빠른 최신 이메일 발송 엔진 (추천)
  - **가입 및 발급 주소**: [https://resend.com/](https://resend.com/)
- **SendGrid API**
  - **용도**: 전통적이고 안정적인 대량 메일 발송 플랫폼
  - **가입 및 발급 주소**: [https://sendgrid.com/](https://sendgrid.com/)

---

## 2. 뉴스 콘텐츠 스튜디오 (News Content Studio) 관련 API

### ① 실시간 뉴스 및 검색 트렌드 수집 API
포털 뉴스 검색 결과 및 소셜 미디어 트렌드를 정량 분석하기 위해 데이터를 긁어오는 관문입니다.
- **네이버 검색 API (News Search)**
  - **용도**: 키워드 기반 네이버 뉴스 실시간 스크랩용 (ClientID & ClientSecret 발급)
  - **가입 및 발급 주소**: [https://developers.naver.com/](https://developers.naver.com/)
- **SerpAPI (Google Search API)**
  - **용도**: 구글 뉴스 검색 및 실시간 구글 검색어 트렌드 순위 수집용
  - **가입 및 발급 주소**: [https://serpapi.com/](https://serpapi.com/)

### ② 블로그/SNS 자동 발행 API
"뉴스 콘텐츠 자동 발행" 메뉴에서 작성 완료된 블로그 초안을 사용자의 계정에 원클릭으로 전송/발행합니다.
- **네이버 블로그 API**
  - **용도**: 네이버 블로그에 포스팅 자동 전송 및 발행
  - **신청 및 발급 주소**: [https://developers.naver.com/](https://developers.naver.com/) (검색 API와 동일한 개발자 센터에서 어플리케이션 등록)
- **티스토리 API**
  - **용도**: 티스토리 블로그 자동 발행용 AppID 및 Access Token 획득
  - **신청 및 발급 주소**: [https://www.tistory.com/guide/api/manage/register](https://www.tistory.com/guide/api/manage/register)
- **워드프레스 Application Password**
  - **용도**: 자체 설치형 워드프레스 사이트 API 연동 패스워드
  - **발급 방법**: 본인 워드프레스 사이트의 [관리자 페이지] -> [사용자(Users)] -> [프로필 편집] 하단에서 '애플리케이션 비밀번호' 발급.

### ③ AI 목소리 & 아바타 비디오 합성 API
"AI 뉴스 앵커" 메뉴에서 대본(텍스트)을 실제 AI 앵커의 자연스러운 목소리로 낭독하고 얼굴 모션 비디오로 합성해 냅니다.
- **ElevenLabs API**
  - **용도**: 현존 가장 인간적이고 정교한 한국어 음성합성(TTS) 엔진
  - **가입 및 발급 주소**: [https://elevenlabs.io/](https://elevenlabs.io/)
- **HeyGen API**
  - **용도**: 초고화질 AI 아바타 얼굴 모션 및 대본 입모양 싱크 비디오 합성
  - **가입 및 발급 주소**: [https://www.heygen.com/](https://www.heygen.com/)
- **D-ID API**
  - **용도**: 사진 한 장만으로 목소리와 싱크를 맞춘 대화형 비디오 생성
  - **가입 및 발급 주소**: [https://www.d-id.com/](https://www.d-id.com/)
