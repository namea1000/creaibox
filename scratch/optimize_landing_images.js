const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const images = [
  'blog_editor.webp',
  'video_editor.webp',
  'medio_library.webp'
];

const targetDir = path.join(__dirname, '../public/images/landingpage');

async function run() {
  for (const img of images) {
    const filePath = path.join(targetDir, img);
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }
    const tempPath = path.join(targetDir, `temp_${img}`);
    console.log(`Resizing and compressing ${img}...`);
    
    const meta = await sharp(filePath).metadata();
    console.log(`Original size of ${img}: ${meta.width}x${meta.height}`);

    await sharp(filePath)
      .resize({ width: 1600 }) // Downsize to 1600px width for standard web layout optimization
      .webp({ quality: 80, effort: 6 }) // Excellent compression
      .toFile(tempPath);
      
    fs.renameSync(tempPath, filePath);
    
    const newMeta = await sharp(filePath).metadata();
    const size = fs.statSync(filePath).size;
    console.log(`Optimized ${img} -> New size: ${newMeta.width}x${newMeta.height} (${(size / 1024).toFixed(1)} KB)`);
  }
}

run().catch(err => {
  console.error("Image optimization failed:", err);
});
