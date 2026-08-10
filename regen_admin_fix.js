const fs = require('fs');
const childProcess = require('child_process');

const originalPageContent = childProcess.execSync('git show HEAD:src/app/studio/custom-client-site/page.tsx').toString();
const lines = originalPageContent.split('\n');

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{activeTab === "admin_dashboard" && (')) {
    startIndex = i;
  }
  if (lines[i].includes('{/* --- DEPLOY MODAL WIZARD --- */}')) {
    endIndex = i;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  let block = lines.slice(startIndex + 1, endIndex - 1).join('\n');
  
  const content = `import React, { useState } from "react";
import { Globe, ArrowRight, ShieldCheck, Mail, Tag, Activity, RefreshCw, Check, Eye, Search, Sparkles, Lock, Zap, Award, Bot, FileText, Smartphone, Laptop } from "lucide-react";
import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";

export default function AdminDashboardTab() {
  const [adminRequests, setAdminRequests] = useState<AdminRequestItem[]>(INITIAL_ADMIN_REQUESTS);
  const [adminFilter, setAdminFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedPromptModal, setSelectedPromptModal] = useState<AdminRequestItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  return (
${block}
  );
}
`;

  fs.writeFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', content);
  console.log("AdminDashboardTab regenerated for real!");
}
