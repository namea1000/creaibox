"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Settings, Layers, Palette, Shield, LineChart, Globe, HelpCircle, 
  Plus, Trash2, Save, FileText, CheckCircle2, TrendingUp, Users, Eye, RefreshCw,
  Sparkles, Zap, GitCommit, Upload, Image as ImageIcon, Loader2, X
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";


interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
}

function ScoreRing({ score, label }: { score: number; label: string }) {
  const strokeDashoffset = 251.2 - (251.2 * score) / 100;
  let colorClass = "text-rose-500 stroke-rose-500 bg-rose-500/5";
  if (score >= 90) {
    colorClass = "text-emerald-500 stroke-emerald-500 bg-emerald-500/5";
  } else if (score >= 50) {
    colorClass = "text-amber-500 stroke-amber-500 bg-amber-500/5";
  }
  
  return (
    <div className="flex flex-col items-center p-6 rounded-[24px] border border-zinc-900 bg-zinc-950/40 text-center space-y-4">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            className="stroke-zinc-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Foreground circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            className={colorClass}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black italic tracking-tighter text-white">
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
        {label}
      </span>
    </div>
  );
}

function MetricCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/30 text-left space-y-1">
      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">{title}</span>
      <p className="text-lg font-black text-white italic tracking-tight">{value}</p>
      <p className="text-[10px] text-zinc-500 leading-relaxed font-bold">{description}</p>
    </div>
  );
}

