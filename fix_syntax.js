const fs = require('fs');

const fixComponent = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  // Remove `)}` that appears right before `  );`
  content = content.replace(/\n\s*\)\}\n\s*\);\n\}/g, '\n  );\n}');
  fs.writeFileSync(filePath, content);
};

const components = [
  'src/components/studio/custom-client-site/tabs/MarketplaceTab.tsx',
  'src/components/studio/custom-client-site/tabs/MigrationTab.tsx',
  'src/components/studio/custom-client-site/tabs/ManageTab.tsx',
  'src/components/studio/custom-client-site/tabs/RequestTab.tsx',
  'src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx',
  'src/components/studio/custom-client-site/modals/PreviewModal.tsx',
  'src/components/studio/custom-client-site/modals/DeployModal.tsx'
];

components.forEach(fixComponent);

const pagePath = 'src/app/studio/custom-client-site/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf-8');
// Fix the literal '\n' issue
if (pageContent.includes('\\n')) {
  pageContent = pageContent.replace(/\\n/g, '\n');
  fs.writeFileSync(pagePath, pageContent);
}

// Also make sure getDesignPresetsForCategory is exported in src/constants/custom-client-site.ts
const constantsPath = 'src/constants/custom-client-site.ts';
let constantsContent = fs.readFileSync(constantsPath, 'utf-8');
if (constantsContent.includes('const getDesignPresetsForCategory =')) {
  constantsContent = constantsContent.replace('const getDesignPresetsForCategory =', 'export const getDesignPresetsForCategory =');
  fs.writeFileSync(constantsPath, constantsContent);
}

console.log('Fixed syntax errors!');
