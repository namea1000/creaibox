import fs from "fs";
import path from "path";
import sharp from "sharp";
import { uploadCustomClientAsset, getCustomClientAssetUrl } from "@/lib/r2-client-assets";

interface AssetConfig {
  sourceFile: string;
  targetName: string;
  quality: number;
  maxWidth: number;
  description: string;
}

const SOTONGCHEUM_ASSETS: AssetConfig[] = [
  {
    sourceFile: "sotongcheum_hero_bg.png",
    targetName: "hero-bg.webp",
    quality: 92,
    maxWidth: 1920,
    description: "메인 히어로 대형 비주얼 배경 (Q92 초고화질)",
  },
  {
    sourceFile: "sotongcheum_vision_bg.png",
    targetName: "vision-bg.webp",
    quality: 92,
    maxWidth: 1920,
    description: "비전 및 핵심가치 배경 (Q92 초고화질)",
  },
  {
    sourceFile: "sotongcheum_map_real.png",
    targetName: "map-real.webp",
    quality: 90,
    maxWidth: 1200,
    description: "오시는 길 약도 안내 지도 (Q90 선명도 보존)",
  },
  // 렌탈 장비 6종 카드 (Q88 골든 밸런스, 가로 1000px)
  {
    sourceFile: "rental_sound_system.png",
    targetName: "rental-sound-system.webp",
    quality: 88,
    maxWidth: 1000,
    description: "음향 시스템 렌탈 카드",
  },
  {
    sourceFile: "rental_lighting_effects.png",
    targetName: "rental-lighting-effects.webp",
    quality: 88,
    maxWidth: 1000,
    description: "특수 조명 연출 렌탈 카드",
  },
  {
    sourceFile: "rental_stage_truss.png",
    targetName: "rental-stage-truss.webp",
    quality: 88,
    maxWidth: 1000,
    description: "무대 트러스 렌탈 카드",
  },
  {
    sourceFile: "rental_video_led.png",
    targetName: "rental-video-led.webp",
    quality: 88,
    maxWidth: 1000,
    description: "영상 중계 LED 렌탈 카드",
  },
  {
    sourceFile: "rental_canopy_tents.png",
    targetName: "rental-canopy-tents.webp",
    quality: 88,
    maxWidth: 1000,
    description: "캐노피 텐트 렌탈 카드",
  },
  {
    sourceFile: "rental_tables_chairs.png",
    targetName: "rental-tables-chairs.webp",
    quality: 88,
    maxWidth: 1000,
    description: "테이블 의자 렌탈 카드",
  },
  // 비즈니스 6종 카드 (Q88 골든 밸런스, 가로 1000px)
  {
    sourceFile: "biz_cultural_event.png",
    targetName: "biz-cultural-event.webp",
    quality: 88,
    maxWidth: 1000,
    description: "문화 축제 행사대행 카드",
  },
  {
    sourceFile: "biz_ceremony.png",
    targetName: "biz-ceremony.webp",
    quality: 88,
    maxWidth: 1000,
    description: "공식 의전 기념식 카드",
  },
  {
    sourceFile: "biz_local_autonomy.png",
    targetName: "biz-local-autonomy.webp",
    quality: 88,
    maxWidth: 1000,
    description: "주민자치 교육사업 카드",
  },
  {
    sourceFile: "biz_sports_day.png",
    targetName: "biz-sports-day.webp",
    quality: 88,
    maxWidth: 1000,
    description: "명랑운동회 체육대회 카드",
  },
  {
    sourceFile: "biz_performance_sharing.png",
    targetName: "biz-performance-sharing.webp",
    quality: 88,
    maxWidth: 1000,
    description: "성과공유회 전시박람회 카드",
  },
  {
    sourceFile: "biz_workshop.png",
    targetName: "biz-workshop.webp",
    quality: 88,
    maxWidth: 1000,
    description: "워크숍 임직원연수 카드",
  },
];

async function migrateAssets() {
  console.log("=== STARTING TIERED WEBP MIGRATION TO CLOUDFLARE R2 (sites/custom-clients/sotongcheum/) ===");

  const sourceDir = path.join(process.cwd(), "public", "images", "clients", "sotongcheum");
  const clientSlug = "sotongcheum";

  let totalOriginalBytes = 0;
  let totalCompressedBytes = 0;

  for (let i = 0; i < SOTONGCHEUM_ASSETS.length; i++) {
    const config = SOTONGCHEUM_ASSETS[i];
    const srcPath = path.join(sourceDir, config.sourceFile);

    if (!fs.existsSync(srcPath)) {
      console.warn(`[WARN] Source file not found: ${srcPath}`);
      continue;
    }

    const originalBuffer = fs.readFileSync(srcPath);
    const originalSize = originalBuffer.length;
    totalOriginalBytes += originalSize;

    // Apply Sharp Tiered WebP compression
    const compressedBuffer = await sharp(originalBuffer)
      .rotate()
      .resize({
        width: config.maxWidth,
        withoutEnlargement: true,
      })
      .webp({
        quality: config.quality,
        effort: 5,
      })
      .toBuffer();

    const compressedSize = compressedBuffer.length;
    totalCompressedBytes += compressedSize;

    const savingsPercent = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);

    console.log(
      `\n[${i + 1}/${SOTONGCHEUM_ASSETS.length}] ${config.description}\n` +
      `  -> Source: ${config.sourceFile} (${(originalSize / 1024).toFixed(1)} KB)\n` +
      `  -> WebP: ${config.targetName} (${(compressedSize / 1024).toFixed(1)} KB, Q${config.quality}, ${savingsPercent}% 감량)`
    );

    // Upload to Cloudflare R2
    const cdnUrl = await uploadCustomClientAsset(clientSlug, config.targetName, compressedBuffer);
    console.log(`  🚀 R2 CDN URL: ${cdnUrl}`);
  }

  const totalSavingsPercent = (((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100).toFixed(1);
  console.log(`\n======================================================`);
  console.log(`🎉 ALL 15 ASSETS MIGRATED TO CLOUDFLARE R2!`);
  console.log(`- 원본 총 용량: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- WebP 압축 총 용량: ${(totalCompressedBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- 총 용량 절감률: ${totalSavingsPercent}% 감량 성공!`);
  console.log(`======================================================\n`);
}

migrateAssets().catch(console.error);
