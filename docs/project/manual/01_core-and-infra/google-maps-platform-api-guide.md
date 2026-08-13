# 📖 Google Maps Platform API 서비스 구축 및 연동 가이드 (Google Maps Guide)

본 매뉴얼은 CreAibox 서비스(AI 커스텀 웹사이트 빌더, 로컬 맛집/여행 AI 블로그 글쓰기, 위치 기반 서비스 등)에 **Google Maps Platform API**를 도입하여 차세대 위치 기반 AI 서비스를 구축하기 위한 기술 기획 및 연동 가이드입니다.

---

## 1. 🥇 Google Maps Platform 3대 핵심 API 그룹

Google Maps Platform은 세계 최고 정확도의 위치 및 장소 지능형 데이터를 제공하며, 크게 3가지 핵심 API 그룹으로 구성됩니다.

| API 그룹 | 주요 제공 기능 | CreAibox 적용 분야 |
| :--- | :--- | :--- |
| **Places API** | 전 세계 장소 검색, 매장 정보, 별점 평점, 실제 이용자 리뷰, 사진, 주소 자동완성(Autocomplete) | AI 로컬 맛집/여행 블로그 포스팅, 주소 자동 입력 서식 |
| **Maps JavaScript / Embed API** | 커스텀 핀/마커, 다크모드/네온 3D 커스텀 지도 시각화, 스트리트 뷰(Street View) | AI 커스텀 웹사이트 매장 위치 지도, 부동산/상권 3D 지도 |
| **Routes / Distance Matrix API** | 이동 경로, 자동차/도보/대중교통 이동 시간 및 최단 거리 계산 | AI 여행 일정 최적화 코스 기획, 배달/방문 서비스 동선 |

---

## 2. 🚀 CreAibox 실전 서비스 연동 5대 비즈니스 과제

### 과제 1: AI 커스텀 웹사이트 빌더 (`/client-site-builder`) 지도 & 주소 자동완성
- **기능**: 소상공인/기업 고객의 랜딩페이지 생성 시 업체의 위치를 다크모드/네온 스타일의 3D 지도로 1초 만에 자동 생성.
- **주소 자동완성**: 회원가입, 배송지 입력, 예약 폼 작성 시 Google Places Autocomplete로 주소 입력을 자동화.
- **길찾기 연동**: 지도 핀 클릭 시 구글 맵 / 카카오내비 앱으로 즉시 길찾기 앱 연동.

### 과제 2: AI 맛집/여행 블로그 자동 글쓰기 (100% 진짜 장소 데이터 주입)
- **Zero Fake Data 원칙 준수**: 가짜 장소/후기를 임의 생성하지 않고, Google Places API를 수집하여 **실제 매장의 별점, 리뷰 수, 영업시간, 대표 사진, 위치 지도**를 100% 실시간 수집.
- **C-Rank 상위 노출 원고 생성**: 진짜 장소 데이터 및 지도 핀이 포함된 고품질 블로그 원고를 AI로 즉시 포스팅 생성.

### 과제 3: AI 맞춤형 여행 일정 & 동선 최적화 서비스
- **동선 최적화 (Distance Matrix)**: `"도쿄 3박 4일 여행 코스"` 기획 요청 시 장소 간 최단 이동 경로와 소요 시간을 계산하여 동선 낭비 없는 3D 코스 지도 시각화.

### 과제 4: 위치 기반(LBS) 상권 및 주변 시설 탐색기
- **Nearby Search**: 사용자 현재 위치 반경 1km/5km 이내의 카페, 병원, 헬스장, 주차장 핀 마커 탐색.

### 과제 5: 스트리트 뷰 (Street View API) 360도 현장 체험
- **현장 실감 뷰**: 웹 브라우저에서 실제 매장/건물 외관을 360도 3D VR로 둘러보기 제공.

---

## 3. 💰 무료 크레딧 & 비용 관리 가이드

- **매월 $200 (약 27만원) 무료 크레딧 자동 지급**:
  - Google Cloud Platform 계정 보유 시 매월 $200 크레딧이 자동 갱신됩니다.
  - **월 약 28,000건의 지도 로드** 및 **주소 검색(Autocomplete)을 무료**로 자유롭게 구동할 수 있습니다.
- **보안 설정 (API Key Protection)**:
  - Google Cloud Console(`console.cloud.google.com`) ➔ API 및 서비스 ➔ 사용자 자격 증명
  - **HTTP 리퍼러(웹사이트) 제한**: `https://creaibox.com/*`, `https://*.creaibox.com/*`, `http://localhost:3000/*` 등록하여 무단 도용 방지.

---

## 4. 💻 연동 코드 스니펫 예시

### 4.1 Google Maps JavaScript API 로더
```typescript
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: "weekly",
  libraries: ["places"],
});

export async function initGoogleMap(element: HTMLElement, lat: number, lng: number) {
  const { Map } = await loader.importLibrary("maps");
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");

  const map = new Map(element, {
    center: { lat, lng },
    zoom: 16,
    mapId: "CREAIBOX_DARK_MAP_ID", // 커스텀 다크모드 Map ID
  });

  new AdvancedMarkerElement({
    map,
    position: { lat, lng },
    title: "CreAibox 파트너 매장",
  });

  return map;
}
```

### 4.2 Places API 맛집/장소 정보 수집 API 스니펫
```typescript
export async function fetchPlaceDetails(placeQuery: string) {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeQuery)}&key=${apiKey}&language=ko`;
  
  const res = await fetch(url);
  const data = await res.json();

  if (data.results && data.results.length > 0) {
    const place = data.results[0];
    return {
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      location: place.geometry.location,
      photos: place.photos?.map((p: any) => p.photo_reference) || [],
    };
  }
  return null;
}
```

---

## 5. 📅 업데이트 및 유지보수 이력

- **2026-07-30**: CreAibox Google Maps Platform API 통합 구축 가이드 초안 최초 작성 등록 완료.
