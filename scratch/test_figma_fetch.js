async function checkFigma() {
  const urls = [
    'http://futuremind.kr',
    'https://easing-perm-64748637.figma.site/',
    'https://easing-perm-64748637.figma.site'
  ];

  for (const u of urls) {
    console.log(`\n--- Fetching: ${u} ---`);
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow'
      });
      console.log('Status:', res.status, 'Final URL:', res.url);
      const text = await res.text();
      console.log('Length:', text.length);
      console.log('Snippet (first 500 chars):', text.substring(0, 500));
      
      // Check for frameset
      const isFrameset = /<frameset[\s\S]*?>/i.test(text);
      const frameMatch = text.match(/<frame[\s\S]*?src=["']([^"']+)["']/i);
      console.log('isFrameset:', isFrameset, 'frameSrc:', frameMatch ? frameMatch[1] : null);
      
      // Check for keywords like futuremind, AI, etc
      console.log('Contains "futuremind":', text.includes('futuremind') || text.includes('미래'));
      console.log('Contains "WE WORK":', text.includes('WE WORK') || text.includes('work') || text.includes('Work'));
    } catch (e) {
      console.error('Error fetching', u, e.message);
    }
  }
}

checkFigma();
