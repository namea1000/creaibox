# 📖 [운영 매뉴얼] 구글 드라이브 이미지 웹 최적화 & 프록시 사용 실무 가이드

> **매뉴얼 목적**: 개발자 및 운용진이 블로그/웹사이트에 이미지를 표시할 때 CORS 엑박을 방지하고, 썸네일(30~40KB)과 본문(100~150KB)을 올바르게 활용하는 방법 가이드.

---

## 1. 💡 2가지 스마트 분리 서빙 규칙 (Serving Rules)

이미지 서빙 시 화면 용도에 맞게 옵션을 지정하면 **속도 가속과 화질 보존 두 마리 토끼**를 모두 잡을 수 있습니다.

| 사용 위치 | 추천 옵션 | 사용 코드 | 용량 효과 |
| --- | --- | --- | --- |
| **블로그 목록 / 카드 썸네일** | `type: "thumb"` | `formatImageUrl(url, { type: "thumb" })` | **30~40KB 초경량 (85% 절감)** |
| **블로그 본문 상세 보기** | `type: "detail"` | `formatImageUrl(url, { type: "detail" })` | **100~150KB 고화질 선명 보존** |
| **원본 이미지 다운로드** | `download: true` | `/api/free-assets/proxy?url=...&download=true` | 원본 무손실 파일 다운로드 |

---

## 2. 💻 실전 개발 코드 예시 (Code Examples)

### ✅ 1) 블로그 목록 썸네일 표시 시 (카드용)
```tsx
import { formatImageUrl, handleImageError } from "@/utils/image-url";

<img
  src={formatImageUrl(post.thumbnailUrl, { type: "thumb" })} // 30~40KB 경량화
  alt={post.title}
  onError={handleImageError}
  className="w-full h-full object-cover"
/>
```

### ✅ 2) 블로그 본문 상세 이미지 표시 시
```tsx
import { formatImageUrl } from "@/utils/image-url";

<img
  src={formatImageUrl(contentImageUrl, { type: "detail" })} // 1400px 고화질 선명도 99%
  alt="본문 상세 이미지"
  className="w-full h-auto rounded-xl"
/>
```

---

## 3. ❓ 자주 묻는 질문 & 트러블슈팅 (FAQ)

- **Q1. 이미지가 깨지거나 엑박이 나지 않나요?**
  - **A**: 프록시 API가 구글 서비스 계정 인증 및 폴백 302 리다이렉트 기능을 가지고 있으므로 엑박이 전혀 나지 않습니다.

- **Q2. 구글 드라이브 원본 파일이 손상되나요?**
  - **A**: 아닙니다! 구글 드라이브 보관함에는 원본 파일이 그대로 보존되며, 오직 웹 브라우저에 표시될 때만 실시간 WebP 가공으로 변환 서빙됩니다.
