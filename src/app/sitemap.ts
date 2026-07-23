import { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: admins } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "ADMIN");

  const adminIds = (admins || []).map((a) => a.id);

  let posts: any[] = [];
  let error: any = null;

  if (adminIds.length > 0) {
    const query = await supabase
      .from("writing_creaibox_posts")
      .select("slug, updated_at")
      .eq("status", "published")
      .in("user_id", adminIds)
      .not("slug", "is", null);
    posts = query.data || [];
    error = query.error;
  }

  if (error) {
    console.error("Sitemap posts fetch error:", error.message);
  }


  const blogUrls =
    posts?.map((post) => ({
      url: `https://creaibox.com/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  const staticUrls = [
    {
      url: "https://creaibox.com",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: "https://creaibox.com/blog",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // 유튜브 트렌드
    {
      url: "https://creaibox.com/youtube-trend",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: "https://creaibox.com/youtube-trend/top300",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: "https://creaibox.com/youtube-trend/search",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    // 키워드 트렌드
    {
      url: "https://creaibox.com/keyword-trend",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: "https://creaibox.com/keyword-trend/bulk",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: "https://creaibox.com/keyword-trend/related",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    // 유틸리티 Tools
    {
      url: "https://creaibox.com/utility-tools",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: "https://creaibox.com/utility-tools/bg-remover",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: "https://creaibox.com/utility-tools/ocr",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // 디자인 스튜디오
    {
      url: "https://creaibox.com/design",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: "https://creaibox.com/design/workspace",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // AI 홈페이지 제작
    {
      url: "https://creaibox.com/client-site-builder",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // 콘텐츠 라이브러리
    {
      url: "https://creaibox.com/library",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // AI 콘텐츠 플래너
    {
      url: "https://creaibox.com/content-planner",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // 크리에이박스 블로그
    {
      url: "https://creaibox.com/writing/creaibox",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // 네이버 글쓰기
    {
      url: "https://creaibox.com/writing/naver",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // 뮤직 스튜디오
    {
      url: "https://creaibox.com/music",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // 비디오 스튜디오
    {
      url: "https://creaibox.com/video",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // 자료 분석 스튜디오
    {
      url: "https://creaibox.com/research",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // 채널 배포 스튜디오
    {
      url: "https://creaibox.com/publish",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // AI 리포트
    {
      url: "https://creaibox.com/aireport",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // 뉴스 콘텐츠
    {
      url: "https://creaibox.com/news",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    // 커뮤니티
    {
      url: "https://creaibox.com/community",
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    // 인포센터
    {
      url: "https://creaibox.com/infocenter",
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  return [
    ...staticUrls,
    ...blogUrls,
  ];
}