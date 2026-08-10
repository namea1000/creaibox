const fs = require('fs');

const jsx = fs.readFileSync('temp_request.txt', 'utf-8');

// Strip the first and last line of jsx which are `{activeTab === "request" && (` and `)}`
const jsxLines = jsx.split('\n');
const cleanedJsx = jsxLines.slice(1, -2).join('\n'); // omit the first line and last `)}`

const componentContent = `import React, { useState } from "react";
import { Cpu, CheckCircle2, Building2, Sparkles, Plus, Search, Tag, Flame, Pencil, Save, Send } from "lucide-react";
import { getDesignPresetsForCategory, CUSTOM_TEMPLATES } from "@/constants/custom-client-site";

interface RequestTabProps {
  requireAuth: (action?: () => void) => boolean;
}

export default function RequestTab({ requireAuth }: RequestTabProps) {
  const [reqCategory, setReqCategory] = useState<string>("행사/기획/렌탈");
  const [reqConcept, setReqConcept] = useState<string>("");
  const [reqFeatures, setReqFeatures] = useState<string[]>([]);
  const [reqDetail, setReqDetail] = useState<string>("");
  const [reqSuccess, setReqSuccess] = useState<boolean>(false);

  const categories = [
    "전체 테마",
    ...Array.from(new Set(CUSTOM_TEMPLATES.map((t) => t.category))),
  ];

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!reqConcept) {
      alert("추천 디자인 컨셉을 먼저 선택해 주세요.");
      return;
    }
    setReqSuccess(true);
  };

  return (
${cleanedJsx}
  );
}
`;

fs.writeFileSync('src/components/studio/custom-client-site/tabs/RequestTab.tsx', componentContent);
console.log("RequestTab created!");
