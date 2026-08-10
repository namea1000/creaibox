const fs = require('fs');

const pagePath = 'src/app/studio/custom-client-site/page.tsx';
let pageContent = fs.readFileSync(pagePath, 'utf-8');

const manageStatesAndHandlersRegex = /const \[bizNumber[\s\S]*?}, 1500\);\n  };\n/g;

// Find the block from `const [bizNumber` to the end of `handleSaveConfig`
const match = pageContent.match(/const \[bizNumber[\s\S]*?}, 1500\);\n  };\n/);
if (match) {
  const codeBlock = match[0];
  
  // Remove from page.tsx
  pageContent = pageContent.replace(codeBlock, '');
  fs.writeFileSync(pagePath, pageContent);

  // Insert into ManageTab.tsx
  const managePath = 'src/components/studio/custom-client-site/tabs/ManageTab.tsx';
  let manageContent = fs.readFileSync(managePath, 'utf-8');
  
  manageContent = manageContent.replace('const [mainKeyword, setMainKeyword] = useState<string>("");', 'const [mainKeyword, setMainKeyword] = useState<string>("");\n\n' + codeBlock);
  
  // Also add missing imports to ManageTab.tsx
  manageContent = manageContent.replace(
    'import { Globe, ExternalLink, FileText, TrendingUp, ArrowRight, CreditCard, ShieldCheck, Mail, Phone, MapPin, Building2, Pencil, Trash2, Plus, ListPlus, Flame, Tag, Save, CheckCircle2 } from "lucide-react";',
    'import { Globe, ExternalLink, FileText, TrendingUp, ArrowRight, CreditCard, ShieldCheck, Mail, Phone, MapPin, Building2, Pencil, Trash2, Plus, ListPlus, Flame, Tag, Save, CheckCircle2, RefreshCw, HelpCircle, Sparkles, Check, X, ChevronLeft, ChevronRight } from "lucide-react";\nimport { CustomMenuItem } from "@/constants/custom-client-site";'
  );

  fs.writeFileSync(managePath, manageContent);
  console.log("ManageTab states moved!");
} else {
  console.log("Could not find ManageTab block in page.tsx");
}
