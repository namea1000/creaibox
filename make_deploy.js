const fs = require('fs');

const jsx = fs.readFileSync('temp_deploy.txt', 'utf-8');

// Strip the first line `      {deployModalTemplate && (` and last line `)}`
// Actually `temp_deploy.txt` might have 99 lines where the last is `      )}` and line 100 is `{/* --- KIMI-STYLE...`
const jsxLines = jsx.split('\n');
const endIndex = jsxLines.findIndex(line => line.includes('{/* --- KIMI-STYLE'));
const cleanedJsx = jsxLines.slice(1, endIndex - 1).join('\n'); // omit the first line and last `)}`

const componentContent = `import React, { useState } from "react";
import { Zap, CheckCircle2, Globe, RefreshCw } from "lucide-react";
import { CustomTemplate } from "@/constants/custom-client-site";

interface DeployModalProps {
  deployModalTemplate: CustomTemplate | null;
  setDeployModalTemplate: (tpl: CustomTemplate | null) => void;
  deploySiteName: string;
  setDeploySiteName: (name: string) => void;
  deploySubdomain: string;
  setDeploySubdomain: (subdomain: string) => void;
  deploySuccess: boolean;
  setDeploySuccess: (success: boolean) => void;
  setActiveTab: (tab: "marketplace" | "migration" | "manage" | "request" | "admin_dashboard") => void;
}

export default function DeployModal({
  deployModalTemplate,
  setDeployModalTemplate,
  deploySiteName,
  setDeploySiteName,
  deploySubdomain,
  setDeploySubdomain,
  deploySuccess,
  setDeploySuccess,
  setActiveTab,
}: DeployModalProps) {
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  if (!deployModalTemplate) return null;

  const handleConfirmDeploy = async () => {
    if (!deploySiteName || !deploySubdomain) return;
    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
    }, 1500);
  };

  return (
${cleanedJsx}
  );
}
`;

fs.writeFileSync('src/components/studio/custom-client-site/modals/DeployModal.tsx', componentContent);
console.log("DeployModal created!");
