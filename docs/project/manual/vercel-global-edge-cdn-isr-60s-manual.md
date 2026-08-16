# CreaiBox Vercel Global Edge CDN (ISR 60s) 실무 개발 & 운용 매뉴얼

> **문서 경로**: `docs/project/manual/vercel-global-edge-cdn-isr-60s-manual.md`  
> **대상**: 프론트엔드/풀스택 개발자 및 사이트 제작 담당자  
> **목적**: 신규 공개 페이지/블로그 제작 시 0.01초 광속 서빙 표준을 100% 구현하기 위한 실전 가이드

---

## 1. 0.01초 광속 서빙 3대 필수 원칙 (Quick Checklist)

새로운 공개 페이지나 블로그 템플릿을 개발할 때 아래 3가지를 반드시 확인해야 합니다.

- [ ] **원칙 1**: 파일 상단에 `export const revalidate = 60;`을 선언했는가?
- [ ] **원칙 2**: Server Component에서 `cookies()`, `headers()` 등 동적 요청 객체를 직접 호출하지 않고 Client Component로 위임했는가?
- [ ] **원칙 3**: 데이터 조회를 React `cache()`로 래핑하여 중복 DB 쿼리를 방지했는가?

---

## 2. 바로 복사해서 쓰는 추천 코드 템플릿

### 2.1. 정적 공개 페이지 (예: 소개, 랜딩, 공지)

```tsx
import React from "react";
import type { Metadata } from "next";

// 🌟 Vercel Global Edge CDN Incremental Static Regeneration (ISR 60s 광속 캐시)
export const revalidate = 60;

export const metadata: Metadata = {
  title: "서비스 소개 | 크리에이박스 CreaiBox",
  description: "AI 기반 올인원 콘텐츠 및 웹사이트 제작 플랫폼",
};

export default async function PublicPage() {
  return (
    <div className="min-h-screen">
      {/* 콘텐츠 영역 */}
    </div>
  );
}
```

### 2.2. 동적 블로그/포스트 상세 페이지 (`[slug]/page.tsx`)

```tsx
import React, { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/utils/supabase/server";
import PostViewTracker from "@/components/blog/PostViewTracker";

// 🌟 1. ISR 60초 글로벌 캐시 선언
export const revalidate = 60;

// 🌟 2. React cache()로 DB 조회 중복 제거
const getPostData = cache(async (slug: string) => {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("writing_creaibox_posts")
    .select("id, title, content, slug, created_at")
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);

  return data?.[0] || null;
});

// 🌟 3. 빌드 시점 사전 렌더링 (인기 글 즉시 캐시)
export async function generateStaticParams() {
  const supabase = await createAdminClient();
  const { data: posts } = await supabase
    .from("writing_creaibox_posts")
    .select("slug")
    .eq("status", "published")
    .limit(30);

  return (posts || []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug);
  return {
    title: post?.title || "블로그 포스트",
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) notFound();

  return (
    <article className="max-w-4xl mx-auto py-12 px-6">
      {/* 🌟 4. 비차단 비동기 조회수 트래커 */}
      <PostViewTracker postId={post.id} />
      
      <h1 className="text-3xl font-black">{post.title}</h1>
      <div className="mt-8 prose dark:prose-invert">{post.content}</div>
    </article>
  );
}
```

---

## 3. 🚫 절대 금지 패턴 (Anti-Patterns)

### ❌ 금지 1: Server Component에서 `await cookies()` 직접 호출
```tsx
// ❌ 나쁜 예: Server Component에서 쿠키를 읽으면 Next.js가 ISR을 강제로 끄고 매번 느린 SSR로 전환됨!
export default async function BadPage() {
  const cookieStore = await cookies(); // ❌ ISR 무효화!
  const theme = cookieStore.get("theme")?.value;
  ...
}

// ⭕ 좋은 예: 테마나 UI 상태는 Client Component Wrapper 내부의 localStorage나 useEffect로 처리
export default async function GoodPage() {
  return <ClientWrapper initialTheme="light" />; // ⭕ 100% Edge CDN 캐시 유지
}
```

### ❌ 금지 2: 페이지 렌더링 중 동기적 DB Update 실행
```tsx
// ❌ 나쁜 예: SSR 렌더링 중에 DB 쓰기(Write)를 실행하여 500ms 지연 유발
await supabase.from("posts").update({ views: views + 1 }).eq("id", id);

// ⭕ 좋은 예: 클라이언트 컴포넌트(<PostViewTracker />)에서 브라우저 로딩 후 백그라운드 1회 전송
<PostViewTracker postId={post.id} />
```

---

## 4. 자주 묻는 질문 (FAQ)

**Q1. 글을 수정했는데 60초 동안 예전 글이 보이나요?**  
A. 기본적으로 60초가 지난 후 첫 방문자가 들어오면 백그라운드에서 자동 갱신됩니다. 만약 즉시 반영하고 싶다면 관리자 페이지에서 `revalidatePath('/blog/[slug]')`를 실행하면 즉시 새 캐시로 교체됩니다.

**Q2. 방문자가 아예 없는 글도 60초마다 DB를 조회하나요?**  
A. **아닙니다!** ISR은 타이머가 아닙니다. 방문자가 오지 않으면 DB 조회가 0회(완전 휴식)이며, 손님이 왔을 때만 동작하므로 DB 부하나 비용이 0원입니다.
