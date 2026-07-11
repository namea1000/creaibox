# 오픈 그래프(Open Graph) 가이드 및 SEO 썸네일 매칭 리스트

이 문서는 크리에이박스(CreAibox) 서비스의 검색엔진 최적화(SEO) 및 네이버/구글 검색 결과창 옆에 대표 이미지(썸네일)를 띄우기 위한 오픈 그래프(OG) 이미지 설정 가이드입니다.

---

## 1. 오픈 그래프(Open Graph) 작동 원리

오픈 그래프는 Facebook에서 시작된 프로토콜로, 웹페이지가 SNS(카카오톡, 페이스북, 슬랙)에 공유되거나 검색엔진(네이버, 구글)에 인덱싱될 때 **페이지의 대표 이미지, 제목, 설명글을 예쁜 카드로 표현할 수 있도록 전달해 주는 메타데이터 규격**입니다.

### 🔍 작동 프로세스
1. 네이버 로봇(`Yeti`) 또는 구글 로봇(`Googlebot`)이 크리에이박스 사이트를 주기적으로 크롤링합니다.
2. 페이지 소스코드 `<head>` 안의 `<meta property="og:image" content="..." />` 태그 정보를 수집합니다.
3. 네이버 검색결과(SERP) 페이지를 구성할 때, 수집한 이미지 정보를 가져와 개별 사이트 링크 오른쪽에 정방형/직사각형 형태로 노출합니다.

---

## 2. Next.js App Router 구현 및 상속(Fallback) 설계

### 🛠️ Next.js 구현 방식
Next.js App Router 구조에서는 각 라우트 폴더 내의 `page.tsx` 또는 `layout.tsx` 파일에 `Metadata` 객체를 리턴하여 메타데이터를 선언합니다.

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "유튜브 트렌드 분석 | 크리에이박스 CreAibox",
  description: "크리에이박스에서 제공하는 고도화된 유튜브 분석 도구입니다.",
  openGraph: {
    title: "유튜브 트렌드 분석 | 크리에이박스 CreAibox",
    description: "크리에이박스에서 제공하는 고도화된 유튜브 분석 도구입니다.",
    url: "https://creaibox.com/youtube-trend",
    images: [
      {
        url: "https://creaibox.com/images/seo/youtube-trend.png", // public 폴더 기준 절대경로
        width: 1200,
        height: 630,
        alt: "유튜브 트렌드 분석 대표 이미지",
      },
    ],
  },
};
```

### ⚡ 상속(Fallback) 최적화 설계
네이버 검색창에는 서브 라우트(예: `/utility-tools/bg-remover`, `/utility-tools/ocr` 등) 수십 가지가 개별 노출됩니다. 모든 페이지의 썸네일을 각각 만들 필요 없이, 아래와 같이 상속 구조를 설계합니다.

* **최상위 Fallback**: 최하위 페이지에 `og:image`가 누락된 경우, `layout.tsx`에 선언된 최상위 `main.png`를 노출합니다.
* **대분류 상속 (권장)**: `/utility-tools/[tool-name]` 등의 하위 라우트들은 부모 레이아웃(`src/app/utility-tools/layout.tsx`)에 메타데이터를 1번만 설정하여 하위 페이지들이 모두 대표 썸네일 `utility-tools.png`를 상속받아 공유하도록 코딩합니다.
* **결과**: 유저님은 대분류 메뉴 기준 **12개 대표 캡처**만 만들어 주시면 검색창 내 수백 개의 하위 페이지까지 한 번에 다 커버됩니다.

---

## 3. 네이버 검색 썸네일 노출 꿀팁

> [!IMPORTANT]
> **1. 반드시 '절대 경로' 주소를 사용해야 합니다.**
> 네이버 봇은 상대 경로(`/images/seo/main.png`)를 올바르게 인식하지 못하는 경우가 빈번하므로, 반드시 도메인을 포함한 풀 URL인 **`https://creaibox.com/images/seo/main.png`** 형태로 지정해 주어야 신뢰성 있게 긁어갑니다.

> [!TIP]
> **2. 썸네일 이미지 권장 규격**
> * 가로세로 비율: **1200 x 630 px** (1.91:1 비율) 또는 모바일에 최적화된 **1:1 비율** (예: 600x600 px)
> * 포맷: 투명도가 필요 없는 스크린샷인 경우 무손실 압축인 **`PNG`** 포맷을 권장합니다.

> [!NOTE]
> **3. 네이버 서치어드바이저 수집 요청**
> 이미지를 서버 `/public/images/seo/` 폴더에 배포 완료한 뒤, [네이버 서치어드바이저(웹마스터 도구)](https://searchadvisor.naver.com/)에 로그인하여 **[검색 요청 ➔ 웹페이지 수집]** 란에 페이지 URL을 입력해 주시면 수집 봇이 1~2일 내로 갱신하여 검색 결과창에 반영합니다.

---

## 4. 대표 12종 스크린샷 썸네일 매칭 테이블

유저님이 캡처하신 후 저장 및 배포할 때 그대로 사용하실 수 있는 파일 이름 및 매핑 리스트입니다.

| 번호 | 대상 서비스 (대분류) | 대표 URL 경로 | 물리적 배포 경로 (`public/` 기준) | 스크린샷 추천 구성안 |
| :---: | :--- | :--- | :--- | :--- |
| **1** | 메인 홈 페이지 | `/` | `/images/seo/main.png` | 로그인 전 인트로 화면 또는 크리에이박스 메인 대시보드 |
| **2** | 유튜브 트렌드 분석 | `/youtube-trend` | `/images/seo/youtube-trend.png` | 유튜브 실시간 분석 리포트 또는 차트 화면 |
| **3** | 키워드 트렌드 분석 | `/keyword-trend` | `/images/seo/keyword-trend.png` | 키워드 대량 조회/분석 그래프 화면 |
| **4** | 스튜디오 Tools | `/utility-tools` | `/images/seo/utility-tools.png` | 누끼 제거, PDF 분석 등 전체 툴킷 메뉴판 화면 |
| **5** | AI 콘텐츠 플래너 | `/content-planner` | `/images/seo/content-planner.png` | 플래너 캘린더 및 기획 워크플로우 화면 |
| **6** | 비즈니스 제안 | `/business` | `/images/seo/business.png` | 엔터프라이즈 맞춤형 및 제휴 파트너십 화면 |
| **7** | 요금제 가격 안내 | `/pricing` | `/images/seo/pricing.png` | 우리가 리뉴얼 완료한 프리미엄 요금제 4종 비교표 |
| **8** | 가이드 센터 | `/guide` (네이버 가이드) | `/images/seo/guide.png` | 크리에이터 블로그 글쓰기 최적화 가이드 화면 |
| **9** | 고객 지원 및 도움말 | `/help` (인포센터 Q&A) | `/images/seo/help.png` | 자주 묻는 질문(FAQ) 및 1:1 고객 문의 게시판 |
| **10** | 커뮤니티 공간 | `/community` | `/images/seo/community.png` | 실시간 수다방 및 협업 프로젝트 진행방 화면 |
| **11** | 공식 블로그 | `/blog` | `/images/seo/blog.png` | 크리에이박스 서비스 소식 및 발행 리스트 화면 |
| **12** | 개인정보/이용약관 | `/privacy` / `/terms` | `/images/seo/privacy.png` | 정책 텍스트 영역 또는 약관 화면 |
