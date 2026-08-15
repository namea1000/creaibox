import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer-core",
    "pdf-parse",
    "pdfjs-dist",
    "sharp",
    "@ffmpeg/ffmpeg",
    "@ffmpeg/util",
  ],
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@sparticuz/chromium/**",
      "node_modules/pdf-parse/test/**",
      "node_modules/pdf-parse/docs/**",
      "node_modules/@ffmpeg/**",
      "node_modules/puppeteer-core/lib/**",
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  async headers() {
    return [
      {
        // 구글 미디어 assets 1년 무상 CDN 영구 캐싱
        source: "/api/free-assets/proxy",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      // ── Cloudflare R2 CDN (템플릿 썸네일) ──
      {
        protocol: "https",
        hostname: "*.r2.dev",       // Cloudflare R2 pub-xxxx.r2.dev 기본 CDN
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",  // R2 direct endpoint fallback
      },
      {
        protocol: "https",
        hostname: "assets.creaibox.com",  // 커스텀 CDN 도메인 (있는 경우)
      },
      {
        protocol: "https",
        hostname: "pub.creaibox.com",     // 커스텀 CDN 도메인 대안
      },
    ],
  },
};

export default nextConfig;
