const cheerio = require('cheerio');

const html = `<header class="w-full border-b border-gray-100 font-sans"><div class="flex justify-between items-center px-6 py-4">...</div></header>`;
const $ = cheerio.load(html, null, false);
const header = $('header').first();

if (header.length > 0) {
  // Add sticky classes if they don't exist
  header.addClass('sticky top-0 z-50');
  
  // Also ensure the header has a background color, otherwise it's transparent!
  // Checking if it has bg- classes
  const classes = header.attr('class') || '';
  if (!classes.includes('bg-')) {
     header.addClass('bg-white'); // Safe fallback
  }
}
console.log($.html());
