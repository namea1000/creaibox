const fs = require('fs');

const pagePath = 'src/app/studio/custom-client-site/page.tsx';
const pageContent = fs.readFileSync(pagePath, 'utf-8');
const lines = pageContent.split('\n');

// The block starts at `const [bizNumber, setBizNumber]` (line 111-1)
// The block ends at `  };` (line 386-1)

let startIndex = -1;
let endIndex = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const [bizNumber, setBizNumber] = useState<string>("");')) {
    startIndex = i;
  }
  if (lines[i] === '  // Handle Deploy Modal Submit') {
    endIndex = i - 1;
    break;
  }
}

if (startIndex !== -1 && endIndex !== -1) {
  const block = lines.slice(startIndex, endIndex).join('\n');
  
  // Remove from page.tsx
  const newPageContent = [
    ...lines.slice(0, startIndex),
    ...lines.slice(endIndex)
  ].join('\n');
  fs.writeFileSync(pagePath, newPageContent);

  // Insert into ManageTab.tsx
  const managePath = 'src/components/studio/custom-client-site/tabs/ManageTab.tsx';
  let manageContent = fs.readFileSync(managePath, 'utf-8');
  
  // insert after mainKeyword
  manageContent = manageContent.replace('const [mainKeyword, setMainKeyword] = useState<string>("");', 'const [mainKeyword, setMainKeyword] = useState<string>("");\n\n' + block);
  
  // Add missing imports to ManageTab.tsx
  // Let's just replace the whole import block for lucide-react and add supabase
  manageContent = manageContent.replace(
    /import {[^}]+} from "lucide-react";/,
    'import { Globe, ExternalLink, FileText, TrendingUp, ArrowRight, CreditCard, ShieldCheck, Mail, Phone, MapPin, Building2, Pencil, Trash2, Plus, ListPlus, Flame, Tag, Save, CheckCircle2, RefreshCw, HelpCircle, Sparkles, Check, X, ChevronLeft, ChevronRight } from "lucide-react";\nimport { CustomMenuItem } from "@/constants/custom-client-site";\nimport { createClient } from "@/utils/supabase/client";'
  );
  
  // Also add `const supabase = createClient();` inside the component
  manageContent = manageContent.replace(
    'const [companyName, setCompanyName] = useState<string>("");',
    'const supabase = createClient();\n  const [companyName, setCompanyName] = useState<string>("");'
  );
  
  fs.writeFileSync(managePath, manageContent);
  console.log("Moved lines " + startIndex + " to " + endIndex + " successfully!");
} else {
  console.log("Could not find the block");
}
