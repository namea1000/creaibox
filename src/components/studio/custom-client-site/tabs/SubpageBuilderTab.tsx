import React, { useState, useEffect } from "react";
import { Link, Layers, FileText, CheckCircle2, ChevronDown, Wand2, Upload, AlertCircle, ListPlus, Settings2, Globe } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface SubpageBuilderTabProps {
  requireAuth: (action?: () => void) => boolean;
}

export default function SubpageBuilderTab({ requireAuth }: SubpageBuilderTabProps) {
  const [buildMode, setBuildMode] = useState<"single" | "auto">("single");
  const [targetUrl, setTargetUrl] = useState("");
  const [pageCount, setPageCount] = useState<number>(3);
  
  const [sites, setSites] = useState<any[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [subSlug, setSubSlug] = useState("");

  const [refType, setRefType] = useState<"none" | "url" | "text" | "pdf">("none");
  const [refUrl, setRefUrl] = useState("");
  const [refText, setRefText] = useState("");
  const [refFile, setRefFile] = useState<File | null>(null);

  const [isBuilding, setIsBuilding] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [planResult, setPlanResult] = useState<any[]>([]);

  const [isLoadingSites, setIsLoadingSites] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from("client_sites")
            .select("*")
            .eq("profile_id", session.user.id)
            .order("created_at", { ascending: false });
          
          if (error) {
            console.error("Error fetching sites:", error);
          } else if (data) {
            setSites(data);
            if (data.length > 0) {
              setSelectedSiteId(data[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Fetch sites exception:", err);
      } finally {
        setIsLoadingSites(false);
      }
    };
    fetchSites();
  }, []);

  const getBaseUrl = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (!site) return "";
    const protocol = typeof window !== "undefined" ? window.location.protocol : "http:";
    const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
    const port = typeof window !== "undefined" && window.location.port ? `:${window.location.port}` : "";
    
    if (hostname.includes("localhost") || hostname === "127.0.0.1") {
      return `${protocol}//${site.brand_id}.localhost${port}`;
    }
    return `https://${site.brand_id}.creaibox.com`;
  };

  useEffect(() => {
    if (selectedSiteId) {
      const base = getBaseUrl(selectedSiteId);
      if (buildMode === "single") {
        setTargetUrl(subSlug ? `${base}/${subSlug}` : base);
      } else {
        setTargetUrl(base);
      }
    }
  }, [selectedSiteId, subSlug, buildMode, sites]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setRefFile(file);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
        e.target.value = "";
      }
    }
  };

  const handleBuildSingle = async () => {
    if (!subSlug.trim()) {
      alert("서브페이지의 슬러그(예: about)를 입력해주세요.");
      return;
    }

    setIsBuilding(true);
    setProgressText("초기화 중...");

    try {
      const formData = new FormData();
      formData.append("targetUrl", targetUrl.trim());
      formData.append("refType", refType);
      
      if (refType === "url") formData.append("refUrl", refUrl.trim());
      if (refType === "text") formData.append("refText", refText.trim());
      if (refType === "pdf" && refFile) formData.append("refPdf", refFile);

      setProgressText("메인 사이트 톤앤매너 및 참조 자료 기반 유추 창작 중...");

      const res = await fetch("/api/studio/subpage-builder", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("✨ 서브페이지 생성 완료!");
        window.open(targetUrl, "_blank");
      } else {
        alert(data.error || "창작 중 오류가 발생했습니다.");
      }
    } catch (e) {
      alert("서버 연결 중 오류가 발생했습니다.");
    } finally {
      setIsBuilding(false);
    }
  };

  const handleBuildAuto = async () => {
    if (!selectedSiteId) {
      alert("대상 웹사이트(메인)를 선택해주세요.");
      return;
    }

    setIsBuilding(true);
    setPlanResult([]);
    setProgressText("AI 기획 에이전트가 최적의 서브페이지들을 구상 중입니다...");

    try {
      // Step 1: Get Plan
      const planRes = await fetch("/api/studio/subpage-builder/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: targetUrl.trim(),
          pageCount,
          refText: refType === "text" ? refText : ""
        })
      });

      const planData = await planRes.json();
      if (!planRes.ok) {
        alert(planData.error || "기획 단계에서 오류가 발생했습니다.");
        setIsBuilding(false);
        return;
      }

      const pagesToBuild = planData.plan;
      setPlanResult(pagesToBuild);

      // Step 2: Build each page sequentially
      const baseUrl = getBaseUrl(selectedSiteId);

      for (let i = 0; i < pagesToBuild.length; i++) {
        const page = pagesToBuild[i];
        setProgressText(`[${i + 1}/${pagesToBuild.length}] '${page.title}' 페이지 생성 중...`);

        const formData = new FormData();
        formData.append("targetUrl", `${baseUrl}/${page.slug}`);
        formData.append("title", page.title);
        formData.append("autoCreate", "true");
        formData.append("refType", refType);
        
        if (refType === "url") formData.append("refUrl", refUrl.trim());
        if (refType === "text") formData.append("refText", refText.trim());
        if (refType === "pdf" && refFile) formData.append("refPdf", refFile);

        const buildRes = await fetch("/api/studio/subpage-builder", {
          method: "POST",
          body: formData,
        });

        if (!buildRes.ok) {
          const errData = await buildRes.json();
          console.error("Failed to build page:", page.title, errData);
        }
      }

      alert(`✨ ${pagesToBuild.length}개의 서브페이지가 성공적으로 자동 생성되었습니다!`);
      window.open(baseUrl, "_blank");

    } catch (e) {
      alert("서버 연결 중 오류가 발생했습니다.");
    } finally {
      setIsBuilding(false);
      setProgressText("");
    }
  };

  const handleStart = () => {
    if (!requireAuth()) return;
    if (buildMode === "single") {
      handleBuildSingle();
    } else {
      handleBuildAuto();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setBuildMode("single")}
          className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
            buildMode === "single" 
              ? "border-indigo-500 bg-indigo-500/10" 
              : "border-slate-800 bg-slate-900 hover:bg-slate-800"
          }`}
        >
          {buildMode === "single" && (
            <div className="absolute top-4 right-4 text-indigo-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          <Settings2 className={`w-8 h-8 mb-4 ${buildMode === "single" ? "text-indigo-400" : "text-slate-500"}`} />
          <h3 className="text-lg font-bold text-white mb-2">특정 서브페이지 채우기</h3>
          <p className="text-sm text-slate-400">빈 깡통으로 생성된 특정 서브페이지 경로 1개를 지정하여, AI가 내용을 완벽히 채워줍니다.</p>
        </button>

        <button
          onClick={() => setBuildMode("auto")}
          className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
            buildMode === "auto" 
              ? "border-purple-500 bg-purple-500/10" 
              : "border-slate-800 bg-slate-900 hover:bg-slate-800"
          }`}
        >
          {buildMode === "auto" && (
            <div className="absolute top-4 right-4 text-purple-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          <ListPlus className={`w-8 h-8 mb-4 ${buildMode === "auto" ? "text-purple-400" : "text-slate-500"}`} />
          <h3 className="text-lg font-bold text-white mb-2">AI 자율 기획 & 자동 생성</h3>
          <p className="text-sm text-slate-400">메인 주소만 입력하면, 사이트에 꼭 필요한 서브페이지를 AI가 직접 기획하고 대량으로 찍어냅니다.</p>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">서브 페이지 제작 마법사</h2>
            <p className="text-sm text-slate-400 mt-1">기존 사이트의 디자인과 완벽하게 일치하는 콘텐츠를 생성합니다.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-xs">1</span>
              대상 웹사이트 선택
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-slate-500" />
              </div>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-12 pr-10 py-4 text-white text-sm transition-colors outline-none appearance-none"
                disabled={isLoadingSites || sites.length === 0}
              >
                {isLoadingSites ? (
                  <option value="">불러오는 중...</option>
                ) : sites.length === 0 ? (
                  <option value="">생성된 사이트가 없습니다.</option>
                ) : (
                  sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.site_name || site.brand_id} ({getBaseUrl(site.id)})
                    </option>
                  ))
                )}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-slate-500" />
              </div>
            </div>

            {buildMode === "single" && (
              <div className="flex items-center gap-2 mt-2">
                <div className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-sm whitespace-nowrap">
                  {getBaseUrl(selectedSiteId)}/
                </div>
                <input
                  type="text"
                  value={subSlug}
                  onChange={(e) => setSubSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, ""))}
                  placeholder="about"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-sm transition-colors outline-none"
                />
              </div>
            )}
            
            {buildMode === "single" && (
              <p className="text-xs text-slate-500 ml-1">우측 입력칸에 추가할 서브페이지의 경로(슬러그)를 영어 소문자로 입력하세요.</p>
            )}
          </div>

          {buildMode === "auto" && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-xs">+</span>
                생성할 페이지 개수
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPageCount(num)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                      pageCount === num
                        ? "bg-purple-500 text-white shadow-lg"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    {num}개
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-slate-800/50 w-full" />

          {/* Step 2 */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-xs">2</span>
              참조 자료 첨부 (선택 사항)
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setRefType(refType === "text" ? "none" : "text")}
                className={`p-4 rounded-2xl border text-left transition-all ${refType === "text" ? "border-blue-500 bg-blue-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}`}
              >
                <FileText className={`w-5 h-5 mb-2 ${refType === "text" ? "text-blue-400" : "text-slate-500"}`} />
                <div className="text-sm font-bold text-white mb-1">텍스트 입력</div>
                <div className="text-xs text-slate-400 leading-relaxed">핵심 키워드나 원하는 내용을 직접 타이핑</div>
              </button>

              <button
                onClick={() => setRefType(refType === "url" ? "none" : "url")}
                className={`p-4 rounded-2xl border text-left transition-all ${refType === "url" ? "border-emerald-500 bg-emerald-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}`}
              >
                <Link className={`w-5 h-5 mb-2 ${refType === "url" ? "text-emerald-400" : "text-slate-500"}`} />
                <div className="text-sm font-bold text-white mb-1">URL 크롤링</div>
                <div className="text-xs text-slate-400 leading-relaxed">참조할 외부 웹페이지 링크 제공</div>
              </button>

              <button
                onClick={() => setRefType(refType === "pdf" ? "none" : "pdf")}
                className={`p-4 rounded-2xl border text-left transition-all ${refType === "pdf" ? "border-rose-500 bg-rose-500/10" : "border-slate-800 bg-slate-950 hover:bg-slate-900"}`}
              >
                <Upload className={`w-5 h-5 mb-2 ${refType === "pdf" ? "text-rose-400" : "text-slate-500"}`} />
                <div className="text-sm font-bold text-white mb-1">PDF 파일</div>
                <div className="text-xs text-slate-400 leading-relaxed">보유 중인 소개서나 문서 업로드</div>
              </button>
            </div>

            {/* Dynamic Input Area */}
            <div className="mt-4">
              {refType === "none" && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-indigo-200">
                    참조 자료가 없어도 괜찮습니다! 기존 메인 페이지와 다른 서브 페이지들의 내용을 AI가 정독하여 사이트의 정체성을 파악한 뒤, 
                    <strong>입력하신 목적에 맞춰 가장 이상적인 콘텐츠를 완벽하게 유추하여 창작합니다.</strong>
                  </p>
                </div>
              )}

              {refType === "text" && (
                <textarea
                  value={refText}
                  onChange={(e) => setRefText(e.target.value)}
                  className="w-full h-32 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl p-4 text-white text-sm transition-colors outline-none resize-none"
                  placeholder={buildMode === "auto" ? "추가하고 싶은 서브페이지 종류나 특별히 다루고 싶은 주제를 적어주시면 기획에 적극 반영합니다." : "새 서브페이지에 들어가야 할 내용, 키워드, 인사말 등을 자유롭게 적어주세요."}
                />
              )}

              {refType === "url" && (
                <input
                  type="text"
                  value={refUrl}
                  onChange={(e) => setRefUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl px-4 py-4 text-white text-sm transition-colors outline-none"
                  placeholder="참조할 웹사이트 주소(https://...)를 입력하세요."
                />
              )}

              {refType === "pdf" && (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer hover:bg-slate-900 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-slate-500" />
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold text-white">클릭하여 업로드</span> 하거나 파일을 끌어다 놓으세요.
                      </p>
                      <p className="text-xs text-slate-500">PDF 파일만 지원됩니다. {refFile && <span className="text-rose-400 block mt-1">선택된 파일: {refFile.name}</span>}</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            {planResult.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-slate-300">AI가 기획한 서브페이지 리스트</h4>
                <div className="grid gap-2">
                  {planResult.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold shrink-0">{idx + 1}</span>
                      <span className="font-bold text-white">{p.title}</span>
                      <span className="text-slate-500 ml-auto">/{p.slug}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={isBuilding}
              className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${
                isBuilding
                  ? "bg-indigo-500/50 cursor-not-allowed text-white"
                  : buildMode === "auto"
                    ? "bg-purple-500 hover:bg-purple-600 text-white shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_40px_rgba(99,102,241,0.3)]"
              }`}
            >
              {isBuilding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {progressText}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {buildMode === "auto" ? "AI 자율 기획 & 자동 생성 시작" : "서브페이지 생성 시작하기"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
