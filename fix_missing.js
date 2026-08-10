const fs = require('fs');

// 1. Export CUSTOM_TEMPLATES
let constants = fs.readFileSync('src/constants/custom-client-site.ts', 'utf-8');
constants = constants.replace('const CUSTOM_TEMPLATES: CustomTemplate[] = [', 'export const CUSTOM_TEMPLATES: CustomTemplate[] = [');
fs.writeFileSync('src/constants/custom-client-site.ts', constants);

// 2. Fix MarketplaceTab.tsx (No other fixes needed once CUSTOM_TEMPLATES is exported, except adding type to implicit any params)
let marketplace = fs.readFileSync('src/components/studio/custom-client-site/tabs/MarketplaceTab.tsx', 'utf-8');
marketplace = marketplace.replace('(t) => t.category', '(t: any) => t.category');
marketplace = marketplace.replace('(tpl) => {', '(tpl: any) => {');
marketplace = marketplace.replace('(f) => f.toLowerCase()', '(f: any) => f.toLowerCase()');
marketplace = marketplace.replace('(ft, idx) =>', '(ft: any, idx: number) =>');
fs.writeFileSync('src/components/studio/custom-client-site/tabs/MarketplaceTab.tsx', marketplace);

// 3. Fix MigrationTab.tsx (Add missing icons)
let migration = fs.readFileSync('src/components/studio/custom-client-site/tabs/MigrationTab.tsx', 'utf-8');
migration = migration.replace('import { Globe, RefreshCw, Zap, Sparkles, CheckCircle2, ExternalLink, Bot, Check, ArrowRight, Layers, FileText, Cpu, ChevronDown, ChevronUp } from "lucide-react";', 
'import { Globe, RefreshCw, Zap, Sparkles, CheckCircle2, ExternalLink, Bot, Check, ArrowRight, Layers, FileText, Cpu, ChevronDown, ChevronUp, Video, ShieldCheck, Award, HelpCircle } from "lucide-react";');
fs.writeFileSync('src/components/studio/custom-client-site/tabs/MigrationTab.tsx', migration);

// 4. Fix RequestTab.tsx (Add missing icons and states)
let request = fs.readFileSync('src/components/studio/custom-client-site/tabs/RequestTab.tsx', 'utf-8');
// Add missing icons
request = request.replace('import { Cpu, CheckCircle2, Building2, Sparkles, Plus, Search, Tag, Flame, Pencil, Save, Send } from "lucide-react";',
'import { Cpu, CheckCircle2, Building2, Sparkles, Plus, Search, Tag, Flame, Pencil, Save, Send, ListPlus, Zap, Check, ShieldCheck, Lock, RefreshCw, Store, TrendingUp, Award } from "lucide-react";');
// Add missing states
const statesToAdd = `  const [reqHeaderMenus, setReqHeaderMenus] = useState<string[]>(["회사소개", "서비스안내", "포트폴리오", "공지사항", "Contact & 1:1 상담"]);
  const [enableAuthDb, setEnableAuthDb] = useState<boolean>(false);
  const [reqAuthMethods, setReqAuthMethods] = useState<string[]>(["카카오 1초 소셜 로그인 (Kakao OAuth)", "일반 이메일 & 비밀번호 회원가입"]);
  const [reqAuthFeatures, setReqAuthFeatures] = useState<string[]>(["회원 전용 마이페이지 (내 견적/예약/결제 내역 조회)", "관리자 CRM 대시보드 연동", "비회원 접근 제한 (B2B 인트라넷 모드)"]);
  const [reqRefUrl, setReqRefUrl] = useState<string>("");
  const [isSubmittingReq, setIsSubmittingReq] = useState<boolean>(false);
`;
request = request.replace('const [reqSuccess, setReqSuccess] = useState<boolean>(false);', 'const [reqSuccess, setReqSuccess] = useState<boolean>(false);\n' + statesToAdd);

// Fix implicit any
request = request.replace('(t) => t.category', '(t: any) => t.category');
request = request.replace('(preset) => {', '(preset: any) => {');
request = request.replace('(c, i) => (', '(c: any, i: number) => (');
request = request.replace('(m) => m !== menu', '(m: any) => m !== menu');
request = request.replace('(f) => f !== feature', '(f: any) => f !== feature');

fs.writeFileSync('src/components/studio/custom-client-site/tabs/RequestTab.tsx', request);

console.log('Fixed missing imports and states!');
