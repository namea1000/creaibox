import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const NAVER_HOSTS = new Set([
  'blog.naver.com',
  'm.blog.naver.com'
]);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '네이버 블로그 본문을 읽지 못했습니다.';
}

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/');
}

function stripHtml(html: string) {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|ul|ol|h1|h2|h3|h4|h5|h6|blockquote)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function getAbsoluteUrl(baseUrl: string, path: string) {
  return new URL(path, baseUrl).toString();
}

function extractMetaContent(html: string, key: string) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["']`, 'i')
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1]).trim();
    }
  }

  return '';
}

function extractTagText(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1] ? stripHtml(match[1]) : '';
}

function extractBalancedElement(html: string, marker: RegExp, tagName = 'div') {
  const match = marker.exec(html);
  if (!match || match.index === undefined) return '';

  const startIndex = match.index;
  const openTagEnd = html.indexOf('>', startIndex);
  if (openTagEnd === -1) return '';

  const openPattern = new RegExp(`<${tagName}(\\s|>)`, 'gi');
  const closePattern = new RegExp(`</${tagName}>`, 'gi');
  openPattern.lastIndex = startIndex;
  closePattern.lastIndex = startIndex;

  let depth = 0;
  let cursor = startIndex;

  while (cursor < html.length) {
    openPattern.lastIndex = cursor;
    closePattern.lastIndex = cursor;

    const nextOpen = openPattern.exec(html);
    const nextClose = closePattern.exec(html);

    if (!nextClose) break;

    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      cursor = nextOpen.index + 1;
      continue;
    }

    depth -= 1;
    cursor = nextClose.index + nextClose[0].length;

    if (depth === 0) {
      return html.slice(startIndex, cursor);
    }
  }

  return '';
}

function extractIframeSource(html: string, baseUrl: string) {
  const iframeMatch = html.match(/<iframe[^>]+id=["']mainFrame["'][^>]+src=["']([^"']+)["']/i);
  if (!iframeMatch?.[1]) return '';
  return getAbsoluteUrl(baseUrl, iframeMatch[1]);
}

function extractTitle(html: string) {
  const titleCandidates = [
    extractTagText(html, /<div[^>]+class=["'][^"']*se-title-text[^"']*["'][^>]*>([\s\S]*?)<\/div>/i),
    extractTagText(html, /<h3[^>]+class=["'][^"']*se_textarea[^"']*["'][^>]*>([\s\S]*?)<\/h3>/i),
    extractTagText(html, /<span[^>]+class=["'][^"']*pcol1 itemSubjectBoldfont[^"']*["'][^>]*>([\s\S]*?)<\/span>/i),
    extractMetaContent(html, 'og:title'),
    extractTagText(html, /<title>([\s\S]*?)<\/title>/i)
  ].filter(Boolean);

  return titleCandidates[0] || '';
}

function extractContentHtml(html: string) {
  const containerPatterns = [
    /<div[^>]+class=["'][^"']*se-main-container[^"']*["'][^>]*>/i,
    /<div[^>]+id=["']postViewArea["'][^>]*>/i,
    /<div[^>]+class=["'][^"']*post-view[^"']*["'][^>]*>/i,
    /<div[^>]+class=["'][^"']*view_se[^"']*["'][^>]*>/i
  ];

  for (const pattern of containerPatterns) {
    const extracted = extractBalancedElement(html, pattern);
    if (extracted) return extracted;
  }

  return '';
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
    },
    redirect: 'follow',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`네이버 페이지 응답 실패 (${response.status})`);
  }

  return response.text();
}

function normalizeNaverUrl(rawUrl: string) {
  const parsed = new URL(rawUrl);
  if (!NAVER_HOSTS.has(parsed.hostname)) {
    throw new Error('네이버 블로그 주소만 분석할 수 있습니다.');
  }
  return parsed.toString();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: '분석할 URL이 없습니다.' }, { status: 400 });
  }

  try {
    const normalizedUrl = normalizeNaverUrl(rawUrl);
    const outerHtml = await fetchHtml(normalizedUrl);
    const frameUrl = extractIframeSource(outerHtml, normalizedUrl);
    const articleUrl = frameUrl || normalizedUrl;
    const articleHtml = frameUrl ? await fetchHtml(frameUrl) : outerHtml;

    const title = extractTitle(articleHtml) || extractTitle(outerHtml);
    const contentHtml = extractContentHtml(articleHtml);
    const content = stripHtml(contentHtml);

    if (!content || content.length < 80) {
      throw new Error('본문을 충분히 추출하지 못했습니다. 공개된 네이버 블로그 글인지 확인해 주세요.');
    }

    return NextResponse.json({
      title,
      content,
      canonicalUrl: articleUrl
    });
  } catch (error: unknown) {
    console.error('네이버 본문 추출 실패:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
