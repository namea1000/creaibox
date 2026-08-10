const fs = require('fs');

const pagePath = 'src/app/studio/custom-client-site/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf-8');

// The original page.tsx had a block `{activeTab === "admin_dashboard" && (`
// Wait, I already removed it from page.tsx!
// Actually, earlier I said I restored page.tsx via git, but then I used a regex replace script.
// Let's just restore `AdminDashboardTab.tsx` from git? No, it's not tracked.
// But I have the `page.tsx` in git!
// I can just get the block from git!

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
  // Extract the JSX inside `{activeTab === "admin_dashboard" && (`
  // Which is from startIndex + 1 to endIndex - 2 (since the line before deploy modal is `)}`)
  let block = lines.slice(startIndex + 1, endIndex - 1).join('\n');
  
  // Wrap in component
  const content = `import React, { useState } from "react";
import { Globe, ArrowRight, ShieldCheck, Mail, Tag, Activity, RefreshCw, Check, Eye, Search, Sparkles, Lock, Zap, Award, Bot, FileText, Smartphone, Laptop } from "lucide-react";
import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";

export default function AdminDashboardTab() {
  const [adminRequests, setAdminRequests] = useState<AdminRequestItem[]>(INITIAL_ADMIN_REQUESTS);
  const [adminFilter, setAdminFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedPromptModal, setSelectedPromptModal] = useState<AdminRequestItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  return (
\${block}
  );
}
`;

  fs.writeFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', content);
  console.log("AdminDashboardTab regenerated!");
}
