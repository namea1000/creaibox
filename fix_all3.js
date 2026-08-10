const fs = require('fs');

// 1. Fix page.tsx AdminDashboardTab and PreviewModal props
let page = fs.readFileSync('src/app/studio/custom-client-site/page.tsx', 'utf-8');
page = page.replace('<AdminDashboardTab />', '<AdminDashboardTab requireAuth={requireAuth} setActiveTab={setActiveTab} />');
page = page.replace('<PreviewModal\n        requireAuth={requireAuth}\n        previewModalTemplate', '<PreviewModal\n        requireAuth={requireAuth}\n        setDeployModalTemplate={setDeployModalTemplate}\n        setDeploySiteName={setDeploySiteName}\n        setDeploySubdomain={setDeploySubdomain}\n        setDeploySuccess={setDeploySuccess}\n        previewModalTemplate');
fs.writeFileSync('src/app/studio/custom-client-site/page.tsx', page);

// 2. Fix AdminDashboardTab
let admin = fs.readFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', 'utf-8');
admin = admin.replace('export default function AdminDashboardTab({ requireAuth }: { requireAuth: (cb?: () => void) => boolean | void }) {', 'export default function AdminDashboardTab({ requireAuth, setActiveTab }: { requireAuth: (cb?: () => void) => boolean | void, setActiveTab: (tab: string) => void }) {');
fs.writeFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', admin);

// 3. Fix PreviewModal
let preview = fs.readFileSync('src/components/studio/custom-client-site/modals/PreviewModal.tsx', 'utf-8');
preview = preview.replace('previewDeviceMode: "desktop" | "mobile";', 'previewDeviceMode: "desktop" | "tablet" | "mobile";');
preview = preview.replace('setPreviewDeviceMode: (mode: "desktop" | "mobile") => void;', 'setPreviewDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;');
preview = preview.replace('requireAuth: () => boolean;', 'requireAuth: (cb?: () => void) => boolean | void;\n  setDeployModalTemplate: (tpl: any) => void;\n  setDeploySiteName: (name: string) => void;\n  setDeploySubdomain: (name: string) => void;\n  setDeploySuccess: (b: boolean) => void;');
// Add Zap to imports
preview = preview.replace('import { Smartphone, Monitor, Zap, RefreshCw, ArrowRight, ExternalLink } from "lucide-react";', 'import { Smartphone, Monitor, Zap, RefreshCw, ArrowRight, ExternalLink } from "lucide-react";');
// The error says "Cannot find name 'Zap'". Wait, Zap is in the import line! But maybe my import replacement regex earlier missed something. Let's just import Zap manually if needed.
// Ah, `import { Smartphone, Tablet, Monitor, X, ExternalLink, RefreshCw, Eye, CheckCircle2, Zap } from "lucide-react";` was the original!
// Let me just replace the lucide import completely.
preview = preview.replace(/import {.*?lucide-react";/, 'import { Smartphone, Tablet, Monitor, X, ExternalLink, RefreshCw, Eye, CheckCircle2, Zap, ArrowRight } from "lucide-react";');
// Also, destructure the new props in PreviewModal
preview = preview.replace('}: PreviewModalProps) {', '  setDeployModalTemplate,\n  setDeploySiteName,\n  setDeploySubdomain,\n  setDeploySuccess,\n  requireAuth\n}: PreviewModalProps) {');
fs.writeFileSync('src/components/studio/custom-client-site/modals/PreviewModal.tsx', preview);

// 4. Fix ManageTab
let manage = fs.readFileSync('src/components/studio/custom-client-site/tabs/ManageTab.tsx', 'utf-8');
const lines = manage.split('\n');
let newLines = [];
let supabaseCount = 0;
let themeColorCount = 0;
for (let line of lines) {
  if (line.includes('const supabase = createClient();')) {
    if (supabaseCount === 0) newLines.push(line);
    supabaseCount++;
  } else if (line.includes('const [themeColor, setThemeColor] = useState<string>("cyan");')) {
    if (themeColorCount === 0) newLines.push(line);
    themeColorCount++;
  } else {
    newLines.push(line);
  }
}
fs.writeFileSync('src/components/studio/custom-client-site/tabs/ManageTab.tsx', newLines.join('\n'));

console.log("Fixed everything.");
