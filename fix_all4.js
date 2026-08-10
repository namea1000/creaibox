const fs = require('fs');

let admin = fs.readFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', 'utf-8');
admin = admin.replace('setActiveTab: (tab: string) => void', 'setActiveTab: (tab: any) => void');
fs.writeFileSync('src/components/studio/custom-client-site/tabs/AdminDashboardTab.tsx', admin);

let manage = fs.readFileSync('src/components/studio/custom-client-site/tabs/ManageTab.tsx', 'utf-8');
manage = manage.replace('  const [themeColor, setThemeColor] = useState<string>("cyan");\n', '');
fs.writeFileSync('src/components/studio/custom-client-site/tabs/ManageTab.tsx', manage);

console.log("Fixed final two errors");
