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
