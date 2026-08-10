const fs = require('fs');

const jsx = fs.readFileSync('temp_admin.txt', 'utf-8');

// Strip the first and last line of jsx which are `{activeTab === "admin_dashboard" && (` and `)}`
const jsxLines = jsx.split('\n');
const cleanedJsx = jsxLines.slice(1, -2).join('\n'); // omit the first line and last `)}`

const componentContent = `import React, { useState } from "react";
import { Bot, CheckCircle2, ChevronRight, Copy, Terminal, ExternalLink, X, Plus } from "lucide-react";
import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";

export default function AdminDashboardTab() {
  const [adminRequests, setAdminRequests] = useState<AdminRequestItem[]>(INITIAL_ADMIN_REQUESTS);
  const [adminFilter, setAdminFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedPromptModal, setSelectedPromptModal] = useState<AdminRequestItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  return (
${cleanedJsx}
  );
}
`;

fs.writeFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', componentContent);
console.log("AdminDashboardTab created!");
