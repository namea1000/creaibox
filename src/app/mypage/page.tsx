"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  User,
  Shield,
  Trash2,
  Globe,
  Save,
  Sparkles,
  CheckCircle,
  Mail,
  LogIn,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Aside from "@/components/layout/Aside";
import StudioTopbar from "@/components/studio/StudioTopbar";
import Header from "@/components/layout/Header";
import { isReservedBrandId } from "@/lib/constants/reservedWords";

type WpSite = {
  siteName: string;
  url: string;
  userId: string;
  appPassword: string;
};

type ProfileState = {
  nickname: string;
  brand_id: string;
  requested_brand_id: string;
  brand_id_status: string;
  brand_id_rejection_reason: string;
  membership_level: string;
  role?: string;
  extra_configs?: {
    wp_sites?: WpSite[];
    brand_ids?: string[];
    [key: string]: any;
  };
};

function getBrandLimit(membershipLevel: string, role: string) {
  const cleanLevel = (membershipLevel || "").toLowerCase();
  const cleanRole = (role || "").toUpperCase();

  if (cleanRole === "ADMIN" || cleanRole === "SUPER_ADMIN" || cleanLevel === "admin") {
    return 10;
  }
  if (cleanLevel === "pro" || cleanLevel === "business" || cleanLevel === "enterprise") {
    return 3;
  }
  if (cleanLevel === "creator") {
    return 2;
  }
  return 1;
}

