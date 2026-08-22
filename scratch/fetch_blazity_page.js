const fs = require('fs');

async function fetchBlazityPage() {
  const res = await fetch('http://localhost:3000/clients/dynamic-renderer/blazity-mett');
  const html = await res.text();
  fs.writeFileSync('scratch/blazity_page_rendered.html', html, 'utf-8');
  console.log("Fetched blazity page length:", html.length);
}

fetchBlazityPage();
