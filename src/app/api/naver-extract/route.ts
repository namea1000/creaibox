import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const NAVER_HOSTS = new Set([
  'blog.naver.com',
  'm.blog.naver.com'
]);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '본문을 읽지 못했습니다.';
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
    extractTagText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
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
    throw new Error(`페이지 응답 실패 (${response.status})`);
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

function isNaverBlogUrl(urlStr: string) {
  try {
    const parsed = new URL(urlStr);
    return NAVER_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

function cleanGenericHtml(html: string) {
  // Strip comments, scripts, styles, buttons, forms
  let cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
    .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '');

  // Strip headers, footers, navs, asides
  cleaned = cleaned
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');

  return cleaned;
}

function extractTimestamp(html: string) {
  // 1. Try meta tags
  const metaDate = extractMetaContent(html, 'article:published_time') || 
                   extractMetaContent(html, 'pubdate') ||
                   extractMetaContent(html, 'publish-date') ||
                   extractMetaContent(html, 'og:pubdate');
  if (metaDate) {
    return metaDate.replace('T', ' ').split('.')[0];
  }

  // 2. Try body element selectors
  const timestampPatterns = [
    /<div[^>]+class=["'][^"']*(?:timestamp|article-timestamp|write-time|publish-date)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    /<span[^>]+class=["'][^"']*(?:timestamp|article-timestamp|write-time|publish-date)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
    /<span[^>]+class=["'](?:se_publishDate|se-publishDate)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
    /<span[^>]+class=["'](?:date|time)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
    /<div[^>]+id=["'](?:timestamp|publish-date)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
  ];

  for (const pattern of timestampPatterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      const text = stripHtml(match[1]).trim();
      if (/\d/.test(text) && text.length < 150) {
        return text;
      }
    }
  }

  // 3. Fallback: search for date pattern directly in text
  const bodyTextMatch = html.match(/(?:입력|등록|수정|작성)\s*(?:일시)?\s*:?\s*(20\d{2}[.-/]\d{2}[.-/]\d{2}\s+\d{2}:\d{2}(?::\d{2})?)/i);
  if (bodyTextMatch?.[1]) {
    return bodyTextMatch[0].trim();
  }

  return '';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: '분석할 URL이 없습니다.' }, { status: 400 });
  }

  try {
    const urlStr = rawUrl.trim();
    const isNaver = isNaverBlogUrl(urlStr);

    if (isNaver) {
      const normalizedUrl = normalizeNaverUrl(urlStr);
      const outerHtml = await fetchHtml(normalizedUrl);
      const frameUrl = extractIframeSource(outerHtml, normalizedUrl);
      const articleUrl = frameUrl || normalizedUrl;
      const articleHtml = frameUrl ? await fetchHtml(frameUrl) : outerHtml;

      const title = extractTitle(articleHtml) || extractTitle(outerHtml);
      const contentHtml = extractContentHtml(articleHtml);
      
      const textBody = stripHtml(contentHtml);
      const timestamp = extractTimestamp(articleHtml) || extractTimestamp(outerHtml);

      let content = '';
      if (timestamp) {
        content += `[입력/수정 시간] ${timestamp}\n`;
      }
      content += `[출처] ${urlStr}\n\n`;
      content += `---\n\n`;
      content += textBody;

      if (!textBody || textBody.length < 80) {
        throw new Error('본문을 충분히 추출하지 못했습니다. 공개된 네이버 블로그 글인지 확인해 주세요.');
      }

      return NextResponse.json({
        title,
        content,
        canonicalUrl: articleUrl
      });
    } else {
      // Generic URL extraction logic
      const html = await fetchHtml(urlStr);
      const cleanedHtml = cleanGenericHtml(html);

      let contentHtml = '';

      // 1. Check precise content containers
      const divPatterns = [
        // IDs
        /<div[^>]+id=["'](?:articletxt|articleBody|articleBodyContents|newsct_article|harmonyContainer|postViewArea|post-content|article-content|entry-content|content|main-content|post-body|entry-body|story-content|story-body|article_body|article_txt)["'][^>]*>/i,
        // Classes
        /<div[^>]+class=["'](?:article-body|article-contents|article-body-wrap|post-content|article-content|entry-content|main-content|post-body|entry-body|story-content|story-body|article_view|news_body|article_body|article_txt|art_txt)[^"']*["'][^>]*>/i
      ];
      
      for (const pattern of divPatterns) {
        const divContent = extractBalancedElement(cleanedHtml, pattern, 'div');
        if (divContent && stripHtml(divContent).length > 150) {
          contentHtml = divContent;
          break;
        }
      }

      // 2. Check article tag
      if (!contentHtml) {
        const articleContent = extractBalancedElement(cleanedHtml, /<article(\s|>)/i, 'article');
        if (articleContent && stripHtml(articleContent).length > 100) {
          contentHtml = articleContent;
        }
      }

      // 3. Check main tag
      if (!contentHtml) {
        const mainContent = extractBalancedElement(cleanedHtml, /<main(\s|>)/i, 'main');
        if (mainContent && stripHtml(mainContent).length > 100) {
          contentHtml = mainContent;
        }
      }

      // 4. Check generic content classes
      if (!contentHtml) {
        const fallbackContent = extractBalancedElement(cleanedHtml, /<div[^>]+(?:class|id)=["'](?:content|entry|post)["'][^>]*>/i, 'div');
        if (fallbackContent && stripHtml(fallbackContent).length > 150) {
          contentHtml = fallbackContent;
        }
      }

      // 5. Check body tag
      if (!contentHtml) {
        const bodyContent = extractBalancedElement(cleanedHtml, /<body(\s|>)/i, 'body');
        if (bodyContent) {
          contentHtml = bodyContent;
        }
      }

      // 6. Fallback to full cleaned HTML
      if (!contentHtml) {
        contentHtml = cleanedHtml;
      }

      const title = extractTitle(html);
      const timestamp = extractTimestamp(html);
      const textBody = stripHtml(contentHtml);

      let content = '';
      if (timestamp) {
        content += `[입력/수정 시간] ${timestamp}\n`;
      }
      content += `[출처] ${urlStr}\n\n`;
      content += `---\n\n`;
      content += textBody;

      if (!textBody || textBody.length < 50) {
        throw new Error('본문을 충분히 추출하지 못했습니다. URL이 올바른지 혹은 공개된 페이지인지 확인해 주세요.');
      }

      return NextResponse.json({
        title,
        content,
        canonicalUrl: urlStr
      });
    }
  } catch (error: unknown) {
    console.error('본문 추출 실패:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
