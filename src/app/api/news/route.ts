import { NextRequest, NextResponse } from 'next/server';
import { getGoogleNewsWithImages } from '@/lib/news';

// 🌟 이 영역은 완전한 서버사이드(Node.js) 영역이므로 rss-parser가 200% 안전하게 작동합니다.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || '주요뉴스';

  try {
    const newsData = await getGoogleNewsWithImages(keyword);
    return NextResponse.json(newsData);
  } catch (error) {
    console.error("API 라우터 뉴스 수집 에러:", error);
    return NextResponse.json([], { status: 500 });
  }
}