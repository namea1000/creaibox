const fs = require('fs');
const path = require('path');

function replaceInDir(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('sotongcheum')) {
        content = content.replaceAll('sotongcheum', 'sotongchaeum');
        content = content.replaceAll('Sotongcheum', 'Sotongchaeum');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Replaced in: ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, '../src/app/clients/sotongchaeum'));
console.log("Done replacing in sotongchaeum directory!");
