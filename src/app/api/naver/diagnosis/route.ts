import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 네이버 블로그 URL에서 ID와 포스트번호를 정규식으로 추출
function extractNaverBlogKeys(url: string) {
  if (!url) return null;
  const decodedUrl = decodeURIComponent(url);

  // 1. https://blog.naver.com/아이디/포스트번호
  // 2. https://m.blog.naver.com/아이디/포스트번호
  const matchStandard = decodedUrl.match(/blog\.naver\.com\/([a-zA-Z0-9_-]+)\/([0-9]+)/);
  if (matchStandard) {
    return { blogId: matchStandard[1], postNo: matchStandard[2] };
  }

  // 3. https://아이디.blog.me/포스트번호
  const matchBlogMe = decodedUrl.match(/([a-zA-Z0-9_-]+)\.blog\.me\/([0-9]+)/);
  if (matchBlogMe) {
    return { blogId: matchBlogMe[1], postNo: matchBlogMe[2] };
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    // 1. 사용자 로그인 인증 세션 체크
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");
    const keyword = searchParams.get("keyword");

    if (!targetUrl || !keyword) {
      return NextResponse.json({ error: "url and keyword parameters are required" }, { status: 400 });
    }

    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Naver API credentials are not configured on server" },
        { status: 500 }
      );
    }

    // 2. 네이버 검색 API로 해당 키워드 100개 검색
    const searchUrl = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(keyword)}&display=100`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error("Naver Search API Error:", errText);
      return NextResponse.json({ error: "Failed to fetch from Naver Search API" }, { status: 502 });
    }

    const searchData = await searchRes.json();
    const items = searchData.items || [];

    const targetKeys = extractNaverBlogKeys(targetUrl);
    let rank = 101; // 100위 밖(권외) 기본값
    let foundItem: any = null;

    // 3. 검색 결과 100위 내에서 사용자 포스팅 매칭 탐색
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemKeys = extractNaverBlogKeys(item.link);

      if (targetKeys && itemKeys) {
        if (targetKeys.blogId === itemKeys.blogId && targetKeys.postNo === itemKeys.postNo) {
          rank = i + 1;
          foundItem = item;
          break;
        }
      } else {
        // 정규식 추출이 어려울 경우 단순 문자열 포함 체크 fallback
        if (item.link.includes(targetUrl) || targetUrl.includes(item.link)) {
          rank = i + 1;
          foundItem = item;
          break;
        }
      }
    }

    // 4. 최신성 지수 계산
    let freshnessScore = 70; // 기본값
    if (foundItem?.postdate) {
      try {
        const year = parseInt(foundItem.postdate.substring(0, 4));
        const month = parseInt(foundItem.postdate.substring(4, 6)) - 1;
        const day = parseInt(foundItem.postdate.substring(6, 8));
        const postDateObj = new Date(year, month, day);
        const diffTime = Math.abs(new Date().getTime() - postDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        freshnessScore = Math.max(45, 100 - diffDays * 1.2);
      } catch (e) {
        console.error("Postdate parsing failed:", e);
      }
    }

    // 5. 스니펫 적합도 점수 계산
    let snippetScore = 75; // 기본값
    if (foundItem) {
      const titleClean = (foundItem.title || "").replace(/<[^>]*>/g, "");
      const descClean = (foundItem.description || "").replace(/<[^>]*>/g, "");
      
      let score = 50;
      if (titleClean.includes(keyword)) score += 25;
      if (descClean.includes(keyword)) score += 15;
      if (titleClean.startsWith(keyword)) score += 10; // 키워드가 맨 앞에 위치하면 가산점
      
      snippetScore = Math.min(100, score);
    }

    // 6. 점수 조합 산출
    const actualRank = rank <= 100 ? rank : 101;
    // 랭킹 점수: 1위=100점, 10위=90점, 50위=50점, 권외=15점
    const rankScore = actualRank <= 100 ? (101 - actualRank) : 15;
    
    // 체류 시간 및 이탈률은 시뮬레이션
    const stayTime = actualRank <= 3 
      ? Math.floor(Math.random() * 40) + 160 
      : actualRank <= 10 
      ? Math.floor(Math.random() * 30) + 120 
      : Math.floor(Math.random() * 30) + 80;
      
    const bounceRate = actualRank <= 3 
      ? parseFloat((Math.random() * 5 + 15).toFixed(1)) 
      : actualRank <= 10 
      ? parseFloat((Math.random() * 10 + 20).toFixed(1)) 
      : parseFloat((Math.random() * 15 + 30).toFixed(1));

    const indexScore = actualRank <= 100 ? 95 : 60;
    const totalScore = Math.round((rankScore * 0.4) + (snippetScore * 0.3) + (freshnessScore * 0.3));

    return NextResponse.json({
      targetUrl,
      targetKeyword: keyword,
      rank: actualRank,
      totalScore,
      bounceRate,
      stayTime,
      indexScore,
      snippetScore,
      freshnessScore,
      postdate: foundItem?.postdate || null,
      title: foundItem?.title || null,
      date: new Date().toISOString().split("T")[0],
    });
  } catch (error: any) {
    console.error("Naver Diagnosis API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
