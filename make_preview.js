const fs = require('fs');

const jsx = fs.readFileSync('temp_preview.txt', 'utf-8');

// Strip the first line `     {previewModalTemplate && (` and last line `)}`
const jsxLines = jsx.split('\n');
const cleanedJsx = jsxLines.slice(1, -2).join('\n');

const componentContent = `import React from "react";
import { Monitor, Tablet, Smartphone, ExternalLink, X, Maximize2 } from "lucide-react";
import { CustomTemplate } from "@/constants/custom-client-site";

interface PreviewModalProps {
  previewModalTemplate: CustomTemplate | null;
  setPreviewModalTemplate: (tpl: CustomTemplate | null) => void;
  previewDeviceMode: "desktop" | "tablet" | "mobile";
  setPreviewDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  onDeploy: (tpl: CustomTemplate) => void;
}

export default function PreviewModal({
  previewModalTemplate,
  setPreviewModalTemplate,
  previewDeviceMode,
  setPreviewDeviceMode,
  onDeploy,
}: PreviewModalProps) {
  if (!previewModalTemplate) return null;

  return (
${cleanedJsx}
  );
}
`;

fs.mkdirSync('src/components/studio/custom-client-site/modals', { recursive: true });
fs.writeFileSync('src/components/studio/custom-client-site/modals/PreviewModal.tsx', componentContent);
console.log("PreviewModal created!");
