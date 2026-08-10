const fs = require('fs');

const PAGE_FILE = './src/app/studio/custom-client-site/page.tsx';
const CONST_FILE = './src/constants/custom-client-site.ts';

const content = fs.readFileSync(PAGE_FILE, 'utf-8');
const lines = content.split('\n');

// Find the start of the exports
const startIndex = lines.findIndex(l => l.startsWith('export interface CustomMenuItem'));
// Find the line before the default export
const endIndex = lines.findIndex(l => l.startsWith('export default function CustomClientSiteStudioPage'));

if (startIndex !== -1 && endIndex !== -1) {
  const extractedLines = lines.slice(startIndex, endIndex);
  
  // Create constants file content
  const constContent = extractedLines.join('\n');
  fs.writeFileSync(CONST_FILE, constContent);

  // Update page.tsx
  const importStatement = `import {
  CustomMenuItem,
  AdminRequestItem,
  DesignPreset,
  CustomTemplate,
  INDUSTRY_DESIGN_PRESETS,
  CUSTOM_TEMPLATES
} from "@/constants/custom-client-site";
import { INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";\n`;

  const newLines = [
    ...lines.slice(0, startIndex),
    importStatement,
    ...lines.slice(endIndex)
  ];

  fs.writeFileSync(PAGE_FILE, newLines.join('\n'));
  console.log("Extraction complete!");
} else {
  console.log("Could not find boundaries", startIndex, endIndex);
}
