async function dumpFuturemindAll() {
  const jsUrl = 'https://easing-perm-64748637.figma.site/_components/v2/9a3e9fa2eba259646193030778dfd9a358f53b3c.js';
  const res = await fetch(jsUrl);
  const text = await res.text();
  const decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  // Extract all images
  const imgs = Array.from(new Set(decoded.match(/https?:\/\/[^"'\s)]+\.(?:png|jpg|jpeg|webp|svg)/gi) || []));
  console.log("Images found (" + imgs.length + "):", imgs);
  
  // Find all sentences
  const sentences = decoded.match(/["']([가-힣A-Za-z0-9\s,.\-·/()!?~]{3,120})["']/g) || [];
  const cleanSentences = Array.from(new Set(
    sentences
      .map(s => s.replace(/^["']|["']$/g, '').trim())
      .filter(s => s.length >= 2 && !s.startsWith('css-') && !s.includes('function') && !s.includes('return') && !s.includes('webpack'))
  ));
  
  console.log("\nTotal unique sentences:", cleanSentences.length);
  console.log(cleanSentences.slice(0, 100).join('\n'));
}

dumpFuturemindAll();
