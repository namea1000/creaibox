# 기술 스택 정의 (Tech Stack & Architecture)

`CreAibox` 웹 워크스페이스에서 채택한 프레임워크, 라이브러리 및 주요 디자인 시스템 명세입니다.

---

## 1. 프레임워크 및 언어 (Core)
* **프레임워크**: Next.js 16.2.4 (React 19.2.4 대응 App Router 아키텍처)
* **런타임**: Node.js v20+ 권장
* **언어**: TypeScript ^5 (정적 타입 지원 및 모듈 자동 컴파일)
* **패키지 매니저**: npm (기본 제공 패키지 관리 도구)

---

## 2. 상태 관리 및 데이터 동기화 (State & Data)
* **서버 상태 관리 (Server State)**: TanStack React Query v5 (`@tanstack/react-query`)
  - 컴포넌트 마운트 시 불필요한 재호출 방지 (`refetchOnMount: false`).
  - 캐싱 만료 주기 제어 (`staleTime: 10분`, `gcTime: 30분`).
* **클라이언트 상태 관리 (Client State)**: Zustand v5 (`zustand`)
  - 네이버 포스트 저장소 (`naverManuscriptStore`) 및 CreAibox 포스트 저장소 (`creaiboxManuscriptStore`)에서 세션 저장소(`sessionStorage`) 영속화 기법 연동.
  - 마스킹 및 UI 레이아웃 상태 등을 동기화.

---

## 3. UI 디자인 시스템 (UI & Styling)
* **CSS 엔진**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/postcss`)
* **UI 원자 컴포넌트**: Radix UI Primitives (Dropdown, Dialog, Tabs, Table, Sheet 등)
* **아이콘 세트**: Lucide React (`lucide-react`) & React Icons (`react-icons`)
* **블로그 리치 에디터**: Tiptap Editor v3 (`@tiptap/react`)
  - 유튜브 임베드, 테이블 편집, 텍스트 정렬, 플레이스홀더, 외부 이미지 링크 등 확장 패널 구현.
* **스타일링 유틸리티**: `clsx`, `tailwind-merge`, `class-variance-authority` (cva), `tw-animate-css`

---

## 4. 백엔드 및 서드파티 서비스 연동 (Backend & APIs)
* **Backend as a Service (BaaS)**: Supabase (`@supabase/ssr`, `@supabase/auth-helpers-nextjs`, `@supabase/supabase-js`)
  - 회원가입, 세션 토큰 검증, 행 수준 보안(RLS) 및 RPC 원격 호출.
* **AI 생성 플랫폼**: 
  - Google Gemini API (`@google/generative-ai` 및 REST API)
  - Groq Fast AI Engine (`groq-sdk`)
* **미디어 처리 라이브러리**: FFmpeg.wasm v0.12 (`@ffmpeg/ffmpeg`, `@ffmpeg/util`)
  - 클라이언트 웹뷰 상에서 WebM 레코딩을 MP4로 전환하는 비디오 트랜스코딩 엔진 탑재.
* **텍스트 스크래핑 및 파싱**: 
  - Cheerio (`cheerio`) & Open Graph Scraper (`open-graph-scraper`) -> 외부 링크 분석용.
  - PDF.js (`pdfjs-dist`) & PDF Parse (`pdf-parse`) -> PDF 첨부 서류 데이터 분석용.
  - RSS Parser (`rss-parser`) -> 뉴스 채널 파싱용.
* **이미지 처리**: Sharp (`sharp`)
