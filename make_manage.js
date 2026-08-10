const fs = require('fs');

const jsx = fs.readFileSync('temp_manage.txt', 'utf-8');

// Strip the first and last line of jsx which are `{activeTab === "manage" && (` and `)}`
const jsxLines = jsx.split('\n');
const cleanedJsx = jsxLines.slice(1, -2).join('\n'); // omit the first line and last `)}`

const componentContent = `import React, { useState } from "react";
import Link from "next/link";
import { Globe, ExternalLink, FileText, TrendingUp, ArrowRight, CreditCard, ShieldCheck, Mail, Phone, MapPin, Building2, Pencil, Trash2, Plus, ListPlus, Flame, Tag, Save, CheckCircle2 } from "lucide-react";

interface ManageTabProps {
  currentUser: any;
  requireAuth: (action?: () => void) => boolean;
}

export default function ManageTab({ currentUser, requireAuth }: ManageTabProps) {
  const [companyName, setCompanyName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [brandVibe, setBrandVibe] = useState<string>("");
  const [themeColor, setThemeColor] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainKeyword, setMainKeyword] = useState<string>("");

  return (
${cleanedJsx}
  );
}
`;

fs.writeFileSync('src/components/studio/custom-client-site/tabs/ManageTab.tsx', componentContent);
console.log("ManageTab created!");
