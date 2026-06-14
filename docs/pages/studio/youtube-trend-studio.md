# 유튜브 트렌드 스튜디오 화면 정의서 (Page Specification)

이 문서는 유튜브 트렌드 분석 스튜디오 및 상세 화면들의 라우팅 주소와 동작 범위를 기록한 사양서입니다.

---

## 1. 메인 홈 화면
* **경로**: `/studio/youtube` -> `src/app/studio/youtube/page.tsx`
* **설명**: 유튜브 트렌드 스튜디오의 핵심 제어 대시보드. 메인 통계 요약 카드, 10대 상세 서브 분석 도구 네비게이션 그리드, 빠른 키워드 클라우드로 구성되어 있습니다.

---

## 2. 동적 상세 분석 도구
* **경로**: `/studio/youtube/[section]` -> `src/app/studio/youtube/[section]/page.tsx`
* **설명**: URL의 동적 파라미터 `[section]` 세그먼트 매개변수를 식별하여 아래 매핑 컴포넌트를 레이아웃 본문에 탑재합니다.

### 2-1. 채널 상세 분석
* **세그먼트**: `/studio/youtube/channel` -> [ChannelDetail.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/ChannelDetail.tsx)
* **기능**: 특정 채널 핸들 검색 시 프로필, 구독자/조회수 통계 및 최신 비디오 목록 로드.

### 2-2. 급상승 영상 트렌드
* **세그먼트**: `/studio/youtube/rising` -> [RisingVideos.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/RisingVideos.tsx)
* **기능**: 대한민국 유튜브 인기 급상승 차트 수집 썸네일 노출.

### 2-3. 경쟁 채널 비교
* **세그먼트**: `/studio/youtube/compare` -> [ChannelCompare.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/ChannelCompare.tsx)
* **기능**: 두 채널을 1:1 스캔하여 핵심 구독/조회 지수 강도 비교바 차트 구성.

### 2-4. 광고 단가 계산기
* **세그먼트**: `/studio/youtube/cpm` -> [CpmCalculator.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/CpmCalculator.tsx)
* **기능**: 조회수, CPM, 게재율 슬라이더 조절을 통한 실시간 수익 및 RPM 예상표 제공.

### 2-5. 유튜브 SEO 분석
* **세그먼트**: `/studio/youtube/seo` -> [YoutubeSeo.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/YoutubeSeo.tsx)
* **기능**: 영상 메타데이터의 글자수, 태그 개수를 점검해 SEO 종합 지수 진단서 출력.

### 2-6. 쇼츠 바이럴 분석
* **세그먼트**: `/studio/youtube/shorts` -> [ShortsViral.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/ShortsViral.tsx)
* **기능**: 시청 시간별 이탈 곡선 시뮬레이션 및 반복 재생 루프 체크리스트 진단.

### 2-7. 썸네일 CTR 연구소
* **세그먼트**: `/studio/youtube/thumbnail` -> [ThumbnailCtr.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/ThumbnailCtr.tsx)
* **기능**: 입력 텍스트와 배경색 썸네일을 홈 피드 경쟁작들 사이에 배치해 가시성 리뷰.

### 2-8. AI 제목 생성기
* **세그먼트**: `/studio/youtube/title` -> [AiTitleGenerator.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/AiTitleGenerator.tsx)
* **기능**: Gemini API 호출을 활용해 키워드와 스타일에 걸맞은 고유 5가지 추천 영상 제목 생성.

### 2-9. 콘텐츠 전략 리포트
* **세그먼트**: `/studio/youtube/report` -> [StrategyReport.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/StrategyReport.tsx)
* **기능**: 채널 포지셔닝안 및 4주차 스케줄 캘린더 리포트 구성.

### 2-10. 유튜브 자동 제작 연결
* **세그먼트**: `/studio/youtube/workflow` -> [VideoWorkflow.tsx](file:///Users/a1234/Local%20Sites/creaibox/src/app/studio/youtube/%5Bsection%5D/components/VideoWorkflow.tsx)
* **기능**: 태그 SEO와 시나리오 대본 연동을 마친 후 각 스튜디오 제작 툴로 연계 파이프라인.
