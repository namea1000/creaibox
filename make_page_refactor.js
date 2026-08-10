const fs = require('fs');

const pagePath = 'src/app/studio/custom-client-site/page.tsx';
const content = fs.readFileSync(pagePath, 'utf-8');
const lines = content.split('\n');

const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Insert imports after the last import
  if (i === 11) { // Line 12 in 1-indexed
    newLines.push(line);
    newLines.push('import MarketplaceTab from "@/components/studio/custom-client-site/tabs/MarketplaceTab";');
    newLines.push('import MigrationTab from "@/components/studio/custom-client-site/tabs/MigrationTab";');
    newLines.push('import ManageTab from "@/components/studio/custom-client-site/tabs/ManageTab";');
    newLines.push('import RequestTab from "@/components/studio/custom-client-site/tabs/RequestTab";');
    newLines.push('import AdminDashboardTab from "@/components/studio/custom-client-site/tabs/AdminDashboardTab";');
    newLines.push('import PreviewModal from "@/components/studio/custom-client-site/modals/PreviewModal";');
    newLines.push('import DeployModal from "@/components/studio/custom-client-site/modals/DeployModal";');
    continue;
  }

  // Remove unused states
  if (
    line.includes('const [selectedCategory, setSelectedCategory]') ||
    line.includes('const [searchQuery, setSearchQuery]') ||
    line.includes('const [migrationUrl, setMigrationUrl]') ||
    line.includes('const [isMigrating, setIsMigrating]') ||
    line.includes('const [migrationResult, setMigrationResult]') ||
    line.includes('const [expandedMigrationFaq, setExpandedMigrationFaq]') ||
    line.includes('const [companyName, setCompanyName]') ||
    line.includes('const [phone, setPhone]') ||
    line.includes('const [address, setAddress]') ||
    line.includes('const [email, setEmail]') ||
    line.includes('const [brandVibe, setBrandVibe]') ||
    line.includes('const [themeColor, setThemeColor]') ||
    line.includes('const [logoFile, setLogoFile]') ||
    line.includes('const [mainKeyword, setMainKeyword]') ||
    line.includes('const [reqCategory, setReqCategory]') ||
    line.includes('const [reqConcept, setReqConcept]') ||
    line.includes('const [reqFeatures, setReqFeatures]') ||
    line.includes('const [reqDetail, setReqDetail]') ||
    line.includes('const [reqSuccess, setReqSuccess]') ||
    line.includes('const [adminRequests, setAdminRequests]') ||
    line.includes('const [adminFilter, setAdminFilter]') ||
    line.includes('const [selectedPromptModal, setSelectedPromptModal]') ||
    line.includes('const [copiedPrompt, setCopiedPrompt]') ||
    line.includes('const [isDeploying, setIsDeploying]')
  ) {
    continue;
  }

  // Remove handleSiteMigration
  if (line.includes('const handleSiteMigration = async')) {
    while (!lines[i].includes('finally {')) i++;
    i += 3; // skip to end of function
    continue;
  }

  // Remove handleConfirmDeploy
  if (line.includes('const handleConfirmDeploy = async')) {
    while (!lines[i].includes('}, 1500);')) i++;
    i += 2; // skip to end of function
    continue;
  }

  // Remove handleSendRequest
  if (line.includes('const handleSendRequest = async')) {
    while (!lines[i].includes('setReqSuccess(true);')) i++;
    i += 2; // skip to end of function
    continue;
  }

  // Replace MarketplaceTab
  if (i === 586) { // 587 in 1-indexed: {activeTab === "marketplace" && (
    newLines.push('      {activeTab === "marketplace" && (');
    newLines.push('        <MarketplaceTab');
    newLines.push('          setPreviewModalTemplate={setPreviewModalTemplate}');
    newLines.push('          setDeployModalTemplate={setDeployModalTemplate}');
    newLines.push('          setDeploySiteName={setDeploySiteName}');
    newLines.push('          setDeploySubdomain={setDeploySubdomain}');
    newLines.push('          setDeploySuccess={setDeploySuccess}');
    newLines.push('          requireAuth={requireAuth}');
    newLines.push('        />');
    newLines.push('      )}');
    i = 756; // Skip to end of marketplace
    continue;
  }

  // Replace MigrationTab
  if (i === 757) { // 758 in 1-indexed
    newLines.push('      {activeTab === "migration" && (');
    newLines.push('        <MigrationTab requireAuth={requireAuth} />');
    newLines.push('      )}');
    i = 1095; // Skip to end
    continue;
  }

  // Replace ManageTab
  if (i === 1096) { // 1097 in 1-indexed
    newLines.push('      {activeTab === "manage" && (');
    newLines.push('        <ManageTab currentUser={currentUser} requireAuth={requireAuth} />');
    newLines.push('      )}');
    i = 1750; // Skip to end
    continue;
  }

  // Replace RequestTab
  if (i === 1751) { // 1752 in 1-indexed
    newLines.push('      {activeTab === "request" && (');
    newLines.push('        <RequestTab requireAuth={requireAuth} />');
    newLines.push('      )}');
    i = 2221; // Skip to end
    continue;
  }

  // Replace AdminDashboardTab
  if (i === 2222) { // 2223 in 1-indexed
    newLines.push('      {activeTab === "admin_dashboard" && (');
    newLines.push('        <AdminDashboardTab />');
    newLines.push('      )}');
    i = 2775; // Skip to end of admin (wait, earlier I saw deployModal is at 2777, so admin ends at 2776)
    continue;
  }

  // Replace DeployModal
  if (i === 2776) { // 2777 in 1-indexed
    newLines.push('      <DeployModal');
    newLines.push('        deployModalTemplate={deployModalTemplate}');
    newLines.push('        setDeployModalTemplate={setDeployModalTemplate}');
    newLines.push('        deploySiteName={deploySiteName}');
    newLines.push('        setDeploySiteName={setDeploySiteName}');
    newLines.push('        deploySubdomain={deploySubdomain}');
    newLines.push('        setDeploySubdomain={setDeploySubdomain}');
    newLines.push('        deploySuccess={deploySuccess}');
    newLines.push('        setDeploySuccess={setDeploySuccess}');
    newLines.push('        setActiveTab={setActiveTab}');
    newLines.push('      />');
    i = 2875; // Skip to end of DeployModal
    continue;
  }

  // Replace PreviewModal
  if (i === 2876) { // 2877 in 1-indexed
    newLines.push('      <PreviewModal');
    newLines.push('        previewModalTemplate={previewModalTemplate}');
    newLines.push('        setPreviewModalTemplate={setPreviewModalTemplate}');
    newLines.push('        previewDeviceMode={previewDeviceMode}');
    newLines.push('        setPreviewDeviceMode={setPreviewDeviceMode}');
    newLines.push('        onDeploy={(tpl) => {');
    newLines.push('          setDeployModalTemplate(tpl);');
    newLines.push('          setDeploySiteName(`${tpl.name.split(" ")[0]} 내 브랜드`);');
    newLines.push('          setDeploySubdomain(`${tpl.id}-mybrand`);');
    newLines.push('          setDeploySuccess(false);');
    newLines.push('          setPreviewModalTemplate(null);');
    newLines.push('        }}');
    newLines.push('      />');
    i = 3018; // Skip to end of PreviewModal
    continue;
  }

  newLines.push(line);
}

fs.writeFileSync(pagePath, newLines.join('\\n'));
console.log("page.tsx refactored!");
