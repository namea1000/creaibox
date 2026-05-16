import Parser from 'rss-parser';
import ogs from 'open-graph-scraper';

// 🌟 [무적 치트키] 외부 상속을 끊고, 구글 RSS 아이템의 규격을 우리가 직접 100% 선언합니다.
// 이렇게 하면 rss-parser의 타입이 꼬여도 절대 에러가 나지 않습니다.
interface GoogleRSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  source?: {
    name?: string;
    url?: string;
  };
  [key: string]: any; // 혹시 모를 다른 데이터들도 유연하게 수용
}

const parser = new Parser();

// 기사 원문 링크를 방문하여 대표 이미지(og:image)를 추출하는 함수
async function getOgImage(link: string): Promise<string> {
  try {
    const options = { 
      url: link, 
      timeout: 2500 
    };
    const { result } = await ogs(options);
    
    if (result.ogImage && result.ogImage.length > 0) {
      return result.ogImage[0].url || '/images/default-news.jpg';
    }
    
    return '/images/default-news.jpg'; 
  } catch (error) {
    return '/images/default-news.jpg';
  }
}

// 외부에서 카테고리별 키워드를 던지면 [뉴스 리스트 + 이미지]를 완성해서 뱉어내는 메인 엔진
export async function getGoogleNewsWithImages(keyword: string) {
  const RSS_URL = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`;
  
  try {
    const feed = await parser.parseURL(RSS_URL);
    const topItems = feed.items.slice(0, 15);

    // 🌟 우리가 직접 만든 완벽한 무적의 GoogleRSSItem 타입을 매칭합니다.
    const newsList = await Promise.all(
      topItems.map(async (item: any) => {
        const cachedItem = item as GoogleRSSItem; // 안전하게 타입 단언(Type Assertion)
        const articleLink = cachedItem.link || '';
        const imageUrl = articleLink ? await getOgImage(articleLink) : '/images/default-news.jpg';

        return {
          title: cachedItem.title || '제목 없음',
          link: articleLink,
          pubDate: cachedItem.pubDate || new Date().toISOString(),
          source: cachedItem.source?.name || 'Google News',
          imageUrl: imageUrl 
        };
      })
    );

    return newsList;
  } catch (error) {
    console.error(`[${keyword}] RSS 및 이미지 융합 파싱 에러:`, error);
    return [];
  }
}