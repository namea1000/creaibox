import fs from "fs";

/**
 * Common Chrome executable paths across Mac, Linux, and Windows
 */
const COMMON_CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

async function getExecutablePath(): Promise<string> {
  for (const p of COMMON_CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  try {
    const chromium = (await import("@sparticuz/chromium")).default;
    return await chromium.executablePath();
  } catch (err) {
    console.warn("[HeadlessScraper] Failed to load @sparticuz/chromium:", err);
  }
  return "";
}

/**
 * Detect whether the scraped HTML is an unrendered CSR / SPA website
 */
export function isSpaWebsite(html: string): boolean {
  if (!html) return false;
  const hasEmptyApp = /<div\s+id=["'](?:app|root|__next|__nuxt)["']\s*>\s*<\/div>/i.test(html);
  const hasSpaNoscript = /JavaScript\s+(?:enabled|required|is\s+disabled)/i.test(html);
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  if (hasEmptyApp || (hasSpaNoscript && imgTags.length < 3)) return true;
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim() : "";
  if (bodyContent.length < 500 && html.includes("<script")) return true;
  return false;
}

/**
 * v2.0: Detect Framer-built sites
 */
export function isFramerSite(html: string): boolean {
  if (!html) return false;
  return (
    html.includes("framerusercontent.com") ||
    /data-framer[-a-z]*/i.test(html) ||
    /content="Framer/i.test(html) ||
    html.includes("framer-search-index") ||
    html.includes("Made in Framer")
  );
}

/**
 * v2.0: Fetch Framer Search Index JSON
 * Framer publishes ALL content (text + image URLs) as a public JSON blob for SEO.
 * This is the most reliable way to get 100% content from Framer sites.
 */
export async function fetchFramerSearchIndex(html: string): Promise<{
  texts: string[];
  imageUrls: string[];
  colorTokens: Record<string, string>;
} | null> {
  try {
    const primaryMatch = html.match(/name=["']framer-search-index["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/content=["']([^"']+)["'][^>]+name=["']framer-search-index["']/i);
    const fallbackMatch = html.match(/name=["']framer-search-index-fallback["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/content=["']([^"']+)["'][^>]+name=["']framer-search-index-fallback["']/i);

    const searchIndexUrl = primaryMatch?.[1] || fallbackMatch?.[1];
    if (!searchIndexUrl) return null;

    console.log(`[HeadlessScraper] Framer Search Index: ${searchIndexUrl}`);
    const res = await fetch(searchIndexUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;

    const json: any = await res.json();
    const texts: string[] = [];
    const imageUrls: string[] = [];
    const colorTokens: Record<string, string> = {};

    const pages: any[] = json.pages || json.documents || json.items || (Array.isArray(json) ? json : [json]);
    for (const page of pages) {
      const extractTexts = (obj: any) => {
        if (!obj) return;
        if (typeof obj === "string" && obj.trim().length > 2) texts.push(obj.trim());
        else if (Array.isArray(obj)) obj.forEach(extractTexts);
        else if (typeof obj === "object") Object.values(obj).forEach(extractTexts);
      };
      if (page.text) extractTexts(page.text);
      if (page.texts) extractTexts(page.texts);
      if (page.content) extractTexts(page.content);
      if (page.sections) extractTexts(page.sections);

      const jsonStr = JSON.stringify(page);
      const framerImgRegex = /https:\/\/framerusercontent\.com\/images\/[A-Za-z0-9_./-]+/gi;
      const found = jsonStr.match(framerImgRegex) || [];
      found.forEach(u => imageUrls.push(u.replace(/['")\s>]+$/, "")));
    }

    const tokenRegex = /(--token-[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/gi;
    let tokenMatch;
    while ((tokenMatch = tokenRegex.exec(html)) !== null) {
      colorTokens[tokenMatch[1]] = tokenMatch[2].trim();
    }

    const uniqueImages = [...new Set(imageUrls)].filter(u => u.length > 20);
    console.log(`[HeadlessScraper] SearchIndex: ${texts.length} texts, ${uniqueImages.length} imgs, ${Object.keys(colorTokens).length} tokens`);
    return { texts, imageUrls: uniqueImages, colorTokens };
  } catch (err) {
    console.warn("[HeadlessScraper] Framer Search Index failed:", err);
    return null;
  }
}

/**
 * v2.0: Extract ALL image URLs from raw HTML
 * Covers: img src, srcset, data-src, CSS background-image, framerusercontent.com, OG tags
 */
export function extractAllImageUrls(html: string, origin: string): string[] {
  const urls = new Set<string>();
  const resolve = (u: string): string | null => {
    if (!u || u.startsWith("data:") || u === "#") return null;
    try {
      if (u.startsWith("http")) return u;
      if (u.startsWith("//")) return `https:${u}`;
      if (u.startsWith("/")) return `${origin}${u}`;
      return `${origin}/${u}`;
    } catch { return null; }
  };

  let m: RegExpExecArray | null;

  // 1. <img src>
  const r1 = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((m = r1.exec(html)) !== null) { const u = resolve(m[1]); if (u) urls.add(u); }

  // 2. <img srcset>
  const r2 = /<img[^>]+srcset=["']([^"']+)["']/gi;
  while ((m = r2.exec(html)) !== null) {
    m[1].split(",").forEach(p => { const u = resolve(p.trim().split(/\s+/)[0]); if (u) urls.add(u); });
  }

  // 3. data-src / data-lazy / data-bg
  const r3 = /data-(?:src|lazy|original|bg|background|image)=["']([^"']+)["']/gi;
  while ((m = r3.exec(html)) !== null) { const u = resolve(m[1]); if (u) urls.add(u); }

  // 4. inline style background-image (Framer's primary pattern)
  const r4 = /style=["'][^"']*background(?:-image)?:\s*url\(['"]?([^"')]+)['"]?\)/gi;
  while ((m = r4.exec(html)) !== null) { const u = resolve(m[1].trim()); if (u) urls.add(u); }

  // 5. Any url() in style with image extension
  const r5 = /style=["'][^"']*url\(['"]?([^"')]+)['"]?\)/gi;
  while ((m = r5.exec(html)) !== null) {
    const u = resolve(m[1].trim());
    if (u && u.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)/i)) urls.add(u);
  }

  // 6. All framerusercontent.com image URLs anywhere in HTML
  const r6 = /https:\/\/framerusercontent\.com\/images\/[A-Za-z0-9_./-]+/gi;
  while ((m = r6.exec(html)) !== null) { urls.add(m[0].replace(/['")\s>]+$/, "")); }

  // 7. OG / Twitter images
  const r7 = /(?:og:image|twitter:image)[^>]+content=["']([^"']+)["']/gi;
  while ((m = r7.exec(html)) !== null) { const u = resolve(m[1]); if (u) urls.add(u); }

  return [...urls].filter(u => u.length > 10).slice(0, 50);
}

/**
 * v2.0: Extract Framer CSS design tokens (brand colors + fonts)
 */
export function extractFramerCssTokens(html: string): { colors: Record<string, string>; fontFamilies: string[] } {
  const colors: Record<string, string> = {};
  const fontFamilies: string[] = [];
  const seenFonts = new Set<string>();
  let m: RegExpExecArray | null;

  const r1 = /(--token-[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/gi;
  while ((m = r1.exec(html)) !== null) colors[m[1]] = m[2].trim();

  const r2 = /font-family:\s*['"]([^'"]+)['"]/gi;
  while ((m = r2.exec(html)) !== null) {
    const font = m[1].trim();
    if (!font.includes("Placeholder") && !seenFonts.has(font)) {
      seenFonts.add(font);
      fontFamilies.push(font);
    }
  }
  return { colors, fontFamilies };
}

/**
 * v2.0 UPGRADED: Headless Chrome with advanced scroll for Framer/GSAP/scroll-animation sites
 */
export async function fetchRenderedHtmlWithHeadless(url: string): Promise<string | null> {
  let browser: any = null;
  try {
    const executablePath = await getExecutablePath();
    if (!executablePath) {
      console.warn("[HeadlessScraper] No Chrome executable path found.");
      return null;
    }

    console.log(`[HeadlessScraper v2.0] Launching for: ${url}`);

    let puppeteer: any;
    try {
      puppeteer = (await import("puppeteer-core")).default;
    } catch (importErr) {
      console.warn("[HeadlessScraper] puppeteer-core not available:", importErr);
      return null;
    }

    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--window-size=1920,1080",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    // networkidle0 ensures Framer's heavy JS bundles fully execute
    await page.goto(url, { waitUntil: "networkidle0", timeout: 25000 });

    // Phase 1: Wait for Framer Motion hydration
    await new Promise(r => setTimeout(r, 3000));

    // Phase 2: Force-reveal all opacity:0 / visibility:hidden animated elements
    try {
      await page.evaluate(() => {
        (document.querySelectorAll("*") as NodeListOf<HTMLElement>).forEach(el => {
          const s = window.getComputedStyle(el);
          if (s.opacity === "0") el.style.opacity = "1";
          if (s.visibility === "hidden") el.style.visibility = "visible";
          if (s.transform && s.transform !== "none") {
            const match = s.transform.match(/matrix(?:3d)?\([^)]+,\s*([^)]+)\)/);
            if (match && Math.abs(parseFloat(match[1])) > 80) el.style.transform = "none";
          }
        });
      });
    } catch {}

    // Phase 3: 20-step gradual scroll — triggers IntersectionObserver at every step
    try {
      await page.evaluate(async () => {
        const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
        const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 4000);
        const STEPS = 20;
        for (let i = 0; i <= STEPS; i++) {
          window.scrollTo(0, (h / STEPS) * i);
          await delay(200);
        }
        window.scrollTo(0, 0);
        await delay(400);
      });
    } catch {}

    // Phase 4: Force-resolve lazy-loaded images
    try {
      await page.evaluate(async () => {
        (document.querySelectorAll("img[data-src], img[data-lazy], img[loading='lazy']") as NodeListOf<HTMLImageElement>).forEach(img => {
          if ((img as any).dataset.src) img.src = (img as any).dataset.src;
          if ((img as any).dataset.lazy) img.src = (img as any).dataset.lazy;
        });
        await new Promise(r => setTimeout(r, 800));
      });
    } catch {}

    // Phase 5: Carousel traversal
    try {
      await page.evaluate(async () => {
        const nextBtns = document.querySelectorAll(
          '.swiper-button-next, .slick-next, [aria-label*="다음"], [aria-label*="next" i], button[class*="next" i]'
        );
        if (nextBtns.length > 0) {
          for (let i = 0; i < 25; i++) {
            nextBtns.forEach((btn: any) => { try { btn.click(); } catch {} });
            await new Promise(r => setTimeout(r, 120));
          }
        }
        document.querySelectorAll(".swiper, .swiper-container").forEach((el: any) => {
          if (el.swiper) {
            const count = el.swiper.slides?.length || 20;
            for (let i = 0; i < count; i++) { try { el.swiper.slideTo(i); } catch {} }
          }
        });
      });
    } catch {}

    const renderedHtml = await page.content();
    console.log(`[HeadlessScraper v2.0] Captured (${renderedHtml.length} bytes)`);
    return renderedHtml;
  } catch (error) {
    console.error("[HeadlessScraper]", error);
    return null;
  } finally {
    if (browser) { try { await browser.close(); } catch {} }
  }
}
