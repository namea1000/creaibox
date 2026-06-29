# AI 쇼츠 자동 생성기 & 채널 배포 스튜디오 통합 기획 설계서

본 문서는 크리에이박스(CreAibox)의 **채널 배포 스튜디오(Channel Distribution Studio)** 및 **AI 쇼츠 자동 생성기(AI Shorts Auto-Generator)**의 기획 배경, 상세 아키텍처, 데이터베이스 모델 및 최종 구현 명세를 기록합니다.

---

## 1. 기획 및 설계 배경

유저가 비디오 에디터를 통해 수동으로 영상을 편집하여 다운로드하고 다시 유튜브에 업로드하는 기존 동선은 번거롭고 많은 시간이 소요됩니다. 
이를 해결하기 위해 **AI가 실시간 트렌드 정보를 기반으로 자동으로 쇼츠 영상을 작문/합성하고, 다중 채널(유튜브, 인스타, 틱톡)로 클릭 한 번에 즉시 자동 배포**하는 원스톱 배포 자동화 파이프라인을 구축했습니다.

---

## 2. 시스템 아키텍처 및 구현 사양

통합 배포 솔루션은 크게 세 가지 축으로 구성되어 작동합니다.

```
┌────────────────────────────────────────────────────────┐
│               채널 배포 스튜디오 (Client)               │
└────────────────────────────────────────────────────────┘
     │                    │                     │
     ▼                    ▼                     ▼
┌───────────┐       ┌───────────┐         ┌───────────┐
│ AI Shorts │       │  Storage  │         │ Database  │
│  Engine   │       │ & Upload  │         │  Schema   │
└───────────┘       └───────────┘         └───────────┘
```

### 1) AI 쇼츠 엔진 (AI Shorts Engine)
* **대본 & 구성 기획**: `/api/ai/generate` 엔드포인트를 경유해 공용 Gemini API Key로 기사 및 키워드 기반 대본 작성을 요청합니다.
* **에셋 크롤링**: 사용자의 Pexels API Key 유무에 따라 실시간 vertical 비디오 목록을 Pexels API로 긁어오거나, 크리에이박스에서 자체 보관 중인 고품질 vertical 카테고리별 CDN(Mixkit) 비디오 데이터를 매칭시킵니다.
* **내레이션 (TTS)**: 브라우저 내장 웹 스피치 API(`window.speechSynthesis`)를 사용하여 오프라인이나 추가 비용 없이 한국어 내레이션 음성 출력을 완벽하게 동기화합니다.
* **캔버스 비디오 컴파일러**: `540x960` 세로 해상도 Canvas 위에 각 구간별 비디오 프레임을 30FPS로 정밀 드로잉합니다. 텍스트 단어 타이밍에 맞춰 **알렉스 호모지 스타일(Alex Hormozi Style)**의 강조 자막 효과를 실시간으로 그리고, 선택한 배경 BGM 오디오 소스를 믹싱하여 `MediaRecorder`를 통해 실제 재생 가능한 비디오 파일로 다운로드합니다.

### 2) Supabase 클라우드 저장소 및 파일 업로드
* 렌더링이 완료된 비디오는 클라이언트에서 즉시 Supabase Storage의 **`community`** 버킷 내 `[user_id]/shorts/` 디렉토리로 비동기 업로드됩니다.
* 업로드 완료 후 생성되는 퍼블릭 다운로드 URL을 데이터베이스에 연동하여 영구 보존합니다.

### 3) 데이터베이스 스키마 (`ai_shorts_projects`)
* 생성된 프로젝트는 Supabase의 RLS 정책 하에 유저 본인의 계정에 종속되어 저장됩니다.
* **컬럼 상세**:
  * `id`: UUID (기본키)
  * `user_id`: UUID (외래키)
  * `title`: 비디오 제목
  * `description`: 비디오 설명 및 해시태그
  * `script`: 전체 대본 텍스트
  * `category`: 카테고리 코드 (tech, motivation 등)
  * `keyword`: 검색 세부 키워드
  * `bg_music`: 믹싱된 BGM 명칭
  * `segments`: JSONB 형식 (구간별 대본, 검색 키워드, 매칭 비디오 URL 수록)
  * `video_url`: 렌더링 완료된 스토리지 파일 주소
  * `created_at`: 생성 시각

---

## 3. 사용자 인터페이스 (UI/UX) 흐름

1. **AI 쇼츠 자동 생성기 (첫 번째 메뉴)**:
   * 카테고리, 세부 키워드, 배경음악을 선택하고 `대본 및 영상 기획`을 누르면 AI가 타임라인과 비디오를 조립해 줍니다.
   * `대본 듣기`를 누르면 AI 목소리로 미리 들어볼 수 있으며, `최종 생성 및 전송`을 누르면 실시간 캔버스 합성 진행률이 올라갑니다.
   * 합성 완료 시, 생성된 비디오와 함께 대본 텍스트가 다음 탭인 **SNS 통합 발행** 서식으로 자동 입력됩니다.

2. **SNS 통합 발행 (두 번째 메뉴)**:
   * 연동된 플랫폼(유튜브, 인스타그램, 틱톡) 중 원하는 곳을 선택한 뒤 `자동 배포 시작`을 클릭하면, 여러 플랫폼의 업로드 대기열이 돌며 동시에 자동 발행됩니다.

3. **채널 연동 관리 (세 번째 메뉴)**:
   * 유튜브(구글), 인스타그램(메타), 틱톡 채널을 토글 연동할 수 있는 소셜 OAuth 가상 동의화면 시뮬레이터가 완벽하게 내장되어 정식 오픈 전 동선 검토를 돕습니다.

4. **발행 이력 및 통계 (네 번째 메뉴)**:
   * 통합 배포 이력을 보여주며, **"자동으로 기존 업로드 데이터 가져오기"**를 실행하면 연동 채널의 실시간 영상 조회수와 반응 지표를 파이프라인으로 동기화해 줍니다.

---

## 4. 로컬 및 상용 배포 가이드라인
* **로컬 파일 위치**:
  * 메인 대시보드 컴포넌트: [PublishDashboard.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/publish/components/PublishDashboard.tsx)
  * 라우터 페이지: [studio/publish/page.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/publish/page.tsx)
  * DB 스키마 쿼리: [docs/database/sql/ai-shorts-generator.sql](file:///Users/a1234/Local%20Sites/creaibox/docs/database/sql/ai-shorts-generator.sql)
  * 소셜 인증 검수 가이드: [docs/arch/sns-oauth-api-verification-guide.md](file:///Users/a1234/Local%20Sites/creaibox/docs/arch/sns-oauth-api-verification-guide.md)
