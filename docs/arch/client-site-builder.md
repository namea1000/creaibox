# AI 홈페이지 제작 스튜디오 아키텍처 (Operational Documentation)

본 문서는 CreAIbox 플랫폼 내의 **"AI 홈페이지 제작 스튜디오"** 모듈의 시스템 구조, UI 분기, 데이터베이스 스키마 및 핵심 비즈니스 로직을 설명하는 운영 매뉴얼입니다.

---

## 1. 목적 (Purpose)
- B2B 사용자가 기존 소스 데이터(블로그, 공식 소개글 등)를 활용하여 단 몇 초 만에 AI 기반 전문 기업 홈페이지를 자동 기획 및 개설하도록 지원합니다.
- 동적 데이터 기반 헤드리스 CMS 아키텍처를 도입하여, 코딩 없이 메인 디자인 섹션 편집, 공지사항/블로그 글 관리, 고객 문의 접수 처리가 가능하도록 설계되었습니다.

---

## 2. 주요 기능 (Main Features)
1. **AI 홈페이지 자동 기획 & 빌드**: 입력된 소스 URL을 크롤링/LLM 분석하여 비즈니스 적합 테마 추천 및 고해상도 카피 문구가 주입된 섹션 구조 초안 도출.
2. **워드프레스식 디자인 테마 라이브러리**: 카테고리별(Business, Education, Food, Portfolio) 테마 탐색, 상세 스펙(글꼴, 6색 컬러 칩) 시각화 및 원클릭 적용.
3. **디자인 & 섹션 편집기**: 마우스 드래그 앤 드롭 및 인라인 편집을 통한 실시간 홈페이지 레이아웃 조정, 섹션 추가/삭제 및 텍스트 교체.
4. **고객 문의 관리 (CRM)**: 외부 독립 페이지 문의 폼에서 수집된 유입 리드 내역 조회, 상담 처리 상태 변경 및 상담 관리자 메모 작성.
5. **페이지 및 글 관리 (CMS)**: 홈페이지 내부 4대 정적 페이지 구조 모니터링, 공지사항(`notice`) 및 마케팅 블로그(`board`) 글 CRUD 및 상단 고정 관리.
6. **마스터 정보 설정**: 공식 회사명, 주소, 연락처, 노출 SNS 프로필 링크 및 구글 애널리틱스(GA4) 추적 스크립트 연동 관리.

---

## 3. UI 구조 (UI Structure)
모든 서브 경로는 `/studio/client-site-builder/layout.tsx` 내의 전역 레이아웃 및 상태 동기화 컨텍스트(`SiteBuilderProvider`)를 공유합니다.

```
/studio/client-site-builder
├── (layout.tsx) ────────── [전역 세션/비즈니스 요금제 검증, 마스터 헤더, 서브 탭 GNB]
├── page.tsx ────────────── [대시보드 홈: At a Glance 요약 통계, 최근 문의 리스트]
├── builder/page.tsx ────── [AI 빌더: 생성 마법사(신규) 및 섹션 실시간 편집기(기존)]
├── themes/page.tsx ─────── [테마 라이브러리: WordPress형 테마 스토어 및 상세 스펙]
├── inquiries/page.tsx ──── [고객 문의 관리: 접수된 상담 예약 내역 및 관리자 메모]
├── posts/page.tsx ──────── [페이지 & 글 관리: 서브 페이지 및 공지/블로그 글 CRUD]
└── settings/page.tsx ───── [홈페이지 설정: 마스터 회사 정보 및 GA4/SNS 설정]
```

---

## 4. 데이터베이스 구조 (Database Structure)
Supabase DB 내 3개 핵심 테이블을 활용합니다.

1. **`client_sites` (홈페이지 마스터)**:
   - `profile_id` (참조: `profiles.id`), `brand_id` (서브도메인 브랜드 키), `template_id` (활성 테마 ID), `company_name` (회사명), `phone`, `address`, `extra_configs` (사업자번호, SNS 링크, GA4 ID 등 JSON).
2. **`site_sections` (메인 동적 섹션)**:
   - `site_id` (참조: `client_sites.id`), `section_type` (`hero`, `services`, `about`, `portfolio`, `rental`, `contact`), `sort_order`, `title`, `subtitle`, `content_data` (하위 요소 데이터 JSON).
3. **`site_posts` (문의 내역 및 게시글)**:
   - `site_id` (참조: `client_sites.id`), `post_type` (`notice` 공지, `board` 블로그, `inquiry` 문의), `title`, `content`, `author_name`, `is_pinned` (상단 고정), `views`, `extra_data` (상태값 및 상담 메모 JSON).

---

## 5. API 구조 (API Structure)
- `POST /api/client-site-builder/plan`: 블로그 등 외부 URL을 분석하여 홈페이지 뼈대 기획서(JSON)를 도출하는 AI 기획 수립 API.
- `POST /api/client-site-builder/build`: 사용자가 승인한 기획서 데이터를 기반으로 사이트 마스터 및 섹션 데이터를 일괄 적재하는 사이트 빌드 API.
- `POST /api/client-site-builder/upload`: 이미지 업로드 시 sharp 모듈을 통해 고성능 WebP 포맷 최적화 변환 후 Google Drive 사용자 격리 폴더에 업로드하고 direct CDN 링크를 발급하는 스토리지 API.

---

## 6. 컴포넌트 구조 (Component Structure)
- `SiteCreationWizard.tsx`: 홈페이지가 아직 없거나 신규 추가할 때 실행되는 2단계 AI 기획 마법사.
- `SectionEditor.tsx`: 드래그 앤 드롭 및 우측 추가 섹션 패널, 인라인 텍스트 조정을 담은 실시간 비주얼 에디터.
- `InquiryManager.tsx`: 문의 리스트 테이블 및 상세 상태 변경/메모 관리 분할 패널.
- `TemplateSelector.tsx`: 신속 테마 스위칭 인라인 모달.
- `UpgradeModal.tsx`: Pro 등급 이하 사용자 진입 차단 안내 및 상담 신청 모달.

---

## 7. 향후 확장 방향 (Future Expansion)
- **블로그 & 포스트 렌더링 연동**: 동적 렌더러(`/clients/dynamic-renderer`) 단에 게시판 및 블로그 글 상세 뷰(`/notice/[id]`, `/blog/[id]`) 렌더링 로직 연동.
- **다중 페이지 추가 개설**: 마스터 페이지 에디터 단에서 사용자가 원클릭으로 커스텀 서브 페이지를 신설하고 섹션을 직접 배치할 수 있는 고도화 에디터 지원.
