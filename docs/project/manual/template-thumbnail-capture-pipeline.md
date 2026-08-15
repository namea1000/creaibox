# 🤖 템플릿 썸네일 자동 캡처 & R2 업로드 파이프라인 매뉴얼

> **경로**: `POST /api/studio/custom-client-site/capture-thumbnail`
> **저장소**: `creaibox-assets/templates/{templateId}/thumbnail.webp`
> **비율**: 9:16 세로형 (720×1280), WebP 90%

---

## 1. 사전 준비 — 환경변수 설정

| 환경변수                   | 설명                             | 예시                        |
| -------------------------- | -------------------------------- | --------------------------- |
| `ADMIN_API_SECRET`       | 캡처 API 호출 보안키             | `your_admin_secret_here`  |
| `R2_ACCOUNT_ID`          | Cloudflare R2 계정 ID            | `your_r2_account_id`      |
| `R2_ACCESS_KEY_ID`       | R2 액세스 키                     | `your_r2_access_key_id`   |
| `R2_SECRET_ACCESS_KEY`   | R2 시크릿 키                     | `your_r2_secret_here`     |
| `NEXT_PUBLIC_R2_CDN_URL` | R2 CDN 공개 URL (slashless)      | `https://pub-xxxx.r2.dev` |
| `NEXT_PUBLIC_SITE_URL`   | 배포된 사이트 URL (일괄 캡처 시) | `https://creaibox.com`    |

---

## 2. API 호출 방법

### ✅ A. 단건 캡처 (특정 템플릿 하나만)

```bash
curl -X POST https://creaibox.com/api/studio/custom-client-site/capture-thumbnail \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: your_admin_secret_here" \
  -d '{
    "templateId": "sotongcheum",
    "targetUrl": "https://creaibox.com/clients/sotongcheum"
  }'
```

**응답 예시:**

```json
{
  "message": "썸네일 캡처 & R2 업로드 완료",
  "templateId": "sotongcheum",
  "r2Key": "templates/sotongcheum/thumbnail.webp",
  "cdnUrl": "https://pub-xxxx.r2.dev/templates/sotongcheum/thumbnail.webp",
  "success": true
}
```

---

### ✅ B. 전체 일괄 배치 캡처 (16개 템플릿 전부)

```bash
curl -X POST https://creaibox.com/api/studio/custom-client-site/capture-thumbnail \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: your_admin_secret_here" \
  -d '{
    "batch": true,
    "baseUrl": "https://creaibox.com"
  }'
```

> **참고**: 16개 템플릿을 순차 캡처하므로 2~5분 소요. Vercel 서버리스 timeout(최대 300초) 내에서 실행.

---

### ✅ C. 특정 썸네일 R2 존재 여부 확인 (GET)

```bash
curl "https://creaibox.com/api/studio/custom-client-site/capture-thumbnail?templateId=sotongcheum"
```

**응답:**

```json
{
  "exists": true,
  "templateId": "sotongcheum",
  "r2Key": "templates/sotongcheum/thumbnail.webp",
  "cdnUrl": "https://pub-xxxx.r2.dev/templates/sotongcheum/thumbnail.webp"
}
```

---

## 3. R2 저장 경로 구조

```
creaibox-assets/
  templates/
    sotongcheum/
      thumbnail.webp        ← 720×1280, WebP 90%, Cache-Control: 1년 immutable
    commufill/
      thumbnail.webp
    creative-media-blog/
      thumbnail.webp
    aura-portfolio/
      thumbnail.webp
    ...
```

---

## 4. 마켓플레이스 UI 연동 구조

```
CUSTOM_TEMPLATES[].thumbnailUrl
  └── getTemplateThumbnailUrl(id)
        └── process.env.NEXT_PUBLIC_R2_CDN_URL + "/templates/" + id + "/thumbnail.webp"
              └── null (CDN 미설정 시)

MarketplaceTab.tsx
  └── tpl.thumbnailUrl != null
        ├── <Image fill src={tpl.thumbnailUrl} />   ← R2 WebP 0.01초 서빙
        └── null → 그라디언트 Fallback + "썸네일 캡처 준비 중"
```

---

## 5. 향후 자동화 확장 계획

| 단계   | 내용                                       | 상태    |
| ------ | ------------------------------------------ | ------- |
| Step 1 | 수동 cURL 일괄 캡처                        | ✅ 현재 |
| Step 2 | Admin Panel UI 버튼 ("전체 썸네일 재생성") | 🔜 예정 |
| Step 3 | 새 템플릿 등록 시 webhook 자동 캡처        | 🔜 예정 |
| Step 4 | Vercel Cron (월 1회 자동 갱신)             | 🔜 예정 |

---

## 6. Anti-Patterns (금지 패턴)

- ❌ `iframe` 라이브 프리뷰를 마켓플레이스 카드에 재도입 — 네트워크 트래픽 폭탄, 메뉴 이동 지연 원인
- ❌ `thumbnailUrl`에 `localhost` URL 하드코딩 — 프로덕션 배포 시 이미지 로드 불가
- ❌ `batch: true` 호출을 개인 브라우저 탭에서 장시간 열어두기 — 서버리스 timeout 위험, cURL 권장
