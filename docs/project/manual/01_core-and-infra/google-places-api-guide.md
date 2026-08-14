# 📖 Google Places API 서비스 구축 및 연동 가이드 (Google Places Guide)

본 매뉴얼은 CreaiBox의 **Strict Zero Fake Data Rule(가짜 데이터 생성 100% 절대 금지)** 원칙을 완벽히 수호하면서, AI 로컬 맛집/여행 블로그 포스팅 자동 생성, 커스텀 웹사이트 주소 자동완성(Autocomplete) 및 상권 분석 서비스를 구축하기 위한 **Google Places API** 전용 기술 매뉴얼입니다.

---

## 1. 🥇 Google Places API 핵심 개요

Google Places API는 전 세계 2억 개 이상의 매장, 건물, 관광지, 명소에 대한 실시간 정밀 데이터베이스를 제공합니다.

| 제공 데이터 종류 | 세부 내용 및 파싱 정보 | CreaiBox 활용 분야 |
| :--- | :--- | :--- |
| **장소 기본 정보** | 정식 장소명, 도로명 주소, 지번 주소, 위도·경도 좌표, 전화번호, 웹사이트 URL | 커스텀 웹사이트 매장 정보, 블로그 위치 지점 |
| **별점 및 사용자 평점** | 구글 실시간 별점 (예: ⭐ 4.8 / 5.0), 총 사용자 평점 개수 | 진짜 맛집/명소 검증 지표 |
| **실제 이용자 후기 (Reviews)** | 실제 방문자 텍스트 후기, 작성자 정보, 별점, 작성 시각 | AI 블로그 원고 작성 시 진짜 후기 분석 요약 |
| **영업 상태 & 시간** | 현재 영업 여부(Open Now), 요일별 영업시간, 정기 휴무일 | 상점 정보 팝업 모달, 매장 안내 카드 |
| **고화질 장소 사진** | 매장 외관, 내부 인테리어, 대표 음식/메뉴 고화질 이미지 | 포스팅 원고 대표 썸네일 및 본문 이미지 |
| **주소 자동완성 (Autocomplete)** | 몇 글자 입력 시 관련 주소/장소명 실시간 추천 | 회원가입, 배송지, 매장 주소 입력 서식 |

---

## 2. 🚀 CreaiBox 3대 실전 구축 서비스 모델

### 모델 1: AI 맛집/여행 블로그 포스팅 엔진 (Zero-Fake Writer)
- **개념**: 사용자가 `"성수동 카페"` 또는 `"제주도 가성비 흑돼지"` 키워드를 입력하면, Places API를 통해 **100% 진짜 매장의 실시간 별점, 주소, 사진, 실제 손님 후기**를 수집.
- **AI 원고 결합**: AI 카피라이터가 수집된 진짜 팩트 데이터와 실제 후기를 토대로 블로그 포스팅 원고를 자동 구성하여 상위 노출(C-Rank 점수 상승) 달성.

### 모델 2: 커스텀 웹사이트 빌더 주소 자동완성 (`/client-site-builder`)
- **개념**: 소상공인/기업 고객이 홈페이지 제작 시 매장 주소를 입력할 때 `Google Places Autocomplete`를 연동하여 오타 없는 정확한 도로명 주소와 위경도 좌표를 1초 만에 입력.

### 모델 3: 실시간 주변 상권 & 추천 장소 팝업 모달
- **개념**: 특정 매장 주변 1km 이내의 연관 추천 장소(주차장, 지하철역, 카페 등)를 팝업 모달 카드 형태로 조회 시각화.

---

## 3. 💡 90% 비용 절감을 위한 핵심 기술: Field Masking (`X-Goog-FieldMask`)

Google Places API (New/v1)는 요청 시 **`X-Goog-FieldMask` 헤더**를 통해 정확히 필요한 데이터만 선택 호출하면 비용을 최대 90% 이상 절감할 수 있습니다.

- **기본 전용 호출 (Basic Fields - 최저 비용)**: `places.displayName`, `places.formattedAddress`, `places.location`
- **고급 전용 호출 (Advanced Fields)**: `places.rating`, `places.userRatingCount`, `places.regularOpeningHours`
- **프리미엄 전용 호출 (Premium Fields)**: `places.reviews`, `places.photos`

---

## 4. 💻 TypeScript / Next.js 실전 구현 스니펫

### 4.1 Google Places Text Search (New API) 수집 스니펫
```typescript
interface PlaceSearchResult {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
  websiteUri?: string;
}

export async function searchRealPlaces(query: string): Promise<PlaceSearchResult[]> {
  const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_MAPS_SERVER_API_KEY가 없습니다.");

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      // Field Masking으로 필요한 필드만 지정하여 비용 극대화 절감!
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri",
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: "ko",
      maxResultCount: 5,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Places API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.places || [];
}
```

### 4.2 Places Autocomplete (클라이언트 주소 자동완성 연동)
```typescript
import { useEffect, useRef } from "react";

export function useGooglePlacesAutocomplete(onSelect: (place: any) => void) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["establishment", "geocode"],
      componentRestrictions: { country: "kr" }, // 한국 장소 우선
      fields: ["place_id", "geometry", "name", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onSelect(place);
      }
    });
  }, [onSelect]);

  return inputRef;
}
```

---

## 5. 📅 업데이트 및 유지보수 이력

- **2026-07-30**: CreaiBox Google Places API 전용 구축 및 연동 매뉴얼 작성 완료.
