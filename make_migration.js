const fs = require('fs');

const jsx = fs.readFileSync('temp_migration.txt', 'utf-8');

// Strip the first and last line of jsx which are `{activeTab === "migration" && (` and `)}`
const jsxLines = jsx.split('\n');
const cleanedJsx = jsxLines.slice(1, -2).join('\n'); // omit the first line and last `)}`

const componentContent = `import React, { useState } from "react";
import { Globe, RefreshCw, Zap, Sparkles, CheckCircle2, ExternalLink, Bot, Check, ArrowRight, Layers, FileText, Cpu, ChevronDown, ChevronUp } from "lucide-react";

interface MigrationTabProps {
  requireAuth: (action?: () => void) => boolean;
}

export default function MigrationTab({ requireAuth }: MigrationTabProps) {
  const [migrationUrl, setMigrationUrl] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any | null>(null);
  const [expandedMigrationFaq, setExpandedMigrationFaq] = useState<number | null>(0);

  const handleSiteMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!migrationUrl.trim()) return;

    setIsMigrating(true);
    try {
      const res = await fetch("/api/studio/site-migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: migrationUrl }),
      });
      const data = await res.json();

      if (res.ok) {
        setMigrationResult(data.data);
      } else {
        alert(data.error || "홈페이지 이관 실패");
      }
    } catch {
      alert("홈페이지 AI 이관 중 오류가 발생했습니다.");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
${cleanedJsx}
  );
}
`;

fs.writeFileSync('src/components/studio/custom-client-site/tabs/MigrationTab.tsx', componentContent);
console.log("MigrationTab created!");
