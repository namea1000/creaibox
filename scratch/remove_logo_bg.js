const sharp = require('sharp');
const fs = require('fs');

async function removeBackground() {
  const inputPath = 'public/images/futuremind-logo.png';
  const outputPath = 'public/images/futuremind-logo-transparent.png';

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Image info: ${width}x${height}, channels: ${channels}`);

  // Create RGBA buffer
  const rgbaBuffer = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const a = channels === 4 ? data[i * channels + 3] : 255;

    // Dark background color around futuremind logo is roughly dark navy/black: r < 25, g < 30, b < 45
    // Let's check distance to the dark navy background (sample corner pixels)
    // If the pixel is very dark, make it transparent
    const isDarkBg = (r < 25 && g < 30 && b < 50) || (r < 18 && g < 18 && b < 25);

    if (isDarkBg) {
      rgbaBuffer[i * 4] = 0;
      rgbaBuffer[i * 4 + 1] = 0;
      rgbaBuffer[i * 4 + 2] = 0;
      rgbaBuffer[i * 4 + 3] = 0; // Transparent
    } else {
      // Keep original pixel
      rgbaBuffer[i * 4] = r;
      rgbaBuffer[i * 4 + 1] = g;
      rgbaBuffer[i * 4 + 2] = b;
      rgbaBuffer[i * 4 + 3] = a;
    }
  }

  await sharp(rgbaBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png()
  .toFile(outputPath);

  console.log("✅ Transparent logo saved to:", outputPath);
}

removeBackground().catch(console.error);
