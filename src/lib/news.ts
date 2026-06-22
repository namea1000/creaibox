import Parser from 'rss-parser';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  imageUrl: string;
  description: string; // 🌟 모달창 내부에서 즉시 읽을 수 있는 실제 기사 요약본 필드 추가!
}

const parser = new Parser();

// 🌟 batchexecute API를 호출하여 구글 뉴스의 새로운 인코딩 주소(AU_yq)를 리졸브
async function callBatchExecute(base64Str: string, signature: string, timestamp: string): Promise<string | null> {
  try {
    const payload = [
      "Fbv4je",
      `["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"${base64Str}",${timestamp},"${signature}"]`
    ];

    const body = `f.req=${encodeURIComponent(JSON.stringify([[payload]]))}`;
    const res = await fetch("https://news.google.com/_/DotsSplashUi/data/batchexecute", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      body
    });

    if (res.ok) {
      const text = await res.text();
      const splitText = text.split("\n\n");
      if (splitText.length > 1) {
        const parsedData = JSON.parse(splitText[1]);
        const innerData = JSON.parse(parsedData[0][2]);
        if (innerData && innerData[1]) {
          return innerData[1];
        }
      }
    }
  } catch (e) {
    console.error("callBatchExecute error:", e);
  }
  return null;
}

// 🌟 구글 뉴스 중간 경로에서 signature와 timestamp를 긁어 진짜 URL을 역추적하는 최종 해석 엔진
async function resolveGoogleNewsUrl(googleUrl: string): Promise<string> {
  try {
    if (!googleUrl.includes("articles/")) return googleUrl;
    const urlObj = new URL(googleUrl);
    const pathParts = urlObj.pathname.split('/');
    const articlesIndex = pathParts.indexOf('articles');
    if (articlesIndex === -1 || articlesIndex === pathParts.length - 1) return googleUrl;

    const base64Str = pathParts[articlesIndex + 1];

    const res = await fetch(`https://news.google.com/articles/${base64Str}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      next: { revalidate: 3600 } // 1시간 캐싱
    });
    if (!res.ok) return googleUrl;
    const html = await res.text();

    const sgMatch = html.match(/data-n-a-sg="([^"]+)"/) || html.match(/data-n-a-sg='([^']+)'/);
    const tsMatch = html.match(/data-n-a-ts="([^"]+)"/) || html.match(/data-n-a-ts='([^']+)'/);

    if (!sgMatch || !tsMatch) {
      return googleUrl;
    }

    const decoded = await callBatchExecute(base64Str, sgMatch[1], tsMatch[1]);
    return decoded || googleUrl;
  } catch (e) {
    console.error("resolveGoogleNewsUrl error:", e);
    return googleUrl;
  }
}

export async function getGoogleNewsWithImages(keyword: string): Promise<NewsItem[]> {
  try {
    const targetUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`;
    const feed = await parser.parseURL(targetUrl);

    if (!feed.items) return [];

    // 그리드에 딱 맞는 최적의 개수 (12개) 큐레이션
    const newsPromises = feed.items.slice(0, 12).map(async (item: any) => {
      const originalTitle = item.title || '';
      const titleParts = originalTitle.split(' - ');
      const title = titleParts[0];
      const source = titleParts[1] || '주요뉴스';
      const googleLink = item.link || '';
      
      // 진짜 언론사 주소로 디코딩 (batchexecute API 호출)
      const realUrl = await resolveGoogleNewsUrl(googleLink);

      // 1. 기본 백업 이미지 및 설명 기본값 정의
      let imageUrl = '';
      let description = '기사 원문에서 실시간 데이터를 분석하는 중입니다. 하단의 원문 전체보기 버튼을 클릭하시면 언론사 전용 레이아웃으로 상세 내용을 확인할 수 있습니다.';

      // AbortController 기반 1.2초 타임아웃 구성 (개별 언론사 지연 방지)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      try {
        const res = await fetch(realUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          next: { revalidate: 300 } // 5분간 서버 캐싱
        });

        if (res.ok) {
          const html = await res.text();

          // 3. 오픈그래프(OG Tag) 파싱 엔진 정규식 구동
          const ogImgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
          
          if (ogImgMatch && ogImgMatch[1]) {
            imageUrl = ogImgMatch[1];
          }

          // 4. 본문 요약 추출 엔진
          const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                              html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
          
          if (ogDescMatch && ogDescMatch[1]) {
            description = ogDescMatch[1]
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&#39;/g, "'");
          }
        }
      } catch (e) {
        console.warn(`원문 데이터 스크래핑 실패/타임아웃 (${source}):`, e);
      } finally {
        clearTimeout(timeoutId);
      }

      // 5. 이미지가 비어있거나 구글 뉴스 기본 월페이퍼일 경우 테마 월페이퍼로 안전하게 보정
      if (!imageUrl || imageUrl.includes('news.google.com') || imageUrl.includes('photo-1518770660439')) {
        if (keyword.includes('세계') || keyword.includes('국제')) imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500';
        else if (keyword.includes('경제') || keyword.includes('금융')) imageUrl = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500';
        else if (keyword.includes('사회')) imageUrl = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=500';
        else if (keyword.includes('생활') || keyword.includes('문화')) imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500';
        else if (keyword.includes('사설') || keyword.includes('칼럼')) imageUrl = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500';
        else imageUrl = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500';
      }

      return {
        title,
        link: realUrl,
        pubDate: item.pubDate || new Date().toISOString(),
        source,
        imageUrl,
        description
      };
    });

    return await Promise.all(newsPromises);
  } catch (error) {
    console.error("구글 뉴스 최종 융합 엔진 수집 핵심 실패:", error);
    return [];
  }
}