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

      // 1. 기본 백업 이미지 및 설명 기본값 정의
      let imageUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500';
      let description = '기사 원문에서 실시간 데이터를 분석하는 중입니다. 하단의 원문 전체보기 버튼을 클릭하시면 언론사 전용 레이아웃으로 상세 내용을 확인할 수 있습니다.';

      try {
        // 2. 🔥 [CORS 억까 우회] 서버사이드에서 원문 뉴스 주소로 다이렉트 침투 연산 가동
        // 일반 크롬 브라우저로 완벽히 위장하여 언론사 방화벽을 우회합니다.
        const res = await fetch(googleLink, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          next: { revalidate: 300 } // 5분간 서버 캐싱으로 속도 극대화
        });

        if (res.ok) {
          const html = await res.text();

          // 3. 🎯 오픈그래프(OG Tag) 파싱 엔진 정규식 구동
          // 원문 HTML 코드 속에 숨겨진 '진짜 기사 사진 주소' 추출
          const ogImgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
          
          if (ogImgMatch && ogImgMatch[1]) {
            imageUrl = ogImgMatch[1];
          }

          // 4. 📝 [본문 요약 추출 엔진] 원문 HTML 속 '진짜 기사 첫 줄/요약 내용' 추출
          const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                              html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
          
          if (ogDescMatch && ogDescMatch[1]) {
            // HTML 엔티티 기호 깨짐 처리 
            description = ogDescMatch[1]
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&#39;/g, "'");
          }
        }
      } catch (e) {
        console.error(`원문 데이터 스크래핑 우회 실패 (${source}):`, e);
      }

      // 5. 만약 원문 사이트가 너무 빡세게 막아서 사진 파싱이 튕겼을 때만 카테고리별 매거진 테마 월페이퍼로 안전하게 보정
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
        link: googleLink,
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