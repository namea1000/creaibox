const fs = require('fs');
const reqPath = 'src/components/studio/custom-client-site/tabs/RequestTab.tsx';
let req = fs.readFileSync(reqPath, 'utf-8');

// Add supabase import
req = req.replace(
  'import { CustomTemplate, getDesignPresetsForCategory } from "@/constants/custom-client-site";',
  'import { CustomTemplate, getDesignPresetsForCategory } from "@/constants/custom-client-site";\nimport { createClient } from "@/utils/supabase/client";'
);

// Add state for currentUser if needed? Wait, RequestTab doesn't have currentUser.
// Let's check what state it has.
// handleSendRequest
const insertRegex = /const handleSendRequest = async \(e: React\.FormEvent\) => {[\s\S]*?setReqSuccess\(true\);\n  };/;
const insertReplacement = `const supabase = createClient();
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!reqConcept) {
      alert("추천 디자인 컨셉을 먼저 선택해 주세요.");
      return;
    }
    
    setIsSubmittingReq(true);
    
    // Get current user to attach profile_id
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get profile nickname or use email
      const { data: profile } = await supabase.from('profiles').select('nickname, full_name').eq('id', user.id).single();
      const userNickname = profile?.nickname || profile?.full_name || user.email?.split('@')[0] || "사용자";
      
      const { error } = await supabase.from('client_site_requests').insert([
        {
          user_id: user.id,
          user_nickname: userNickname,
          company_name: reqCompany,
          category: selectedCategory === "전체 테마" ? "기타" : selectedCategory,
          theme_color: reqConcept,
          features: reqFeatures,
          ref_url: reqRefUrl,
          detail: reqDetail,
          status: "pending"
        }
      ]);
      
      if (error) {
        console.error("Failed to submit request:", error);
        alert("요청 제출 중 오류가 발생했습니다.");
        setIsSubmittingReq(false);
        return;
      }
    } else {
      alert("로그인이 필요합니다.");
      setIsSubmittingReq(false);
      return;
    }
    
    setIsSubmittingReq(false);
    setReqSuccess(true);
  };`;

req = req.replace(insertRegex, insertReplacement);

// Fix isSubmittingReq not declared. Wait, `isSubmittingReq` was inside `page.tsx` before! Is it inside `RequestTab.tsx`?
// Let's verify what states exist in RequestTab.tsx.
fs.writeFileSync('src/components/studio/custom-client-site/tabs/RequestTab.tsx', req);
console.log("Supabase logic added to RequestTab.tsx");
