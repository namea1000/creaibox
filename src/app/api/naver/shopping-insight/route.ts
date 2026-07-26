import { NextRequest, NextResponse } from "next/server";
import { makeNaverOpenApiHeaders } from "@/lib/server/ncp-api-hub";

export const CATEGORY_TOP500_MOCK: Record<string, string[]> = {
  "스포츠/레저": ["전기자전거", "선풍기조끼", "수영복", "여자실내수영복", "래쉬가드", "등산화", "캠핑의자", "아이스박스", "무릎보호대", "골프화", "남성골프화", "파라솔", "로드자전거", "구명조끼", "트레킹화", "원터치텐트", "실내자전거", "아레나수영복", "캠핑테이블", "등산배낭"],
  "디지털/가전": ["에어컨", "제습기", "창문형에어컨", "선풍기", "서큘레이터", "블루투스이어폰", "모니터", "노트북", "아이폰15", "로봇청소기", "태블릿", "얼음정수기", "냉장고", "헤드셋", "무선선풍기", "건조기", "애플워치", "보조배터리"],
  "패션의류": ["반팔티", "반바지", "원피스", "린넨셔츠", "여름원피스", "민소매", "크롭티", "슬랙스", "청바지", "카라티", "오버핏반팔티", "볼캡", "나시원피스"],
  "식품": ["수박", "복숭아", "삼겹살", "닭가슴살", "생수", "탄산수", "아이스크림", "전복", "초당옥수수", "자두", "냉면", "밀키트"],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cid = "50000002", categoryName = "스포츠/레저", startDate = "2026-06-25", endDate = "2026-07-25" } = body;

    // Call Naver OpenAPI DataLab Shopping categories endpoint
    const url = "https://openapi.naver.com/v1/datalab/shopping/categories";
    const headers = makeNaverOpenApiHeaders();
    
    const requestBody = {
      startDate,
      endDate,
      timeUnit: "date",
      category: [{ name: categoryName, param: [cid] }],
    };

    let trendData: any[] = [];
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.results && json.results[0] && json.results[0].data) {
          trendData = json.results[0].data;
        }
      }
    } catch (e) {
      console.warn("Live Naver Shopping API fallback:", e);
    }

    if (trendData.length === 0) {
      // Mock line points
      const dates = ["06-25", "06-28", "07-01", "07-04", "07-07", "07-10", "07-13", "07-16", "07-19", "07-22", "07-25"];
      trendData = dates.map((period, i) => ({
        period: `2026-${period}`,
        ratio: 50 + Math.floor(Math.sin(i) * 35 + Math.random() * 15),
      }));
    }

    const keywords = CATEGORY_TOP500_MOCK[categoryName] || CATEGORY_TOP500_MOCK["스포츠/레저"];

    return NextResponse.json({
      categoryName,
      startDate,
      endDate,
      trendData,
      topKeywords: keywords.map((kw, i) => ({
        rank: i + 1,
        keyword: kw,
        change: i % 3 === 0 ? "NEW" : i % 2 === 0 ? "▲" : "▼",
      })),
      deviceRatio: { pc: 17, mobile: 83 },
      genderRatio: { female: 64, male: 36 },
      ageRatio: [
        { age: "10대", ratio: 5 },
        { age: "20대", ratio: 22 },
        { age: "30대", ratio: 41 },
        { age: "40대", ratio: 24 },
        { age: "50대", ratio: 8 },
      ],
    });
  } catch (err) {
    console.error("Shopping insight POST error:", err);
    return NextResponse.json({ error: "쇼핑 인사이트 조회를 실패했습니다." }, { status: 500 });
  }
}
