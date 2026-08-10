const fs = require('fs');

// 1. AdminDashboardTab.tsx
let admin = fs.readFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', 'utf-8');
admin = admin.replace(/data\.map\(d => \(\{/g, 'data.map((d: any) => ({');
admin = admin.replace(/\{req\.features\.map\(\(f, i\) => \(/g, '{req.features.map((f: any, i: any) => (');
fs.writeFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', admin);

// 2. RequestTab.tsx
let req = fs.readFileSync('src/components/studio/custom-client-site/tabs/RequestTab.tsx', 'utf-8');
req = req.replace('import { CustomTemplate, getDesignPresetsForCategory } from "@/constants/custom-client-site";', 'import { CustomTemplate, getDesignPresetsForCategory } from "@/constants/custom-client-site";\nimport { createClient } from "@/utils/supabase/client";');
req = req.replace('company_name: reqCompany,', 'company_name: userNickname + "님의 사이트",');
req = req.replace('category: selectedCategory === "전체 테마" ? "기타" : selectedCategory,', 'category: reqCategory,');
// Let's ensure createClient isn't duplicated
req = req.replace(/import \{ createClient \} from "@\/utils\/supabase\/client";\nimport \{ createClient \} from "@\/utils\/supabase\/client";/g, 'import { createClient } from "@/utils/supabase/client";');
fs.writeFileSync('src/components/studio/custom-client-site/tabs/RequestTab.tsx', req);

console.log("Fixed minor TS errors");
