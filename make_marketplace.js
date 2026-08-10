const fs = require('fs');

const jsx = fs.readFileSync('temp_marketplace.txt', 'utf-8');

// Strip the first and last line of jsx which are `{activeTab === "marketplace" && (` and `)}`
const jsxLines = jsx.split('\n');
const cleanedJsx = jsxLines.slice(1, -2).join('\n'); // omit the first line and last `)}`

const componentContent = `import React, { useState } from "react";
import { Search, CheckCircle2, ShieldCheck, Eye, Zap, Lock, ExternalLink, Maximize2 } from "lucide-react";
import { CustomTemplate, CUSTOM_TEMPLATES } from "@/constants/custom-client-site";

interface MarketplaceTabProps {
  setPreviewModalTemplate: (tpl: CustomTemplate) => void;
  setDeployModalTemplate: (tpl: CustomTemplate) => void;
  setDeploySiteName: (name: string) => void;
  setDeploySubdomain: (subdomain: string) => void;
  setDeploySuccess: (success: boolean) => void;
  requireAuth: (action: () => void) => void;
}

export default function MarketplaceTab({
  setPreviewModalTemplate,
  setDeployModalTemplate,
  setDeploySiteName,
  setDeploySubdomain,
  setDeploySuccess,
  requireAuth,
}: MarketplaceTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체 테마");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "전체 테마",
    ...Array.from(new Set(CUSTOM_TEMPLATES.map((t) => t.category))),
  ];

  const filteredTemplates = CUSTOM_TEMPLATES.filter((tpl) => {
    const matchCat = selectedCategory === "전체 테마" || tpl.category === selectedCategory;
    const matchSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
${cleanedJsx}
  );
}
`;

fs.mkdirSync('src/components/studio/custom-client-site/tabs', { recursive: true });
fs.writeFileSync('src/components/studio/custom-client-site/tabs/MarketplaceTab.tsx', componentContent);
console.log("MarketplaceTab created!");
