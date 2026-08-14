import puppeteer from "puppeteer-core";
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
  // 1. Check local Chrome paths (for Mac/Windows local dev)
  for (const p of COMMON_CHROME_PATHS) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // 2. Fallback to @sparticuz/chromium for Vercel / AWS Lambda serverless
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

  // SPA typical empty container patterns
  const hasEmptyApp = /<div\s+id=["'](?:app|root|__next|__nuxt)["']\s*>\s*<\/div>/i.test(html);
  const hasSpaNoscript = /JavaScript\s+(?:enabled|required|is\s+disabled)/i.test(html);
  
  // Count real visible img tags
  const imgTags = html.match(/<img\b[^>]*>/gi) || [];
  const realImgCount = imgTags.length;

  // If container is empty or 0 images with heavy JS bundle chunks
  if (hasEmptyApp || (hasSpaNoscript && realImgCount < 3)) {
    return true;
  }

  // Very short body length (< 3000 chars) with scripts
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim() : "";
  if (bodyContent.length < 500 && html.includes("<script")) {
    return true;
  }

  return false;
}

/**
 * Launch Headless Chrome to render full JavaScript DOM and extract real images & HTML
 */
export async function fetchRenderedHtmlWithHeadless(url: string): Promise<string | null> {
  let browser: any = null;
  try {
    const executablePath = await getExecutablePath();
    if (!executablePath) {
      console.warn("[HeadlessScraper] No Chrome executable path found.");
      return null;
    }

    console.log(`[HeadlessScraper 🚀] Launching Headless Chrome for SPA rendering: ${url}`);

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

    // Navigate and wait for network activity to settle (JS rendering completion)
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 15000,
    });

    // Optional short wait for dynamic animations / slider mounts
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 🌟 Auto-traverse Swiper / Slick / Carousel sliders to force all virtual slides (up to 25 slides) to mount into DOM
    try {
      await page.evaluate(async () => {
        // 1. If Swiper instances exist on window or elements, trigger loop
        const nextButtons = document.querySelectorAll('.swiper-button-next, .slick-next, [aria-label*="다음"], [aria-label*="next" i], button[class*="next" i]');
        if (nextButtons.length > 0) {
          for (let i = 0; i < 20; i++) {
            nextButtons.forEach((btn: any) => {
              try { btn.click(); } catch {}
            });
            await new Promise((r) => setTimeout(r, 150));
          }
        }

        // 2. Also simulate Swiper instance jump if available
        const swiperElements = document.querySelectorAll('.swiper, .swiper-container');
        swiperElements.forEach((el: any) => {
          if (el.swiper) {
            try {
              const count = el.swiper.slides ? el.swiper.slides.length : 20;
              for (let i = 0; i < count; i++) {
                el.swiper.slideTo(i);
              }
            } catch {}
          }
        });

        // 3. Scroll down to trigger lazy loading of images across the entire page
        window.scrollTo(0, document.body.scrollHeight / 2);
        await new Promise((r) => setTimeout(r, 600));
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 600));
        window.scrollTo(0, 0);
      });
    } catch {}

    const renderedHtml = await page.content();
    console.log(`[HeadlessScraper 🟢] Successfully captured rendered SPA DOM (Length: ${renderedHtml.length})`);
    return renderedHtml;
  } catch (error) {
    console.error("[HeadlessScraper ❌] Failed to scrape with Headless Chrome:", error);
    return null;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}
