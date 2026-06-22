const Parser = require('rss-parser');
const parser = new Parser();

async function callBatchExecute(base64Str, signature, timestamp) {
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
    console.error("callBatchExecute error:", e.message);
  }
  return null;
}

async function resolveGoogleNewsUrl(googleUrl) {
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
      }
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
    console.error("resolveGoogleNewsUrl error:", e.message);
    return googleUrl;
  }
}

async function testFetch() {
  const keyword = '증권 부동산 금융 재테크 기업';
  const targetUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=ko&gl=KR&ceid=KR:ko`;
  const feed = await parser.parseURL(targetUrl);
  
  const item = feed.items[0];
  const googleLink = item.link;
  console.log("Original Google Link:", googleLink);

  console.time("Decoding time");
  const realUrl = await resolveGoogleNewsUrl(googleLink);
  console.timeEnd("Decoding time");
  
  console.log("Decoded Real URL:", realUrl);

  // 진짜 언론사 주소로 이미지 파싱이 되는지 테스트
  if (realUrl && realUrl !== googleLink) {
    try {
      const res = await fetch(realUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        const html = await res.text();
        const ogImgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (ogImgMatch && ogImgMatch[1]) {
          console.log("Parsed og:image:", ogImgMatch[1]);
        } else {
          console.log("No og:image match found in Real Publisher HTML");
        }
      }
    } catch (e) {
      console.log("Fetch Real URL error:", e.message);
    }
  }
}

testFetch();
