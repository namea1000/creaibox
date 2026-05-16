import Parser from 'rss-parser';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  imageUrl: string;
}

const parser = new Parser();

export async function getGoogleNewsWithImages(keyword: string): Promise<NewsItem[]> {
  try {
    // 🎯 구글 뉴스 RSS 호출 (한글 인코딩 완벽 보정)
    const targetUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`;
    const feed = await parser.parseURL(targetUrl);

    if (!feed.items) return [];

    // 큐레이션 개수 최적화 (12개)
    // 💡 item 타입 에러 ts(7006) 완벽 해결본
    const newsPromises = feed.items.slice(0, 12).map(async (item: any) => {
      const originalTitle = item.title || '';
      
      // 1. 구글 특유의 타이틀 맨 뒤 ' - 언론사' 분리 가공
      const titleParts = originalTitle.split(' - ');
      const title = titleParts[0];
      const source = titleParts[1] || '주요뉴스';

      // 2. 구글 RSS 고유의 리다이렉트 링크 주소 확보
      const googleLink = item.link || '';

      // 3. 기본 고화질 매거진 테마 이미지 기본 셋업
      let imageUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500';

      try {
        // 구글 RSS 내부의 content나 enclosure 영역에 썸네일 주소가 파싱되어 들어오는 경우 추출
        if (item.enclosure && item.enclosure.url) {
          imageUrl = item.enclosure.url;
        } else if (item.content) {
          const imgRegex = /<img[^>]+src="([^">]+)"/g;
          const match = imgRegex.exec(item.content);
          if (match && match[1]) {
            imageUrl = match[1];
          }
        }

        // 4. 🌟 [핵심 그물망 보정] 구글 기본 로고나 플레이스홀더 찌꺼기 주소가 감지되면 100% 차단 후 카테고리별 테마 이미지 강제 매칭
        if (
          !imageUrl || 
          imageUrl.includes('news.google.com') || 
          imageUrl.includes('googleusercontent') ||
          imageUrl.includes('gstatic') ||
          imageUrl.includes('photo-1518770660439') || 
          imageUrl.includes('photo-1518770660439-4636190af475')
        ) {
          if (keyword.includes('세계') || keyword.includes('국제') || keyword.includes('글로벌') || keyword.includes('외신')) {
            imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500'; // 우주/지구 테크
          } else if (keyword.includes('경제') || keyword.includes('금융') || keyword.includes('주식') || keyword.includes('증권') || keyword.includes('재테크')) {
            imageUrl = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500'; // 차트/금융
          } else if (keyword.includes('사회') || keyword.includes('사건') || keyword.includes('사고')) {
            imageUrl = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=500'; // 시티 뷰
          } else if (keyword.includes('생활') || keyword.includes('푸드') || keyword.includes('여행') || keyword.includes('문화')) {
            imageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500'; // 매거진 푸드/라이프
          } else if (keyword.includes('사설') || keyword.includes('칼럼') || keyword.includes('오피니언') || keyword.includes('시론')) {
            imageUrl = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500'; // 만년필/원고지
          } else if (keyword.includes('인기') || keyword.includes('화제') || keyword.includes('실시간') || keyword.includes('HOT')) {
            imageUrl = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500'; // 트렌디 네온/네트워크
          } else {
            imageUrl = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=500'; // 제너럴 미디어 뉴스룸
          }
        }
      } catch (e) {
        console.error("썸네일 이미지 가공 처리 예외 발생:", e);
      }

      return {
        title,
        link: googleLink,
        pubDate: item.pubDate || new Date().toISOString(),
        source,
        imageUrl
      };
    });

    return await Promise.all(newsPromises);
  } catch (error) {
    console.error("구글 뉴스 엔진 수집 핵심 실패:", error);
    return [];
  }
}