# [Architecture Specification] Google Drive Media Proxy & WebP Pipeline

> **문서 분류**: 아키텍처 기술 명세서 (Architecture Spec)  
> **관련 모듈**: `src/app/api/free-assets/proxy/route.ts`, `src/utils/image-url.ts`, `src/lib/google-drive.ts`  
> **시스템 레이어**: Client Browser ↔ Serverless Proxy Route ↔ Google Drive Hosting CDN ↔ Vercel Edge Cache

---

## 1. 아키텍처 파이프라인 (Media Proxy Pipeline Diagram)

```mermaid
flowchart TD
    Client[브라우저 client <img>] -->|GET /api/free-assets/proxy?url=...&type=thumb| Proxy[Proxy API Route]
    
    Proxy -->|1. File ID 추출| Extractor[extractGDriveFileId]
    
    alt download === 'true' (파일 직접 다운로드)
        Proxy -->|Google Drive API OAuth| GDrive[Google Drive Storage]
        GDrive -->|무손실 원본 버퍼 Stream| Proxy
        Proxy -->|Content-Disposition: attachment| Client
    else type === 'thumb' 또는 w 지정 (화면 서빙 최적화)
        Proxy -->|2. Google CDN 최적화 URL 조립| CDNUrl[lh3.googleusercontent.com/d/ID=w800-rw]
        CDNUrl -->|3. 구글 CDN 800px WebP 변환| GoogleCDN[Google Global CDN]
        GoogleCDN -->|30~40KB 초경량 WebP 바이너리| Proxy
        Proxy -->|4. Cache-Control: public, max-age=31536000| VercelEdge[Vercel Edge Cache]
        VercelEdge -->|5. 쾌속 렌더링| Client
    end
```

---

## 2. API 내부 처리 알고리즘 (Internal Processing Specifications)

### 2.1 File ID 파싱 정규식 (URL Formats)
- **Format A**: `https://lh3.googleusercontent.com/d/{FILE_ID}`
- **Format B**: `https://drive.google.com/file/d/{FILE_ID}/view`
- **Format C**: `https://drive.google.com/uc?export=download&id={FILE_ID}`

```typescript
function extractGDriveFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}
```

### 2.2 파라미터별 구글 CDN 변환 옵션 매핑
| `type` 옵션 | `w` 지정값 | 생성되는 구글 CDN 호스팅 파라미터 | 반환 데이터 성격 |
| --- | --- | --- | --- |
| `thumb` (기본값) | 미지정 | `=w800-rw` | 가로 800px 최적화 30~40KB WebP |
| `detail` / `content` | 미지정 | `=w1400-rw` | 가로 1400px 고화질 선명도 99% 100~150KB WebP |
| 자유 지정 | `w=600` | `=w600-rw` | 지정한 가로폭 맞춤 WebP |

### 2.3 Edge CDN 응답 헤더 스펙 (Response Headers Spec)
- `Content-Type`: `image/webp` (또나 원본 MIME 타입)
- `Access-Control-Allow-Origin`: `*` (CORS 완전 해제)
- `Cache-Control`: `public, max-age=31536000, s-maxage=31536000, immutable` (Vercel Edge 1년 영구 캐싱)

---

## 3. 예외 및 Fallback 처리 구조 (Exception Handling)

1. **Google CDN 파라미터 응답 실패 (404/500)**:
   - `getGoogleDriveBuffer(fileId)` 서버 인증 함수로 전환하여 원본 드라이브 파일 버퍼를 직접 안전 스트리밍.
2. **구글 드라이브 접근 불가능/삭제된 파일**:
   - `https://images.unsplash.com/...` 고화질 폴백 이미지로 `302 Redirect` 처리하여 브라우저 엑박 100% 방지.
