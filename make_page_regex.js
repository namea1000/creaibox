const fs = require('fs');

const pagePath = 'src/app/studio/custom-client-site/page.tsx';
let content = fs.readFileSync(pagePath, 'utf-8');

// 1. Insert imports
const importsToInsert = `import MarketplaceTab from "@/components/studio/custom-client-site/tabs/MarketplaceTab";
import MigrationTab from "@/components/studio/custom-client-site/tabs/MigrationTab";
import ManageTab from "@/components/studio/custom-client-site/tabs/ManageTab";
import RequestTab from "@/components/studio/custom-client-site/tabs/RequestTab";
import AdminDashboardTab from "@/components/studio/custom-client-site/tabs/AdminDashboardTab";
import PreviewModal from "@/components/studio/custom-client-site/modals/PreviewModal";
import DeployModal from "@/components/studio/custom-client-site/modals/DeployModal";
`;

content = content.replace('import { createClient } from "@/utils/supabase/client";', 'import { createClient } from "@/utils/supabase/client";\n' + importsToInsert);

// 2. Remove states
const statesToRemove = [
  /const \[selectedCategory, setSelectedCategory\] = useState<string>\("전체 테마"\);\n/g,
  /const \[searchQuery, setSearchQuery\] = useState<string>\(""\);\n/g,
  /const \[migrationUrl, setMigrationUrl\] = useState\(""\);\n/g,
  /const \[isMigrating, setIsMigrating\] = useState\(false\);\n/g,
  /const \[migrationResult, setMigrationResult\] = useState<any \| null>\(null\);\n/g,
  /const \[expandedMigrationFaq, setExpandedMigrationFaq\] = useState<number \| null>\(0\);\n/g,
  /const \[companyName, setCompanyName\] = useState<string>\(""\);\n/g,
  /const \[phone, setPhone\] = useState<string>\(""\);\n/g,
  /const \[address, setAddress\] = useState<string>\(""\);\n/g,
  /const \[email, setEmail\] = useState<string>\(""\);\n/g,
  /const \[brandVibe, setBrandVibe\] = useState<string>\(""\);\n/g,
  /const \[themeColor, setThemeColor\] = useState<string>\(""\);\n/g,
  /const \[logoFile, setLogoFile\] = useState<File \| null>\(null\);\n/g,
  /const \[mainKeyword, setMainKeyword\] = useState<string>\(""\);\n/g,
  /const \[reqCategory, setReqCategory\] = useState<string>\("행사\/기획\/렌탈"\);\n/g,
  /const \[reqConcept, setReqConcept\] = useState<string>\(""\);\n/g,
  /const \[reqFeatures, setReqFeatures\] = useState<string\[\]>\(\[\]\);\n/g,
  /const \[reqDetail, setReqDetail\] = useState<string>\(""\);\n/g,
  /const \[reqSuccess, setReqSuccess\] = useState<boolean>\(false\);\n/g,
  /const \[adminRequests, setAdminRequests\] = useState<AdminRequestItem\[\]>\(INITIAL_ADMIN_REQUESTS\);\n/g,
  /const \[adminFilter, setAdminFilter\] = useState<"all" \| "pending" \| "completed">\("all"\);\n/g,
  /const \[selectedPromptModal, setSelectedPromptModal\] = useState<AdminRequestItem \| null>\(null\);\n/g,
  /const \[copiedPrompt, setCopiedPrompt\] = useState<boolean>\(false\);\n/g,
  /const \[isDeploying, setIsDeploying\] = useState<boolean>\(false\);\n/g,
];

statesToRemove.forEach(regex => {
  content = content.replace(regex, '');
});

// 3. Remove handlers
content = content.replace(/const handleSiteMigration = async \(\) => {[\s\S]*?finally {\s*setIsMigrating\(false\);\s*}\s*};\n/g, '');
content = content.replace(/const handleSiteMigration = async \(e: React\.FormEvent\) => {[\s\S]*?finally {\s*setIsMigrating\(false\);\s*}\s*};\n/g, '');
content = content.replace(/const handleConfirmDeploy = async \(\) => {[\s\S]*?}, 1500\);\s*};\n/g, '');
content = content.replace(/const handleSendRequest = async \(e: React\.FormEvent\) => {[\s\S]*?setReqSuccess\(true\);\s*};\n/g, '');

// 4. Replace JSX Blocks
content = content.replace(/{activeTab === "marketplace" && \([\s\S]*?{activeTab === "migration" && \(/, `      {activeTab === "marketplace" && (
        <MarketplaceTab
          setPreviewModalTemplate={setPreviewModalTemplate}
          setDeployModalTemplate={setDeployModalTemplate}
          setDeploySiteName={setDeploySiteName}
          setDeploySubdomain={setDeploySubdomain}
          setDeploySuccess={setDeploySuccess}
          requireAuth={requireAuth}
        />
      )}
      {activeTab === "migration" && (`);

content = content.replace(/{activeTab === "migration" && \([\s\S]*?{activeTab === "manage" && \(/, `      {activeTab === "migration" && (
        <MigrationTab requireAuth={requireAuth} />
      )}
      {activeTab === "manage" && (`);

content = content.replace(/{activeTab === "manage" && \([\s\S]*?{activeTab === "request" && \(/, `      {activeTab === "manage" && (
        <ManageTab currentUser={currentUser} requireAuth={requireAuth} />
      )}
      {activeTab === "request" && (`);

content = content.replace(/{activeTab === "request" && \([\s\S]*?{activeTab === "admin_dashboard" && \(/, `      {activeTab === "request" && (
        <RequestTab requireAuth={requireAuth} />
      )}
      {activeTab === "admin_dashboard" && (`);

content = content.replace(/{activeTab === "admin_dashboard" && \([\s\S]*?{deployModalTemplate && \(/, `      {activeTab === "admin_dashboard" && (
        <AdminDashboardTab />
      )}
      {deployModalTemplate && (`);

content = content.replace(/{deployModalTemplate && \([\s\S]*?{previewModalTemplate && \(/, `      <DeployModal
        deployModalTemplate={deployModalTemplate}
        setDeployModalTemplate={setDeployModalTemplate}
        deploySiteName={deploySiteName}
        setDeploySiteName={setDeploySiteName}
        deploySubdomain={deploySubdomain}
        setDeploySubdomain={setDeploySubdomain}
        deploySuccess={deploySuccess}
        setDeploySuccess={setDeploySuccess}
        setActiveTab={setActiveTab}
      />
      {previewModalTemplate && (`);

content = content.replace(/{previewModalTemplate && \([\s\S]*?{showLoginModal && \(/, `      <PreviewModal
        previewModalTemplate={previewModalTemplate}
        setPreviewModalTemplate={setPreviewModalTemplate}
        previewDeviceMode={previewDeviceMode}
        setPreviewDeviceMode={setPreviewDeviceMode}
        onDeploy={(tpl) => {
          setDeployModalTemplate(tpl);
          setDeploySiteName(\`\${tpl.name.split(" ")[0]} 내 브랜드\`);
          setDeploySubdomain(\`\${tpl.id}-mybrand\`);
          setDeploySuccess(false);
          setPreviewModalTemplate(null);
        }}
      />
      {showLoginModal && (`);

fs.writeFileSync(pagePath, content);
console.log("page.tsx replaced perfectly!");
