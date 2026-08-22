const fs = require('fs');

async function fetchFuturemind2z3u() {
  const res = await fetch('http://localhost:3000/clients/dynamic-renderer/futuremind-2z3u');
  const html = await res.text();
  fs.writeFileSync('scratch/futuremind_2z3u_rendered.html', html, 'utf-8');
  console.log("Fetched futuremind-2z3u rendered html length:", html.length);
}

fetchFuturemind2z3u();
