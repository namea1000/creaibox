# 작업 목록 및 예정 사항 (TODO & Future Work)

현재 `CreAibox` 프로젝트는 핵심 도구(비디오 에디터, 블로그 에디터, API Vault, 통계 대시보드)가 완성되어 정상 동작하고 있으나, 스튜디오의 여러 특화 서브 채널들은 `StudioComingSoonPage` 컴포넌트로 연결되어 차후 구현을 대기하고 있습니다.

## 1. 예정된 스튜디오 기능 (WIP)

아래 항목들은 사용자 메뉴에 노출되고 있으나, 현재 라우트 진입 시 **"준비 중인 기능"** 화면으로 연결됩니다. 차후 에이전트 개발 시 이 목록을 참고하여 실제 컴포넌트 교체 및 로직 연결을 진행해야 합니다.

### 1-1. 뮤직 스튜디오 (`/studio/music/*`)
- [ ] **스타일 포맷 (`style-format`)**: 장르별(EDM, Pop, Lo-fi) 프롬프트 프리셋 저장고 구축.
- [ ] **커버 이미지 (`cover-image`)**: AI 이미지 생성기를 연동한 앨범 커버 전용 마법사 개발.
- [ ] **영상 프롬프트 (`video-prompt`)**: 가사와 분위기에 연계되는 영상 프롬프트 큐레이팅.
- [ ] **번역 (`translate`)** & **유튜브 최적화 (`youtube-seo`)**: AI 다국어 가사 번역 및 메타 정보 빌더 구축.
- [ ] **플레이리스트 (`playlist`)**, **프로젝트 (`projects`)**, **설정 (`settings`)** 기능 보완.

### 1-2. 비디오 스튜디오 (`/studio/video/*`)
- [ ] **쇼츠 & 릴스 제작 (`shorts`)**: 9:16 종횡비 템플릿 및 숏폼 클립 커터 기능 연동.
- [ ] **영상 프롬프트 (`prompts`)** & **자막/음성 (`subtitle`)**: ElevenLabs 음성 합성과 자막 타임싱크 자동화 바인딩.
- [ ] **영상 템플릿 (`templates`)**, **썸네일 연동 (`thumbnail`)**, **프로젝트 관리 (`projects`)**.

### 1-3. 유튜브 연구소 (`/studio/youtube/*`)
- [ ] **채널 상세 분석 (`channel`)** & **급상승 트렌드 (`rising`)**: YouTube Data API를 사용한 채널 통계 연계 및 스크래핑.
- [ ] **경쟁 채널 비교 (`compare`)** & **광고 단가 계산기 (`cpm`)**.
- [ ] **유튜브 SEO 분석 (`seo`)** & **쇼츠 바이럴 분석 (`shorts`)**.

### 1-4. 키워드 연구소 (`/studio/keyword/*`)
- [ ] **대량 조회 (`bulk`)**, **연관 키워드 (`related`)**, **형태소 분석 (`morphology`)**.
- [ ] **실시간 순위 추적 (`rank`)** & **SEO 경쟁 분석 (`seo`)**.

### 1-5. 기타 스튜디오 및 커뮤니티
- [ ] **뉴스 스튜디오 (`/studio/news/*`)**: 실시간 이슈 탐지 및 카드 뉴스, AI 앵커 생성.
- [ ] **인사이트 리포트 (`/studio/report/*`)**: 시장 보고서 자동 생성기.
- [ ] **스마트 도구 (`/studio/tools/*`)**: AI 누끼 제거, AI OCR, 프롬프트 개선기 등 유틸리티 배치.
- [ ] **크리에이터 커뮤니티 (`/studio/community/*`)**: 실시간 협업, 채팅 및 토론방 웹소켓 연결.

---

## 2. 코드베이스 내부 개선 태스크 (Technical Debt)
- **Supabase Session 재시도 최적화**: 현재 `waitForAuthenticatedUser` 헬퍼가 인증 미스로 지연 루프(최대 4회 재시도)를 수행하나, 전역 Auth Context 혹은 Middleware와의 연계를 정비해 인증 상태를 즉시 반환하도록 최적화가 요구됨.
- **WASM 로딩 퍼포먼스**: FFmpeg.wasm 로드 시 프론트 브라우저 단에서 공유 버퍼 차단 이슈로 인한 헤더 문제(`Cross-Origin-Opener-Policy`, `Cross-Origin-Embedder-Policy`)의 정적 배포 세팅 보완 필요.
