const fs = require('fs');

const adminPath = 'src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx';
let adminContent = fs.readFileSync(adminPath, 'utf-8');
const lines = adminContent.split('\n');

// Find line `{deployModalTemplate && (`
let truncateIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('{/* --- DEPLOY MODAL WIZARD --- */}')) {
    truncateIndex = i;
    break;
  }
}

if (truncateIndex !== -1) {
  let newLines = lines.slice(0, truncateIndex);
  
  // Close the JSX
  newLines.push('  );');
  newLines.push('}');
  
  let newContent = newLines.join('\n');
  
  // Replace imports
  newContent = newContent.replace(
    'import { Globe, ArrowRight, ShieldCheck, Mail, Tag, Activity, RefreshCw } from "lucide-react";',
    'import { Globe, ArrowRight, ShieldCheck, Mail, Tag, Activity, RefreshCw, Check, Eye, Search, Sparkles, Lock, Zap, Award } from "lucide-react";\nimport { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";'
  );
  
  // Insert missing states
  const states = `  const [adminRequests, setAdminRequests] = useState<AdminRequestItem[]>(INITIAL_ADMIN_REQUESTS);
  const [adminFilter, setAdminFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedPromptModal, setSelectedPromptModal] = useState<AdminRequestItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);`;
  
  newContent = newContent.replace(
    'export default function AdminDashboardTab() {',
    'export default function AdminDashboardTab() {\n' + states
  );

  fs.writeFileSync(adminPath, newContent);
  console.log("AdminDashboardTab truncated and fixed!");
} else {
  console.log("Could not find truncate point");
}
