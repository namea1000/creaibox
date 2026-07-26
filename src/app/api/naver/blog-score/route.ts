import { NextRequest, NextResponse } from "next/server";
import { fetchBlogScore, TOP_BLOGGERS_SEED } from "@/lib/server/naver-blog-score";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get("blogId");
  const category = searchParams.get("category");
  const query = searchParams.get("query");

  if (blogId) {
    const result = await fetchBlogScore(blogId);
    return NextResponse.json(result);
  }

  let list = [...TOP_BLOGGERS_SEED];
  if (category && category !== "전체" && category !== "선택") {
    list = list.filter((b) => b.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    list = list.filter((b) => b.blogId.toLowerCase().includes(q) || b.nickname.toLowerCase().includes(q) || b.blogTitle.toLowerCase().includes(q));
  }

  return NextResponse.json({
    total: list.length,
    bloggers: list,
  });
}
