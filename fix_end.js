const fs = require('fs');
const file = 'src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx';
let content = fs.readFileSync(file, 'utf-8');

// replace the last `)}` and `);` and `}` and whatever literal `\n` is there.
const clean = content.replace(/\n\s*\}\)\n  \);\n\}\n*$/, '');
const superClean = clean.replace(/\n\s*\)\}\n\s*\);\n\}/, '');
const ultraClean = superClean.replace(/\n\s*\)\}\\n  \);\\n\}/, '');

fs.writeFileSync(file, ultraClean.trim() + '\n  );\n}');
console.log('Fixed end of AdminDashboardTab.tsx!');
