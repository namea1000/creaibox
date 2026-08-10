const fs = require('fs');
const pagePath = 'src/app/studio/custom-client-site/page.tsx';
let page = fs.readFileSync(pagePath, 'utf-8');

// Remove categories array and filteredTemplates
page = page.replace(/const categories = \[[\s\S]*?\];\n\n/g, '');
page = page.replace(/const filteredTemplates = CUSTOM_TEMPLATES\.filter\(\(tpl\) => {[\s\S]*?\}\);\n\n/g, '');

// Also clean up any other missing references: setIsSubmittingReq
page = page.replace(/const handleSendRequest = async \(e: React\.FormEvent\) => {[\s\S]*?}, 1200\);\n  };\n/g, '');
page = page.replace(/const \[isSubmittingReq, setIsSubmittingReq\] = useState<boolean>\(false\);\n/g, '');
page = page.replace(/const \[reqSuccess, setReqSuccess\] = useState<boolean>\(false\);\n/g, '');

fs.writeFileSync(pagePath, page);

// AdminDashboardTab fixes
const adminPath = 'src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx';
let admin = fs.readFileSync(adminPath, 'utf-8');
admin = admin.replace('import { Globe, ArrowRight, ShieldCheck, Mail, Tag, Activity, RefreshCw, Check, Eye, Search, Sparkles, Lock, Zap, Award, Bot, FileText, Smartphone, Laptop } from "lucide-react";',
'import { Globe, ArrowRight, ShieldCheck, Mail, Tag, Activity, RefreshCw, Check, Eye, Search, Sparkles, Lock, Zap, Award, Bot, FileText, Smartphone, Laptop, Clock, CheckCircle2, ExternalLink, Copy } from "lucide-react";\nimport { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";');
fs.writeFileSync(adminPath, admin);

// PreviewModal fixes
const previewPath = 'src/components/studio/custom-client-site/modals/PreviewModal.tsx';
let preview = fs.readFileSync(previewPath, 'utf-8');
preview = preview.replace('export default function PreviewModal({', `interface PreviewModalProps {
  previewModalTemplate: CustomTemplate | null;
  setPreviewModalTemplate: (tpl: CustomTemplate | null) => void;
  previewDeviceMode: "desktop" | "mobile";
  setPreviewDeviceMode: (mode: "desktop" | "mobile") => void;
  onDeploy: (tpl: CustomTemplate) => void;
  requireAuth: () => boolean;
}

export default function PreviewModal({`);
preview = preview.replace('}: {', '}: PreviewModalProps) {');
preview = preview.replace('  previewModalTemplate: any;', '');
preview = preview.replace('  setPreviewModalTemplate: any;', '');
preview = preview.replace('  previewDeviceMode: any;', '');
preview = preview.replace('  setPreviewDeviceMode: any;', '');
preview = preview.replace('  onDeploy: any;', '');
preview = preview.replace('import { Smartphone, Monitor, Zap, RefreshCw, ArrowRight, ExternalLink } from "lucide-react";', 'import { Smartphone, Monitor, Zap, RefreshCw, ArrowRight, ExternalLink } from "lucide-react";\nimport { CustomTemplate } from "@/constants/custom-client-site";');
fs.writeFileSync(previewPath, preview);

// ManageTab fixes
const managePath = 'src/components/studio/custom-client-site/tabs/ManageTab.tsx';
let manage = fs.readFileSync(managePath, 'utf-8');
manage = manage.replace('const [themeColor, setThemeColor] = useState<string>("cyan");', '');
manage = manage.replace('const supabase = createClient();', 'const supabase = createClient();\n  const [themeColor, setThemeColor] = useState<string>("cyan");');
fs.writeFileSync(managePath, manage);

// Make sure CustomTemplate in constants is exported properly
let constants = fs.readFileSync('src/constants/custom-client-site.ts', 'utf-8');
constants = constants.replace('export export', 'export');
constants = constants.replace('type CustomTemplate = {', 'export type CustomTemplate = {');
constants = constants.replace('type DesignPreset = {', 'export type DesignPreset = {');
constants = constants.replace('const INDUSTRY_DESIGN_PRESETS: DesignPreset[] = [', 'export const INDUSTRY_DESIGN_PRESETS: DesignPreset[] = [');
constants = constants.replace('const INITIAL_ADMIN_REQUESTS: AdminRequestItem[] = [', 'export const INITIAL_ADMIN_REQUESTS: AdminRequestItem[] = [');
fs.writeFileSync('src/constants/custom-client-site.ts', constants);

console.log("Fixed stuff");
