async function testFigmaJson() {
  const jsonUrl = 'https://easing-perm-64748637.figma.site/_json/f5f57572-b34e-4158-8bfa-853916a6bf6a/_index.json';
  const res = await fetch(jsonUrl);
  console.log("JSON status:", res.status);
  const data = await res.json();
  console.log("JSON data keys:", Object.keys(data));
  const str = JSON.stringify(data);
  console.log("JSON total length:", str.length);
  console.log("Contains '미래':", str.includes('미래'));
  console.log("Contains 'AI라는 경계':", str.includes('AI라는 경계'));
  console.log("Contains 'WE WORK':", str.includes('WE WORK'));
  console.log("Contains '교육':", str.includes('교육'));
  console.log("Contains '기획':", str.includes('기획'));
  console.log("Contains '개발':", str.includes('개발'));
  console.log("Contains '홍보':", str.includes('홍보'));
  
  // Extract all texts
  function extractStrings(obj, set = new Set()) {
    if (typeof obj === 'string') {
      if (obj.length > 1 && !obj.startsWith('http') && !obj.startsWith('css-')) {
        set.add(obj);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(item => extractStrings(item, set));
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(val => extractStrings(val, set));
    }
    return set;
  }
  
  const strings = Array.from(extractStrings(data));
  console.log("Extracted strings count:", strings.length);
  console.log("Sample strings (first 30):\n", strings.slice(0, 30));
}

testFigmaJson();
