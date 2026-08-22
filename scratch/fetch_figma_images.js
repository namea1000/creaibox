const fs = require('fs');

async function fetchFigmaImages() {
  try {
    const res = await fetch('https://easing-perm-64748637.figma.site/_json/f5f57572-b34e-4158-8bfa-853916a6bf6a/_index.json');
    const data = await res.json();
    const dataStr = JSON.stringify(data);
    
    // Find all image hash keys or png urls
    const matches = dataStr.match(/[a-f0-9]{32,64}\.(?:png|jpg|jpeg|webp)/g) || [];
    console.log("Figma Image Hashes:", Array.from(new Set(matches)));

    const urls = Array.from(new Set(matches)).map(m => `https://easing-perm-64748637.figma.site/_json/f5f57572-b34e-4158-8bfa-853916a6bf6a/${m}`);
    console.log("Image URLs:", urls);
    fs.writeFileSync('scratch/figma_images.json', JSON.stringify(urls, null, 2));
  } catch (err) {
    console.error("Error fetching figma json:", err);
  }
}

fetchFigmaImages();
