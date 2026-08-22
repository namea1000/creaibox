async function testClean() {
  const res = await fetch('https://easing-perm-64748637.figma.site/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
  });
  const htmlText = await res.text();
  console.log("Raw HTML Length:", htmlText.length);
  
  // What does cleanHtml do?
  const cleanHtml = htmlText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  
  console.log("Clean HTML Length:", cleanHtml.length);
  console.log("Clean HTML content snippet:\n", cleanHtml);

  // Check if text is inside script tags (e.g. JSON or figma payload in script)
  const scriptMatches = htmlText.match(/<script[\s\S]*?<\/script>/gi) || [];
  console.log("Number of script tags:", scriptMatches.length);
  for (let i = 0; i < scriptMatches.length; i++) {
    const s = scriptMatches[i];
    if (s.includes("미래") || s.includes("교육") || s.includes("WE WORK") || s.includes("AI라는 경계")) {
      console.log(`Found content in script #${i}! Length: ${s.length}`);
      console.log(s.substring(0, 1000));
    }
  }
}

testClean();
