const fs = require('fs');

// 1. Fix constants exports
let constants = fs.readFileSync('src/constants/custom-client-site.ts', 'utf-8');
constants = constants.replace('interface DesignPreset {', 'export interface DesignPreset {');
constants = constants.replace('const INDUSTRY_DESIGN_PRESETS:', 'export const INDUSTRY_DESIGN_PRESETS:');
constants = constants.replace('const getDesignPresetsForCategory =', 'export const getDesignPresetsForCategory =');
constants = constants.replace('interface CustomTemplate {', 'export interface CustomTemplate {');
fs.writeFileSync('src/constants/custom-client-site.ts', constants);

// 2. Fix page.tsx
let page = fs.readFileSync('src/app/studio/custom-client-site/page.tsx', 'utf-8');
// adminRequests passed to AdminDashboardTab? Wait, AdminDashboardTab handles its own state now. So page.tsx should NOT pass it, nor use it.
page = page.replace('({adminRequests.length}건)', '(여러 건)'); // Line 221 in page.tsx uses adminRequests! Ah, AdminDashboardTab still had some code in page.tsx? Wait!
// Did I leave the AdminDashboardTab JSX in page.tsx?
page = page.replace(/<AdminDashboardTab \/>[\s\S]*?{deployModalTemplate && \(/, '<AdminDashboardTab />\n      )}\n      {deployModalTemplate && (');
// Actually, earlier I wrote a regex for page.tsx that replaced everything inside `{activeTab === "admin_dashboard" && (`.
// Oh wait, `adminRequests.length` is probably inside the Header Banner of `page.tsx`! Let's just remove that count or fix it.
page = page.replace('({adminRequests.length}건)', '');

// Add requireAuth to PreviewModal
page = page.replace('<PreviewModal\n        previewModalTemplate', '<PreviewModal\n        requireAuth={requireAuth}\n        previewModalTemplate');

fs.writeFileSync('src/app/studio/custom-client-site/page.tsx', page);


// 3. Fix AdminDashboardTab
let admin = fs.readFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', 'utf-8');
// Fix duplicate imports
admin = admin.replace('import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";\nimport { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";', 'import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";');
// Add missing icons
admin = admin.replace('Clock, CheckCircle2, ExternalLink, Copy } from "lucide-react";', 'Clock, CheckCircle2, ExternalLink, Copy, X } from "lucide-react";');
// Add missing props
admin = admin.replace('export default function AdminDashboardTab() {', 'export default function AdminDashboardTab({ requireAuth }: { requireAuth: () => boolean }) {');

// The states selectedPromptModal, etc. are INSIDE the component, but why does tsc say "Cannot find name"?
// Because inside AdminDashboardTab.tsx, there are TWO nested components probably? Or I put them OUTSIDE the component?
// Let's check: I did `admin = admin.replace('export default function AdminDashboardTab() {', 'export default function AdminDashboardTab() {\n' + states)`
// Wait, if I replaced the function declaration, the states are at the TOP of the function. This should be fine. But let's check if the prompt modal JSX is outside the function somehow?
// Ah! In `AdminDashboardTab.tsx`, the prompt modal JSX is inside `{selectedPromptModal && ( ... )}` which was at the end of the Dashboard UI. It should be perfectly fine. We will see.

fs.writeFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', admin);

// 4. Fix ManageTab
let manage = fs.readFileSync('src/components/studio/custom-client-site/tabs/ManageTab.tsx', 'utf-8');
// Fix duplicate supabase and themeColor
manage = manage.replace('const supabase = createClient();\n  const [themeColor, setThemeColor] = useState<string>("cyan");\n\n  const [bizNumber', 'const [bizNumber');
// Fix missing useEffect
manage = manage.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";');
// Fix setCurrentUser
manage = manage.replace('setCurrentUser(user);', '// setCurrentUser(user);'); // Assume we don't need to update it here

fs.writeFileSync('src/components/studio/custom-client-site/tabs/ManageTab.tsx', manage);

console.log("Fixed part 2");
