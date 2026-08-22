async function findVideoAssets() {
  const jsUrl = 'https://easing-perm-64748637.figma.site/_components/v2/9a3e9fa2eba259646193030778dfd9a358f53b3c.js';
  const res = await fetch(jsUrl);
  const text = await res.text();
  
  // Search for video URLs
  const videoMatches = text.match(/https?:\/\/[^"'\s)]+\.(?:mp4|webm|mov|m4v)/gi) || [];
  console.log("Direct video URLs found:", videoMatches);
  
  // Search for video tag or iframe or player
  const vimeoMatches = text.match(/vimeo\.com\/[^"'\s)]+/gi) || [];
  const youtubeMatches = text.match(/youtube\.com\/[^"'\s)]+|youtu\.be\/[^"'\s)]+/gi) || [];
  console.log("Vimeo matches:", vimeoMatches);
  console.log("YouTube matches:", youtubeMatches);
  
  // Search for figma video assets or cdn links
  const figmaVideoMatches = text.match(/https?:\/\/[^"'\s)]*figma[^"'\s)]*\.(?:mp4|webm)/gi) || [];
  console.log("Figma video matches:", figmaVideoMatches);
  
  // Search for 'video', 'muted', 'autoplay', 'loop' in JS
  const videoKeywordMatches = text.match(/.{0,50}(?:video|autoplay|loop|playsinline).{0,50}/gi) || [];
  console.log("Sample video keyword snippets (first 10):", videoKeywordMatches.slice(0, 10));
}

findVideoAssets();
