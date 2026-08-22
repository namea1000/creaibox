async function checkUnicode() {
  const jsUrl = 'https://easing-perm-64748637.figma.site/_components/v2/9a3e9fa2eba259646193030778dfd9a358f53b3c.js';
  const res = await fetch(jsUrl);
  const text = await res.text();
  
  // Convert unicode escapes to utf8
  const decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  console.log("Decoded length:", decoded.length);
  console.log("Contains '미래':", decoded.includes('미래'));
  console.log("Contains 'AI라는 경계':", decoded.includes('AI라는 경계'));
  console.log("Contains '교육':", decoded.includes('교육'));
  console.log("Contains '기획':", decoded.includes('기획'));
  console.log("Contains '개발':", decoded.includes('개발'));
  console.log("Contains '홍보':", decoded.includes('홍보'));
  
  const koreanMatches = decoded.match(/[가-힣]{2,}(?:\s+[가-힣]{1,})*/g) || [];
  console.log("Found decoded korean words count:", koreanMatches.length);
  console.log("Sample decoded korean words (first 50):", koreanMatches.slice(0, 50));
}

checkUnicode();
