const fs = require('fs');

const adminPath = 'src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx';
let admin = fs.readFileSync(adminPath, 'utf-8');

// The file currently has:
// return (
//   <div className="space-y-8 animate-fade-in-up"> ... </div>
// )}
// {/* --- ADMIN AI EXECUTION PROMPT MODAL --- */}
// {selectedPromptModal && ( ... )}
// {/* --- TAB 6 (REMOVED: Use /studio/domain-search instead) --- */}
// ... domain search code ...

// Let's rewrite it from scratch cleanly using a regex that just takes the two valid blocks we want.

const pageContent = fs.readFileSync('src/app/studio/custom-client-site/page.tsx', 'utf-8');
// Wait, I already removed them from page.tsx!
// But I have `regen_admin_fix.js` which fetched from Git HEAD!
const childProcess = require('child_process');
const originalPageContent = childProcess.execSync('git show HEAD:src/app/studio/custom-client-site/page.tsx').toString();

// Extract Admin Dashboard Block
const dashboardMatch = originalPageContent.match(/{activeTab === "admin_dashboard" && \(\s*([\s\S]*?)\s*\)}\s*\{\/\* --- ADMIN AI EXECUTION PROMPT MODAL --- \*\/\}/);
const dashboardJSX = dashboardMatch[1];

// Extract Admin Prompt Modal Block
const promptModalMatch = originalPageContent.match(/\{\/\* --- ADMIN AI EXECUTION PROMPT MODAL --- \*\/\}[\s\S]*?{selectedPromptModal && \(\s*([\s\S]*?)\s*\)}\s*\{\/\* --- TAB 6/);
const promptModalJSX = promptModalMatch[1];

const cleanComponent = `import React, { useState } from "react";
import { Globe, ArrowRight, ShieldCheck, Mail, Tag, Activity, RefreshCw, Check, Eye, Search, Sparkles, Lock, Zap, Award, Bot, FileText, Smartphone, Laptop, Clock, CheckCircle2, ExternalLink, Copy, X } from "lucide-react";
import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";

export default function AdminDashboardTab({ requireAuth }: { requireAuth: (cb?: () => void) => boolean | void }) {
  const [adminRequests, setAdminRequests] = useState<AdminRequestItem[]>(INITIAL_ADMIN_REQUESTS);
  const [adminFilter, setAdminFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedPromptModal, setSelectedPromptModal] = useState<AdminRequestItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  return (
    <>
      \${dashboardJSX}
      {selectedPromptModal && (
        \${promptModalJSX}
      )}
    </>
  );
}
`;

fs.writeFileSync(adminPath, cleanComponent.replace(/\$\{dashboardJSX\}/g, dashboardJSX).replace(/\$\{promptModalJSX\}/g, promptModalJSX));
console.log("Rewrote AdminDashboardTab.tsx cleanly!");
