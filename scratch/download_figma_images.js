const fs = require('fs');
const path = require('path');

const urls = JSON.parse(fs.readFileSync('scratch/figma_images.json', 'utf-8'));

async function downloadAll() {
  const dir = 'scratch/figma_downloads';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = path.basename(url);
    const dest = path.join(dir, `${i}_${filename}`);
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(buffer));
        console.log(`[${i}] Downloaded ${filename} (${buffer.byteLength} bytes)`);
      }
    } catch (e) {
      console.error(`Failed ${url}`, e);
    }
  }
}

downloadAll();
