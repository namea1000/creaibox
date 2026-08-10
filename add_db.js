const fs = require('fs');

let admin = fs.readFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', 'utf-8');

// 1. Add supabase client import and useEffect
admin = admin.replace(
  'import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";',
  'import { AdminRequestItem, INITIAL_ADMIN_REQUESTS } from "@/constants/custom-client-site";\nimport { createClient } from "@/utils/supabase/client";\nimport { useEffect } from "react";'
);

// 2. Add data fetching logic
const statesRegex = /const \[adminRequests, setAdminRequests\] = useState<AdminRequestItem\[\]>\(INITIAL_ADMIN_REQUESTS\);\n  const \[adminFilter, setAdminFilter\] = useState<"all" \| "pending" \| "completed">\("all"\);\n  const \[selectedPromptModal, setSelectedPromptModal\] = useState<AdminRequestItem \| null>\(null\);\n  const \[copiedPrompt, setCopiedPrompt\] = useState<boolean>\(false\);/;

const replaceStr = `const [adminRequests, setAdminRequests] = useState<any[]>(INITIAL_ADMIN_REQUESTS);
  const [adminFilter, setAdminFilter] = useState<"all" | "pending" | "completed">("all");
  const [selectedPromptModal, setSelectedPromptModal] = useState<any | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('client_site_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        setAdminRequests(data.map(d => ({
          id: d.id,
          userId: d.user_id,
          userNickname: d.user_nickname,
          companyName: d.company_name,
          category: d.category,
          themeColor: d.theme_color,
          features: d.features || [],
          refUrl: d.ref_url || "",
          detail: d.detail || "",
          status: d.status,
          createdAt: new Date(d.created_at).toLocaleDateString()
        })));
      }
      setIsLoading(false);
    };
    fetchRequests();
  }, [supabase]);`;

admin = admin.replace(statesRegex, replaceStr);

fs.writeFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', admin);
console.log("Supabase logic added to AdminDashboardTab.tsx");