export default function BlogManagementPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  


  // Settings states (Initial load bypass to prevent flickering spinner)
  const [brandId, setBrandId] = useState("loading");
  const [brandStatus, setBrandStatus] = useState("APPROVED");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDesc, setBlogDesc] = useState("");
  const [blogTemplate, setBlogTemplate] = useState("card");
  const [blogAccentColor, setBlogAccentColor] = useState("#3b82f6");
  const [gaId, setGaId] = useState("");
  const [naverKey, setNaverKey] = useState("");
  const [googleSearchConsoleKey, setGoogleSearchConsoleKey] = useState("");
  const [adsensePubId, setAdsensePubId] = useState("");
  const [seoTitleTemplate, setSeoTitleTemplate] = useState("%title% | %blog_title%");
  const [seoDescTemplate, setSeoDescTemplate] = useState("%description%");

  // Author Profile Card & Badge states
  const [showBadge, setShowBadge] = useState<boolean>(true);
  const [useAuthorCard, setUseAuthorCard] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>("");
  const [authorBio, setAuthorBio] = useState<string>("");
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState<string>("");
  const [authorLink, setAuthorLink] = useState<string>("");
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false);
  const avatarFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sourceType", "writing_creaibox_posts");

      const res = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "이미지 업로드에 실패했습니다.");
      }
      const uploadedUrl = data.url || data.image_url || data.image?.image_url;
      if (uploadedUrl) {
        setAuthorAvatarUrl(uploadedUrl);
      } else {
        throw new Error("업로드된 이미지 URL을 생성하지 못했습니다.");
      }
    } catch (err: any) {
      console.error("Failed to upload avatar", err);
      alert(`로고/아바타 이미지 업로드 실패: ${err.message || err}`);
    } finally {
      setIsAvatarUploading(false);
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";
    }
  };
  
  const [isSaving, setIsSaving] = useState(false);

  // Categories states
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [catSuccess, setCatSuccess] = useState(false);

  // Posts states (for statistics display)
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Custom Domain states
  const [customDomainStatus, setCustomDomainStatus] = useState("NONE");
  const [customDomain, setCustomDomain] = useState("");
  const [requestedCustomDomain, setRequestedCustomDomain] = useState("");
  const [customDomainRejectionReason, setCustomDomainRejectionReason] = useState("");
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [membershipLevel, setMembershipLevel] = useState("free");
  const [userRole, setUserRole] = useState("USER");

  const [profile, setProfile] = useState<any>(null);
  const [approvedBrands, setApprovedBrands] = useState<string[]>([]);
  const [activeBrandId, setActiveBrandId] = useState<string>("");

  // Tab state
  const [activeSubTab, setActiveSubTab] = useState<"general" | "categories" | "seo" | "analytics" | "customDomain" | "pagespeed">("general");

  // PageSpeed states
  const [pagespeedUrl, setPagespeedUrl] = useState("");
  const [pagespeedStrategy, setPagespeedStrategy] = useState<"desktop" | "mobile">("desktop");
  const [pagespeedLoading, setPagespeedLoading] = useState(false);
  const [pagespeedResult, setPagespeedResult] = useState<any>(null);
  const [pagespeedError, setPagespeedError] = useState("");

  // Real-time GA4 analytics states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

  // Search Console Tutorial Guide Modal states
  const [isVerificationGuideOpen, setIsVerificationGuideOpen] = useState(false);
  const [guideModalTab, setGuideModalTab] = useState<"naver" | "google" | "urls">("naver");
  const [copiedUrlType, setCopiedUrlType] = useState<string | null>(null);

  const handleCopyUrl = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedUrlType(label);
      setTimeout(() => setCopiedUrlType(null), 2000);
    } catch (e) {
      console.error("Clipboard copy failed:", e);
    }
  };

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Fetch initial profile, categories, and posts
  useEffect(() => {
    let mounted = true;
    const fetchInitData = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!currentUser) {
          setUser(null);
          setBrandId("");
          return;
        }
        setUser(currentUser);

        // Fetch user profile and published posts in parallel
        const [profileRes, postsRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle(),
          supabase
            .from("writing_creaibox_posts")
            .select("id, title, slug, created_at, canonical_url")
            .eq("user_id", currentUser.id)
            .eq("status", "published")
            .order("created_at", { ascending: false })
        ]);

        if (!mounted) return;

        // Process profile config
        if (profileRes.data) {
          const profileData = profileRes.data;
          setProfile(profileData);
          setBrandId(profileData.brand_id || "");
          setBrandStatus(profileData.brand_id_status || "NONE");
          setMembershipLevel(profileData.membership_level || "free");
          setUserRole(profileData.role || "USER");

          // Extract all approved brands (including main official blog creaibox.com/blog)
          const brands: string[] = ["creaibox"];
          if (profileData.brand_id && profileData.brand_id_status === "APPROVED") {
            if (!brands.includes(profileData.brand_id)) {
              brands.push(profileData.brand_id);
            }
          }
          if (Array.isArray(profileData.extra_configs?.brand_ids)) {
            profileData.extra_configs.brand_ids.forEach((bid: string) => {
              if (bid && !brands.includes(bid)) {
                brands.push(bid);
              }
            });
          }
          setApprovedBrands(brands);
          
          if (brands.length > 0) {
            setActiveBrandId(profileData.brand_id && brands.includes(profileData.brand_id) ? profileData.brand_id : brands[0]);
          } else {
            setActiveBrandId("creaibox");
          }
        }



        // Process published posts
        if (postsRes.data) {
          setPosts((postsRes.data as BlogPost[]) || []);
        }

      } catch (e) {
        console.error("Failed to load initial data", e);
      }
    };
    void fetchInitData();
    return () => {
      mounted = false;
    };
  }, [supabase, router]);

  // Filter published posts for activeBrandId
  const filteredPosts = useMemo(() => {
    if (!activeBrandId) return posts;
    const configs = profile?.extra_configs || {};
    const primaryId = profile?.brand_id || "";
    const customDomainKey = `custom_domain_${activeBrandId}`;
    const activeCustomDomain = activeBrandId === primaryId 
      ? (configs.custom_domain || "") 
      : (configs[customDomainKey] || "");

    return posts.filter((p: any) => {
      const cUrl = (p.canonical_url || "").toLowerCase();
      if (!cUrl) return activeBrandId === "creaibox";
      try {
        const urlObj = new URL(cUrl);
        let host = urlObj.hostname;
        if (host.startsWith("www.")) host = host.slice(4);

        if (activeBrandId === "creaibox") {
          if (host.endsWith(".creaibox.com")) {
            const sub = host.replace(".creaibox.com", "");
            if (sub !== "www" && sub !== "") return false;
          }
          if (host.endsWith(".localhost")) {
            const sub = host.replace(".localhost", "");
            if (sub !== "www" && sub !== "") return false;
          }
          if (host === "creaibox.com" || host === "localhost") return true;
          return false;
        } else {
          const cleanCustom = activeCustomDomain ? activeCustomDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] : "";
          return host === `${activeBrandId.toLowerCase()}.creaibox.com` || 
                 host === `${activeBrandId.toLowerCase()}.localhost` ||
                 (cleanCustom ? host === cleanCustom : false);
        }
      } catch (e) {
        return activeBrandId === "creaibox";
      }
    });
  }, [posts, activeBrandId, profile]);

  // Handle activeBrandId settings sync
  useEffect(() => {
    if (!profile || !activeBrandId) return;

    const configs = profile.extra_configs || {};
    const primaryId = profile.brand_id || "";

    const getConfigValue = (configName: string, defaultValue: string = "") => {
      if (configs[`${configName}_${activeBrandId}`] !== undefined && configs[`${configName}_${activeBrandId}`] !== null) {
        return configs[`${configName}_${activeBrandId}`];
      }
      if (activeBrandId === primaryId && configs[configName] !== undefined && configs[configName] !== null) {
        return configs[configName];
      }
      return defaultValue;
    };

    setBlogTitle(getConfigValue("blog_title", `${profile.nickname || "My AI"} 블로그`));
    setBlogDesc(getConfigValue("blog_description", ""));
    setBlogTemplate(getConfigValue("blog_template", "card"));
    setBlogAccentColor(getConfigValue("blog_accent_color", "#3b82f6"));
    setGaId(getConfigValue("ga_id", ""));
    setNaverKey(getConfigValue("naver_advisor_key", ""));
    setGoogleSearchConsoleKey(getConfigValue("google_search_console_key", ""));
    setAdsensePubId(getConfigValue("adsense_pub_id", ""));
    setSeoTitleTemplate(getConfigValue("seo_template_title", "%title% | %blog_title%"));
    setSeoDescTemplate(getConfigValue("seo_template_desc", "%description%"));

    const badgeVal = getConfigValue("show_creaibox_badge", "true");
    setShowBadge(typeof badgeVal === "boolean" ? badgeVal : badgeVal !== "false");

    const authorCardVal = getConfigValue("use_author_card", "false");
    setUseAuthorCard(typeof authorCardVal === "boolean" ? authorCardVal : authorCardVal === "true");
    setAuthorName(getConfigValue("author_name", `${profile.nickname || "에디터"}`));
    setAuthorBio(getConfigValue("author_bio", "국내외 최신 소식과 정보를 전문적으로 다루는 미디어입니다."));
    setAuthorAvatarUrl(getConfigValue("author_avatar_url", ""));
    const status = getConfigValue("custom_domain_status", "NONE");
    const domain = getConfigValue("custom_domain", "");
    const reqDomain = getConfigValue("requested_custom_domain", "");
    
    setCustomDomainStatus(status);
    setCustomDomain(domain);
    setRequestedCustomDomain(reqDomain);
    setCustomDomainRejectionReason(getConfigValue("custom_domain_rejection_reason", ""));
    setCustomDomainInput(reqDomain || domain || "");

    const defaultBlogUrl = (status === "APPROVED" && domain)
      ? `https://${domain}`
      : `https://${activeBrandId}.creaibox.com`;

    setAuthorLink(getConfigValue("author_link", defaultBlogUrl));

    // Fetch categories dynamically for this activeBrandId!
    const fetchCats = async () => {
      try {
        const { data: catsData } = await supabase
          .from("blog_categories")
          .select("*")
          .eq("user_id", profile.id)
          .or(`brand_id.eq.${activeBrandId},brand_id.is.null`)
          .order("created_at", { ascending: true });

        if (catsData) {
          const cats = catsData as BlogCategory[];
          const orderIds = configs[`category_order_${activeBrandId}`] || (activeBrandId === primaryId ? configs.category_order : []) || [];
          if (Array.isArray(orderIds) && orderIds.length > 0) {
            cats.sort((a, b) => {
              const aIdx = orderIds.indexOf(a.id);
              const bIdx = orderIds.indexOf(b.id);
              if (aIdx === -1 && bIdx === -1) return 0;
              if (aIdx === -1) return 1;
              if (bIdx === -1) return -1;
              return aIdx - bIdx;
            });
          }
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to fetch categories for brand:", err);
      }
    };
    void fetchCats();
  }, [activeBrandId, profile]);

  // Fetch analytics data on demand (when analytics tab is active or brandId changes)
  const fetchAnalytics = async () => {
    if (!activeBrandId) return;
    setIsAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/studio/analytics/blog?brandId=${activeBrandId}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === "analytics" && activeBrandId) {
      void fetchAnalytics();
    }
  }, [activeSubTab, activeBrandId]);

  // PageSpeed URL auto-sync based on activeBrandId / customDomain
  useEffect(() => {
    if (activeBrandId) {
      const url = customDomainStatus === "APPROVED" && customDomain
        ? `https://${customDomain}`
        : `https://${activeBrandId}.creaibox.com`;
      setPagespeedUrl(url);
    }
  }, [activeBrandId, customDomain, customDomainStatus]);

  const runPagespeedAudit = async () => {
    if (!pagespeedUrl) {
      setPagespeedError("URL을 입력해 주세요.");
      return;
    }
    if (!pagespeedUrl.startsWith("http://") && !pagespeedUrl.startsWith("https://")) {
      setPagespeedError("URL은 http:// 또는 https://로 시작해야 합니다.");
      return;
    }

    setPagespeedLoading(true);
    setPagespeedError("");
    setPagespeedResult(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY;
      const target = encodeURIComponent(pagespeedUrl);
      const apiEndpoint = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${target}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=${pagespeedStrategy}${apiKey ? `&key=${apiKey}` : ""}`;
      
      const res = await fetch(apiEndpoint);
      if (!res.ok) {
        let errMsg = "PageSpeed API 호출 중 오류가 발생했습니다.";
        try {
          const errData = await res.json();
          if (errData.error?.message) {
            if (errData.error.message.includes("Quota exceeded") || errData.error.message.includes("limit")) {
              errMsg = "PageSpeed API 오류: Google PageSpeed의 기본 익명 일일 호출 한도가 초과되었습니다. 안정적인 측정을 위해 본인의 Google Cloud Console에서 PageSpeed Insights API를 활성화한 뒤, API 키를 무료로 생성하여 .env.local 파일에 NEXT_PUBLIC_PAGESPEED_API_KEY 값으로 등록해 주세요.";
            } else {
              errMsg = `PageSpeed API 오류: ${errData.error.message}`;
            }
          }
        } catch (_) {}
        throw new Error(errMsg);
      }
      
      const data = await res.json();
      if (!data.lighthouseResult) {
        throw new Error("Lighthouse 결과를 읽을 수 없습니다.");
      }
      
      const lh = data.lighthouseResult;
      const scores = {
        performance: Math.round((lh.categories.performance?.score || 0) * 100),
        accessibility: Math.round((lh.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lh.categories["best-practices"]?.score || 0) * 100),
        seo: Math.round((lh.categories.seo?.score || 0) * 100),
      };

      const metrics = {
        fcp: lh.audits["first-contentful-paint"]?.displayValue || "N/A",
        lcp: lh.audits["largest-contentful-paint"]?.displayValue || "N/A",
        tbt: lh.audits["total-blocking-time"]?.displayValue || "N/A",
        cls: lh.audits["cumulative-layout-shift"]?.displayValue || "N/A",
        si: lh.audits["speed-index"]?.displayValue || "N/A",
      };

      setPagespeedResult({ scores, metrics });
    } catch (err: any) {
      console.error(err);
      setPagespeedError(err.message || "속도 측정 중 예상치 못한 에러가 발생했습니다.");
    } finally {
      setPagespeedLoading(false);
    }
  };

  // 1. Action: Save Blog Profile & Customizer & SEO config
  const handleSaveConfigs = async () => {
    if (!user || !activeBrandId) return;
    setIsSaving(true);
    try {
      // Fetch latest profile first to preserve other extra_configs fields (like wp_sites)
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("brand_id, extra_configs")
        .eq("id", user.id)
        .maybeSingle();

      const mergedConfigs = {
        ...(currentProfile?.extra_configs || {}),
        [`blog_title_${activeBrandId}`]: blogTitle.trim(),
        [`blog_description_${activeBrandId}`]: blogDesc.trim(),
        [`blog_template_${activeBrandId}`]: blogTemplate,
        [`blog_accent_color_${activeBrandId}`]: blogAccentColor,
        [`ga_id_${activeBrandId}`]: gaId.trim(),
        [`naver_advisor_key_${activeBrandId}`]: naverKey.trim(),
        [`google_search_console_key_${activeBrandId}`]: googleSearchConsoleKey.trim(),
        [`adsense_pub_id_${activeBrandId}`]: adsensePubId.trim(),
        [`seo_template_title_${activeBrandId}`]: seoTitleTemplate.trim(),
        [`seo_template_desc_${activeBrandId}`]: seoDescTemplate.trim(),
        [`show_creaibox_badge_${activeBrandId}`]: showBadge,
        [`use_author_card_${activeBrandId}`]: useAuthorCard,
        [`author_name_${activeBrandId}`]: authorName.trim(),
        [`author_bio_${activeBrandId}`]: authorBio.trim(),
        [`author_avatar_url_${activeBrandId}`]: authorAvatarUrl.trim(),
        [`author_link_${activeBrandId}`]: authorLink.trim(),
      };

      // Set top-level configs as well if the selected brand ID is the primary brand ID for compatibility
      if (activeBrandId === currentProfile?.brand_id) {
        mergedConfigs.blog_title = blogTitle.trim();
        mergedConfigs.blog_description = blogDesc.trim();
        mergedConfigs.blog_template = blogTemplate;
        mergedConfigs.blog_accent_color = blogAccentColor;
        mergedConfigs.ga_id = gaId.trim();
        mergedConfigs.naver_advisor_key = naverKey.trim();
        mergedConfigs.google_search_console_key = googleSearchConsoleKey.trim();
        mergedConfigs.adsense_pub_id = adsensePubId.trim();
        mergedConfigs.seo_template_title = seoTitleTemplate.trim();
        mergedConfigs.seo_template_desc = seoDescTemplate.trim();
        mergedConfigs.show_creaibox_badge = showBadge;
        mergedConfigs.use_author_card = useAuthorCard;
        mergedConfigs.author_name = authorName.trim();
        mergedConfigs.author_bio = authorBio.trim();
        mergedConfigs.author_avatar_url = authorAvatarUrl.trim();
        mergedConfigs.author_link = authorLink.trim();
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          extra_configs: mergedConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      
      setProfile((prev: any) => ({
        ...prev,
        extra_configs: mergedConfigs
      }));

      alert("✅ 블로그 환경 설정이 성공적으로 저장되었습니다!");
    } catch (e: any) {
      alert(`저장 실패: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Action: Create Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const name = newCatName.trim();
    const slug = newCatSlug.trim().toLowerCase();

    if (!name || !slug) return;
    if (!/^[a-z0-9가-힣_-]{2,30}$/i.test(slug)) {
      alert("카테고리 슬러그는 영문, 한글, 숫자, 하이픈(-), 언더바(_) 조합 2~30자만 가능합니다.");
      return;
    }

    // Check duplicate slug in active list
    if (categories.some(c => c.slug === slug)) {
      alert("이미 등록된 동일한 슬러그가 존재합니다.");
      return;
    }

    setIsAddingCat(true);
    try {
      const { data, error } = await supabase
        .from("blog_categories")
        .insert({
          user_id: user.id,
          brand_id: activeBrandId,
          name,
          slug,
        })
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data as BlogCategory]);
      setNewCatName("");
      setNewCatSlug("");
      setCatSuccess(true);
      setTimeout(() => {
        setCatSuccess(false);
      }, 2000);
    } catch (e: any) {
      alert(`카테고리 생성 실패: ${e.message}`);
    } finally {
      setIsAddingCat(false);
    }
  };

  // 3. Action: Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`'${name}' 카테고리를 삭제하시겠습니까? 연결된 원고들은 카테고리 없음 상태로 변경됩니다.`)) return;

    try {
      const { error } = await supabase
        .from("blog_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("삭제되었습니다.");
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (e: any) {
      alert(`삭제 실패: ${e.message}`);
    }
  };
  // 4. Action: Move Category (Up/Down) and Auto-Save
  const handleMoveCategory = async (index: number, direction: "up" | "down") => {
    if (!user || !activeBrandId) return;

    const newCategories = [...categories];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    // Swap
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;

    setCategories(newCategories);

    // Save to profiles.extra_configs
    try {
      const orderIds = newCategories.map(c => c.id);
      
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("brand_id, extra_configs")
        .eq("id", user.id)
        .maybeSingle();

      const mergedConfigs = {
        ...(currentProfile?.extra_configs || {}),
        [`category_order_${activeBrandId}`]: orderIds,
      };

      if (activeBrandId === currentProfile?.brand_id) {
        mergedConfigs.category_order = orderIds;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          extra_configs: mergedConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev: any) => ({
        ...prev,
        extra_configs: mergedConfigs
      }));
    } catch (e: any) {
      console.error("Failed to save category order:", e);
    }
  };

  const requestCustomDomain = async () => {
    if (!user || !activeBrandId) return;
    const domain = customDomainInput.trim().toLowerCase();
    if (!domain) {
      alert("연결할 독립 도메인을 입력해 주세요.");
      return;
    }
    
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
    if (!domainRegex.test(domain)) {
      alert("올바른 도메인 형식(예: blog.mybrand.com 또는 mybrand.com)을 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("brand_id, extra_configs")
        .eq("id", user.id)
        .maybeSingle();

      const mergedConfigs = {
        ...(currentProfile?.extra_configs || {}),
        [`requested_custom_domain_${activeBrandId}`]: domain,
        [`custom_domain_status_${activeBrandId}`]: "PENDING",
        [`custom_domain_rejection_reason_${activeBrandId}`]: null,
      };

      if (activeBrandId === currentProfile?.brand_id) {
        mergedConfigs.requested_custom_domain = domain;
        mergedConfigs.custom_domain_status = "PENDING";
        mergedConfigs.custom_domain_rejection_reason = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          extra_configs: mergedConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev: any) => ({
        ...prev,
        extra_configs: mergedConfigs
      }));

      setCustomDomainStatus("PENDING");
      setRequestedCustomDomain(domain);
      setCustomDomainRejectionReason("");

      alert("✅ 독립 도메인 연결 신청이 접수되었습니다. 관리자 심사 후 연결됩니다.");
    } catch (err: any) {
      alert(`신청 실패: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDisconnectModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isPending = customDomainStatus === "PENDING";
    setConfirmModal({
      title: isPending ? "독립 도메인 신청 취소" : "독립 도메인 연결 해제",
      message: isPending
        ? "신청된 독립 도메인 연결을 취소하시겠습니까?"
        : "연결된 독립 도메인을 해제하시겠습니까?",
      onConfirm: () => executeDisconnectCustomDomain(),
    });
  };

  const executeDisconnectCustomDomain = async () => {
    setConfirmModal(null);
    if (!user || !activeBrandId) return;

    setIsSaving(true);
    try {
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("brand_id, extra_configs")
        .eq("id", user.id)
        .maybeSingle();

      const mergedConfigs = {
        ...(currentProfile?.extra_configs || {}),
        [`custom_domain_${activeBrandId}`]: null,
        [`requested_custom_domain_${activeBrandId}`]: null,
        [`custom_domain_status_${activeBrandId}`]: "NONE",
        [`custom_domain_rejection_reason_${activeBrandId}`]: null,
      };

      if (activeBrandId === currentProfile?.brand_id) {
        mergedConfigs.custom_domain = null;
        mergedConfigs.requested_custom_domain = null;
        mergedConfigs.custom_domain_status = "NONE";
        mergedConfigs.custom_domain_rejection_reason = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          extra_configs: mergedConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev: any) => ({
        ...prev,
        extra_configs: mergedConfigs
      }));

      setCustomDomainStatus("NONE");
      setCustomDomain("");
      setRequestedCustomDomain("");
      setCustomDomainInput("");

      alert("✅ 독립 도메인 연결이 해제되었습니다.");
    } catch (err: any) {
      alert(`해제 실패: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Generate sitemap link
  const sitemapUrl = useMemo(() => {
    if (customDomainStatus === "APPROVED" && customDomain) {
      return `https://${customDomain}/sitemap.xml`;
    }
    if (!activeBrandId) return "";
    return `http://${activeBrandId}.localhost:3000/sitemap.xml`;
  }, [activeBrandId, customDomain, customDomainStatus]);



  // If brand is not approved, show guide card
  if (approvedBrands.length === 0 || !activeBrandId) {
    if (!user) {
      return (
        <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12 font-sans text-white flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6 rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-10 backdrop-blur-xl shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Login Required
            </h1>
            <p className="text-sm font-bold text-zinc-400 leading-relaxed">
              공식 블로그 관리 및 커스텀 도메인 연동 기능을 사용하려면 로그인이 필요합니다.
            </p>
            <div className="pt-2 space-y-3">
              <button
                onClick={() => router.push("/login?redirect=/studio/writing/creaibox/blog-management")}
                className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 py-4 text-xs font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
              >
                로그인 하러 가기
              </button>
              <button
                onClick={() => router.push("/register")}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 py-4 text-xs font-black uppercase italic tracking-widest text-zinc-400 hover:text-white transition-all"
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12 font-sans text-white flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center space-y-6 rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-10 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
            <Globe size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white">
            Brand ID Not Active
          </h1>
          <p className="text-sm font-bold text-zinc-400 leading-relaxed">
            블로그 관리 서비스를 사용하려면 먼저 마이페이지에서 사용할 브랜드 ID(서브도메인)를 신청하고 승인받아야 합니다.
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push("/mypage")}
              className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 py-4 text-xs font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
            >
              브랜드 ID 신청하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] p-8 pb-32 lg:p-12 font-sans text-white">
      <div className="space-y-8">
            {/* Title Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 flex items-center gap-1.5">
                  <Settings size={12} className="text-blue-500" /> Writing Studio
                </p>
                <h1 className="text-3xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                  공식 블로그 설정 및 관리
                </h1>
                <p className="text-xs font-bold text-zinc-500">
                  내 브랜드 블로그({activeBrandId}.creaibox.com)의 디자인, 카테고리 구성, SEO 검색엔진 최적화를 연동합니다.
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {approvedBrands.length > 0 && (
                  <div className="flex items-center gap-2 bg-zinc-900/55 border border-zinc-800 rounded-2xl px-4 py-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">관리할 블로그 선택:</span>
                    <select
                      value={activeBrandId}
                      onChange={(e) => setActiveBrandId(e.target.value)}
                      className="bg-transparent text-xs font-black text-blue-400 outline-none cursor-pointer"
                    >
                      {approvedBrands.map((bid) => {
                        const isPrimary = bid === (profile?.brand_id || "");
                        const cDomKey = `custom_domain_${bid}`;
                        const cDom = isPrimary ? (profile?.extra_configs?.custom_domain || "") : (profile?.extra_configs?.[cDomKey] || "");
                        const label = bid === "creaibox" 
                          ? "creaibox.com/blog (공식 메인 블로그)" 
                          : cDom 
                          ? `${cDom} (${bid}.creaibox.com)` 
                          : `${bid}.creaibox.com`;
                        return (
                          <option key={bid} value={bid} className="bg-zinc-950 text-zinc-300 font-bold">
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
                <a
                  href={
                    activeBrandId === "creaibox"
                      ? "/blog"
                      : customDomainStatus === "APPROVED" && customDomain
                      ? `https://${customDomain}`
                      : `http://${activeBrandId}.localhost:3000`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-3 text-xs font-black uppercase italic text-zinc-400 hover:text-white transition-colors"
                >
                  <Globe size={13} /> {activeBrandId === "creaibox" ? "creaibox.com/blog" : customDomainStatus === "APPROVED" && customDomain ? customDomain : `${activeBrandId}.creaibox.com`} 방문
                </a>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-zinc-900">
              <button
                onClick={() => setActiveSubTab("general")}
                className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  activeSubTab === "general"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                기본 정보 및 디자인
              </button>
              <button
                onClick={() => setActiveSubTab("categories")}
                className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  activeSubTab === "categories"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                카테고리 설정
              </button>
              <button
                onClick={() => setActiveSubTab("seo")}
                className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  activeSubTab === "seo"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                SEO 및 연동 관리
              </button>
              <button
                onClick={() => setActiveSubTab("customDomain")}
                className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  activeSubTab === "customDomain"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                독립 도메인 관리
              </button>
              <button
                onClick={() => setActiveSubTab("analytics")}
                className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  activeSubTab === "analytics"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                방문 통계 리포트
              </button>
              <button
                onClick={() => setActiveSubTab("pagespeed")}
                className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
                  activeSubTab === "pagespeed"
                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                PageSpeed Insights 성능 측정
              </button>
            </div>

            {/* TAB CONTENT: General Settings & Design */}
            {activeSubTab === "general" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-8 space-y-6">
                  <h3 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                    <Palette size={18} className="text-blue-400" /> 블로그 디자인 및 브랜딩
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                          블로그 이름 (타이틀)
                        </label>
                        <input
                          type="text"
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          placeholder="예: 자동차 가이드 블로그"
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                          테마 강조 색상 (Accent Color)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={blogAccentColor}
                            onChange={(e) => setBlogAccentColor(e.target.value)}
                            className="h-11 w-16 cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-950 p-1"
                          />
                          <input
                            type="text"
                            value={blogAccentColor}
                            onChange={(e) => setBlogAccentColor(e.target.value)}
                            placeholder="#3b82f6"
                            className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        블로그 설명 (상세 설명)
                      </label>
                      <textarea
                        value={blogDesc}
                        onChange={(e) => setBlogDesc(e.target.value)}
                        placeholder="이 블로그의 메인 슬로건 및 소개글을 작성해 주세요."
                        rows={3}
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        블로그 레이아웃 템플릿 선택
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { key: "card", name: "Card Grid", desc: "이미지 중심 격자 배치" },
                          { key: "list", name: "List Feed", desc: "가로 피드 연속 배치" },
                          { key: "news", name: "News Flow", desc: "텍스트 중심 속보형 배치" },
                        ].map((tpl) => (
                          <button
                            key={tpl.key}
                            type="button"
                            onClick={() => setBlogTemplate(tpl.key)}
                            className={`rounded-2xl border p-5 text-left transition-all ${
                              blogTemplate === tpl.key
                                ? "border-blue-500 bg-blue-500/5 shadow-[0_4px_12px_rgba(59,130,246,0.1)]"
                                : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                            }`}
                          >
                            <p className="text-xs font-black uppercase tracking-wider text-white">{tpl.name}</p>
                            <p className="text-[10px] font-bold text-zinc-500 mt-1">{tpl.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 🌟 출처 뱃지 & 사용자 맞춤 작가/브랜드 프로필 카드 설정 */}
                    <div className="space-y-4 pt-6 border-t border-zinc-900">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-black uppercase italic tracking-wider text-amber-400 flex items-center gap-2">
                            <Sparkles size={14} className="text-amber-400" />
                            출처 뱃지 & 브랜드 프로필 카드 설정
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-bold mt-0.5">
                            포스팅 하단에 표시되는 1줄 출처 뱃지와 맞춤 작가/브랜드 소식을 제어합니다.
                          </p>
                        </div>

                        {/* 뱃지 On/Off 스위치 (유료 플랜 전용) */}
                        {["creator", "pro", "premier", "business", "admin"].includes((membershipLevel || "").toLowerCase()) ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-zinc-400">1줄 뱃지 표시</span>
                            <button
                              type="button"
                              onClick={() => setShowBadge(!showBadge)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                showBadge ? "bg-purple-600" : "bg-zinc-800"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  showBadge ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
                            🔒 유료 플랜 뱃지 Off 지원
                          </span>
                        )}
                      </div>

                      {/* 맞춤 프로필 카드 토글 및 폼 */}
                      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                          <div>
                            <p className="text-xs font-black text-white">사용자 맞춤 작가 / 브랜드 프로필 카드 사용</p>
                            <p className="text-[10px] text-zinc-500 font-bold">
                              포스팅 본문 하단에 본인의 프로필(소개글, 링크) 카드를 렌더링합니다.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUseAuthorCard(!useAuthorCard)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              useAuthorCard ? "bg-blue-600" : "bg-zinc-800"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                useAuthorCard ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        {useAuthorCard && (
                          <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-zinc-500">작가 / 브랜드명</label>
                                <input
                                  type="text"
                                  value={authorName}
                                  onChange={(e) => setAuthorName(e.target.value)}
                                  placeholder="예: 테크앤라이프 에디터"
                                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-blue-500"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-zinc-500">공식 링크 / SNS (선택)</label>
                                <input
                                  type="text"
                                  value={authorLink}
                                  onChange={(e) => setAuthorLink(e.target.value)}
                                  placeholder={`예: ${customDomainStatus === "APPROVED" && customDomain ? `https://${customDomain}` : `https://${activeBrandId}.creaibox.com`}`}
                                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-blue-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase text-zinc-500">한 줄 소개글</label>
                              <textarea
                                value={authorBio}
                                onChange={(e) => setAuthorBio(e.target.value)}
                                placeholder="예: 최신 IT 기기 리뷰, 스마트 라이프스타일 및 에센셜 소식을 전달하는 파워블로그입니다."
                                rows={2}
                                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-blue-500 resize-none"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-zinc-500">아바타 / 로고 이미지 (업로드 또는 URL 입력)</label>
                              <div className="flex items-center gap-4">
                                {/* 아바타 실시간 프리뷰 */}
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 shrink-0 flex items-center justify-center">
                                  {authorAvatarUrl ? (
                                    <img src={authorAvatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="text-blue-500 font-black text-sm">
                                      {authorName ? authorName[0] : "A"}
                                    </div>
                                  )}
                                  {isAvatarUploading && (
                                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
                                      <Loader2 size={16} className="animate-spin text-blue-400" />
                                    </div>
                                  )}
                                </div>

                                {/* 숨겨진 파일 인풋 */}
                                <input
                                  type="file"
                                  ref={avatarFileInputRef}
                                  onChange={handleAvatarUpload}
                                  accept="image/*"
                                  className="hidden"
                                />

                                {/* 파일 업로드 버튼 */}
                                <button
                                  type="button"
                                  onClick={() => avatarFileInputRef.current?.click()}
                                  disabled={isAvatarUploading}
                                  className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
                                >
                                  {isAvatarUploading ? (
                                    <>
                                      <Loader2 size={14} className="animate-spin text-blue-400" />
                                      <span>업로드 중...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={14} className="text-blue-400" />
                                      <span>내 컴퓨터에서 사진 업로드</span>
                                    </>
                                  )}
                                </button>

                                {/* URL 직접 입력 필드 */}
                                <input
                                  type="text"
                                  value={authorAvatarUrl}
                                  onChange={(e) => setAuthorAvatarUrl(e.target.value)}
                                  placeholder="https://domain.com/logo.png (직접 URL 입력 가능)"
                                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-blue-500 font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900/80 flex justify-end">
                    <button
                      onClick={handleSaveConfigs}
                      disabled={isSaving}
                      className="rounded-2xl bg-blue-500 hover:bg-blue-600 px-6 py-4 text-xs font-black uppercase italic tracking-widest text-white transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                    >
                      <Save size={14} /> 테마 저장하기
                    </button>
                  </div>
                </div>

                {/* 🌟 실시간 블로그 라이브 프리뷰 목업 (Premium WOW UI) */}
                <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase italic tracking-wider text-white flex items-center justify-between">
                    <span>블로그 실시간 프리뷰</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[9px] font-black tracking-wider text-emerald-400">
                      LIVE
                    </span>
                  </h4>

                  {/* 브라우저 목업 */}
                  <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#09090b] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                    {/* 브라우저 헤더 */}
                    <div className="flex h-10 items-center justify-between bg-zinc-950 px-4 border-b border-zinc-900">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="rounded bg-zinc-900/80 px-4 py-1 text-[9px] font-mono text-zinc-500 truncate w-40 text-center">
                        {activeBrandId}.creaibox.com
                      </div>
                      <div className="w-8" />
                    </div>

                    {/* 블로그 홈 콘텐츠 */}
                    <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar bg-zinc-950 text-left">
                      {/* 미니 블로그 헤더 */}
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                        <span 
                          className="text-xs font-black italic tracking-tighter uppercase transition-colors"
                          style={{ color: blogAccentColor }}
                        >
                          {blogTitle || "MY BLOG"}
                        </span>
                        <div className="flex gap-2 text-[8px] font-bold text-zinc-500">
                          <span>전체글</span>
                          <span>골프 레슨</span>
                        </div>
                      </div>

                      {/* 미니 블로그 배너 */}
                      <div 
                        className="rounded-xl p-4 text-center space-y-2 border border-zinc-900"
                        style={{ 
                          backgroundImage: `linear-gradient(135deg, ${blogAccentColor}12, #09090b)`,
                        }}
                      >
                        <h5 className="text-sm font-black text-white">{blogTitle || "MY BLOG"}</h5>
                        <p className="text-[9px] font-bold text-zinc-500 leading-normal line-clamp-2">
                          {blogDesc || "블로그 소개 및 설명글 영역입니다."}
                        </p>
                      </div>

                      {/* 템플릿별 실시간 목록 미리보기 */}
                      <div className="space-y-3">
                        {/* 1. CARD Template */}
                        {blogTemplate === "card" && (
                          <div className="grid grid-cols-2 gap-3">
                            {[1, 2].map((i) => (
                              <div key={i} className="rounded-xl border border-zinc-900 bg-zinc-900/20 overflow-hidden flex flex-col">
                                <div 
                                  className="h-14 w-full"
                                  style={{
                                    backgroundImage: `linear-gradient(135deg, ${blogAccentColor}33, #09090b)`,
                                  }}
                                />
                                <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                                  <div className="space-y-1">
                                    <div className="h-1.5 w-6 rounded bg-zinc-800" />
                                    <div className="h-2.5 w-full rounded bg-zinc-700" />
                                  </div>
                                  <div className="flex items-center justify-between pt-1 text-[7px] font-black" style={{ color: blogAccentColor }}>
                                    <span>자세히 보기</span>
                                    <span>&rarr;</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 2. LIST Template */}
                        {blogTemplate === "list" && (
                          <div className="space-y-2.5">
                            {[1, 2].map((i) => (
                              <div key={i} className="flex gap-2.5 rounded-xl border border-zinc-900 bg-zinc-900/20 p-2">
                                <div 
                                  className="h-10 w-16 rounded bg-zinc-950 shrink-0"
                                  style={{
                                    backgroundImage: `linear-gradient(135deg, ${blogAccentColor}33, #09090b)`,
                                  }}
                                />
                                <div className="flex-1 flex flex-col justify-between py-0.5">
                                  <div className="space-y-1">
                                    <div className="h-1.5 w-8 rounded bg-zinc-800" />
                                    <div className="h-2.5 w-16 rounded bg-zinc-700" />
                                  </div>
                                  <div className="text-[7px] font-black" style={{ color: blogAccentColor }}>
                                    Read Post &rarr;
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 3. NEWS Template */}
                        {blogTemplate === "news" && (
                          <div className="space-y-2">
                            {[1, 2].map((i) => (
                              <div key={i} className="border-b border-zinc-900 pb-2 last:border-0 last:pb-0">
                                <div className="flex gap-1.5 text-[6px] font-black text-zinc-600 mb-1">
                                  <span style={{ color: blogAccentColor }}>NEWS</span>
                                  <span>2026. 06. 17.</span>
                                </div>
                                <div className="h-3 w-4/5 rounded bg-zinc-700" />
                                <div className="h-1.5 w-full rounded bg-zinc-800 mt-1" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* 간략 정보 요약 */}
                  <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4 text-[10px] font-bold text-zinc-500 leading-relaxed space-y-1">
                    <p className="text-white font-black">💡 테마 및 템플릿 실시간 적용</p>
                    <p>
                      강조 색상과 템플릿 레이아웃이 실제 사용자 사이트({activeBrandId}.creaibox.com)에 즉각 반영되어 출력됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Categories Editor */}
            {activeSubTab === "categories" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <form 
                  onSubmit={handleAddCategory}
                  className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-6"
                >
                  <h3 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                    <Layers size={18} className="text-blue-400" /> 새 카테고리 추가
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        카테고리 이름
                      </label>
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="예: IT 트렌드"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        카테고리 슬러그 (URL용)
                      </label>
                      <input
                        type="text"
                        required
                        value={newCatSlug}
                        onChange={(e) => setNewCatSlug(e.target.value)}
                        placeholder="예: it-trends"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingCat || catSuccess}
                    className={`w-full rounded-2xl py-4 text-xs font-black uppercase italic tracking-widest text-white transition-all flex items-center justify-center gap-1.5 ${
                      catSuccess
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.15)]"
                        : "bg-blue-500 hover:bg-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                    }`}
                  >
                    {catSuccess ? (
                      <>
                        <CheckCircle2 size={14} /> 카테고리가 생성되었습니다.
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> 카테고리 생성
                      </>
                    )}
                  </button>
                </form>

                <div className="space-y-4">
                  <h3 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                    카테고리 리스트 ({categories.length})
                  </h3>

                  {categories.length === 0 ? (
                    <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 px-8 py-16 text-center text-sm font-bold text-zinc-500">
                      등록된 카테고리가 없습니다. 왼쪽에서 나만의 블로그 카테고리를 추가해 보세요.
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-[32px] border border-zinc-900 bg-zinc-900/10">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-900 bg-zinc-950/40 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                            <th className="px-4 py-4">카테고리 명</th>
                            <th className="px-4 py-4 text-center">정렬</th>
                            <th className="px-4 py-4 text-right">삭제</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat, idx) => (
                            <tr 
                              key={cat.id} 
                              className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-all text-xs font-bold text-zinc-300"
                            >
                              <td className="px-4 py-4 min-w-[110px]">
                                <span className="font-black text-white block truncate">{cat.name}</span>
                                <span className="text-[9px] text-zinc-500 font-mono">/{cat.slug}</span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <div className="inline-flex gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveCategory(idx, "up")}
                                    className="h-7 w-7 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-zinc-900 flex items-center justify-center font-black"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === categories.length - 1}
                                    onClick={() => handleMoveCategory(idx, "down")}
                                    className="h-7 w-7 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-zinc-900 flex items-center justify-center font-black"
                                  >
                                    ▼
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-500 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 🌟 실시간 카테고리 헤더 프리뷰 목업 */}
                <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase italic tracking-wider text-white flex items-center justify-between">
                    <span>블로그 실시간 프리뷰</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[9px] font-black tracking-wider text-emerald-400">
                      LIVE
                    </span>
                  </h4>

                  {/* 브라우저 목업 */}
                  <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#09090b] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                    {/* 브라우저 헤더 */}
                    <div className="flex h-10 items-center justify-between bg-zinc-950 px-4 border-b border-zinc-900">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                      </div>
                      <div className="rounded bg-zinc-900/80 px-4 py-1 text-[9px] font-mono text-zinc-500 truncate w-40 text-center">
                        {activeBrandId}.creaibox.com
                      </div>
                      <div className="w-8" />
                    </div>

                    {/* 블로그 홈 콘텐츠 */}
                    <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar bg-zinc-950 text-left">
                      {/* 미니 블로그 헤더 - 실시간 카테고리 매핑 */}
                      <div className="flex flex-col gap-2 border-b border-zinc-900 pb-2">
                        <div className="flex items-center justify-between">
                          <span 
                            className="text-xs font-black italic tracking-tighter uppercase transition-colors"
                            style={{ color: blogAccentColor }}
                          >
                            {blogTitle || "MY BLOG"}
                          </span>
                        </div>
                        {/* 헤더 메뉴 실시간 매핑 */}
                        <div className="flex flex-wrap gap-2 text-[8px] font-bold text-zinc-500 bg-zinc-900/40 p-2 rounded-lg border border-zinc-900">
                          <span className="text-zinc-300 underline underline-offset-2 decoration-blue-500">전체글</span>
                          {categories.length === 0 ? (
                            <span className="text-zinc-600 italic">카테고리 없음</span>
                          ) : (
                            categories.slice(0, 5).map((cat) => (
                              <span key={cat.id} className="text-zinc-400 hover:text-white transition-all truncate max-w-[50px]">
                                {cat.name}
                              </span>
                            ))
                          )}
                          {categories.length > 5 && <span>...</span>}
                        </div>
                      </div>

                      {/* 미니 블로그 배너 */}
                      <div 
                        className="rounded-xl p-4 text-center space-y-2 border border-zinc-900"
                        style={{ 
                          backgroundImage: `linear-gradient(135deg, ${blogAccentColor}12, #09090b)`,
                        }}
                      >
                        <h5 className="text-sm font-black text-white">{blogTitle || "MY BLOG"}</h5>
                        <p className="text-[9px] font-bold text-zinc-500 leading-normal line-clamp-2">
                          {blogDesc || "블로그 소개 및 설명글 영역입니다."}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* 간략 정보 요약 */}
                  <div className="rounded-2xl border border-zinc-900 bg-black/40 p-4 text-[10px] font-bold text-zinc-500 leading-relaxed space-y-1">
                    <p className="text-white font-black">💡 상단 헤더 메뉴 실시간 연동</p>
                    <p>
                      카테고리 추가, 삭제 및 <b>정렬 순서(▲/▼)</b>를 바꾸면 실제 블로그 사이트의 상단 메뉴바 순서도 실시간으로 반영되어 출력됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SEO & Meta Integration */}
            {activeSubTab === "seo" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                      <Shield size={18} className="text-blue-400" /> SEO 및 애널리틱스 연동
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsVerificationGuideOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2.5 text-xs font-black text-blue-400 transition-all shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                    >
                      <HelpCircle size={14} /> 📖 구글/네이버 소유권 1분 연동 가이드
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="pl-1 text-xs font-black uppercase tracking-wider text-zinc-400">
                          Google Analytics (GA4) ID
                        </label>
                        <input
                          type="text"
                          value={gaId}
                          disabled
                          placeholder="자동 발급 및 연동 대기 중"
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 px-5 py-4 text-xs font-bold font-mono text-zinc-500 outline-none cursor-not-allowed select-none transition-colors"
                        />
                        <p className="text-xs text-zinc-300 pl-1 leading-relaxed mt-1">
                          해당 ID는 브랜드 신청 승인(도메인 연동) 시점에 크리에이박스 백엔드가 <b>Google Analytics Admin API를 직접 호출하여 도메인별 전용 분석 프로퍼티를 자동 개설하고 주입한 값</b>입니다. 시스템 관리에 의해 자동으로 추적 스크립트 셋팅이 완료되었으므로 수동 변경이 불가합니다.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="pl-1 text-xs font-black uppercase tracking-wider text-zinc-400">
                          네이버 서치어드바이저 연동 키
                        </label>
                        <input
                          type="text"
                          value={naverKey}
                          onChange={(e) => setNaverKey(e.target.value)}
                          placeholder="예: 3e7c8d92..."
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="pl-1 text-xs font-black uppercase tracking-wider text-zinc-400">
                          구글 서치콘솔 연동 키
                        </label>
                        <input
                          type="text"
                          value={googleSearchConsoleKey}
                          onChange={(e) => setGoogleSearchConsoleKey(e.target.value)}
                          placeholder="google-site-verification 값"
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-3 border-t border-zinc-900/50 pt-4">
                        <label className="pl-1 text-xs font-black uppercase tracking-wider text-zinc-400">
                          구글 애드센스 (Google AdSense) 게시자 ID
                        </label>
                        <input
                          type="text"
                          value={adsensePubId}
                          onChange={(e) => setAdsensePubId(e.target.value)}
                          placeholder="예: pub-XXXXXXXXXXXXXXXX"
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                        />
                        <p className="text-xs text-zinc-300 pl-1 leading-relaxed mt-1">
                          애드센스 게시자 ID(pub-으로 시작하는 16자리 숫자)를 입력하면 <b>ads.txt 파일이 해당 도메인에 자동으로 생성 및 서비스</b>되며, 광고 게재 권한이 즉시 활성화됩니다.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="pl-1 text-xs font-black uppercase tracking-wider text-zinc-400">
                        Rank Math 스타일 SEO Title 템플릿
                      </label>
                      <input
                        type="text"
                        value={seoTitleTemplate}
                        onChange={(e) => setSeoTitleTemplate(e.target.value)}
                        placeholder="%title% | %blog_title%"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-zinc-300 pl-1 mt-1">
                        치환자 지원: %title% (원고 제목), %blog_title% (블로그 공식 제목)
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="pl-1 text-xs font-black uppercase tracking-wider text-zinc-400">
                        Rank Math 스타일 SEO Meta Description 템플릿
                      </label>
                      <input
                        type="text"
                        value={seoDescTemplate}
                        onChange={(e) => setSeoDescTemplate(e.target.value)}
                        placeholder="%description%"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                      />
                      <p className="text-xs text-zinc-300 pl-1 mt-1">
                        치환자 지원: %description% (원고 메타 설명문), %title% (원고 제목)
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900/80 flex justify-end">
                    <button
                      onClick={handleSaveConfigs}
                      disabled={isSaving}
                      className="rounded-2xl bg-blue-500 hover:bg-blue-600 px-6 py-4 text-xs font-black uppercase italic tracking-widest text-white transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-[0_4px_12px_rgba(59,130,246,0.15)]"
                    >
                      <Save size={14} /> 설정 저장하기
                    </button>
                  </div>
                </div>

                <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase italic tracking-wider text-white flex items-center gap-1">
                    <Globe size={13} className="text-blue-400" /> 사이트맵 및 색인 상태
                  </h4>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5 space-y-2">
                      <span className="text-xs font-bold text-zinc-400 uppercase">sitemap.xml 주소</span>
                      <a
                        href={sitemapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-mono text-xs font-black italic text-blue-400 hover:underline break-all"
                      >
                        {activeBrandId}.creaibox.com/sitemap.xml
                      </a>
                    </div>
                    
                    <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5 space-y-2 text-xs font-bold text-zinc-300 leading-relaxed">
                      <p className="text-white font-black text-xs">💡 구글/네이버 등록 안내</p>
                      <p>
                        위 사이트맵 링크를 구글 서치콘솔 및 네이버 서치어드바이저에 등록하시면, 글 발행 시 검색엔진에 자동 반영 및 색인됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 🌟 SEO & GA4 Premium Visual Insight Guide */}
                <div className="lg:col-span-3 mt-8 rounded-[32px] border border-zinc-800/80 bg-zinc-900/10 backdrop-blur-xl p-8 md:p-10 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
                  
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-[10px] font-black tracking-widest uppercase shadow-sm">
                      <Sparkles size={11} className="animate-spin-slow" /> CreAibox Magic Engine
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight text-white leading-tight">
                      크리에이박스 검색 노출 & 분석 자동화 시스템 가이드
                    </h3>
                    <p className="text-xs text-zinc-400 font-semibold leading-relaxed max-w-4xl">
                      크리에이박스는 번거로운 코딩과 기술적 환경 설정 지식 없이도, 프로 수준의 구글/네이버 검색 엔진 최적화(SEO) 및 방문자 분석 환경을 즉시 완성할 수 있도록 모든 연동을 지능형 자동화로 셋팅해 드립니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* CARD 1: 비즈니스 검색 노출 구조 비교 */}
                    <div className="rounded-2xl border border-zinc-850 bg-black/30 p-6 space-y-4">
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <Globe size={16} className="text-indigo-400" /> 서브 도메인 VS 독립 도메인 차이
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        블로그 개설 형태에 따라 검색엔진 봇이 도메인의 소유권을 심사하는 로직이 달라집니다.
                      </p>
                      <div className="space-y-2.5 pt-2">
                        <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900 space-y-1">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">
                            기본 서브도메인 (아이디.creaibox.com)
                          </span>
                          <p className="text-xs text-zinc-300 font-bold leading-normal">
                            <b>개별 소유권 인증 불필요!</b> 크리에이박스 메인 도메인의 강력한 점수(도메인 권위)를 함께 공유하므로, 별도의 연동 작업 없이 글 발행 즉시 검색 노출이 가능합니다.
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-900 space-y-1">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">
                            개인 독립 도메인 (본인도메인.com)
                          </span>
                          <p className="text-xs text-zinc-300 font-bold leading-normal">
                            <b>최초 1회 인증 필요!</b> 사용자 고유의 독립 도메인이므로, 구글/네이버 등록 시에 제공된 HTML 인증 키를 <b>[SEO 및 연동 관리]</b>에 입력하여 소유자임을 선언해야 합니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: 구글 소유권 확인 자동 시너지 */}
                    <div className="rounded-2xl border border-zinc-850 bg-black/30 p-6 space-y-4">
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <Zap size={16} className="text-yellow-400" /> 구글 서치콘솔 프리패스 시너지
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        구글 애널리틱스(GA4)가 블로그 헤더에 선제적으로 자동 장착되어 동작하기 때문에, 사용자가 별도의 메타태그 복사 설정 없이도 서치콘솔에서 <b>&quot;원클릭 소유권 인증&quot;</b>이 가능해집니다.
                      </p>
                      <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 space-y-2">
                        <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                          ✨ 원클릭 프리패스 작동 원리
                        </span>
                        <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                          구글 서치콘솔 사이트 등록 화면에서 본인 도메인을 입력한 뒤 소유권 인증 수단 중 <b>[Google 애널리틱스]</b>를 선택하기만 하면, 사이트 내에 탑재되어 있는 애널리틱스 추적 태그가 실시간 감지되어 1초 만에 바로 소유권 확인이 완료됩니다.
                        </p>
                      </div>
                    </div>

                    {/* CARD 3: GA4 자동화 프로세스 다이어그램 */}
                    <div className="md:col-span-2 rounded-2xl border border-zinc-850 bg-black/30 p-6 space-y-6">
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <GitCommit size={16} className="text-emerald-400" /> 구글 애널리틱스 (GA4) API 자동 발급 프로세스
                      </h4>
                      
                      {/* Horizontal Steps Timeline diagram UI */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                        <div className="hidden md:block absolute top-[18px] left-[15%] right-[15%] h-[1px] bg-zinc-800/80 -z-10" />
                        
                        <div className="flex items-start md:flex-col gap-4 md:gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-955 border border-zinc-800 text-xs font-black text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                            01
                          </span>
                          <div className="space-y-1">
                            <h5 className="text-xs font-black text-white">도메인 승인</h5>
                            <p className="text-[10px] text-zinc-400 leading-normal">관리자가 도메인 연결을 최종 승인합니다.</p>
                          </div>
                        </div>

                        <div className="flex items-start md:flex-col gap-4 md:gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-955 border border-zinc-800 text-xs font-black text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                            02
                          </span>
                          <div className="space-y-1">
                            <h5 className="text-xs font-black text-white">API 연동 호출</h5>
                            <p className="text-[10px] text-zinc-400 leading-normal">백엔드 서버가 구글 GA Admin API를 직접 호출합니다.</p>
                          </div>
                        </div>

                        <div className="flex items-start md:flex-col gap-4 md:gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-955 border border-zinc-800 text-xs font-black text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                            03
                          </span>
                          <div className="space-y-1">
                            <h5 className="text-xs font-black text-white">데이터 스트림 생성</h5>
                            <p className="text-[10px] text-zinc-400 leading-normal">구글 서버 내에 도메인 전용 분석 스트림이 개설됩니다.</p>
                          </div>
                        </div>

                        <div className="flex items-start md:flex-col gap-4 md:gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-955 border border-zinc-800 text-xs font-black text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                            04
                          </span>
                          <div className="space-y-1">
                            <h5 className="text-xs font-black text-white">헤더 스크립트 주입</h5>
                            <p className="text-[10px] text-zinc-400 leading-normal">측정 ID가 감지되어 블로그 헤더에 자동 탑재됩니다.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD 4: 비즈니스 마케팅 세일즈 카피 가이드 */}
                    <div className="md:col-span-2 rounded-2xl border border-zinc-850 bg-black/30 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                          <FileText size={16} className="text-pink-400" /> 비즈니스 마케팅 세일즈 카피 가이드
                        </h4>
                        <span className="text-[9px] font-black bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          홍보에 즉시 활용 가능
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        크리에이박스의 차별화된 SEO 자동화 기술을 대고객 및 파트너 영업 마케팅에 그대로 카피하여 세일즈 효율을 올려보세요.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 space-y-1 text-xs">
                          <p className="text-white font-black">🔥 검색 노출이 머리아픈 크리에이터들에게</p>
                          <p className="text-zinc-400 text-[11px] leading-relaxed">
                            &quot;구글 서치콘솔 등록이 복잡해서 포기하셨나요? 크리에이박스 기본 도메인을 사용하시면 1초 만에 최적의 구글 노출 뼈대가 자동 장착됩니다.&quot;
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 space-y-1 text-xs">
                          <p className="text-white font-black">💼 기업 및 비즈니스 요금제 마케팅 시</p>
                          <p className="text-zinc-400 text-[11px] leading-relaxed">
                            &quot;GA4 연동 및 추적 코드 코딩을 몰라도, 본인 소유의 개인 도메인을 연결하는 즉시 구글 애널리틱스 분석 채널이 완전 자동 개설됩니다.&quot;
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CARD 5: 구글/네이버 수동 사이트맵 & 피드 제출 안내 */}
                    <div className="md:col-span-2 rounded-2xl border border-zinc-850 bg-black/30 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                          <HelpCircle size={16} className="text-blue-400" /> 왜 사이트맵(sitemap.xml)과 피드(/feed)를 직접 수동 제출해야 하나요?
                        </h4>
                        <span className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          최초 1회 필수 작업
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        등록하지 않아도 구글/네이버가 링크를 타고 부분적으로 색인을 생성할 수는 있지만, <b>기사 누락을 방지하고 몇 분 내로 초고속 검색 수집을 개통하려면 반드시 아래의 직접 연동 제출 작업이 강력히 권장됩니다.</b>
                      </p>
                      
                      <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 space-y-3">
                        <p className="text-xs text-zinc-300 font-bold leading-relaxed">
                          <b>💡 플랫폼(중앙 시스템)이 대신 자동 등록해 주지 못하는 이유:</b><br />
                          구글 서치콘솔과 네이버 서치어드바이저는 보안 및 스팸 차단을 목적으로 <b>&quot;해당 도메인을 쥔 실소유주 개인 계정&quot;의 로그인 승인을 철저하게 강제</b>하고 있기 때문에, 중앙 시스템이 우회하여 대행 등록하는 수단이 기술적/정책적으로 원천 차단되어 있습니다.
                        </p>
                        
                        <div className="border-t border-zinc-900 pt-3 space-y-2 text-xs">
                          <p className="text-white font-black">⚙️ 최초 1회 수동 제출 가이드라인</p>
                          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 text-[11px] leading-relaxed">
                            <li>
                              <b>구글 서치콘솔 (Google Search Console)</b>: 로그인 ➡️ 좌측 <b>[Sitemaps]</b> 메뉴 이동 ➡️ &apos;새 사이트맵 추가&apos; 입력창에 <code className="text-blue-400 font-mono">sitemap.xml</code> 과 <code className="text-blue-400 font-mono">feed</code> 를 각각 1회씩 써넣고 제출합니다.
                            </li>
                            <li>
                              <b>네이버 서치어드바이저 (Naver Search Advisor)</b>: 로그인 ➡️ 본인 도메인 선택 ➡️ 좌측 <b>[요청]</b> 메뉴 이동 ➡️ <b>[사이트맵 제출]</b> 메뉴에 <code className="text-blue-400 font-mono">sitemap.xml</code> 을 입력하여 제출 ➡️ <b>[RSS 제출]</b> 메뉴에 도메인을 포함한 전체 피드 주소(예: <code className="text-blue-400 font-mono">https://{activeBrandId}.creaibox.com/feed</code>)를 정확히 입력하여 제출합니다.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Traffic Analytics Dashboard */}
            {activeSubTab === "analytics" && (
              <div className="space-y-8">
                {/* Analytics Top Banner Banner */}
                <div className="rounded-[28px] border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-purple-500/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-400" />
                      크리에이박스 스튜디오 내 자체 조회수 & 통합 성과 분석 대시보드
                    </h3>
                    <p className="text-xs text-zinc-400 font-bold">
                      구글/네이버 서치콘솔에 매번 로그인하지 않고도 내 블로그의 인기 포스팅, 실시간 접속자, 유입 경로를 한눈에 모니터링합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVerificationGuideOpen(true)}
                    className="inline-flex items-center gap-2 shrink-0 rounded-2xl bg-blue-500 hover:bg-blue-600 px-5 py-3 text-xs font-black text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.25)]"
                  >
                    <HelpCircle size={15} /> 📖 구글/네이버 소유권 1분 연동 가이드
                  </button>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Card 1: Real-time Active Users */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_50%)]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      실시간 동시 접속자
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {isAnalyticsLoading ? (
                        <span className="inline-block w-12 h-6 bg-zinc-850 rounded animate-pulse" />
                      ) : (
                        `${analyticsData?.realtimeUsers ?? 0} 명`
                      )}
                    </h4>
                  </div>

                  {/* Card 2: Today PV */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <Eye size={12} className="text-blue-400" /> 오늘 페이지 뷰 (PV)
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {isAnalyticsLoading ? (
                        <span className="inline-block w-12 h-6 bg-zinc-850 rounded animate-pulse" />
                      ) : (
                        `${analyticsData?.todayPv ?? 0} 회`
                      )}
                    </h4>
                  </div>

                  {/* Card 3: Today UV */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <Users size={12} className="text-emerald-400" /> 오늘 고유 방문자 (UV)
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {isAnalyticsLoading ? (
                        <span className="inline-block w-12 h-6 bg-zinc-850 rounded animate-pulse" />
                      ) : (
                        `${analyticsData?.todayUv ?? 0} 명`
                      )}
                    </h4>
                  </div>

                  {/* Card 4: Total Published Posts */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <FileText size={12} className="text-purple-400" /> 누적 발행 포스트
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {filteredPosts.length} 개
                    </h4>
                  </div>

                  {/* Card 5: Average Duration */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <TrendingUp size={12} className="text-amber-400" /> 평균 체류 시간
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {isAnalyticsLoading ? (
                        <span className="inline-block w-16 h-6 bg-zinc-850 rounded animate-pulse" />
                      ) : (
                        analyticsData?.avgDuration ?? "0초"
                      )}
                    </h4>
                  </div>
                </div>

                {/* Popular posts & 7 days chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Traffic flow chart */}
                  <div className="lg:col-span-2 rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase italic tracking-wider text-white">
                        일간 방문 흐름 (최근 7일)
                      </h3>
                      {isAnalyticsLoading && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 animate-pulse">Syncing...</span>
                      )}
                    </div>

                    <div className="h-60 flex items-end gap-3 px-4 pt-10 border-b border-zinc-900">
                      {isAnalyticsLoading || !analyticsData?.dailyTrend || analyticsData.dailyTrend.length === 0 ? (
                        // Skeleton Chart Bars
                        Array.from({ length: 7 }).map((_, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 animate-pulse">
                            <div className="w-full bg-zinc-900/30 rounded-t-lg h-20" />
                            <span className="w-8 h-2 bg-zinc-900/30 rounded mt-2" />
                          </div>
                        ))
                      ) : (
                        // Live GA4 Chart Bars
                        analyticsData.dailyTrend.map((item: any, idx: number) => {
                          const maxViews = Math.max(...analyticsData.dailyTrend.map((t: any) => t.views), 10);
                          const percentage = Math.min(Math.round((item.views / maxViews) * 100), 100);
                          
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                              <span className="text-[9px] text-zinc-500 font-bold group-hover:text-blue-400 transition-colors">
                                {item.views} PV
                              </span>
                              <div 
                                className="w-full bg-blue-500/20 group-hover:bg-blue-500/40 rounded-t-lg transition-all duration-300"
                                style={{ height: `${percentage}%` }}
                              />
                              <span className="text-[9px] text-zinc-600 font-bold mt-2">
                                {item.date}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Popular posts (GA4 Live Data backed) */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                    <h3 className="text-sm font-black uppercase italic tracking-wider text-white flex items-center justify-between">
                      인기 글 순위 <TrendingUp size={14} className="text-blue-400" />
                    </h3>

                    {isAnalyticsLoading ? (
                      // Skeleton Loading
                      <div className="space-y-3 py-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div key={idx} className="flex items-center gap-3 animate-pulse">
                            <div className="h-6 w-6 rounded bg-zinc-900/30" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-zinc-900/30 rounded w-3/4" />
                              <div className="h-2 bg-zinc-900/30 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : !analyticsData?.popularPosts || analyticsData.popularPosts.length === 0 ? (
                      <div className="text-xs font-bold text-zinc-600 py-10 text-center">
                        통계를 집계할 포스트가 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {analyticsData.popularPosts.map((post: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 border-b border-zinc-900/50 pb-2.5 last:border-b-0 last:pb-0">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-zinc-950 font-black text-xs text-blue-400 italic mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-zinc-200" title={post.title}>
                                {post.title}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="text-[9px] font-black text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded">
                                  PV: {post.pv}
                                </span>
                                <span className="text-[9px] font-black text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded">
                                  평균독서: {post.avgDuration}
                                </span>
                                <span className="text-[9px] font-black text-zinc-500 bg-zinc-950/80 px-1.5 py-0.5 rounded">
                                  이탈: {post.bounceRate}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2단계: Marketing Analytics Panels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Channel traffic sources */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                    <h3 className="text-sm font-black uppercase italic tracking-wider text-white">
                      유입 채널 분석 (Top Channels)
                    </h3>
                    
                    {isAnalyticsLoading ? (
                      <div className="space-y-4 py-6 animate-pulse">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-2 bg-zinc-900/30 rounded w-1/3" />
                            <div className="h-1.5 bg-zinc-900/30 rounded" />
                          </div>
                        ))}
                      </div>
                    ) : !analyticsData?.channels || analyticsData.channels.length === 0 ? (
                      <div className="text-xs font-bold text-zinc-600 py-10 text-center">
                        유입 분석 데이터가 아직 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {analyticsData.channels.map((chan: any, idx: number) => {
                          const total = analyticsData.channels.reduce((sum: number, c: any) => sum + c.value, 0);
                          const percentage = Math.round((chan.value / (total || 1)) * 100);
                          const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-red-500"];
                          const activeColor = colors[idx % colors.length];

                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-zinc-300">{chan.name}</span>
                                <span className="text-zinc-500">{percentage}% ({chan.value}명)</span>
                              </div>
                              <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                                <div className={`h-full ${activeColor}`} style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Device share */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                    <h3 className="text-sm font-black uppercase italic tracking-wider text-white">
                      접속 기기 분석 (Device Share)
                    </h3>

                    {isAnalyticsLoading ? (
                      <div className="space-y-4 py-6 animate-pulse">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-2 bg-zinc-900/30 rounded w-1/3" />
                            <div className="h-1.5 bg-zinc-900/30 rounded animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ) : !analyticsData?.devices || analyticsData.devices.length === 0 ? (
                      <div className="text-xs font-bold text-zinc-600 py-10 text-center">
                        기기 분석 데이터가 아직 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {analyticsData.devices.map((dev: any, idx: number) => {
                          const total = analyticsData.devices.reduce((sum: number, d: any) => sum + d.value, 0);
                          const percentage = Math.round((dev.value / (total || 1)) * 100);
                          const colors = ["bg-emerald-500", "bg-blue-500", "bg-purple-500"];
                          const activeColor = colors[idx % colors.length];

                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-zinc-300 capitalize">{dev.name}</span>
                                <span className="text-zinc-500">{percentage}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                                <div className={`h-full ${activeColor}`} style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Regions distribution */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                    <h3 className="text-sm font-black uppercase italic tracking-wider text-white">
                      주요 방문 지역 (Regions)
                    </h3>

                    {isAnalyticsLoading ? (
                      <div className="space-y-3.5 py-4 animate-pulse">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-4 bg-zinc-900/30 rounded w-full" />
                          </div>
                        ))}
                      </div>
                    ) : !analyticsData?.regions || analyticsData.regions.length === 0 ? (
                      <div className="text-xs font-bold text-zinc-600 py-10 text-center">
                        지역 분석 데이터가 아직 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {analyticsData.regions.map((reg: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between border-b border-zinc-900/50 pb-2 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-400">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-zinc-200">{reg.name}</span>
                            </div>
                            <span className="text-xs font-black text-blue-400 italic">
                              {reg.value} 명
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Custom Domain Management */}
            {activeSubTab === "customDomain" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Side: Request / Status Console */}
                <div className="lg:col-span-2 rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-8 space-y-6">
                  <h3 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                    <Globe size={18} className="text-blue-400" /> 독립 도메인 설정 (Custom Domain)
                  </h3>

                  {!(membershipLevel === "pro" || membershipLevel === "admin" || userRole === "ADMIN" || userRole === "SUPER_ADMIN") ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          className="w-full rounded-2xl border border-zinc-900 bg-zinc-950/40 px-6 py-5 text-sm font-bold text-zinc-700 outline-none cursor-not-allowed"
                          placeholder="연결할 도메인 입력 (예: aaa.com)"
                        />
                      </div>
                      <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-6 text-xs font-bold text-amber-500 leading-relaxed text-left flex items-start gap-3">
                        <HelpCircle className="shrink-0 mt-0.5 text-amber-500" size={16} />
                        <div>
                          <p className="text-sm font-black">독립 도메인 연결 제한 안내</p>
                          <p className="text-zinc-500 mt-2">
                            독립 도메인 연결 기능은 <strong>Pro 멤버십 이상</strong> 회원에게만 제공되는 프리미엄 기능입니다.<br />
                            나만의 개인 독립 도메인(예: aaa.com)으로 블로그를 브랜딩하려면 마이페이지에서 멤버십을 업그레이드해 주세요.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Status == NONE */}
                      {customDomainStatus === "NONE" && (
                        <div className="space-y-4 text-left">
                          <p className="text-xs font-bold text-zinc-400 leading-relaxed">
                            나만의 개인 독립 도메인(예: aaa.com 또는 blog.aaa.com)을 이 브랜드 블로그({activeBrandId}.creaibox.com)에 매핑하여 서비스할 수 있습니다.
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customDomainInput}
                              onChange={(e) => setCustomDomainInput(e.target.value)}
                              className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-sm font-bold text-white shadow-inner outline-none transition-all placeholder:text-zinc-800 focus:border-blue-500"
                              placeholder="연결할 독립 도메인 입력 (예: aaa.com)"
                            />
                            <button
                              onClick={requestCustomDomain}
                              disabled={isSaving}
                              className="rounded-2xl bg-blue-500 hover:bg-blue-600 px-6 text-xs font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)] disabled:opacity-50 font-bold"
                            >
                              {isSaving ? "신청 중..." : "연결 신청"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Status == PENDING */}
                      {customDomainStatus === "PENDING" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-4">
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">독립 도메인 등록 심사 중</span>
                              <span className="text-sm font-black text-zinc-400 mt-0.5 italic tracking-tight font-mono">
                                {requestedCustomDomain}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-amber-500" />
                              <span className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-amber-400">
                                PENDING
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleOpenDisconnectModal(e)}
                                className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-300 transition-colors font-bold"
                              >
                                신청 취소
                              </button>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-5 text-xs font-bold text-zinc-500 leading-relaxed text-left space-y-1">
                            <p className="text-zinc-300 font-black">⏳ 도메인 신청 접수 완료</p>
                            <p>관리자가 신청된 독립 도메인을 검토하여 1~2일 내로 등록 및 SSL 인증서를 발급합니다.</p>
                          </div>
                        </div>
                      )}

                      {/* Status == APPROVED */}
                      {customDomainStatus === "APPROVED" && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4">
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">연결 완료 (LIVE)</span>
                              <a
                                href={`https://${customDomain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-black text-white hover:text-blue-400 transition-colors flex items-center gap-1 mt-0.5 italic tracking-tight font-mono"
                              >
                                {customDomain}
                              </a>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-emerald-400">
                                LIVE
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleOpenDisconnectModal(e)}
                                className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-300 transition-colors font-bold"
                              >
                                연결 해제
                              </button>
                            </div>
                          </div>

                          {/* DNS Connection Guides */}
                          <div className="space-y-3 rounded-2xl border border-blue-500/10 bg-blue-600/5 p-5 text-left">
                            <p className="flex items-center gap-2 text-xs font-black leading-relaxed text-blue-400">
                              <CheckCircle2 size={14} /> DNS 설정 필수 안내
                            </p>
                            <p className="text-xs font-bold leading-relaxed text-zinc-400">
                              독립 도메인 연결을 완료하려면 본인의 DNS 관리자(Cloudflare, GoDaddy 등)에서 아래 레코드를 추가하셔야 합니다.
                            </p>
                            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2 font-mono text-[11px] text-zinc-400 leading-relaxed">
                              <div className="flex justify-between border-b border-zinc-900 pb-2">
                                <span>레코드 타입:</span>
                                <span className="text-white font-bold">CNAME</span>
                              </div>
                              <div className="flex justify-between border-b border-zinc-900 pb-2">
                                <span>이름(호스트):</span>
                                <span className="text-white font-bold">@ 또는 blog (서브도메인 호스트명)</span>
                              </div>
                              <div className="flex justify-between">
                                <span>값 (Value):</span>
                                <span className="text-blue-400 font-bold">{activeBrandId}.creaibox.com</span>
                              </div>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-500 leading-relaxed">
                              * Vercel 배포 시스템이 {activeBrandId}.creaibox.com 도메인을 통해 가상 프록시를 처리하므로, 본인의 DNS에서 이 주소를 목적지로 지정하시면 됩니다.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Status == REJECTED */}
                      {customDomainStatus === "REJECTED" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4">
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">독립 도메인 연결 반려됨</span>
                              <span className="text-sm font-black text-zinc-500 line-through mt-0.5 italic tracking-tight font-mono">
                                {requestedCustomDomain}
                              </span>
                            </div>
                            <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-red-400">
                              REJECTED
                            </span>
                          </div>
                          {customDomainRejectionReason && (
                            <div className="rounded-xl border border-red-500/10 bg-red-600/5 p-4 text-xs font-bold text-red-400 leading-relaxed text-left">
                              💡 반려 사유: {customDomainRejectionReason}
                            </div>
                          )}
                          <div className="flex gap-2 pt-2">
                            <input
                              type="text"
                              value={customDomainInput}
                              onChange={(e) => setCustomDomainInput(e.target.value)}
                              className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-sm font-bold text-white shadow-inner outline-none transition-all placeholder:text-zinc-800 focus:border-blue-500"
                              placeholder="연결할 독립 도메인 다시 입력 (예: aaa.com)"
                            />
                            <button
                              onClick={requestCustomDomain}
                              disabled={isSaving}
                              className="rounded-2xl bg-blue-500 hover:bg-blue-600 px-6 text-xs font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)] disabled:opacity-50 font-bold"
                            >
                              다시 신청
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side: Informative Technical Guide */}
                <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-6 text-left">
                  <h4 className="text-xs font-black uppercase italic tracking-wider text-white flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-blue-500" /> 독립 도메인 작동 안내 가이드
                  </h4>

                  <div className="space-y-5 text-[11px] font-bold leading-relaxed text-zinc-400">
                    <div className="space-y-1.5">
                      <p className="text-white font-black text-xs">🌐 1. CNAME 레코드 설정 방법</p>
                      <p>
                        도메인 등록 대행업체(예: 가비아, 가비아, 가비아, 가비아) 웹사이트에 로그인한 후, DNS 설정 메뉴에서 <strong>CNAME 레코드</strong>를 추가합니다.
                      </p>
                      <p className="text-zinc-500 pl-2 border-l border-zinc-800">
                        * 주 도메인(예: mybrand.com)을 직접 연결하거나 서브도메인(예: blog.mybrand.com)을 분할해 연결할 수 있습니다.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-white font-black text-xs">🔒 2. SSL/TLS 보안 인증서 동적 발급</p>
                      <p>
                        도메인 연결이 승인되면 CreAibox의 인프라(Vercel 에지 프록시 네트워크)가 사용자 도메인을 위해 **Let's Encrypt**보안 SSL 인증서를 동적으로 실시간 발급합니다.
                      </p>
                      <p className="text-zinc-500">
                        이를 통해 사용자는 별도의 SSL 구매 없이 `https://`로 안전하게 블로그를 운영할 수 있습니다.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-white font-black text-xs">🚀 3. 호스트 분석 및 내부 리다이렉트</p>
                      <p>
                        블로그 시스템은 Next.js Edge Middleware 기술을 기반으로 작동합니다. 방문자가 본인의 독립 도메인으로 접속하면, 주소창 주소는 본인 도메인 그대로 유지한 채 서버 내부적으로 CreAibox에 매핑된 브랜드 글들을 실시간 로드해 줍니다.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-500/10 bg-blue-600/5 p-4 space-y-1 text-zinc-500 text-[10px] leading-relaxed">
                      <p className="text-blue-400 font-black flex items-center gap-1">
                        💡 Vercel 클라우드 연동 완료
                      </p>
                      <p>
                        본 서비스는 Vercel CDN 네트워크를 통해 호스팅되므로 전 세계 어디서든 0.1초대의 빠른 속도로 콘텐츠가 서빙됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PageSpeed Insights Audit */}
            {activeSubTab === "pagespeed" && (
              <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-8 space-y-8 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                      <TrendingUp size={18} className="text-blue-400" /> PageSpeed Insights 성능 분석
                    </h3>
                    <p className="text-xs font-bold text-zinc-400">
                      Google Lighthouse 엔진을 통해 블로그의 실시간 속도, 최적화 상태 및 코어 웹 바이탈 점수를 측정합니다.
                    </p>
                  </div>
                  <a
                    href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(pagespeedUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                  >
                    Google 공식 페이지에서 보기 <Globe size={11} />
                  </a>
                </div>

                {/* Search Bar / Input console */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">측정 대상 블로그 주소 (외부 공개용 주소 필수)</span>
                    <input
                      type="text"
                      value={pagespeedUrl}
                      onChange={(e) => setPagespeedUrl(e.target.value)}
                      className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-4.5 text-sm font-bold text-white shadow-inner outline-none transition-all focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">측정 모드</span>
                      <select
                        value={pagespeedStrategy}
                        onChange={(e) => setPagespeedStrategy(e.target.value as "desktop" | "mobile")}
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4.5 text-sm font-bold text-zinc-350 outline-none cursor-pointer focus:border-blue-500"
                      >
                        <option value="desktop" className="bg-zinc-950 text-zinc-300 font-bold">🖥️ 데스크톱</option>
                        <option value="mobile" className="bg-zinc-950 text-zinc-300 font-bold">📱 휴대전화</option>
                      </select>
                    </div>
                    <button
                      onClick={runPagespeedAudit}
                      disabled={pagespeedLoading}
                      className="rounded-2xl bg-blue-500 hover:bg-blue-600 px-6 text-xs font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)] disabled:opacity-50 font-bold flex items-center justify-center gap-2"
                      style={{ height: "54px" }}
                    >
                      {pagespeedLoading ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> 측정 중
                        </>
                      ) : (
                        "성능 측정"
                      )}
                    </button>
                  </div>
                </div>

                {pagespeedError && (
                  <div className="rounded-2xl border border-red-500/10 bg-red-600/5 p-5 text-xs font-bold text-red-400 text-left">
                    ⚠️ {pagespeedError}
                  </div>
                )}

                {/* Loading state skeleton */}
                {pagespeedLoading && (
                  <div className="rounded-3xl border border-zinc-900 bg-zinc-950/20 p-8 space-y-6 text-center animate-pulse">
                    <div className="flex justify-center">
                      <RefreshCw size={36} className="text-blue-500 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-black text-white">Google Lighthouse에서 모바일/데스크톱 속도 정보를 수집 중입니다...</p>
                      <p className="text-xs text-zinc-500">실시간 원격 서버에서 네트워크 환경과 렌더링 성능을 테스트하므로 약 10~15초 정도 소요될 수 있습니다.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-zinc-900/30 rounded-2xl border border-zinc-900/50" />
                      ))}
                    </div>
                  </div>
                )}

                {/* PageSpeed Audit Results */}
                {pagespeedResult && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="rounded-3xl border border-zinc-900 bg-zinc-950/20 p-8 space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">📊 Lighthouse 진단 스코어 ({pagespeedStrategy === "desktop" ? "🖥️ 데스크톱" : "📱 휴대전화"})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ScoreRing score={pagespeedResult.scores.performance} label="성능" />
                        <ScoreRing score={pagespeedResult.scores.accessibility} label="접근성" />
                        <ScoreRing score={pagespeedResult.scores.bestPractices} label="권장사항" />
                        <ScoreRing score={pagespeedResult.scores.seo} label="검색엔진 최적화" />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-900 bg-zinc-950/20 p-8 space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">⚡ 코어 웹 바이탈 핵심 항목 (Core Web Vitals)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <MetricCard
                          title="First Contentful Paint (FCP)"
                          value={pagespeedResult.metrics.fcp}
                          description="페이지 첫 텍스트/이미지가 보이기 시작하는 시간입니다."
                        />
                        <MetricCard
                          title="Largest Contentful Paint (LCP)"
                          value={pagespeedResult.metrics.lcp}
                          description="가장 큰 메인 이미지가 다 나타나는 데 걸린 시간입니다."
                        />
                        <MetricCard
                          title="Total Blocking Time (TBT)"
                          value={pagespeedResult.metrics.tbt}
                          description="마우스 클릭/입력이 반응하기까지의 지연 대기시간입니다."
                        />
                        <MetricCard
                          title="Cumulative Layout Shift (CLS)"
                          value={pagespeedResult.metrics.cls}
                          description="화면 로딩 시 갑자기 글이나 이미지가 밀리는 현상 지수입니다."
                        />
                        <MetricCard
                          title="Speed Index"
                          value={pagespeedResult.metrics.si}
                          description="콘텐츠들이 화면을 채우는 속도를 계산한 평균치입니다."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
      </div>
      {/* 🌟 Custom Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[32px] border border-zinc-800 bg-[#0b0e14] p-8 shadow-2xl text-left space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-blue-400" /> 확인
              </span>
              <h3 className="text-lg font-black text-white italic uppercase">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-zinc-400 font-bold leading-relaxed">
                {confirmModal.message}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 rounded-2xl border border-zinc-850 bg-zinc-900 hover:bg-zinc-800 py-3.5 text-xs font-black text-zinc-400 hover:text-white transition-all font-bold"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-500 py-3.5 text-xs font-black text-white transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] font-bold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 구글 / 네이버 서치콘솔 3단계 소유권 연동 튜토리얼 모달 */}
      {isVerificationGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl rounded-[32px] border border-zinc-800 bg-zinc-950 p-6 md:p-8 space-y-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                  <Sparkles size={12} /> 1분 자동 완성 튜토리얼
                </span>
                <h3 className="text-xl font-black text-white italic tracking-tight flex items-center gap-2 mt-0.5">
                  구글 서치콘솔 & 네이버 서치어드바이저 등록 가이드
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVerificationGuideOpen(false)}
                className="rounded-full bg-zinc-900 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-zinc-900 gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setGuideModalTab("naver")}
                className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all ${
                  guideModalTab === "naver"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                🟢 네이버 서치어드바이저 (3단계)
              </button>
              <button
                type="button"
                onClick={() => setGuideModalTab("google")}
                className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all ${
                  guideModalTab === "google"
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                🔵 구글 서치콘솔 (3단계)
              </button>
              <button
                type="button"
                onClick={() => setGuideModalTab("urls")}
                className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all ${
                  guideModalTab === "urls"
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                📋 사이트맵 & RSS 주소 1초 복사
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto space-y-4 pr-1 text-xs leading-relaxed font-bold text-zinc-300 custom-scrollbar flex-1">
              {guideModalTab === "naver" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Step 1. 서치어드바이저 로그인 및 사이트 추가</span>
                    <p className="text-zinc-300">
                      <a href="https://searchadvisor.naver.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-black">네이버 서치어드바이저(searchadvisor.naver.com)</a> 접속 ➡️ [웹마스터 도구] 진입 ➡️ 사이트 등록란에 내 블로그 주소(<code className="text-white font-mono bg-zinc-950 px-1.5 py-0.5 rounded">https://{activeBrandId}.creaibox.com</code>)를 입력합니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Step 2. HTML 태그 방식 메타태그 복사</span>
                    <p className="text-zinc-300">
                      사이트 소유 확인 방법 중 <b>[HTML 태그]</b>를 선택한 후, 제공되는 코드 중 <code className="text-emerald-300 font-mono bg-zinc-950 px-1.5 py-0.5 rounded">content=&quot;...&quot;</code> 안의 고유 키값을 복사합니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Step 3. 크리에이박스 스튜디오에 입력 및 저장</span>
                    <p className="text-zinc-300">
                      현재 보시는 <b>[SEO 및 연동 관리]</b> 탭의 <b>&apos;네이버 서치어드바이저 연동 키&apos;</b> 입력칸에 복사한 값을 붙여넣고 [설정 저장하기]를 클릭합니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Step 4. 네이버에서 소유확인 & 사이트맵 / RSS 제출</span>
                    <p className="text-zinc-300">
                      네이버 서치어드바이저 화면으로 돌아와 <b>[소유확인]</b> 버튼을 누르면 승인이 완료됩니다!<br />
                      ① <b>[요청 ➡️ 사이트맵 제출]</b>: <code className="text-emerald-400 font-mono">sitemap.xml</code> 입력 후 제출<br />
                      ② <b>[요청 ➡️ RSS 제출]</b>: 전체 피드 주소(<code className="text-emerald-400 font-mono">https://{activeBrandId}.creaibox.com/feed</code>)를 입력 후 제출해 주세요.
                    </p>
                  </div>
                </div>
              )}

              {guideModalTab === "google" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Step 1. 구글 서치콘솔 접속 및 속성 추가</span>
                    <p className="text-zinc-300">
                      <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-black">구글 서치콘솔(search.google.com/search-console)</a> 로그인 ➡️ 좌측 상단 [속성 추가] ➡️ <b>&apos;URL 접두사&apos;</b> 항목에 내 블로그 주소(<code className="text-white font-mono bg-zinc-950 px-1.5 py-0.5 rounded">https://{activeBrandId}.creaibox.com</code>)를 입력합니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Step 2. HTML 태그 소유권 인증 코드 복사</span>
                    <p className="text-zinc-300">
                      다른 인증 방법 중 <b>[HTML 태그]</b>를 클릭하고 발급된 <code className="text-blue-300 font-mono bg-zinc-950 px-1.5 py-0.5 rounded">google-site-verification</code> 메타태그 키값을 복사합니다.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Step 3. 스튜디오 붙여넣기 & 사이트맵 / RSS 제출</span>
                    <p className="text-zinc-300">
                      스튜디오 <b>[SEO 및 연동 관리]</b>의 <b>&apos;구글 서치콘솔 연동 키&apos;</b>에 복사한 키를 넣고 [설정 저장하기]를 누른 뒤, 구글 서치콘솔에서 [확인] 클릭!<br />
                      그 후 <b>[Sitemaps]</b> 메뉴에서 <code className="text-blue-400 font-mono">sitemap.xml</code> 과 <code className="text-blue-400 font-mono">feed</code> (또는 RSS 피드 주소)를 각각 1회씩 입력하여 제출해 주세요.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs leading-relaxed font-bold">
                    💡 <b>꿀팁!</b> 구글 애널리틱스(GA4)가 블로그에 자동 설치되어 있으므로, 구글 서치콘솔 인증 시 <b>[Google 애널리틱스]</b> 방식을 선택하시면 클릭 한 번에 1초 완료됩니다!
                  </div>
                </div>
              )}

              {guideModalTab === "urls" && (
                <div className="space-y-4">
                  <p className="text-zinc-400 text-xs font-bold">
                    구글 서치콘솔 및 네이버 서치어드바이저 사이트맵 제출 메뉴에 아래 주소를 입력하세요.
                  </p>

                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-purple-400">1. 사이트맵 주소 (Sitemap.xml)</span>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(`https://${activeBrandId}.creaibox.com/sitemap.xml`, "sitemap")}
                        className="rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 px-3 py-1 text-[10px] font-black text-purple-300 transition-all"
                      >
                        {copiedUrlType === "sitemap" ? "✅ 복사 완료!" : "📋 주소 복사"}
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={`https://${activeBrandId}.creaibox.com/sitemap.xml`}
                      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-xs font-mono text-white outline-none select-all"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-purple-400">2. RSS 피드 주소 (/feed)</span>
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(`https://${activeBrandId}.creaibox.com/feed`, "rss")}
                        className="rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 px-3 py-1 text-[10px] font-black text-purple-300 transition-all"
                      >
                        {copiedUrlType === "rss" ? "✅ 복사 완료!" : "📋 주소 복사"}
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={`https://${activeBrandId}.creaibox.com/feed`}
                      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-xs font-mono text-white outline-none select-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-900 pt-4 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-bold text-zinc-500">
                크리에이박스 검색엔진 자동 색인 지원 로직 적용됨
              </span>
              <button
                type="button"
                onClick={() => setIsVerificationGuideOpen(false)}
                className="rounded-2xl bg-zinc-850 hover:bg-zinc-800 px-6 py-2.5 text-xs font-black text-white transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
