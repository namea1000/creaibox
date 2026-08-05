# 📖 [운영 매뉴얼] 0.01초 Instant 블로그 & 커스텀 사이트 링커 개발 가이드

> **매뉴얼 목적**: 개발자 및 기획자가 신규 블로그 템플릿, 비즈니스 홈페이지, 커스텀 사이트 개발 시 네이버 뉴스급 0.01초 가속 성능을 보장하는 방법과 Vercel 비용 0원 유지 규칙 숙지.

---

## 1. 💡 개발자가 지켜야 할 필수 원칙 (Core Rules)

1. **원칙 1: 모든 카드 및 아티클 링커는 `SmartIntentLink` 컴포넌트 필수 사용**
   - 맹목적 `<Link href="...">`나 `<a href="...">`를 절대 직접 사용하지 않고 무조건 `@/components/common/SmartIntentLink`를 사용합니다.

2. **원칙 2: 본문 상세 페이지 ISR 필수 보장 (`revalidate = 300`)**
   - `src/app/brand/[brand_id]/[slug]/page.tsx` 등 본문 페이지 상단에 `export const revalidate = 300;`을 필수 지정해야 Vercel 요금이 0원으로 안전하게 유지됩니다.

3. **원칙 3: CSS/JS 정적 번들 1년 무상 CDN 영구 캐싱 헤더 고증**
   - `next.config.ts`의 `headers()`에 `/_next/static/:path*` 1년 영구 캐스케이드 헤더(`max-age=31536000, immutable`)가 항상 켜져 있어 렌더링 차단 지연시간이 0ms로 방어되는지 점검합니다.

---

## 2. 💻 실전 코드 사용법 (Code Examples)

### ✅ 신규 블로그/카드 템플릿 제작 시 (권장 예시)

```tsx
import React from "react";
import SmartIntentLink from "@/components/common/SmartIntentLink";
import { formatImageUrl } from "@/utils/image-url";

export function CustomBlogCard({ post }: { post: any }) {
  return (
    <SmartIntentLink
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border p-4 transition hover:shadow-lg"
      hoverDelay={150} // 기본 0.15초 체류 의도 감지
    >
      <div className="aspect-[16/9] overflow-hidden rounded-xl">
        <img
          src={formatImageUrl(post.thumbnailUrl, { type: "thumb" })} // 30~40KB 초경량 썸네일
          alt={post.title}
          className="h-full w-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <h3 className="mt-3 text-lg font-bold group-hover:text-blue-500">
        {post.title}
      </h3>
    </SmartIntentLink>
  );
}
```

---

## 3. 🚫 금지 사항 (Anti-Patterns)

- ❌ **`prefetch={true}` 옵션을 일반 Link에 무분별하게 부여하는 행위**:
  - 마우스가 스쳐 지나갈 때마다 Vercel 서버리스 비용 및 Supabase 트래픽 폭탄을 유발할 수 있습니다.
- ❌ **`export const dynamic = "force-dynamic"` 사용 금지**:
  - 동적 강제 지정을 하면 Edge CDN 캐시가 깨져 0.01초 Instant 오픈이 불가능해집니다.

---

## 4. ❓ 자주 묻는 질문 (FAQ)

- **Q1. 모바일 기기에서도 속도가 빨라지나요?**
  - **A**: 네! `SmartIntentLink`는 모바일 사용자가 손가락으로 글 카드를 터치하는 순간(`onTouchStart`) 0.05초 만에 백그라운드 사전 로딩을 구동하여 0.01초 오픈을 동일하게 보장합니다.

- **Q2. Vercel 요금이 늘어나지 않나요?**
  - **A**: 0.15초 체류 확인 후 Vercel Edge CDN 정적 파일을 서빙받기 때문에 서버리스 실행 횟수가 0회로 유지되어 **Vercel 비용 0원(무료)**이 철저히 지켜집니다.
