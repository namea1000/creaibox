"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  ShieldAlert,
  Search,
  Plus,
  Trash2,
  Share2,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building2,
  Globe,
  Settings,
  Database,
  Users,
  Sparkles,
  Bot
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { getMatchedEnglishBrandTerms } from "@/lib/constants/knownEntityMap";
import { useRouter } from "next/navigation";

// 22개 카테고리 정의 및 한글명 매핑
const CATEGORIES = [
  { value: "SYSTEM", label: "시스템 예약어", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  { value: "GOVERNMENT", label: "공공기관/지자체", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { value: "MEDIA", label: "언론/방송사", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  { value: "FINANCE", label: "금융기관/결제", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { value: "COMPANY", label: "기업/브랜드", color: "bg-lime-500/10 text-lime-400 border-lime-500/20" },
  { value: "IT_SERVICE", label: "IT 서비스/플랫폼", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  { value: "INFLUENCER", label: "인플루언서/셀럽", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  { value: "EDUCATION", label: "대학/교육기관", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { value: "GEOGRAPHY", label: "지역/도시명", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  { value: "COMMON_SERVICE", label: "공용 명사/서비스", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  { value: "ADULT_GAMBLING", label: "성인/도박", color: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20" },
  { value: "ABUSE", label: "비속어/유해어", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  { value: "TRADEMARK", label: "제품/상표명 보호", color: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  { value: "PAYMENT_SECURITY", label: "결제/보안 피싱방지", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { value: "CRYPTO", label: "가상자산/거래소", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { value: "HEALTHCARE", label: "의료/헬스케어", color: "bg-emerald-600/10 text-emerald-300 border-emerald-600/20" },
  { value: "RELIGION_POLITICS", label: "종교/정치 사칭방지", color: "bg-amber-600/10 text-amber-300 border-amber-600/20" },
  { value: "MILITARY_SECURITY", label: "군사/안보기관", color: "bg-stone-500/10 text-stone-400 border-stone-500/20" },
  { value: "INFRASTRUCTURE", label: "시스템 인프라", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  { value: "DOMAIN_BRAND", label: "도메인/인증서사", color: "bg-indigo-600/10 text-indigo-300 border-indigo-600/20" },
  { value: "PUBLIC_SERVICE", label: "공공행정 서비스", color: "bg-blue-600/10 text-blue-300 border-blue-600/20" },
  { value: "HIGH_RISK_COMMERCE", label: "고위험 상거래방지", color: "bg-rose-600/10 text-rose-300 border-rose-600/20" }
];

// DB에서 삭제되어 코드 상수로 관리되는 정적 카테고리
const STATIC_CATEGORIES = new Set(["SYSTEM", "ABUSE", "ADULT_GAMBLING", "RELIGION_POLITICS", "MILITARY_SECURITY", "GEOGRAPHY"]);

type ReservedWord = {
  id: string;
  brand_id: string;
  category: string;
  reason: string;
  created_at: string;
};

type UserProfile = {
  id: string;
  email: string;
  nickname: string;
  brand_id: string | null;
};

export default function ReservedWordsAdminPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  // 1. 인증 및 상태 관리
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [words, setWords] = useState<ReservedWord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // 검색/필터 필드
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc"); // 기본값: 최신 등록순
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days">("all");
  const [page, setPage] = useState(0);
  const LIMIT = 20;

  // 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<ReservedWord | null>(null);

  // 추가 폼 필드
  const [newBrandId, setNewBrandId] = useState("");
  const [newCategory, setNewCategory] = useState("SYSTEM");
  const [newReason, setNewReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 배포(할당) 폼 필드
  const [userSearch, setUserSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  // AI 스캔 모달 상태
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanCategory, setScanCategory] = useState("IT_SERVICE");
  const [isScanning, setIsScanning] = useState(false);
  const [isScanningAll, setIsScanningAll] = useState(false);
  const [scanResults, setScanResults] = useState<Array<{ brand_id: string; reason: string; category: string }>>([]);
  const [selectedScanItems, setSelectedScanItems] = useState<Set<string>>(new Set());
  const [scanStats, setScanStats] = useState<{ total: number; already_blocked: number; static_filtered: number } | null>(null);
  const [isBatchSaving, setIsBatchSaving] = useState(false);

  // 2. 권한 검사
  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !data || data.role !== "ADMIN") {
          alert("❌ 관리자 권한이 필요합니다.");
          router.replace("/studio");
          return;
        }

        if (mounted) {
          setIsAdmin(true);
          setIsAuthChecking(false);
        }
      } catch (err) {
        console.error(err);
        router.replace("/studio");
      }
    };

    void checkAdmin();
    return () => {
      mounted = false;
    };
  }, [supabase, router]);

  // 3. 예약어 목록 데이터 로드
  const fetchReservedWords = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const isStatic = selectedCategory !== "ALL" && STATIC_CATEGORIES.has(selectedCategory);

      if (isStatic) {
        // ✅ 정적 카테고리: DB 아닌 서버 코드 상수에서 조회
        const params = new URLSearchParams({
          category: selectedCategory,
          page: String(page),
          limit: String(LIMIT),
        });
        if (searchQuery.trim()) params.set("q", searchQuery.trim());

        const res = await fetch(`/api/admin/brands/static?${params.toString()}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "정적 데이터 로드 실패");

        setWords(json.items ?? []);
        setTotalCount(json.total ?? 0);
      } else {
        // 동적 카테고리: DB 조회 (created_at 정렬 & 날짜 필터)
        const startRange = page * LIMIT;
        const endRange = startRange + LIMIT - 1;

        let query = supabase
          .from("reserved_brand_ids")
          .select("*", { count: "exact" });

        if (searchQuery.trim()) {
          const q = searchQuery.trim();
          const engTerms = getMatchedEnglishBrandTerms(q);
          if (engTerms.length > 0) {
            const termConditions = engTerms.map(term => `brand_id.ilike.%${term}%`).join(",");
            query = query.or(`brand_id.ilike.%${q}%,reason.ilike.%${q}%,${termConditions}`);
          } else {
            query = query.or(`brand_id.ilike.%${q}%,reason.ilike.%${q}%`);
          }
        }

        if (selectedCategory !== "ALL") {
          query = query.eq("category", selectedCategory);
        }

        // 📅 날짜 필터 (오늘/7일/30일)
        if (dateFilter === "today") {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          query = query.gte("created_at", todayStart.toISOString());
        } else if (dateFilter === "7days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          query = query.gte("created_at", sevenDaysAgo.toISOString());
        } else if (dateFilter === "30days") {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          query = query.gte("created_at", thirtyDaysAgo.toISOString());
        }

        const { data, error, count } = await query
          .order("created_at", { ascending: sortOrder === "asc" })
          .range(startRange, endRange);

        if (error) throw error;

        if (data) {
          setWords(data ?? []);
          setTotalCount(count ?? 0);
        }
      }
    } catch (err: any) {
      console.error("fetchReservedWords error:", err);
    } finally {
      setIsDataLoading(false);
    }
  }, [supabase, selectedCategory, searchQuery, page, LIMIT, sortOrder, dateFilter]);

  // 검색어나 카테고리가 바뀔 때 page를 0으로 리셋
  useEffect(() => {
    if (!isAdmin) return;
    setPage(0);
  }, [searchQuery, selectedCategory, isAdmin]);

  // page나 isAdmin이 바뀔 때 데이터 로드
  useEffect(() => {
    if (!isAdmin) return;
    void fetchReservedWords();
  }, [page, isAdmin, fetchReservedWords]);

  // 4. 수동 예약어 추가
  const handleAddReservedWord = async (e: React.FormEvent) => {
    e.preventDefault();
    const brand = newBrandId.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const reason = newReason.trim();

    if (!brand) {
      alert("브랜드 ID를 입력해 주세요.");
      return;
    }

    if (!/^[a-z0-9]{2,15}$/.test(brand)) {
      alert("❌ 브랜드 ID는 영문 소문자와 숫자 조합 2~15자여야 합니다.");
      return;
    }

    setIsSaving(true);
    try {
      // 중복 체크
      const { data: duplicate } = await supabase
        .from("reserved_brand_ids")
        .select("id")
        .eq("brand_id", brand)
        .maybeSingle();

      if (duplicate) {
        alert("❌ 이미 등록되어 있는 예약어입니다.");
        setIsSaving(false);
        return;
      }

      const { data, error } = await supabase
        .from("reserved_brand_ids")
        .insert([{ brand_id: brand, category: newCategory, reason }])
        .select()
        .single();

      if (error) throw error;

      alert("🎉 예약어가 성공적으로 등록되었습니다!");
      setIsAddModalOpen(false);
      
      // 입력 폼 초기화
      setNewBrandId("");
      setNewReason("");
      setNewCategory("SYSTEM");

      // 목록 갱신
      void fetchReservedWords();
    } catch (err: any) {
      alert(`등록 실패: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 5. 예약어 수동 삭제
  const handleDeleteReservedWord = async (id: string, brandId: string) => {
    if (!confirm(`정말로 예약어 [${brandId}]를 삭제하시겠습니까?\n삭제하시면 사용자들이 해당 브랜드 ID를 선점 신청할 수 있게 됩니다.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("reserved_brand_ids")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("🗑️ 예약어가 삭제되었습니다.");
      void fetchReservedWords();
    } catch (err: any) {
      alert(`삭제 실패: ${err.message}`);
    }
  };

  // 6. 사용자 검색 (배포 대상)
  const handleSearchUsers = async () => {
    const search = userSearch.trim();
    if (!search) {
      alert("검색할 사용자 이메일 또는 활동명을 입력해 주세요.");
      return;
    }

    setIsSearchingUsers(true);
    setFoundUsers([]);
    setSelectedUser(null);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, nickname, brand_id")
        .or(`email.ilike.%${search}%,nickname.ilike.%${search}%`)
        .limit(10);

      if (error) throw error;

      if (data) {
        setFoundUsers(data);
        if (data.length === 0) {
          alert("검색 결과와 일치하는 사용자가 없습니다.");
        }
      }
    } catch (err: any) {
      alert(`사용자 검색 실패: ${err.message}`);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  // 7. 사용자에게 특정 예약어 배포 실행
  const handleReleaseBrandToUser = async () => {
    if (!selectedWord || !selectedUser) {
      alert("배정할 예약어와 대상 사용자를 지정해 주세요.");
      return;
    }

    const { brand_id: brand } = selectedWord;
    const confirmMsg = `[${selectedUser.nickname} (${selectedUser.email})] 사용자에게 예약어 브랜드 [${brand}]를 강제 배포하시겠습니까?\n\n이 작업은 다음 순서로 연동 처리됩니다:\n1. reserved_brand_ids 테이블에서 예약어 제거\n2. 사용자 프로필의 brand_id에 '${brand}' 주입 및 승인(APPROVED) 처리`;

    if (!confirm(confirmMsg)) return;

    setIsSaving(true);
    try {
      // 1단계: reserved_brand_ids에서 삭제
      const { error: deleteErr } = await supabase
        .from("reserved_brand_ids")
        .delete()
        .eq("id", selectedWord.id);

      if (deleteErr) throw deleteErr;

      // 2단계: 대상 profiles 테이블 업데이트
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({
          brand_id: brand,
          requested_brand_id: brand,
          brand_id_status: "APPROVED",
          brand_id_rejection_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedUser.id);

      if (updateErr) {
        // 복구 시도 (다시 예약어에 복원)
        await supabase.from("reserved_brand_ids").insert([{
          brand_id: brand,
          category: selectedWord.category,
          reason: selectedWord.reason
        }]);
        throw new Error(`사용자 정보 업데이트 중 오류 발생 (예약어 복원됨): ${updateErr.message}`);
      }

      alert(`🎉 [${brand}] 브랜드가 [${selectedUser.nickname}]님에게 성공적으로 배정 완료되었습니다!`);
      
      // 모달 리셋 및 목록 갱신
      setIsReleaseModalOpen(false);
      setSelectedUser(null);
      setFoundUsers([]);
      setUserSearch("");
      
      void fetchReservedWords();
    } catch (err: any) {
      alert(`배포 실패: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 8. AI 신규 브랜드 스캔 실행 (Groq LLaMA 3.3 70B)
  const handleRunAiScan = async () => {
    setIsScanning(true);
    setScanResults([]);
    setSelectedScanItems(new Set());
    setScanStats(null);

    try {
      const res = await fetch("/api/admin/brands/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: scanCategory }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI 스캔 중 오류가 발생했습니다.");

      const suggestions = data.suggestions ?? [];
      setScanResults(suggestions);
      setSelectedScanItems(new Set(suggestions.map((item: any) => item.brand_id)));
      setScanStats({
        total: data.total ?? 0,
        already_blocked: data.already_blocked ?? 0,
        static_filtered: data.static_filtered ?? 0,
      });

      if (suggestions.length === 0) {
        alert("🔍 해당 카테고리에서 미등록된 신규 추천 키워드가 발견되지 않았습니다. (이미 모두 등록됨)");
      }
    } catch (err: any) {
      alert(`AI 스캔 실패: ${err.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  // 9. AI 스캔 결과 선택 항목 일괄 DB 등록
  const handleBatchAddReservedWords = async () => {
    const itemsToAdd = scanResults.filter((item) => selectedScanItems.has(item.brand_id));
    if (itemsToAdd.length === 0) {
      alert("등록할 항목을 최소 1개 이상 선택해 주세요.");
      return;
    }

    if (!confirm(`선택한 ${itemsToAdd.length}개 신규 브랜드 예약어를 DB에 일괄 등록하시겠습니까?`)) {
      return;
    }

    setIsBatchSaving(true);
    try {
      const payload = itemsToAdd.map((item) => ({
        brand_id: item.brand_id.toLowerCase().trim(),
        category: item.category,
        reason: item.reason,
      }));

      // ✅ upsert + ignoreDuplicates: true 옵션으로 이미 DB에 존재하는 단어와의 유니크 키 충돌 에러 완전 방어
      const { error } = await supabase
        .from("reserved_brand_ids")
        .upsert(payload, { onConflict: "brand_id", ignoreDuplicates: true });

      if (error) throw error;

      alert(`🎉 ${itemsToAdd.length}개의 신규 예약어가 성공적으로 등록되었습니다!`);
      setIsScanModalOpen(false);
      setScanResults([]);
      setSelectedScanItems(new Set());
      setScanStats(null);

      void fetchReservedWords();
    } catch (err: any) {
      alert(`일괄 등록 실패: ${err.message}`);
    } finally {
      setIsBatchSaving(false);
    }
  };

  // 10. ⚡ 16개 전체 카테고리 무인 자율 풀스캔 & DB 자동 수집
  const handleRunAiScanAll = async () => {
    if (!confirm("⚡ 16개 전체 카테고리를 자율 스캔하여 미등록된 모든 신규 브랜드 예약어를 DB에 일괄 자동 수집하시겠습니까?\n(약 15~30초 소요됩니다)")) {
      return;
    }

    setIsScanningAll(true);
    try {
      const res = await fetch("/api/admin/brands/scan-all", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "전체 카테고리 자율 스캔 실패");

      alert(data.message ?? `🎉 자율 스캔 완료! 총 ${data.total_added}개의 신규 예약어가 DB에 자동 추가되었습니다.`);
      setIsScanModalOpen(false);
      void fetchReservedWords();
    } catch (err: any) {
      alert(`자율 스캔 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsScanningAll(false);
    }
  };

  // UI 헬퍼: 카테고리 컬러 클래스 획득
  const getCategoryColor = (catValue: string) => {
    const matched = CATEGORIES.find(c => c.value === catValue);
    return matched ? matched.color : "bg-zinc-800 text-zinc-300 border-zinc-700";
  };

  // UI 헬퍼: 카테고리 한글 라벨 획득
  const getCategoryLabel = (catValue: string) => {
    const matched = CATEGORIES.find(c => c.value === catValue);
    return matched ? matched.label : catValue;
  };

  // 11. 🪄 초창기 미지정 예약어 AI 사유 및 Target Entity 자동 보강
  const [isEnriching, setIsEnriching] = useState(false);
  const handleEnrichMissingEntities = async () => {
    if (!confirm("🪄 사유가 미지정된 과거 예약어 80개에 대해 Gemini/Vertex AI를 구동하여 [Target Entity 기관명] 서식으로 자동 보강하시겠습니까?")) {
      return;
    }

    setIsEnriching(true);
    try {
      const res = await fetch("/api/admin/brands/enrich", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "AI 사유 보강 실패");

      alert(data.message ?? `🎉 ${data.updatedCount}개 항목의 Target Entity 사유가 자동 업데이트되었습니다!`);
      void fetchReservedWords();
    } catch (err: any) {
      alert(`AI 사유 보강 중 오류: ${err.message}`);
    } finally {
      setIsEnriching(false);
    }
  };



  // 💡 UI 헬퍼: reason 또는 brand_id에서 대상 기관/상표/브랜드 한글명 스마트 추출
  const parseReasonEntity = (brandId: string, reason: string) => {
    if (!reason) return { entity: "-", details: "-" };

    // 1) [한국전력공사] 형태의 대괄호 서식 추출
    const bracketMatch = reason.match(/^\[(.*?)\]\s*(.*)$/);
    if (bracketMatch) {
      return {
        entity: bracketMatch[1].trim(),
        details: bracketMatch[2].trim() || reason,
      };
    }

    // 2) 알려진 영문 브랜드아이디 스마트 사전 매핑 (초창기 키워드 100% 한글화)
    const KNOWN_MAP: Record<string, string> = {
      bluehouse: "🏛️ 청와대 (대통령실)",
      police: "🚔 경찰청 / 경찰",
      rok: "🇰🇷 대한민국 육군/정부",
      president: "👑 대한민국 대통령실",
      assembly: "🏛️ 대한민국 국회",
      supcourt: "⚖️ 대한민국 대법원",
      gov: "🏛️ 대한민국 정부",
      korea: "🇰🇷 대한민국 국호",
      korean: "🇰🇷 대한민국 국호",
      samsung: "🏢 삼성그룹",
      google: "🌐 구글 (Google)",
      news: "📰 뉴스/언론 종합",
      syuka: "🎙️ 크리에이터 슈카월드",
      court: "⚖️ 대한민국 법원",
      snu: "🎓 서울대학교",
      seoul: "🏛️ 서울특별시",
      bnk: "🏦 BNK 금융지주 / 부산은행",
      government: "🏛️ 대한민국 정부",
      store: "🛒 쇼핑몰 / 스토어 공용어",
      prosecution: "⚖️ 대한민국 검찰청",
      kakao: "💬 카카오 (Kakao)",
      naver: "🟢 네이버 (Naver)",
      toss: "💙 토스 (Viva Republica)",
      coupang: "🚀 쿠팡 (Coupang)",
      baemin: "🛵 배달의민족",
      daum: "🌐 다음 (Daum)",
      daangn: "🥕 당근 (당근마켓)",
      lotte: "🏢 롯데그룹",
      lg: "🏢 LG그룹",
      sk: "🏢 SK그룹",
      hyundai: "🚗 현대자동차그룹",
      posco: "🏭 포스코",
      kt: "📡 KT (한국통신)",
      shinhan: "🏦 신한금융그룹",
      woori: "🏦 우리금융그룹",
      hana: "🏦 하나금융그룹",
      kb: "🏦 KB국민금융그룹",
      nh: "🌾 농협 (NH농협금융)",
      cj: "🍷 CJ그룹",
      koreaelec: "⚡ 한국전력공사",
      koreatrans: "🛣️ 한국도로공사",
      koreasea: "⚓ 한국해양교통안전공단",
      koreaoption: "📈 한국옵션거래소",
      koreapost: "📮 우정사업본부 (우체국)",
      koreagas: "🔥 한국가스공사",
      koreawater: "💧 한국수자원공사",
      korealand: "🏠 LH 한국토지주택공사",
      korearail: "🚆 한국철도공사 (KORAIL)",
      koreaairport: "✈️ 한국공항공사",
    };

    const cleanId = brandId.toLowerCase().trim();
    if (KNOWN_MAP[cleanId]) {
      return {
        entity: KNOWN_MAP[cleanId],
        details: reason,
      };
    }

    // 3) "~ 사칭", "~ 사기", "~ 보호" 앞부분의 명사 추출 시도
    const patternMatch = reason.match(/^([가-힣a-zA-Z0-9\s]+?)(?: 사칭| 사기| 선점| 보호| 피싱| 서비스| 관련| 우려)/);
    if (patternMatch && patternMatch[1].trim().length >= 2 && patternMatch[1].trim().length <= 20) {
      return {
        entity: patternMatch[1].trim(),
        details: reason,
      };
    }

    // fallback: reason 전체가 짧으면 해당 텍스트를, 없으면 '미지정'
    return {
      entity: reason.length <= 12 ? reason : "미지정 (일반)",
      details: reason,
    };
  };

  if (isAuthChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05070a] text-white">
        <RefreshCw className="animate-spin text-blue-500" size={36} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] p-6 pt-4 pb-48 lg:p-12 lg:pt-10">
      {/* Header */}
      <header className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-zinc-800 pb-8 text-left md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter text-white">
            Reserved <span className="text-red-500">Brand IDs</span> Manager
          </h1>
          <p className="mt-2 pl-1 text-[10px] font-black uppercase italic tracking-[0.3em] text-zinc-500">
            Blacklist & Reservation Word Registry Control System
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleEnrichMissingEntities}
            disabled={isEnriching}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-600/10 hover:bg-emerald-600/20 disabled:opacity-50 px-5 py-4 text-xs font-black uppercase italic tracking-wider text-emerald-300 shadow-[0_10px_25px_rgba(16,185,129,0.15)] transition-all active:scale-95"
          >
            {isEnriching ? (
              <>
                <RefreshCw size={16} className="animate-spin text-emerald-400" />
                AI 사유 보강 중...
              </>
            ) : (
              <>
                <Bot size={16} className="text-emerald-400" />
                🪄 AI 사유 보강
              </>
            )}
          </button>
          <button
            onClick={() => setIsScanModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-600/10 hover:bg-purple-600/20 px-5 py-4 text-xs font-black uppercase italic tracking-wider text-purple-300 shadow-[0_10px_25px_rgba(168,85,247,0.15)] transition-all active:scale-95"
          >
            <Sparkles size={16} className="text-purple-400" />
            AI Trend Scan
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-4 text-xs font-black uppercase italic tracking-wider text-white shadow-[0_10px_25px_rgba(239,68,68,0.2)] transition-all active:scale-95"
          >
            <Plus size={16} />
            Add Reserved Word
          </button>
        </div>
      </header>

      {/* 검색 & 필터링 폼 */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* 1. 검색어 */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            placeholder="브랜드 ID 또는 차단 사유 검색..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-4 pl-12 pr-6 text-sm font-medium text-white placeholder-zinc-650 outline-none transition-all focus:border-red-500/50 focus:bg-zinc-900"
          />
        </div>

        {/* 2. 카테고리 선택 */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(0);
            }}
            className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-900/60 px-6 py-4 text-sm font-medium text-white outline-none transition-all focus:border-red-500/50 focus:bg-zinc-900 cursor-pointer"
          >
            <option value="ALL">전체 카테고리 필터</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label} ({cat.value})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>

        {/* 3. 날짜 범위 및 정적/최신순 필터 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value as any);
                setPage(0);
              }}
              className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 text-xs font-bold text-emerald-400 outline-none transition-all focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="all">🗓️ 전체 기간</option>
              <option value="today">🔥 오늘 등록</option>
              <option value="7days">⚡ 최근 7일 이내</option>
              <option value="30days">📅 최근 30일 이내</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          <div className="relative flex-1">
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as any);
                setPage(0);
              }}
              className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 text-xs font-bold text-purple-300 outline-none transition-all focus:border-purple-500/50 cursor-pointer"
            >
              <option value="desc">⬇️ 최신 등록순</option>
              <option value="asc">⬆️ 오래된순</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 예약어 현황 요약 및 상단 미니 페이징 */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-bold text-zinc-500 px-1">
        <div className="flex items-center gap-3">
          <span>검색 결과: <strong className="text-white">{totalCount.toLocaleString()}</strong>건 등록됨</span>
          {isDataLoading && <span className="flex items-center gap-1.5"><RefreshCw size={12} className="animate-spin text-red-500" /> 로딩 중...</span>}
        </div>

        {/* 상단 미니 페이징 */}
        {totalCount > 0 && (
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0 || isDataLoading}
              className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 disabled:opacity-30 disabled:pointer-events-none p-2 text-zinc-400 hover:text-white transition-all active:scale-95"
              title="이전 페이지"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[11px] font-black text-zinc-400 italic">
              Page {page + 1} of {Math.ceil(totalCount / LIMIT) || 1}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={(page + 1) * LIMIT >= totalCount || isDataLoading}
              className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 disabled:opacity-30 disabled:pointer-events-none p-2 text-zinc-400 hover:text-white transition-all active:scale-95"
              title="다음 페이지"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* 정적 카테고리 안내 배너 */}
      {selectedCategory !== "ALL" && STATIC_CATEGORIES.has(selectedCategory) && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-xs font-semibold text-amber-400">
          <Database size={15} className="mt-0.5 shrink-0 text-amber-500" />
          <div className="leading-relaxed">
            <span className="font-black">📦 코드 상수 관리 카테고리</span> —
            이 카테고리는 DB가 아닌 서버 코드 파일(<code className="bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px]">reservedBrandsStatic.ts</code>)에서 관리됩니다.
            항목 추가·수정은 코드 수정 후 재배포가 필요합니다. 관리자 화면에서 Deploy·Delete 불가.  
          </div>
        </div>
      )}

      {/* 테이블 영역 */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-zinc-300">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50 font-black uppercase text-[10px] tracking-widest text-zinc-500">
                <th className="px-6 py-4 text-center w-16">No.</th>
                <th className="px-6 py-4">Brand ID</th>
                <th className="px-6 py-4 text-emerald-400">Target Entity (대상 기관/브랜드)</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Reason / Description</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {words.length > 0 ? (
                words.map((item, index) => {
                  const parsed = parseReasonEntity(item.brand_id, item.reason);
                  return (
                    <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 text-center font-bold text-zinc-500 text-xs">
                        {page * LIMIT + index + 1}
                      </td>
                      <td className="px-6 py-4 font-black italic tracking-tight text-white select-all">
                        {item.brand_id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 shadow-sm">
                          <Building2 size={13} className="text-emerald-400 shrink-0" />
                          {parsed.entity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border ${getCategoryColor(item.category)}`}>
                          {getCategoryLabel(item.category)}
                        </span>
                        {(item as any).is_static && (
                          <span className="ml-2 inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border border-amber-500/30 bg-amber-500/10 text-amber-500">
                            코드상수
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-zinc-400 max-w-sm truncate" title={item.reason}>
                        {parsed.details}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-zinc-600">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : <span className="text-zinc-700 italic">코드 관리</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                        {(item as any).is_static ? (
                          <span className="text-[10px] font-bold text-zinc-600 italic px-3 py-2">
                            코드 수정 후 재배포 필요
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setSelectedWord(item);
                                setIsReleaseModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/15 px-3 py-2 text-xs font-black tracking-tighter uppercase italic transition-all"
                              title="사용자에게 강제 배정"
                            >
                              <Share2 size={13} />
                              Deploy
                            </button>
                            <button
                              onClick={() => handleDeleteReservedWord(item.id, item.brand_id)}
                              className="flex items-center gap-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/15 px-3 py-2 text-xs font-black tracking-tighter uppercase italic transition-all"
                              title="삭제"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-650 font-bold">
                    {isDataLoading ? "데이터를 불러오는 중입니다..." : "등록된 예약어(블랙리스트)가 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이징 컨트롤 (좌우 넘김) */}
      {totalCount > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800 pt-6 px-1">
          <div className="text-xs font-bold text-zinc-500">
            Showing <strong className="text-white">{Math.min(page * LIMIT + 1, totalCount)}</strong> to{" "}
            <strong className="text-white">{Math.min((page + 1) * LIMIT, totalCount)}</strong> of{" "}
            <strong className="text-white">{totalCount.toLocaleString()}</strong> records
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0 || isDataLoading}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 disabled:opacity-30 disabled:pointer-events-none px-5 py-3 text-xs font-black uppercase italic tracking-wider text-zinc-400 hover:text-white transition-all active:scale-95"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            
            <div className="text-xs font-black text-zinc-400 italic">
              Page {page + 1} of {Math.ceil(totalCount / LIMIT) || 1}
            </div>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={(page + 1) * LIMIT >= totalCount || isDataLoading}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 disabled:opacity-30 disabled:pointer-events-none px-5 py-3 text-xs font-black uppercase italic tracking-wider text-zinc-400 hover:text-white transition-all active:scale-95"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. 예약어 수동 등록 모달 */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[30px] border border-zinc-800 bg-[#0c0e14] p-8 text-left shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-5 mb-6">
              <div className="flex items-center gap-2">
                <Plus size={20} className="text-red-500" />
                <h3 className="text-lg font-black uppercase italic text-white tracking-tight">Add Reserved Word</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReservedWord} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-red-400 uppercase tracking-wider pl-1">Brand ID (영문소문자+숫자 2~15자)</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newBrandId}
                  onChange={(e) => setNewBrandId(e.target.value)}
                  placeholder="예: coupang, admin, google"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-bold text-white outline-none transition-all focus:border-red-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-red-400 uppercase tracking-wider pl-1">Category (분류)</label>
                <div className="relative">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-bold text-white outline-none transition-all focus:border-red-500/50 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label} ({cat.value})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-red-400 uppercase tracking-wider pl-1">Reason (차단/예약 사유)</label>
                <textarea
                  required
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="예: 시스템 라우팅 보호 및 선점 제한"
                  rows={3}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-bold text-white outline-none transition-all focus:border-red-500/50 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-4 text-xs font-black uppercase italic tracking-wider text-zinc-400 transition-all hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-4 text-xs font-black uppercase italic tracking-wider text-white shadow-lg transition-all disabled:opacity-50"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  Register Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. 사용자에게 예약어 배포 모달 */}
      {/* ======================================================== */}
      {isReleaseModalOpen && selectedWord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[30px] border border-zinc-800 bg-[#0c0e14] p-8 text-left shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-5 mb-6">
              <div className="flex items-center gap-2">
                <Share2 size={20} className="text-emerald-500" />
                <h3 className="text-lg font-black uppercase italic text-white tracking-tight">Deploy Brand ID</h3>
              </div>
              <button
                onClick={() => {
                  setIsReleaseModalOpen(false);
                  setSelectedUser(null);
                  setFoundUsers([]);
                  setUserSearch("");
                }}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* 타겟 예약어 정보 뷰 */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-0.5">배정 대상 예약어</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black italic text-white tracking-tight select-all">{selectedWord.brand_id}</span>
                  <span className={`inline-block px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border ${getCategoryColor(selectedWord.category)}`}>
                    {getCategoryLabel(selectedWord.category)}
                  </span>
                </div>
                <p className="text-xs font-bold text-zinc-400">{selectedWord.reason}</p>
              </div>

              {/* 사용자 검색 폼 */}
              <div className="space-y-2">
                <label className="text-xs font-black text-emerald-400 uppercase tracking-wider pl-1">배정 유저 검색 (활동명 또는 이메일)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="유저 검색어를 입력해 주세요..."
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-4 pl-12 pr-6 text-sm font-bold text-white outline-none transition-all focus:border-emerald-500/50"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleSearchUsers();
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchUsers}
                    className="rounded-xl border border-zinc-850 bg-zinc-900 hover:bg-zinc-850 px-6 text-xs font-black uppercase italic tracking-tighter text-zinc-300 transition-all"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* 검색 결과 목록 */}
              {isSearchingUsers ? (
                <div className="flex justify-center py-6">
                  <RefreshCw className="animate-spin text-emerald-500" size={24} />
                </div>
              ) : foundUsers.length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  {foundUsers.map((u) => {
                    const isSelected = selectedUser?.id === u.id;
                    return (
                      <div
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all hover:bg-zinc-900/40
                          ${isSelected
                            ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400"
                            : "border-zinc-850 bg-zinc-900/30 text-zinc-300"
                          }
                        `}
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-black tracking-tight">{u.nickname}</span>
                          <span className="text-xs text-zinc-500">{u.email}</span>
                        </div>
                        {u.brand_id ? (
                          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/10">
                            ID 보유중: {u.brand_id}
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
                            Brand ID 없음
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* 배정 확인 안내 구역 */}
              {selectedUser && (
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4 flex gap-3 text-left">
                  <UserCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-emerald-400">배정 타겟 확인</p>
                    <p className="text-[11px] font-semibold text-zinc-400 leading-relaxed">
                      <strong>[{selectedUser.nickname} ({selectedUser.email})]</strong> 유저에게 브랜드 ID로 <strong>[{selectedWord.brand_id}]</strong>를 즉시 할당 및 활성화(APPROVED)합니다.
                    </p>
                  </div>
                </div>
              )}

              {/* 실행 액션 버튼 */}
              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsReleaseModalOpen(false);
                    setSelectedUser(null);
                    setFoundUsers([]);
                    setUserSearch("");
                  }}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-4 text-xs font-black uppercase italic tracking-wider text-zinc-400 transition-all hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isSaving || !selectedUser}
                  onClick={handleReleaseBrandToUser}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-4 text-xs font-black uppercase italic tracking-wider text-white shadow-lg transition-all disabled:opacity-50"
                >
                  {isSaving && <RefreshCw size={14} className="animate-spin" />}
                  Deploy Brand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ======================================================== */}
      {/* 3. AI 트렌드 브랜드 스캔 모달 */}
      {/* ======================================================== */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-[30px] border border-purple-500/30 bg-[#0c0e14] p-8 text-left shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-5 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase italic text-white tracking-tight">AI Trend & New Brand Discovery</h3>
                  <p className="text-[11px] font-semibold text-purple-400/80">LLaMA 3.3 70B AI로 최신 신규 브랜드·서비스 자동 탐지 및 미등록 항목 스캔</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanResults([]);
                  setSelectedScanItems(new Set());
                  setScanStats(null);
                }}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* ⚡ 16개 전체 카테고리 1회 클릭 자율 풀스캔 대형 버튼 */}
              <div className="rounded-2xl border border-purple-500/30 bg-purple-600/10 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-400" />
                      16개 카테고리 전 영역 자율 무인 스캔
                    </span>
                    <p className="text-[11px] font-medium text-zinc-400">
                      버튼 클릭 한 번으로 LLaMA AI가 16개 카테고리를 탐지하여 신규 예약어를 DB에 일괄 자동 등록합니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isScanning || isScanningAll}
                    onClick={handleRunAiScanAll}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 px-6 py-3.5 text-xs font-black uppercase italic tracking-wider text-white shadow-[0_8px_25px_rgba(168,85,247,0.3)] transition-all active:scale-95 shrink-0"
                  >
                    {isScanningAll ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        16개 카테고리 스캔 중...
                      </>
                    ) : (
                      <>
                        <Bot size={16} />
                        ⚡ Scan All 16 Categories & Auto Register
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 스캔 대상 카테고리 수동 선택 */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-wider pl-1">개별 카테고리 스캔</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <select
                      value={scanCategory}
                      onChange={(e) => setScanCategory(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm font-bold text-white outline-none transition-all focus:border-purple-500/50 cursor-pointer"
                    >
                      <option value="IT_SERVICE">🤖 AI 서비스 / IT 플랫폼 (KIMI, Grok, Cursor, Perplexity 등)</option>
                      <option value="FINANCE">💳 핀테크 / 금융 서비스 (토스, 핀다, 암호화폐 결제)</option>
                      <option value="TRADEMARK">🏷️ 제품 / 상표명 보호 (글로벌 핫 브랜드 및 신제품)</option>
                      <option value="INFLUENCER">🎬 크리에이터 / 셀럽 / 버튜버 / K-pop</option>
                      <option value="COMPANY">🏢 기업 / 신규 스타트업 / 테크 유니콘</option>
                      <option value="CRYPTO">🪙 가상자산 / 거래소 / 블록체인 프로토콜</option>
                      <option value="HEALTHCARE">🏥 의료 / 헬스케어 / 의약품 / 웰니스</option>
                      <option value="COMMON_SERVICE">💡 프리미엄 일반 명사 / 서비스 키워드</option>
                      <option value="GOVERNMENT">🏛️ 공공기관 / 지자체 / 정부행정</option>
                      <option value="MEDIA">📰 언론사 / 방송사 / 미디어 매체</option>
                      <option value="EDUCATION">🎓 대학 / 교육기관 / 에듀테크</option>
                      <option value="PAYMENT_SECURITY">🔒 결제 / 인증 / 보안 피싱 방지</option>
                      <option value="INFRASTRUCTURE">⚙️ 시스템 인프라 / 호스팅 / 서버 키워드</option>
                      <option value="DOMAIN_BRAND">🌐 도메인 / 호스팅 / 인증서 사업자</option>
                      <option value="PUBLIC_SERVICE">🛂 공공 행정 / 비자 / 민원 서비스</option>
                      <option value="HIGH_RISK_COMMERCE">🛍️ 고위험 상거래 / 리셀 / 상품권 / 명품</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    disabled={isScanning}
                    onClick={handleRunAiScan}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-6 py-4 text-xs font-black uppercase italic tracking-wider text-white shadow-[0_5px_20px_rgba(168,85,247,0.3)] transition-all active:scale-95 shrink-0"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        AI 탐지 중...
                      </>
                    ) : (
                      <>
                        <Bot size={16} />
                        Run AI Scan
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 스캔 결과 통계 요약 */}
              {scanStats && (
                <div className="grid grid-cols-3 gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">신규 발견 (미등록)</p>
                    <p className="text-xl font-black text-purple-400">{scanStats.total}개</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">DB 이미 등록됨</p>
                    <p className="text-xl font-black text-zinc-400">{scanStats.already_blocked}개</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">정적상수 자동제외</p>
                    <p className="text-xl font-black text-zinc-400">{scanStats.static_filtered}개</p>
                  </div>
                </div>
              )}

              {/* 탐지된 항목 결과 목록 */}
              {isScanning ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3 text-purple-400">
                  <RefreshCw size={28} className="animate-spin" />
                  <p className="text-xs font-bold animate-pulse">LLaMA 3.3 AI 모델이 최신 브랜드 및 키워드를 수집·분석 중입니다...</p>
                </div>
              ) : scanResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-black text-zinc-400">
                      신규 추천 목록 ({selectedScanItems.size}/{scanResults.length}개 선택됨)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedScanItems.size === scanResults.length) {
                          setSelectedScanItems(new Set());
                        } else {
                          setSelectedScanItems(new Set(scanResults.map((r) => r.brand_id)));
                        }
                      }}
                      className="text-[11px] font-bold text-purple-400 hover:underline"
                    >
                      {selectedScanItems.size === scanResults.length ? "전체 해제" : "전체 선택"}
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 custom-scrollbar">
                    {scanResults.map((item) => {
                      const isChecked = selectedScanItems.has(item.brand_id);
                      return (
                        <div
                          key={item.brand_id}
                          onClick={() => {
                            const next = new Set(selectedScanItems);
                            if (next.has(item.brand_id)) next.delete(item.brand_id);
                            else next.add(item.brand_id);
                            setSelectedScanItems(next);
                          }}
                          className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                            isChecked
                              ? "border-purple-500/40 bg-purple-500/10 text-white"
                              : "border-zinc-850 bg-zinc-900/30 text-zinc-400 hover:bg-zinc-900/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                                isChecked
                                  ? "border-purple-500 bg-purple-600 text-white"
                                  : "border-zinc-700 bg-zinc-900 text-transparent"
                              }`}
                            >
                              ✓
                            </div>
                            <span className="font-black italic text-sm text-white tracking-tight">{item.brand_id}</span>
                          </div>
                          <span className="text-xs font-semibold text-zinc-400 max-w-xs truncate">{item.reason}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* 하단 닫기 & 일괄 등록 버튼 */}
              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsScanModalOpen(false);
                    setScanResults([]);
                    setSelectedScanItems(new Set());
                    setScanStats(null);
                  }}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-4 text-xs font-black uppercase italic tracking-wider text-zinc-400 transition-all hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isBatchSaving || selectedScanItems.size === 0}
                  onClick={handleBatchAddReservedWords}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 py-4 text-xs font-black uppercase italic tracking-wider text-white shadow-lg transition-all disabled:opacity-50"
                >
                  {isBatchSaving && <RefreshCw size={14} className="animate-spin" />}
                  Register Selected ({selectedScanItems.size})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
