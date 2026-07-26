import { NextResponse } from "next/server";
import { getHistoricalHourlyKeywords } from "@/lib/server/keyword-history";

export const GOOGLE_TRENDS_POOL = [
  { title: "KBO 프로야구 경기 일정", traffic: "200,000+", pubDate: "1시간 전", newsTitle: "프로야구 주말 3연전 긴급 총력전... 승차 지각변동", newsSource: "스포츠경향", newsUrl: "https://www.google.com/search?q=KBO+프로야구+경기+일정&tbm=nws" },
  { title: "삼성전자 실적 발표", traffic: "100,000+", pubDate: "2시간 전", newsTitle: "삼성전자 HBM 반도체 공급 계약 체결 소식에 주가 급등", newsSource: "한국경제", newsUrl: "https://www.google.com/search?q=삼성전자+실적+발표&tbm=nws" },
  { title: "비트코인 가상자산 시세", traffic: "100,000+", pubDate: "3시간 전", newsTitle: "비트코인 9천만원선 회복... 글로벌 자금 유입 가속화", newsSource: "매일경제", newsUrl: "https://www.google.com/search?q=비트코인+가상자산+시세&tbm=nws" },
  { title: "손흥민 LAFC 연속골", traffic: "50,000+", pubDate: "4시간 전", newsTitle: "손흥민 3경기 연속 멀티골 폭발... 팀 승리 견인", newsSource: "OSEN", newsUrl: "https://www.google.com/search?q=손흥민+LAFC+연속골&tbm=nws" },
  { title: "전기자전거 보조금 사업", traffic: "50,000+", pubDate: "5시간 전", newsTitle: "2026 지자체 전기자전거 구매 지원금 선착순 접수", newsSource: "연합뉴스", newsUrl: "https://www.google.com/search?q=전기자전거+보조금+사업&tbm=nws" },
  { title: "최저임금 위원회 결정", traffic: "50,000+", pubDate: "6시간 전", newsTitle: "내년도 최저시급 최종 타결... 노동계 및 경영계 입장", newsSource: "KBS 뉴스", newsUrl: "https://www.google.com/search?q=최저임금+위원회+결정&tbm=nws" },
  { title: "아이폰16 프로 디자인", traffic: "50,000+", pubDate: "7시간 전", newsTitle: "애플 아이폰16 베젤 슬림화 및 캡처 버튼 탑재 유출", newsSource: "전자신문", newsUrl: "https://www.google.com/search?q=아이폰16+프로+디자인&tbm=nws" },
  { title: "로또 1129회 당첨번호", traffic: "20,000+", pubDate: "8시간 전", newsTitle: "로또 1등 배출점 및 1인당 당첨 수령액 공개", newsSource: "MBC 뉴스", newsUrl: "https://www.google.com/search?q=로또+1129회+당첨번호&tbm=nws" },
  { title: "장마철 퐁피두 폭우 예보", traffic: "20,000+", pubDate: "9시간 전", newsTitle: "기상청 전국 실시간 강수량 및 침수 주의보 발령", newsSource: "SBS 뉴스", newsUrl: "https://www.google.com/search?q=장마철+폭우+예보&tbm=nws" },
  { title: "청계천 야시장 축제", traffic: "20,000+", pubDate: "10시간 전", newsTitle: "서울 밤도깨비 야시장 여름 스페셜 개장 안내", newsSource: "서울시 뉴스", newsUrl: "https://www.google.com/search?q=청계천+야시장+축제&tbm=nws" },
  { title: "네이버 웨일 브라우저", traffic: "10,000+", pubDate: "11시간 전", newsTitle: "네이버 AI 챗봇 큐(CUE) 웨일 통합 업데이트", newsSource: "IT조선", newsUrl: "https://www.google.com/search?q=네이버+웨일+브라우저&tbm=nws" },
  { title: "테슬라 모델Y 하이랜드", traffic: "10,000+", pubDate: "12시간 전", newsTitle: "테슬라 신형 모델Y 국내 인도 시작... 사전계약 폭주", newsSource: "디지털타임스", newsUrl: "https://www.google.com/search?q=테슬라+모델Y+하이랜드&tbm=nws" },
  { title: "국민연금 개혁안 확정", traffic: "10,000+", pubDate: "13시간 전", newsTitle: "보건복지부 국민연금 모수개혁 추진안 종합 발표", newsSource: "YTN 뉴스", newsUrl: "https://www.google.com/search?q=국민연금+개혁안+확정&tbm=nws" },
  { title: "파리 올림픽 선수단 입촌", traffic: "10,000+", pubDate: "14시간 전", newsTitle: "대한민국 국가대표 선수단 파리 현지 적응 훈련 착수", newsSource: "뉴스1", newsUrl: "https://www.google.com/search?q=파리+올림픽+선수단+입촌&tbm=nws" },
  { title: "쿠팡 와우 멤버십 혜택", traffic: "10,000+", pubDate: "15시간 전", newsTitle: "쿠팡이츠 무제한 무료배달 전국 확대 시행", newsSource: "파이낸셜뉴스", newsUrl: "https://www.google.com/search?q=쿠팡+와우+멤버십+혜택&tbm=nws" },
  { title: "카카오톡 멀티프로필 개편", traffic: "5,000+", pubDate: "16시간 전", newsTitle: "카카오 보안 강화 및 개인정보 보호 기능 업데이트", newsSource: "머니투데이", newsUrl: "https://www.google.com/search?q=카카오톡+멀티프로필+개편&tbm=nws" },
  { title: "아파트 실거래가 조회", traffic: "5,000+", pubDate: "17시간 전", newsTitle: "수도권 주요 단지 매매가 회복세... 국토부 실거래 시스템", newsSource: "이데일리", newsUrl: "https://www.google.com/search?q=아파트+실거래가+조회&tbm=nws" },
  { title: "현대자동차 N Line 신차", traffic: "5,000+", pubDate: "18시간 전", newsTitle: "현대차 아반떼 N라인 마이너체인지 디자인 공개", newsSource: "경향신문", newsUrl: "https://www.google.com/search?q=현대자동차+N+Line+신차&tbm=nws" },
  { title: "코스피 2800선 안착", traffic: "5,000+", pubDate: "19시간 전", newsTitle: "외국인 및 기관 동반 매수세... 증시 연속 상승", newsSource: "아시아경제", newsUrl: "https://www.google.com/search?q=코스피+2800선+안착&tbm=nws" },
  { title: "초당옥수수 수확철 직거래", traffic: "5,000+", pubDate: "20시간 전", newsTitle: "여름 당도 높은 초당옥수수 농가 산지 직송 열풍", newsSource: "농민신문", newsUrl: "https://www.google.com/search?q=초당옥수수+수확철+직거래&tbm=nws" },
  { title: "신세계 백화점 여름 세일", traffic: "50,000+", pubDate: "어제", newsTitle: "명품 브랜드 여름 정기 세일 개막 및 사은 행사", newsSource: "매일경제", newsUrl: "https://www.google.com/search?q=신세계+백화점+여름+세일&tbm=nws" },
  { title: "한국은행 기준금리 동결", traffic: "100,000+", pubDate: "어제", newsTitle: "금융통화위원회 기준금리 동결 결정 배경 발표", newsSource: "한국경제", newsUrl: "https://www.google.com/search?q=한국은행+기준금리+동결&tbm=nws" },
  { title: "엔화 환율 900원 돌파", traffic: "30,000+", pubDate: "어제", newsTitle: "일본 여행객 급증 및 엔화 강세 전환 전망", newsSource: "조선일보", newsUrl: "https://www.google.com/search?q=엔화+환율+900원&tbm=nws" },
  { title: "넷플릭스 신작 시리즈 공개", traffic: "20,000+", pubDate: "어제", newsTitle: "주말 볼만한 넷플릭스 오리지널 추천작 TOP 5", newsSource: "동아일보", newsUrl: "https://www.google.com/search?q=넷플릭스+신작+시리즈&tbm=nws" },
];

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const geo = requestUrl.searchParams.get("geo") || "KR";
  const date = requestUrl.searchParams.get("date");
  const hour = Number(requestUrl.searchParams.get("hour") || "12");

  const todayStr = new Date().toISOString().split("T")[0];

  // 1. 과거 날짜 요청 시 CreAibox 클라우드 DB 보관 기록 우선 조회
  if (date && date < todayStr) {
    const dbRecords = await getHistoricalHourlyKeywords(date, hour, "google");
    if (dbRecords && dbRecords.length > 0) {
      return NextResponse.json({
        geo,
        total: dbRecords.length,
        items: dbRecords.map((r) => ({
          title: r.keyword,
          traffic: r.search_volume || "100K+",
          pubDate: `${date} ${hour}:00`,
          newsTitle: r.news_title,
          newsUrl: r.news_url,
          newsSource: r.news_source,
        })),
      });
    }
  }

  // 2. 구글 트렌드 실시간 / 최근 일간 RSS API 조회 (오늘 및 최근 과거 날짜)
  try {
    const rssUrl = `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`;
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const xmlText = await res.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      const items: any[] = [];
      let match;

      while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemContent = match[1];
        const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemContent);
        const trafficMatch = /<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/.exec(itemContent);
        const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);
        const newsTitleMatch = /<ht:news_item_title>([\s\S]*?)<\/ht:news_item_title>/.exec(itemContent);
        const newsUrlMatch = /<ht:news_item_url>([\s\S]*?)<\/ht:news_item_url>/.exec(itemContent);
        const newsSourceMatch = /<ht:news_item_source>([\s\S]*?)<\/ht:news_item_source>/.exec(itemContent);

        if (titleMatch) {
          const title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
          const traffic = trafficMatch ? trafficMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "50,000+";
          const pubDate = pubDateMatch ? pubDateMatch[1].trim() : "";
          const newsTitle = newsTitleMatch ? newsTitleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
          let newsUrl = newsUrlMatch ? newsUrlMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
          const newsSource = newsSourceMatch ? newsSourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";

          if (!newsUrl || newsUrl.endsWith("news.google.com") || newsUrl.endsWith("news.google.com/")) {
            newsUrl = `https://www.google.com/search?q=${encodeURIComponent(title + " " + (newsTitle || "뉴스"))}&tbm=nws`;
          }

          items.push({
            title,
            traffic,
            pubDate,
            newsTitle,
            newsUrl,
            newsSource,
          });
        }
      }

      if (items.length >= 10) {
        return NextResponse.json({ geo, total: items.length, items });
      }
    }
  } catch (err: any) {
    console.error("Google Trends RSS Error:", err);
  }

  // 3. 최근 API에도 없고 DB에도 없는 오래된 과거 날짜인 경우 -> 정직한 수집제한 안내
  if (date && date < todayStr) {
    return NextResponse.json({
      isBeforeArchiving: true,
      items: [],
      message: "구글 트렌드 및 DB 수집 가능 기간 이전의 데이터입니다.",
    });
  }

  return NextResponse.json({
    geo,
    total: 0,
    items: [],
  });
}
