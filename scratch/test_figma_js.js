async function checkJs() {
  const jsUrl = 'https://easing-perm-64748637.figma.site/_components/v2/9a3e9fa2eba259646193030778dfd9a358f53b3c.js';
  const res = await fetch(jsUrl);
  console.log("JS status:", res.status);
  const text = await res.text();
  console.log("JS length:", text.length);
  console.log("Contains '미래':", text.includes('미래'));
  console.log("Contains 'AI라는 경계':", text.includes('AI라는 경계'));
  console.log("Contains 'WE WORK':", text.includes('WE WORK'));
  console.log("Contains '교육':", text.includes('교육'));
  console.log("Contains '기획':", text.includes('기획'));
  console.log("Contains '개발':", text.includes('개발'));
  console.log("Contains '홍보':", text.includes('홍보'));
  
  // Find korean text snippets
  const koreanMatches = text.match(/[가-힣]{2,}(?:\s+[가-힣]{1,})*/g) || [];
  console.log("Found korean words:", koreanMatches.slice(0, 30));
  
  // Find image urls (.png, .jpg, .webp, .svg, figma asset urls)
  const imgMatches = text.match(/https?:\/\/[^"'\s)]+\.(?:png|jpg|jpeg|webp|svg)/gi) || [];
  console.log("Found images in JS:", imgMatches.slice(0, 10));
}

checkJs();
