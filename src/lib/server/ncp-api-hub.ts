import crypto from "crypto";

const ACCESS_KEY = process.env.NCP_IAM_ACCESS_KEY || "";
const SECRET_KEY = process.env.NCP_IAM_SECRET_KEY || "";
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || "";
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || "";

export function makeNaverOpenApiHeaders() {
  return {
    "X-Naver-Client-Id": NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
    "Content-Type": "application/json",
  };
}

export function makeNcpSignature(method: string, url: string, timestamp: string): string {
  const space = " ";
  const newLine = "\n";
  const hmac = crypto.createHmac("sha256", SECRET_KEY);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url);
  hmac.update(newLine);
  hmac.update(timestamp);
  hmac.update(newLine);
  hmac.update(ACCESS_KEY);

  return hmac.digest("base64");
}

export async function fetchNaverSearchApi(query: string, category: string = "blog", display: number = 10) {
  try {
    const url = `https://openapi.naver.com/v1/search/${category}.json?query=${encodeURIComponent(
      query
    )}&display=${display}`;

    const res = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
    });

    const data = await res.json();
    if (data && data.items && data.items.length > 0) {
      return data;
    }

    // Try NCP API Gateway Header
    const ncpUrl = `https://naveropenapi.apigw.ntruss.com/v1/search/${category}.json?query=${encodeURIComponent(
      query
    )}&display=${display}`;

    const ncpRes = await fetch(ncpUrl, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
      },
    });

    const ncpData = await ncpRes.json();
    if (ncpData && ncpData.items) {
      return ncpData;
    }

    return data;
  } catch (err) {
    console.error("fetchNaverSearchApi Error:", err);
    return { items: [] };
  }
}

export async function fetchNaverDataLabTrend(body: any) {
  try {
    const url = "https://openapi.naver.com/v1/datalab/search";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      },
      body: JSON.stringify(body),
    });

    return await res.json();
  } catch (err) {
    console.error("fetchNaverDataLabTrend Error:", err);
    return { results: [] };
  }
}

// 🟢 네이버 실검/연관검색어 실측 API (Naver Realtime Auto-complete API)
export async function fetchNaverAutoComplete(query: string): Promise<string[]> {
  try {
    const url = `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(
      query
    )}&con=1&frm=nv&ans=2&r_format=json&r_enc=UTF-8&r_unicode=0&t_koreng=1&run=2&rev=4&q_enc=UTF-8`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.items && Array.isArray(data.items)) {
        const keywords: string[] = [];
        data.items.forEach((group: any) => {
          if (Array.isArray(group)) {
            group.forEach((item: any) => {
              if (Array.isArray(item) && typeof item[0] === "string") {
                keywords.push(item[0]);
              }
            });
          }
        });
        if (keywords.length > 0) return Array.from(new Set(keywords));
      }
    }
  } catch (err) {
    console.error("fetchNaverAutoComplete error:", err);
  }
  return [];
}

// 🔵 구글 실시간 뉴스 RSS API (Google Realtime News RSS API - No key required, 100% Real Data)
export async function fetchGoogleNewsRss(query: string): Promise<Array<{ title: string; source: string; pubDate: string; url: string }>> {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });

    if (res.ok) {
      const xml = await res.text();
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      const list: Array<{ title: string; source: string; pubDate: string; url: string }> = [];

      while ((match = itemRegex.exec(xml)) !== null && list.length < 8) {
        const itemContent = match[1];
        const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(itemContent);
        const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemContent);
        const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(itemContent);
        const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);

        if (titleMatch) {
          const fullTitle = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
          const cleanTitle = fullTitle.split(" - ")[0].trim();
          const newsSource = sourceMatch ? sourceMatch[1].trim() : fullTitle.split(" - ")[1] || "뉴스";
          const newsUrl = linkMatch ? linkMatch[1].trim() : `https://www.google.com/search?q=${encodeURIComponent(query)}`;

          list.push({
            title: cleanTitle,
            source: newsSource,
            pubDate: pubDateMatch ? "최근 이슈" : "실시간 뉴스",
            url: newsUrl,
          });
        }
      }
      return list;
    }
  } catch (err) {
    console.error("fetchGoogleNewsRss error:", err);
  }
  return [];
}