export default function MyPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [wpSites, setWpSites] = useState<WpSite[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState<ProfileState>({
    nickname: "",
    brand_id: "",
    requested_brand_id: "",
    brand_id_status: "NONE",
    brand_id_rejection_reason: "",
    membership_level: "free",
    role: "FREE",
    extra_configs: {},
  });

  const [checkingBrandId, setCheckingBrandId] = useState("");
  const [isBrandChecking, setIsBrandChecking] = useState(false);
  const [brandAvailable, setBrandAvailable] = useState<boolean | null>(null);
  const [checkingBrandName, setCheckingBrandName] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [customDomainInput, setCustomDomainInput] = useState("");

  const [selectedBrandForDomain, setSelectedBrandForDomain] = useState("");

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const approvedBrands = useMemo(() => {
    return [profile.brand_id, ...(profile.extra_configs?.brand_ids || [])].filter(Boolean);
  }, [profile.brand_id, profile.extra_configs?.brand_ids]);

  const getBrandDomainConfig = useCallback((bId: string) => {
    if (!bId) return { status: "NONE", domain: "", requested: "", reason: "" };
    const configs = profile.extra_configs || {};
    const isPrimary = bId === profile.brand_id;
    
    const status = configs[`custom_domain_status_${bId}`] !== undefined 
      ? configs[`custom_domain_status_${bId}`] 
      : (isPrimary ? (configs.custom_domain_status || "NONE") : "NONE");
       
    const domain = configs[`custom_domain_${bId}`] !== undefined 
      ? configs[`custom_domain_${bId}`] 
      : (isPrimary ? (configs.custom_domain || "") : "");
       
    const requested = configs[`requested_custom_domain_${bId}`] !== undefined 
      ? configs[`requested_custom_domain_${bId}`] 
      : (isPrimary ? (configs.requested_custom_domain || "") : "");
       
    const reason = configs[`custom_domain_rejection_reason_${bId}`] !== undefined 
      ? configs[`custom_domain_rejection_reason_${bId}`] 
      : (isPrimary ? (configs.custom_domain_rejection_reason || "") : "");
       
    return { status, domain, requested, reason };
  }, [profile.brand_id, profile.extra_configs]);

  useEffect(() => {
    if (approvedBrands.length > 0) {
      if (!selectedBrandForDomain || !approvedBrands.includes(selectedBrandForDomain)) {
        setSelectedBrandForDomain(approvedBrands[0]);
      }
    } else {
      setSelectedBrandForDomain("");
    }
  }, [approvedBrands, selectedBrandForDomain]);

  useEffect(() => {
    if (!selectedBrandForDomain) {
      setCustomDomainInput("");
      return;
    }
    const { domain, requested } = getBrandDomainConfig(selectedBrandForDomain);
    setCustomDomainInput(requested || domain || "");
  }, [selectedBrandForDomain, profile.extra_configs, getBrandDomainConfig]);

  const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,12}$/;

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      try {
        setIsDataLoading(true);

        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        setUser(currentUser);

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (error) {
          console.error("프로필 로드 실패:", error);
        }

        if (data) {
          setProfile({
            nickname: data.nickname || "",
            brand_id: data.brand_id || "",
            requested_brand_id: data.requested_brand_id || "",
            brand_id_status: data.brand_id_status || "NONE",
            brand_id_rejection_reason: data.brand_id_rejection_reason || "",
            membership_level: data.membership_level || "free",
            role: data.role || "FREE",
            extra_configs: data.extra_configs || {},
          });
          setBrandInput("");

          setWpSites(data.extra_configs?.wp_sites || []);
        }
      } finally {
        if (mounted) setIsDataLoading(false);
      }
    };

    void fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [supabase, router]);

  const checkDuplicate = async (field: "nickname", value: string) => {
    const trimmedValue = value ? value.trim() : "";

    if (!nicknameRegex.test(trimmedValue)) {
      alert("❌ 닉네임은 띄어쓰기, 특수문자 없이 한글, 영문, 숫자 조합으로 2~12자만 가능합니다.");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(field)
      .eq(field, trimmedValue)
      .not("id", "eq", user?.id)
      .maybeSingle();

    if (error) {
      alert("체크 중 오류가 발생했습니다.");
      return;
    }

    alert(data ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다!");
  };

  const checkBrandIdAvailability = async (value: string) => {
    const brand = value ? value.trim().toLowerCase() : "";

    if (!/^[a-z0-9]{2,15}$/.test(brand)) {
      alert("❌ Brand ID는 영문 소문자와 숫자 조합으로 2~15자만 가능합니다.");
      return;
    }

    // 1차 필터링: 클라이언트 단 정적 예약어 검증
    if (isReservedBrandId(brand)) {
      setBrandAvailable(false);
      alert("❌ 시스템 예약어 또는 사용이 금지된 브랜드 ID입니다. (SYSTEM)");
      return;
    }

    setIsBrandChecking(true);
    setBrandAvailable(null);
    setCheckingBrandName("");

    try {
      const { data: primaryMatch } = await supabase
        .from("profiles")
        .select("id")
        .eq("brand_id", brand)
        .maybeSingle();

      if (primaryMatch && primaryMatch.id !== user?.id) {
        setBrandAvailable(false);
        alert("❌ 이미 등록된 브랜드 ID입니다.");
        return;
      }

      const { data: requestedMatch } = await supabase
        .from("profiles")
        .select("id")
        .eq("requested_brand_id", brand)
        .in("brand_id_status", ["PENDING", "APPROVED"])
        .maybeSingle();

      if (requestedMatch && requestedMatch.id !== user?.id) {
        setBrandAvailable(false);
        alert("❌ 다른 사용자가 신청 중이거나 승인된 브랜드 ID입니다.");
        return;
      }

      const { data: extraMatch } = await supabase
        .from("profiles")
        .select("id")
        .contains("extra_configs", { brand_ids: [brand] })
        .maybeSingle();

      if (extraMatch && extraMatch.id !== user?.id) {
        setBrandAvailable(false);
        alert("❌ 이미 등록된 브랜드 ID입니다.");
        return;
      }

      // 2차 필터링: reserved_brand_ids DB 조회 (category 추가 조회)
      const { data: reservedData, error: reservedError } = await supabase
        .from("reserved_brand_ids")
        .select("id, category")
        .eq("brand_id", brand)
        .maybeSingle();

      if (reservedError) throw reservedError;

      if (reservedData) {
        setBrandAvailable(false);
        
        let errorMsg = "❌ 시스템 예약어 또는 사용이 금지된 브랜드 ID입니다.";
        switch (reservedData.category) {
          case "SYSTEM":
            errorMsg = "❌ 시스템 예약 경로로 사용 중인 브랜드 ID입니다.";
            break;
          case "GOVERNMENT":
            errorMsg = "❌ 정부 기관, 공공기관 및 지자체 사칭 방지를 위해 사용할 수 없습니다.";
            break;
          case "MEDIA":
            errorMsg = "❌ 뉴스 및 언론 매체 사칭 예방을 위해 사용할 수 없는 브랜드 ID입니다.";
            break;
          case "FINANCE":
            errorMsg = "❌ 금융기관 사칭 및 피싱 사기 예방을 위해 사용할 수 없는 브랜드 ID입니다.";
            break;
          case "COMPANY":
            errorMsg = "❌ 해당 기업체 상표권 보호를 위해 사용할 수 없는 브랜드 ID입니다.";
            break;
          case "IT_SERVICE":
            errorMsg = "❌ 주요 글로벌 IT 서비스 및 플랫폼 명칭 보호를 위해 사용할 수 없습니다.";
            break;
          case "INFLUENCER":
            errorMsg = "❌ 유명 크리에이터/인플루언서 사칭 방지를 위해 사용할 수 없습니다.";
            break;
          case "EDUCATION":
            errorMsg = "❌ 대학 및 교육기관 사칭 예방을 위해 사용할 수 없는 브랜드 ID입니다.";
            break;
          case "GEOGRAPHY":
            errorMsg = "❌ 주요 지자체 및 도시/지역명 선점 방지를 위해 사용할 수 없습니다.";
            break;
          case "COMMON_SERVICE":
            errorMsg = "❌ 공용 서비스 및 상업적 일반 명사 선점 방지를 위해 사용할 수 없습니다.";
            break;
          case "ADULT_GAMBLING":
            errorMsg = "❌ 불법 및 사행성/유해 서비스 개설 방지를 위해 사용할 수 없습니다.";
            break;
          case "ABUSE":
            errorMsg = "❌ 유해 단어 또는 비속어가 포함되어 사용할 수 없습니다.";
            break;
          case "TRADEMARK":
            errorMsg = "❌ 상표권 또는 제품명 보호를 위해 사용할 수 없는 브랜드 ID입니다.";
            break;
          case "PAYMENT_SECURITY":
            errorMsg = "❌ 결제, 보안 및 금융인증 피싱 방지를 위해 사용할 수 없습니다.";
            break;
          case "CRYPTO":
            errorMsg = "❌ 가상자산 및 암호화폐 거래소 사칭 예방을 위해 사용할 수 없습니다.";
            break;
          case "HEALTHCARE":
            errorMsg = "❌ 의료기관 및 의약품 브랜드 사칭 방지를 위해 사용할 수 없습니다.";
            break;
          case "RELIGION_POLITICS":
            errorMsg = "❌ 정치, 종교적 목적 및 공인 사칭 방지를 위해 사용할 수 없습니다.";
            break;
          case "MILITARY_SECURITY":
            errorMsg = "❌ 군사, 안보 및 정보기관 사칭 예방을 위해 사용할 수 없습니다.";
            break;
          case "INFRASTRUCTURE":
            errorMsg = "❌ DNS, API 등 인프라 시스템 예약어로 사용할 수 없습니다.";
            break;
          case "DOMAIN_BRAND":
            errorMsg = "❌ 도메인 및 호스팅 서비스 사칭 방지를 위해 사용할 수 없습니다.";
            break;
          case "PUBLIC_SERVICE":
            errorMsg = "❌ 공공서비스 및 행정 민원 사칭 예방을 위해 사용할 수 없습니다.";
            break;
          case "HIGH_RISK_COMMERCE":
            errorMsg = "❌ 상품권, 투자 유도 등 고위험 거래 사기 방지를 위해 사용할 수 없습니다.";
            break;
        }
        
        alert(errorMsg);
        return;
      }

      setBrandAvailable(true);
      setCheckingBrandName(brand);
      alert("✅ 사용 가능한 브랜드 ID입니다!");
    } catch (err: any) {
      console.error(err);
      alert("체크 중 오류가 발생했습니다.");
    } finally {
      setIsBrandChecking(false);
    }
  };

  const requestBrandId = async () => {
    if (!user) return;
    const brand = checkingBrandName.trim().toLowerCase();
    if (!brand || !brandAvailable) {
      alert("먼저 사용 가능한 브랜드 ID를 조회해 주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const approvedBrands = [profile.brand_id, ...(profile.extra_configs?.brand_ids || [])].filter(Boolean);
      const limit = getBrandLimit(profile.membership_level, profile.role || "");

      if (approvedBrands.length >= limit) {
        alert(`❌ 브랜드 ID 최대 보유 한도(${limit}개)를 초과할 수 없습니다.`);
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          requested_brand_id: brand,
          brand_id_status: "PENDING",
          brand_id_rejection_reason: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        requested_brand_id: brand,
        brand_id_status: "PENDING",
        brand_id_rejection_reason: "",
      }));

      alert("🎉 브랜드 ID 신청이 정상적으로 접수되었습니다. 관리자 승인을 기다려주세요!");

      setBrandAvailable(null);
      setBrandInput("");
    } catch (err: any) {
      console.error(err);
      alert(`신청 실패: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelBrand = (brandIdToCancel: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setConfirmModal({
      title: "브랜드 ID 신청 취소",
      message: "정말로 브랜드 ID 신청을 취소하시겠습니까? 취소하시면 등록된 모든 연동 정보가 자동 정리되며 새로 신청해야 합니다.",
      onConfirm: () => executeCancelBrand(brandIdToCancel),
    });
  };

  const executeCancelBrand = async (brandIdToCancel: string) => {
    setConfirmModal(null);
    if (!user || !profile) return;

    setIsSaving(true);
    try {
      const { data: latestProfile, error: fetchErr } = await supabase
        .from("profiles")
        .select("brand_id, brand_id_status, requested_brand_id, extra_configs")
        .eq("id", user.id)
        .single();

      if (fetchErr) throw fetchErr;

      let primaryBrandId = latestProfile.brand_id || null;
      let brandIdStatus = latestProfile.brand_id_status || "NONE";
      let requestedBrandId = latestProfile.requested_brand_id || null;
      let brandIds: string[] = latestProfile.extra_configs?.brand_ids || [];
      let nextExtraConfigs = { ...(latestProfile.extra_configs || {}) };

      // Handle canceling pending request
      if (requestedBrandId === brandIdToCancel) {
        requestedBrandId = null;
        brandIdStatus = primaryBrandId ? "APPROVED" : "NONE";
      }

      // Handle canceling/deleting approved brand
      if (primaryBrandId === brandIdToCancel) {
        if (brandIds.length > 0) {
          primaryBrandId = brandIds[0];
          brandIds = brandIds.slice(1);
          brandIdStatus = "APPROVED";
          
          // Copy configs of the new primary brand to the base configs
          const keysToCopy = [
            "blog_title", "blog_description", "blog_template", "blog_accent_color",
            "ga_id", "naver_advisor_key", "seo_template_title", "seo_template_desc",
            "custom_domain", "custom_domain_status", "requested_custom_domain", "custom_domain_rejection_reason"
          ];
          keysToCopy.forEach(key => {
            const suffixKey = `${key}_${primaryBrandId}`;
            if (nextExtraConfigs[suffixKey] !== undefined) {
              nextExtraConfigs[key] = nextExtraConfigs[suffixKey];
            } else {
              delete nextExtraConfigs[key];
            }
          });
        } else {
          primaryBrandId = null;
          brandIdStatus = "NONE";
          
          // Clear base configs
          const keysToClear = [
            "blog_title", "blog_description", "blog_template", "blog_accent_color",
            "ga_id", "naver_advisor_key", "seo_template_title", "seo_template_desc",
            "custom_domain", "custom_domain_status", "requested_custom_domain", "custom_domain_rejection_reason"
          ];
          keysToClear.forEach(key => {
            delete nextExtraConfigs[key];
          });
        }
      } else {
        brandIds = brandIds.filter((bId: string) => bId !== brandIdToCancel);
      }

      nextExtraConfigs.brand_ids = brandIds;

      // Purge all configurations with this brand suffix
      const suffix = `_${brandIdToCancel}`;
      Object.keys(nextExtraConfigs).forEach((key) => {
        if (key.endsWith(suffix)) {
          delete nextExtraConfigs[key];
        }
      });

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          brand_id: primaryBrandId,
          brand_id_status: brandIdStatus,
          requested_brand_id: primaryBrandId === null ? null : requestedBrandId,
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateErr) throw updateErr;

      setProfile((prev: any) => ({
        ...prev,
        brand_id: primaryBrandId || "",
        brand_id_status: brandIdStatus,
        requested_brand_id: primaryBrandId === null ? "" : (requestedBrandId || ""),
        extra_configs: nextExtraConfigs,
      }));

      alert("✅ 브랜드 ID 신청이 성공적으로 취소되었습니다.");
    } catch (err: any) {
      console.error(err);
      alert(`취소 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const requestCustomDomain = async () => {
    if (!user || !selectedBrandForDomain) return;
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
      const isPrimary = selectedBrandForDomain === profile.brand_id;
      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        [`requested_custom_domain_${selectedBrandForDomain}`]: domain,
        [`custom_domain_status_${selectedBrandForDomain}`]: "PENDING",
        [`custom_domain_rejection_reason_${selectedBrandForDomain}`]: null,
      };

      if (isPrimary) {
        nextExtraConfigs.requested_custom_domain = domain;
        nextExtraConfigs.custom_domain_status = "PENDING";
        nextExtraConfigs.custom_domain_rejection_reason = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev: any) => ({
        ...prev,
        extra_configs: nextExtraConfigs,
      }));

      alert(`✅ [${selectedBrandForDomain}] 브랜드에 대한 독립 도메인 연결 신청이 접수되었습니다. 관리자 심사 후 연결됩니다.`);
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
    if (!user || !selectedBrandForDomain) return;

    const { status: currentDomainStatus } = getBrandDomainConfig(selectedBrandForDomain);
    const isPending = currentDomainStatus === "PENDING";
    const confirmMessage = isPending
      ? `[${selectedBrandForDomain}] 브랜드에 신청된 독립 도메인 연결을 취소하시겠습니까?`
      : `[${selectedBrandForDomain}] 브랜드에 연결된 독립 도메인을 해제하시겠습니까?`;

    setConfirmModal({
      title: isPending ? "독립 도메인 신청 취소" : "독립 도메인 연결 해제",
      message: confirmMessage,
      onConfirm: () => executeDisconnectCustomDomain(),
    });
  };

  const executeDisconnectCustomDomain = async () => {
    setConfirmModal(null);
    if (!user || !selectedBrandForDomain) return;

    setIsSaving(true);
    try {
      const isPrimary = selectedBrandForDomain === profile.brand_id;
      const nextExtraConfigs = {
        ...(profile.extra_configs || {}),
        [`custom_domain_${selectedBrandForDomain}`]: null,
        [`requested_custom_domain_${selectedBrandForDomain}`]: null,
        [`custom_domain_status_${selectedBrandForDomain}`]: "NONE",
        [`custom_domain_rejection_reason_${selectedBrandForDomain}`]: null,
      };

      if (isPrimary) {
        nextExtraConfigs.custom_domain = null;
        nextExtraConfigs.requested_custom_domain = null;
        nextExtraConfigs.custom_domain_status = "NONE";
        nextExtraConfigs.custom_domain_rejection_reason = null;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          extra_configs: nextExtraConfigs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev: any) => ({
        ...prev,
        extra_configs: nextExtraConfigs,
      }));
      setCustomDomainInput("");

      alert("✅ 독립 도메인 연결이 해제되었습니다.");
    } catch (err: any) {
      alert(`해제 실패: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addWpSite = () => {
    setWpSites((prev) => [...prev, { siteName: "", url: "", userId: "", appPassword: "" }]);
  };

  const removeWpSite = (index: number) => {
    setWpSites((prev) => prev.filter((_, i) => i !== index));
  };

  const updateWpSite = (index: number, field: keyof WpSite, value: string) => {
    setWpSites((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSave = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      router.replace("/login");
      return;
    }

    const trimmedNickname = profile.nickname ? profile.nickname.trim() : "";

    if (!nicknameRegex.test(trimmedNickname)) {
      alert("❌ 닉네임 형식이 올바르지 않습니다.\n띄어쓰기, 특수문자 없는 한글/영문/숫자 2~12자");
      return;
    }

    setIsSaving(true);

    try {
      const nextProfile = {
        id: user.id,
        nickname: trimmedNickname,
        brand_id: profile.brand_id || "",
        membership_level: profile.membership_level || "free",
        extra_configs: {
          ...(profile.extra_configs || {}),
          wp_sites: wpSites,
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(nextProfile, { onConflict: "id" });

      if (error) {
        console.error("Supabase Profile Sync Error:", error);
        alert(`저장 실패: ${error.message}`);
        return;
      }

      setProfile((prev) => ({
        ...prev,
        nickname: trimmedNickname,
        extra_configs: nextProfile.extra_configs,
      }));

      alert("🎉 프로필 설정이 성공적으로 동기화되었습니다!");

      router.refresh();

      setTimeout(() => {
        window.location.reload();
      }, 150);
    } catch (err: any) {
      console.error("Unexpected Save Error:", err);
      alert(`시스템 통신 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05070a] text-white">
        <RefreshCw className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  const limit = getBrandLimit(profile.membership_level, profile.role || "");
  const isProOrAbove =
    profile.membership_level === "pro" ||
    profile.membership_level === "admin" ||
    profile.role === "ADMIN" ||
    profile.role === "SUPER_ADMIN";

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#05070a] font-sans text-zinc-100">
      <Header />
      <div className="flex flex-1 min-h-0 pt-16">
        <Sidebar
          activeMenu="MyPage"
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

      <div className="flex min-w-0 flex-1 flex-col">
        <StudioTopbar setIsMobileOpen={setIsMobileOpen} />

        <div className="flex min-h-0 min-w-0 flex-1">
          <main className="custom-scrollbar min-w-0 flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300">
          <div className="mx-auto max-w-[1400px] p-6 pt-4 pb-48 lg:p-12 lg:pt-10">
            <header className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-zinc-800 pb-10 text-left md:flex-row md:items-end">
              <div className="space-y-2">
                <h1 className="text-5xl font-black uppercase italic leading-none tracking-tighter text-white">
                  My <span className="text-blue-500">Profile</span> Settings
                </h1>
                <p className="mt-3 pl-1 text-[10px] font-black uppercase italic tracking-[0.3em] text-zinc-500">
                  Strategic Personal Environment & Identity Management
                </p>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="group flex items-center gap-3 rounded-2xl border border-blue-400/30 bg-blue-600 px-10 py-5 text-sm font-black uppercase italic tracking-widest text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw size={18} className="animate-spin text-white" />
                ) : (
                  <Save size={18} className="transition-transform group-hover:scale-110" />
                )}
                Sync & Save All Settings
              </button>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <section className="space-y-8 rounded-[40px] border border-zinc-800 bg-zinc-900/40 p-10 text-left shadow-2xl transition-all hover:border-zinc-700">
                <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
                  <User className="text-blue-500" size={24} />
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Identity</h2>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 pl-1 text-[11px] font-black uppercase tracking-widest text-blue-500">
                      <Sparkles size={14} /> 활동 닉네임 브랜딩
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={profile.nickname || ""}
                        onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                        className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-5 text-sm font-bold text-white shadow-inner outline-none transition-all placeholder:text-zinc-800 focus:border-blue-500"
                        placeholder="나만의 닉네임을 입력하세요"
                      />

                      <button
                        onClick={() => checkDuplicate("nickname", profile.nickname)}
                        className="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 text-[11px] font-black uppercase italic tracking-tighter text-zinc-300 transition-all hover:bg-zinc-700"
                      >
                        Check
                      </button>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-blue-500/10 bg-blue-600/5 p-5">
                      <p className="flex items-center gap-2 text-xs font-black leading-relaxed text-blue-400">
                        <CheckCircle size={14} /> 닉네임 설정 가이드
                      </p>
                      <p className="text-[11px] font-bold leading-relaxed text-zinc-500">
                        현재 할당된 닉네임은 계정 생성을 위한 임시 아이디일 수 있습니다.
                        커뮤니티 활동을 위해 나만의 고유한 닉네임으로 변경해 주세요.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                    <label className="pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe size={12} className="text-blue-400" /> 브랜드 ID 보유 현황 ({approvedBrands.length} / {limit}개)
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        Free: 1개 | Creator: 2개 | Pro: 3개 | Admin: 10개
                      </span>
                    </label>

                    {/* Approved Brands List */}
                    {approvedBrands.length > 0 && (
                      <div className="space-y-2">
                        {approvedBrands.map((bId) => (
                          <div key={bId} className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4">
                            <div className="flex flex-col text-left">
                              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">승인 완료 (LIVE)</span>
                              <a 
                                href={`http://${bId}.localhost:3000`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-black text-white hover:text-blue-400 transition-colors flex items-center gap-1 mt-0.5 italic tracking-tight"
                              >
                                {bId}.creaibox.com
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const { status, domain } = getBrandDomainConfig(bId);
                                if (status === "APPROVED" && domain) {
                                  return (
                                    <a
                                      href={`https://${domain}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 mr-2 transition-colors italic tracking-tight"
                                    >
                                      ({domain})
                                    </a>
                                  );
                                }
                                return null;
                              })()}
                              <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-emerald-400">
                                LIVE
                              </span>
                              <button
                                onClick={() => handleCancelBrand(bId)}
                                disabled={isSaving}
                                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                              >
                                신청 취소
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pending Request */}
                    {profile.brand_id_status === "PENDING" && profile.requested_brand_id && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-4">
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">심사 대기 중</span>
                            <span className="text-sm font-black text-zinc-400 mt-0.5 italic tracking-tight">
                              {profile.requested_brand_id}.creaibox.com
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-amber-500" />
                            <span className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-amber-400">
                              PENDING
                            </span>
                            <button
                              type="button"
                              onClick={(e) => handleCancelBrand(profile.requested_brand_id, e)}
                              disabled={isSaving}
                              className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors font-bold"
                            >
                              신청 취소
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rejected Request */}
                    {profile.brand_id_status === "REJECTED" && profile.requested_brand_id && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4">
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">반려됨</span>
                            <span className="text-sm font-black text-zinc-500 line-through mt-0.5 italic tracking-tight">
                              {profile.requested_brand_id}.creaibox.com
                            </span>
                          </div>
                          <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-red-400">
                            REJECTED
                          </span>
                        </div>
                        {profile.brand_id_rejection_reason && (
                          <div className="rounded-xl border border-red-500/10 bg-red-600/5 p-4 text-[11px] font-bold text-red-400 leading-relaxed text-left">
                            💡 반려 사유: {profile.brand_id_rejection_reason}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Apply Form - Render only if count is below limit */}
                    {approvedBrands.length + (profile.brand_id_status === "PENDING" ? 1 : 0) < limit ? (
                      <div className="space-y-4 pt-2">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={brandInput}
                              onChange={(e) => {
                                setBrandInput(e.target.value);
                                setBrandAvailable(null);
                              }}
                              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 pl-6 pr-28 py-5 text-sm font-bold text-white shadow-inner outline-none transition-all placeholder:text-zinc-800 focus:border-blue-500"
                              placeholder="추가할 브랜드 ID 입력"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-600">
                              .creaibox.com
                            </span>
                          </div>

                          <button
                            onClick={() => checkBrandIdAvailability(brandInput)}
                            disabled={isBrandChecking}
                            className="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 text-[11px] font-black uppercase italic tracking-tighter text-zinc-300 transition-all hover:bg-zinc-700 disabled:opacity-50"
                          >
                            {isBrandChecking ? "Checking..." : "Check"}
                          </button>
                        </div>

                        {brandAvailable === true && checkingBrandName === brandInput.trim().toLowerCase() && (
                          <div className="flex items-center justify-between rounded-2xl border border-blue-500/20 bg-blue-600/5 p-5">
                            <div className="space-y-1 text-left">
                              <p className="text-xs font-black text-blue-400 flex items-center gap-1.5">
                                <CheckCircle size={14} /> 사용 가능한 브랜드 ID입니다!
                              </p>
                              <p className="text-[11px] font-bold text-zinc-500 leading-relaxed">
                                {checkingBrandName}.creaibox.com 도메인을 추가하시겠습니까?
                              </p>
                            </div>
                            <button
                              onClick={requestBrandId}
                              disabled={isSaving}
                              className="rounded-xl bg-blue-500 hover:bg-blue-600 px-5 py-2.5 text-[11px] font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
                            >
                              추가하기
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 text-center">
                        <AlertTriangle className="mx-auto text-amber-500 mb-2" size={24} />
                        <p className="text-xs font-black text-zinc-400">브랜드 ID 한도 도달</p>
                        <p className="text-[11px] font-medium text-zinc-600 mt-1.5 leading-relaxed">
                          현재 요금제 등급에서 등록 가능한 최대 브랜드 ID 개수({limit}개)에 도달했습니다.<br />
                          더 많은 브랜드 ID를 등록하려면 요금제를 업그레이드해 주세요.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2.5 rounded-2xl border border-blue-500/10 bg-blue-600/5 p-5">
                      <p className="flex items-center gap-2 text-xs font-black leading-relaxed text-blue-400">
                        <CheckCircle size={14} /> 브랜드 ID 신청 안내
                      </p>
                      <ul className="text-[11px] font-bold leading-relaxed text-zinc-500 list-disc pl-4 space-y-1 text-left">
                        <li>브랜드 ID는 영문 소문자와 숫자 조합으로 2~15자만 가능합니다.</li>
                        <li>신청 후 관리자 승인을 통해 나만의 개인 브랜드 블로그 서브도메인이 최종 할당됩니다.</li>
                        <li>apple, creaibox 등 시스템/유명 브랜드 예약어는 신청이 제한됩니다.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Custom Domain Section */}
                  <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                    <label className="pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe size={12} className="text-blue-400" /> 독립 도메인 연결 (Custom Domain)
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        Pro 요금제 이상 제공
                      </span>
                    </label>

                    {/* Non-Pro User Block */}
                    {!isProOrAbove ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            disabled
                            className="w-full rounded-2xl border border-zinc-900/60 bg-zinc-950/40 px-6 py-5 text-sm font-bold text-zinc-700 outline-none cursor-not-allowed"
                            placeholder="연결할 도메인 입력 (예: aaa.com)"
                          />
                        </div>
                        <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5 text-[11px] font-bold text-amber-500 leading-relaxed text-left flex items-start gap-2">
                          <AlertTriangle className="shrink-0 mt-0.5 text-amber-500" size={14} />
                          <div>
                            <p className="font-black">독립 도메인 연결 제한</p>
                            <p className="text-zinc-500 mt-1">
                              독립 도메인 연결 기능은 <strong>Pro 멤버십 이상</strong> 회원에게만 제공되는 프리미엄 기능입니다.<br />
                              나만의 개인 독립 도메인(예: aaa.com)으로 블로그를 브랜딩하려면 멤버십을 업그레이드해 주세요.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {(() => {
                          if (approvedBrands.length === 0) {
                            return (
                              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 text-[11px] font-bold text-zinc-500 leading-relaxed text-left">
                                ❌ 독립 도메인을 연결할 승인 완료된 브랜드 ID가 없습니다. 먼저 브랜드 ID를 신청하고 승인받으셔야 합니다.
                              </div>
                            );
                          }

                          const { 
                            status: currentDomainStatus, 
                            domain: currentDomain, 
                            requested: currentRequestedDomain, 
                            reason: currentRejectionReason 
                          } = getBrandDomainConfig(selectedBrandForDomain);

                          return (
                            <div className="space-y-4">
                              {/* Brand selector dropdown */}
                              <div className="flex flex-col space-y-2 text-left bg-zinc-950/40 p-5 rounded-3xl border border-zinc-900">
                                <label className="pl-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                                  설정할 브랜드 ID 선택
                                </label>
                                <select
                                  value={selectedBrandForDomain}
                                  onChange={(e) => setSelectedBrandForDomain(e.target.value)}
                                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-bold text-white outline-none transition-all focus:border-blue-500"
                                >
                                  {approvedBrands.map((b) => (
                                    <option key={b} value={b}>
                                      {b}.creaibox.com
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Status == NONE */}
                              {(!currentDomainStatus || currentDomainStatus === "NONE") && (
                                <div className="space-y-4">
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
                                      className="rounded-2xl bg-blue-500 hover:bg-blue-600 px-6 text-[11px] font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)] disabled:opacity-50 font-bold"
                                    >
                                      {isSaving ? "신청 중..." : "연결 신청"}
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Status == PENDING */}
                              {currentDomainStatus === "PENDING" && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-4">
                                    <div className="flex flex-col text-left">
                                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                                        [{selectedBrandForDomain}] 독립 도메인 심사 중
                                      </span>
                                      <span className="text-sm font-black text-zinc-400 mt-0.5 italic tracking-tight">
                                        {currentRequestedDomain}
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
                                        className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-300 transition-colors"
                                      >
                                        신청 취소
                                      </button>
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 text-[11px] font-bold text-zinc-500 leading-relaxed text-left space-y-1">
                                    <p className="text-zinc-300 font-black">⏳ 도메인 신청 접수 완료</p>
                                    <p>관리자가 신청된 독립 도메인을 검토하여 1~2일 내로 등록 및 SSL 인증서를 발급합니다.</p>
                                  </div>
                                </div>
                              )}

                              {/* Status == APPROVED */}
                              {currentDomainStatus === "APPROVED" && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4">
                                    <div className="flex flex-col text-left">
                                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                        [{selectedBrandForDomain}] 연결 완료 (LIVE)
                                      </span>
                                      <a
                                        href={`https://${currentDomain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-black text-white hover:text-blue-400 transition-colors flex items-center gap-1 mt-0.5 italic tracking-tight"
                                      >
                                        {currentDomain}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-emerald-400">
                                        LIVE
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => handleOpenDisconnectModal(e)}
                                        className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-zinc-300 transition-colors"
                                      >
                                        연결 해제
                                      </button>
                                    </div>
                                  </div>

                                  {/* DNS Connection Guides */}
                                  <div className="space-y-2.5 rounded-2xl border border-blue-500/10 bg-blue-600/5 p-5 text-left">
                                    <p className="flex items-center gap-2 text-xs font-black leading-relaxed text-blue-400">
                                      <CheckCircle size={14} /> DNS 설정 필수 안내
                                    </p>
                                    <p className="text-[11px] font-bold leading-relaxed text-zinc-500">
                                      독립 도메인 연결을 완료하려면 본인의 DNS 관리자(Cloudflare, GoDaddy 등)에서 아래 레코드를 추가하셔야 합니다.
                                    </p>
                                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1.5 font-mono text-[10px] text-zinc-400">
                                      <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                                        <span>레코드 타입: <strong className="text-white">CNAME</strong></span>
                                        <span>이름(호스트): <strong className="text-white">@ 또는 blog</strong></span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>대상 주소(Value):</span>
                                        <span className="text-white font-bold">{selectedBrandForDomain}.creaibox.com</span>
                                      </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-zinc-600">
                                      * DNS 정보 전파는 최대 24-48시간이 소요될 수 있습니다.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Status == REJECTED */}
                              {currentDomainStatus === "REJECTED" && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4">
                                    <div className="flex flex-col text-left">
                                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                                        [{selectedBrandForDomain}] 연결 반려됨
                                      </span>
                                      <span className="text-sm font-black text-zinc-500 line-through mt-0.5 italic tracking-tight">
                                        {currentRequestedDomain}
                                      </span>
                                    </div>
                                    <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[9px] font-black uppercase italic tracking-widest text-red-400">
                                      REJECTED
                                    </span>
                                  </div>
                                  {currentRejectionReason && (
                                    <div className="rounded-xl border border-red-500/10 bg-red-600/5 p-4 text-[11px] font-bold text-red-400 leading-relaxed text-left">
                                      💡 반려 사유: {currentRejectionReason}
                                    </div>
                                  )}
                                  {/* Re-apply form */}
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
                                      className="rounded-2xl bg-blue-500 hover:bg-blue-600 px-6 text-[11px] font-black uppercase italic tracking-widest text-white transition-all shadow-[0_4px_12px_rgba(59,130,246,0.2)] font-bold"
                                    >
                                      다시 신청
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Domain Purchase Shortcuts */}
                        <div className="pt-4 border-t border-zinc-800/40 text-left">
                          <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-2.5 flex items-center gap-1.5">
                            💡 도메인 등록/구입 바로가기
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <a
                              href="https://www.gabia.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1"
                            >
                              가비아 (Gabia) ↗
                            </a>

                            <a
                              href="https://vercel.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1"
                            >
                              Vercel ↗
                            </a>
                            <a
                              href="https://www.cafe24.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1"
                            >
                              카페24 (Cafe24) ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="h-fit space-y-8 rounded-[40px] border border-zinc-800 bg-zinc-900/40 p-10 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
                  <Shield className="text-emerald-500" size={24} />
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Security</h2>
                </div>

                <div className="space-y-7">
                  <div className="flex items-center justify-between border-b border-zinc-800/30 py-2">
                    <span className="flex items-center gap-2 pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      <Mail size={14} className="text-zinc-700" /> Account ID
                    </span>
                    <span className="font-mono text-sm font-black italic tracking-tighter text-zinc-300">
                      {user?.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800/30 py-2">
                    <span className="flex items-center gap-2 pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      <LogIn size={14} className="text-zinc-700" /> Auth Provider
                    </span>
                    <span className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-2 text-[10px] font-black uppercase italic tracking-widest text-emerald-500">
                      {user?.app_metadata?.provider || "email"} AUTHENTICATED
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800/30 py-2">
                    <span className="pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      Creation Date
                    </span>
                    <span className="text-sm font-black italic text-zinc-400">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="pl-1 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                      Plan Level
                    </span>
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-6 py-2 text-sm font-black uppercase italic tracking-widest text-blue-500">
                      {profile.membership_level || "free"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="space-y-10 rounded-[40px] border border-zinc-800 bg-zinc-900/40 p-10 shadow-2xl lg:col-span-2">
                <div className="flex items-center justify-between border-b border-zinc-800/50 pb-8">
                  <div className="flex items-center gap-4 text-left">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-inner">
                      <Globe className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                        WP Distribution Center
                      </h2>
                      <p className="mt-1 text-[10px] font-bold uppercase italic tracking-widest text-zinc-600">
                        Multi-Site Connectivity Hub
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={addWpSite}
                    className="rounded-xl border border-blue-500/20 bg-blue-600/10 px-8 py-3 text-[11px] font-black uppercase italic tracking-widest text-blue-500 shadow-lg shadow-blue-900/10 transition-all hover:bg-blue-600 hover:text-white"
                  >
                    + Register Site
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-2 px-2 text-xs font-black uppercase italic tracking-widest text-emerald-500">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Active Multi-Sites
                    </h3>

                    {wpSites.length === 0 && (
                      <p className="rounded-[32px] border border-dashed border-zinc-800 px-6 py-10 text-center text-xs italic text-zinc-700">
                        No active channels found.
                      </p>
                    )}

                    <div className="space-y-4">
                      {wpSites.map((site, index) => (
                        <div
                          key={index}
                          className="group relative space-y-6 rounded-[32px] border border-zinc-800 bg-black/40 p-10 shadow-inner transition-all hover:border-blue-900/50"
                        >
                          <button
                            onClick={() => removeWpSite(index)}
                            className="absolute top-8 right-8 rounded-xl p-2 text-zinc-800 transition-colors hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 size={20} />
                          </button>

                          <div className="space-y-4 pt-4 text-left">
                            <input
                              type="text"
                              placeholder="Site Name"
                              value={site.siteName}
                              onChange={(e) => updateWpSite(index, "siteName", e.target.value)}
                              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-zinc-400 shadow-sm outline-none focus:border-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="URL (https://...)"
                              value={site.url}
                              onChange={(e) => updateWpSite(index, "url", e.target.value)}
                              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-zinc-400 shadow-sm outline-none focus:border-blue-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="User ID"
                                value={site.userId}
                                onChange={(e) => updateWpSite(index, "userId", e.target.value)}
                                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-zinc-400 shadow-sm outline-none focus:border-blue-500"
                              />
                              <input
                                type="password"
                                placeholder="Pass"
                                value={site.appPassword}
                                onChange={(e) => updateWpSite(index, "appPassword", e.target.value)}
                                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-bold text-zinc-400 shadow-sm outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="group relative h-fit space-y-8 overflow-hidden rounded-[40px] border border-dashed border-zinc-800 bg-zinc-900/20 p-12 text-left opacity-60">
                    <Globe className="absolute top-8 right-8 opacity-5 transition-opacity group-hover:opacity-10" size={120} />
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase italic tracking-widest text-zinc-500">
                      <Sparkles size={14} /> Personal Blog Status
                    </h3>
                    <div className="relative z-10 flex items-center gap-3 rounded-3xl border border-zinc-800/50 bg-black/60 p-6 font-black uppercase italic tracking-tighter text-zinc-600 shadow-inner">
                      <CheckCircle size={20} className="text-zinc-800" />
                      <span>Ready to Launch</span>
                      <span className="ml-auto font-mono text-[10px] opacity-20">.creaibox.com</span>
                    </div>
                    <p className="relative z-10 pl-1 text-[11px] font-bold uppercase italic leading-relaxed tracking-widest text-zinc-600">
                      전용 서브도메인이 할당될 준비가 되었습니다. 고유 브랜드 ID 정책 수립 후 공식 오픈 예정입니다.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

        </main>

          <div className="hidden shrink-0 border-l border-zinc-800/50 bg-[#05070a] xl:flex">
            <Aside />
          </div>
        </div>
      </div>
      {/* 🌟 Custom Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-[32px] border border-zinc-800 bg-[#0b0e14] p-8 shadow-2xl text-left space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-1.5">
                <CheckCircle size={12} className="text-blue-400" /> 확인
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
    </div>
    </div>
  );
}
