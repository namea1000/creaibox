"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Settings, Layers, Palette, Shield, LineChart, Globe, HelpCircle, 
  Plus, Trash2, Save, FileText, CheckCircle2, TrendingUp, Users, Eye, RefreshCw
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
  const [seoTitleTemplate, setSeoTitleTemplate] = useState("%title% | %blog_title%");
  const [seoDescTemplate, setSeoDescTemplate] = useState("%description%");
  
  const [isSaving, setIsSaving] = useState(false);

  // Categories states
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);

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
  const [activeSubTab, setActiveSubTab] = useState<"general" | "categories" | "seo" | "analytics" | "customDomain">("general");

  // Fetch initial profile, categories, and posts
  useEffect(() => {
    let mounted = true;
    const fetchInitData = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!currentUser) {
          router.replace("/login");
          return;
        }
        setUser(currentUser);

        // Fetch user profile, blog categories, and published posts in parallel
        const [profileRes, catsRes, postsRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle(),
          supabase
            .from("blog_categories")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: true }),
          supabase
            .from("writing_creaibox_posts")
            .select("id, title, slug, created_at")
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

          // Extract all approved brands
          const brands: string[] = [];
          if (profileData.brand_id && profileData.brand_id_status === "APPROVED") {
            brands.push(profileData.brand_id);
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
            setActiveBrandId("");
          }
        }

        // Process categories
        if (catsRes.data) {
          setCategories(catsRes.data as BlogCategory[]);
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
    setBlogDesc(getConfigValue("blog_description", "CreAibox에서 생성한 고품질 콘텐츠 블로그입니다."));
    setBlogTemplate(getConfigValue("blog_template", "card"));
    setBlogAccentColor(getConfigValue("blog_accent_color", "#3b82f6"));
    setGaId(getConfigValue("ga_id", ""));
    setNaverKey(getConfigValue("naver_advisor_key", ""));
    setSeoTitleTemplate(getConfigValue("seo_template_title", "%title% | %blog_title%"));
    setSeoDescTemplate(getConfigValue("seo_template_desc", "%description%"));

    const status = getConfigValue("custom_domain_status", "NONE");
    const domain = getConfigValue("custom_domain", "");
    const reqDomain = getConfigValue("requested_custom_domain", "");
    
    setCustomDomainStatus(status);
    setCustomDomain(domain);
    setRequestedCustomDomain(reqDomain);
    setCustomDomainRejectionReason(getConfigValue("custom_domain_rejection_reason", ""));
    setCustomDomainInput(reqDomain || domain || "");

  }, [activeBrandId, profile]);

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
        [`seo_template_title_${activeBrandId}`]: seoTitleTemplate.trim(),
        [`seo_template_desc_${activeBrandId}`]: seoDescTemplate.trim(),
      };

      // Set top-level configs as well if the selected brand ID is the primary brand ID for compatibility
      if (activeBrandId === currentProfile?.brand_id) {
        mergedConfigs.blog_title = blogTitle.trim();
        mergedConfigs.blog_description = blogDesc.trim();
        mergedConfigs.blog_template = blogTemplate;
        mergedConfigs.blog_accent_color = blogAccentColor;
        mergedConfigs.ga_id = gaId.trim();
        mergedConfigs.naver_advisor_key = naverKey.trim();
        mergedConfigs.seo_template_title = seoTitleTemplate.trim();
        mergedConfigs.seo_template_desc = seoDescTemplate.trim();
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
    if (!/^[a-z0-9-]{2,20}$/.test(slug)) {
      alert("카테고리 슬러그는 영문 소문자, 숫자, 하이픈(-) 조합 2~20자만 가능합니다.");
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
          name,
          slug,
        })
        .select()
        .single();

      if (error) throw error;

      alert(`✅ '${name}' 카테고리가 생성되었습니다.`);
      setCategories(prev => [...prev, data as BlogCategory]);
      setNewCatName("");
      setNewCatSlug("");
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

  const disconnectCustomDomain = async () => {
    if (!user || !activeBrandId) return;
    if (!confirm("연결된 독립 도메인을 해제하시겠습니까?")) return;

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
                  공식 블로그 관리
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
                      {approvedBrands.map((bid) => (
                        <option key={bid} value={bid} className="bg-zinc-950 text-zinc-300 font-bold">
                          {bid}.creaibox.com
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <a
                  href={customDomainStatus === "APPROVED" && customDomain ? `https://${customDomain}` : `http://${activeBrandId}.localhost:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 px-5 py-3 text-xs font-black uppercase italic text-zinc-400 hover:text-white transition-colors"
                >
                  <Globe size={13} /> {customDomainStatus === "APPROVED" && customDomain ? customDomain : `${activeBrandId}.creaibox.com`} 방문
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

                <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase italic tracking-wider text-white">
                    디자인 프리뷰 정보
                  </h4>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">도메인 주소</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">ACTIVE</span>
                      </div>
                      <p className="font-mono text-xs font-black italic text-zinc-300">
                        {activeBrandId}.creaibox.com
                      </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">활성 템플릿</span>
                      </div>
                      <p className="text-xs font-black uppercase text-white">
                        {blogTemplate.toUpperCase()} TEMPLATE
                      </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">강조 색상</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                        <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: blogAccentColor }} />
                        {blogAccentColor}
                      </div>
                    </div>
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
                    disabled={isAddingCat}
                    className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 py-4 text-xs font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.15)] flex items-center justify-center gap-1.5"
                  >
                    <Plus size={14} /> 카테고리 생성
                  </button>
                </form>

                <div className="lg:col-span-2 space-y-4">
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
                            <th className="px-6 py-4">카테고리 명</th>
                            <th className="px-6 py-4">카테고리 슬러그 (URL 경로)</th>
                            <th className="px-6 py-4 text-right">삭제</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat) => (
                            <tr 
                              key={cat.id} 
                              className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-all text-xs font-bold text-zinc-300"
                            >
                              <td className="px-6 py-5">
                                <span className="font-black text-white">{cat.name}</span>
                              </td>
                              <td className="px-6 py-5 font-mono text-zinc-400">
                                /category/{cat.slug}
                              </td>
                              <td className="px-6 py-5 text-right">
                                <button
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
              </div>
            )}

            {/* TAB CONTENT: SEO & Meta Integration */}
            {activeSubTab === "seo" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-8 space-y-6">
                  <h3 className="text-md font-black uppercase italic tracking-wider text-white flex items-center gap-2">
                    <Shield size={18} className="text-blue-400" /> SEO 및 애널리틱스 연동
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                          Google Analytics (GA4) ID
                        </label>
                        <input
                          type="text"
                          value={gaId}
                          onChange={(e) => setGaId(e.target.value)}
                          placeholder="예: G-XXXXXXXXXX"
                          className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
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
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Rank Math 스타일 SEO Title 템플릿
                      </label>
                      <input
                        type="text"
                        value={seoTitleTemplate}
                        onChange={(e) => setSeoTitleTemplate(e.target.value)}
                        placeholder="%title% | %blog_title%"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                      />
                      <p className="text-[10px] text-zinc-500 pl-1">
                        치환자 지원: %title% (원고 제목), %blog_title% (블로그 공식 제목)
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                        Rank Math 스타일 SEO Meta Description 템플릿
                      </label>
                      <input
                        type="text"
                        value={seoDescTemplate}
                        onChange={(e) => setSeoDescTemplate(e.target.value)}
                        placeholder="%description%"
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-xs font-bold font-mono text-white outline-none focus:border-blue-500 transition-colors"
                      />
                      <p className="text-[10px] text-zinc-500 pl-1">
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
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">sitemap.xml 주소</span>
                      <a
                        href={sitemapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-mono text-xs font-black italic text-blue-400 hover:underline break-all"
                      >
                        {activeBrandId}.creaibox.com/sitemap.xml
                      </a>
                    </div>
                    
                    <div className="rounded-2xl border border-zinc-900 bg-black/40 p-5 space-y-2 text-[10px] font-bold text-zinc-500 leading-relaxed">
                      <p className="text-white font-black">💡 구글/네이버 등록 안내</p>
                      <p>
                        위 사이트맵 링크를 구글 서치콘솔 및 네이버 서치어드바이저에 등록하시면, 글 발행 시 검색엔진에 자동 반영 및 색인됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Traffic Analytics Dashboard */}
            {activeSubTab === "analytics" && (
              <div className="space-y-8">
                {/* Scorecards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <Eye size={12} className="text-blue-400" /> 오늘 페이지 뷰 (PV)
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {posts.length > 0 ? "425 회" : "0 회"}
                    </h4>
                  </div>
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <Users size={12} className="text-emerald-400" /> 오늘 고유 방문자 (UV)
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {posts.length > 0 ? "134 명" : "0 명"}
                    </h4>
                  </div>
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <FileText size={12} className="text-purple-400" /> 누적 발행 포스트
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {posts.length} 개
                    </h4>
                  </div>
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <TrendingUp size={12} className="text-amber-400" /> 평균 체류 시간
                    </span>
                    <h4 className="text-2xl font-black italic tracking-tight text-white">
                      {posts.length > 0 ? "2분 45초" : "-"}
                    </h4>
                  </div>
                </div>

                {/* Popular posts & chart mockups */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Traffic flow chart mockup */}
                  <div className="lg:col-span-2 rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-6">
                    <h3 className="text-sm font-black uppercase italic tracking-wider text-white">
                      일간 방문 흐름 (최근 7일)
                    </h3>
                    <div className="h-60 flex items-end gap-3 px-4 pt-10 border-b border-zinc-900">
                      {[15, 30, 45, 25, 65, 80, 95].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                          <span className="text-[10px] text-zinc-600 font-bold group-hover:text-blue-400 transition-colors">
                            {val * 5}
                          </span>
                          <div 
                            className="w-full bg-blue-500/20 group-hover:bg-blue-500/40 rounded-t-lg transition-all duration-300"
                            style={{ height: `${val}%` }}
                          />
                          <span className="text-[10px] text-zinc-600 font-bold mt-2">
                            06.{10 + idx}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top articles panel */}
                  <div className="rounded-[32px] border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
                    <h3 className="text-sm font-black uppercase italic tracking-wider text-white flex items-center justify-between">
                      인기 글 순위 <TrendingUp size={14} className="text-blue-400" />
                    </h3>

                    {posts.length === 0 ? (
                      <div className="text-xs font-bold text-zinc-600 py-10 text-center">
                        통계를 집계할 포스트가 없습니다.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {posts.slice(0, 5).map((post, idx) => (
                          <div key={post.id} className="flex items-center gap-3 border-b border-zinc-900/50 pb-2.5 last:border-b-0 last:pb-0">
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-950 font-black text-xs text-blue-400 italic">
                              {idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-zinc-200">{post.title}</p>
                              <p className="text-[10px] font-semibold text-zinc-600 mt-0.5">PV: {350 - idx * 60}</p>
                            </div>
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
                            <div className="flex items-center gap-2">
                              <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-amber-500" />
                              <span className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-amber-400">
                                PENDING
                              </span>
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
                                onClick={disconnectCustomDomain}
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
                        도메인 연결이 승인되면 CreAIbox의 인프라(Vercel 에지 프록시 네트워크)가 사용자 도메인을 위해 **Let's Encrypt**보안 SSL 인증서를 동적으로 실시간 발급합니다.
                      </p>
                      <p className="text-zinc-500">
                        이를 통해 사용자는 별도의 SSL 구매 없이 `https://`로 안전하게 블로그를 운영할 수 있습니다.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-white font-black text-xs">🚀 3. 호스트 분석 및 내부 리다이렉트</p>
                      <p>
                        블로그 시스템은 Next.js Edge Middleware 기술을 기반으로 작동합니다. 방문자가 본인의 독립 도메인으로 접속하면, 주소창 주소는 본인 도메인 그대로 유지한 채 서버 내부적으로 CreAIbox에 매핑된 브랜드 글들을 실시간 로드해 줍니다.
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
      </div>
    </div>
  );
}
