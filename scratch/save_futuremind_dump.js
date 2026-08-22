const fs = require('fs');

async function saveFullDump() {
  const jsUrl = 'https://easing-perm-64748637.figma.site/_components/v2/9a3e9fa2eba259646193030778dfd9a358f53b3c.js';
  const res = await fetch(jsUrl);
  const text = await res.text();
  const decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  const koreanMatches = decoded.match(/[가-힣0-9A-Za-z\s,.\-·/()!?~]{2,}/g) || [];
  const uniqueKorean = Array.from(new Set(
    koreanMatches
      .map(k => k.trim())
      .filter(k => /[가-힣]/.test(k) && k.length >= 2 && !k.includes('webpack') && !k.includes('function') && !k.includes('return'))
  ));
  
  fs.writeFileSync('scratch/futuremind_full_text.txt', uniqueKorean.join('\n'), 'utf-8');
  console.log("Saved", uniqueKorean.length, "lines to scratch/futuremind_full_text.txt");
}

saveFullDump();
