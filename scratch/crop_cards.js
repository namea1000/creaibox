const sharp = require('sharp');
const fs = require('fs');

async function cropCards() {
  const src = '/Users/a1234/.gemini/antigravity-ide/brain/42b19226-50cf-4c19-86dd-ab4fbe8fa51b/.user_uploaded/media_1787388229951.png';
  
  const meta = await sharp(src).metadata();
  console.log("Source Image Dimensions:", meta.width, meta.height);

  // Card 1: AI Chip (01 AI 개발)
  // Card 2: Lightbulb & Gold (02 AI 컨설팅)
  // Card 3: Students Study (03 AI 교육)
  
  // From screenshot:
  // Card 1 image is roughly in the left card box
  // Card 2 image is in the middle card box
  // Card 3 image is in the right card box

  const h = meta.height;
  const w = meta.width;

  // Let's compute exact crop boxes
  // Card 1: x: w * 0.04 to w * 0.31, y: h * 0.52 to h * 0.79
  // Card 2: x: w * 0.36 to w * 0.63, y: h * 0.56 to h * 0.83
  // Card 3: x: w * 0.69 to w * 0.96, y: h * 0.55 to h * 0.82

  const card1 = {
    left: Math.round(w * 0.04),
    top: Math.round(h * 0.518),
    width: Math.round(w * 0.267),
    height: Math.round(h * 0.274)
  };

  const card2 = {
    left: Math.round(w * 0.366),
    top: Math.round(h * 0.56),
    width: Math.round(w * 0.264),
    height: Math.round(h * 0.27)
  };

  const card3 = {
    left: Math.round(w * 0.692),
    top: Math.round(h * 0.555),
    width: Math.round(w * 0.264),
    height: Math.round(h * 0.27)
  };

  await sharp(src).extract(card1).toFile('public/images/card-ai-dev.png');
  await sharp(src).extract(card2).toFile('public/images/card-ai-consulting.png');
  await sharp(src).extract(card3).toFile('public/images/card-ai-edu.png');

  console.log("✅ Successfully cropped 3 card images!");
}

cropCards().catch(console.error);
